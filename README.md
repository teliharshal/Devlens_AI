# DevLens AI — AI-Powered Code Review Platform

> An intelligent backend platform that accepts source code submissions and returns structured AI-generated reviews, including issue detection, severity scoring, improvement suggestions, and refactored code — powered by the Groq LLM API and built on Django REST Framework.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Request & Response Structure](#request--response-structure)
- [AI Service Pipeline](#ai-service-pipeline)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Local Setup](#local-setup)
- [Development Roadmap](#development-roadmap)

---

## Overview

DevLens AI is a backend REST API that enables developers to submit code for automated AI review. The system analyzes the code using a Large Language Model (Groq API), extracts structured feedback, persists the results to a PostgreSQL database, and returns the full review — including detected issues, a quality score, identified strengths, and an improved version of the code.

**Core capabilities (current MVP):**

- Submit code in multiple languages for AI review
- Receive a structured review with score, summary, and strengths
- Get a list of detected issues with type, severity, line number, and fix suggestion
- Retrieve previously submitted reviews
- Review status lifecycle: `pending → completed / failed`

---

## Tech Stack

| Layer        | Technology                          |
|--------------|--------------------------------------|
| Language     | Python 3.10+                         |
| Framework    | Django 5.2 + Django REST Framework 3.18 |
| Database     | PostgreSQL (via psycopg 3)           |
| AI Provider  | Groq API (LLM inference)             |
| Config       | python-dotenv                        |
| ORM          | Django ORM (no raw SQL)              |
| API Style    | REST (function-based views)          |

---

## Project Architecture

```
HTTP Client (Postman / Frontend / curl)
            │
            ▼
   ┌─────────────────────┐
   │   Django URL Router  │   config/urls.py
   │  /api/reviews/       │
   └────────┬────────────┘
            │
            ▼
   ┌─────────────────────┐
   │   DRF API Views      │   reviews/views.py
   │  review_list()       │   (function-based @api_view)
   │  review_detail()     │
   └────────┬────────────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
┌─────────┐  ┌──────────────────────┐
│Serializer│  │  AI Service Layer    │   reviews/services/ai_service.py
│ Validate │  │  analyze_code()      │
│ & Parse  │  │  Groq API call       │
└────┬─────┘  │  JSON response parse │
     │        └──────────┬───────────┘
     │                   │
     └─────────┬─────────┘
               │
               ▼
   ┌─────────────────────┐
   │   Django ORM Models  │   reviews/models.py
   │   CodeReview         │
   │   ReviewIssue        │
   └────────┬────────────┘
            │
            ▼
   ┌─────────────────────┐
   │     PostgreSQL       │
   │  reviews_codereview  │
   │  reviews_reviewissue │
   └─────────────────────┘
```

### Request Flow — POST /api/reviews/

```
1. Client sends { title, language, code }
2. View receives request
3. CodeReviewSerializer validates input
4. CodeReview saved to DB with status = "pending"
5. analyze_code(code, language) called → Groq API
6. LLM returns structured JSON
7. CodeReview updated: summary, score, strengths, improved_code, status = "completed"
8. ReviewIssue records created (one per detected issue)
9. Full serialized CodeReview returned to client
   └── If AI call fails → status = "failed", 500 returned
```

---

## Database Schema

### `CodeReview`

| Field          | Type                    | Notes                              |
|----------------|-------------------------|------------------------------------|
| id             | BigAutoField (PK)       | Auto-generated                     |
| title          | CharField(200)          | Human-readable label               |
| language       | CharField(choices)      | python, java, javascript, typescript, cpp, other |
| code           | TextField               | Raw source code submitted          |
| summary        | TextField               | AI-generated summary (blank until reviewed) |
| score          | PositiveSmallIntegerField | 0–100 quality score, nullable     |
| strengths      | JSONField               | List of strength strings           |
| improved_code  | TextField               | AI-refactored version of code      |
| status         | CharField(choices)      | pending / completed / failed       |
| created_at     | DateTimeField           | Auto-set on creation               |
| updated_at     | DateTimeField           | Auto-updated on save               |

**Ordering:** `-created_at` (newest first)

---

### `ReviewIssue`

| Field        | Type               | Notes                                              |
|--------------|--------------------|----------------------------------------------------|
| id           | BigAutoField (PK)  | Auto-generated                                     |
| review       | ForeignKey         | → CodeReview, CASCADE, related_name="issues"       |
| issue_type   | CharField(choices) | bug, security, performance, maintainability, style, other |
| severity     | CharField(choices) | low, medium, high, critical                        |
| line_number  | PositiveIntegerField | Nullable — not all issues are line-specific       |
| title        | CharField(200)     | Short issue label                                  |
| explanation  | TextField          | Detailed description of the issue                  |
| suggestion   | TextField          | How to fix the issue                               |
| created_at   | DateTimeField      | Auto-set on creation                               |

**Relationship:** One `CodeReview` → Many `ReviewIssue` (one-to-many)

---

## API Reference

Base URL: `http://localhost:8000/api/`

| Method | Endpoint             | Description                        |
|--------|----------------------|------------------------------------|
| GET    | `/api/reviews/`      | List all code reviews              |
| POST   | `/api/reviews/`      | Submit code for AI review          |
| GET    | `/api/reviews/{id}/` | Retrieve a single review by ID     |

---

## Request & Response Structure

### POST `/api/reviews/` — Submit Code for Review

**Request Body:**
```json
{
  "title": "Login function review",
  "language": "python",
  "code": "def login(user, password):\n    if user == 'admin' and password == '1234':\n        return True"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "Login function review",
  "language": "python",
  "code": "def login(user, password):\n    ...",
  "summary": "The function has a hardcoded credential vulnerability.",
  "score": 42,
  "strengths": ["Simple control flow", "Returns boolean correctly"],
  "improved_code": "def login(user, password):\n    return check_credentials(user, password)",
  "status": "completed",
  "created_at": "2026-10-09T10:00:00Z",
  "updated_at": "2026-10-09T10:00:05Z",
  "issues": [
    {
      "id": 1,
      "issue_type": "security",
      "severity": "critical",
      "line_number": 2,
      "title": "Hardcoded credentials",
      "explanation": "Credentials are hardcoded in source code, a severe security risk.",
      "suggestion": "Use environment variables or a secure credential store.",
      "created_at": "2026-10-09T10:00:05Z"
    }
  ]
}
```

**Response (500 — AI failure):**
```json
{
  "error": "An error occurred during AI analysis. Please try again."
}
```

---

### GET `/api/reviews/` — List All Reviews

Returns an array of `CodeReview` objects ordered by newest first, each including nested `issues`.

---

### GET `/api/reviews/{id}/` — Single Review

Returns one `CodeReview` with all nested `ReviewIssue` records.

---

## AI Service Pipeline

File: `reviews/services/ai_service.py`

```
analyze_code(code, language)
    │
    ├── Reads GROQ_API_KEY and GROQ_MODEL from environment
    ├── Builds a structured prompt requesting JSON output
    ├── Calls Groq client.chat.completions.create()
    ├── Strips markdown code fences if present (```json ... ```)
    ├── Parses JSON response
    └── Returns dict: { summary, score, strengths, issues[], improved_code }
```

**Expected AI JSON output shape:**
```json
{
  "summary": "...",
  "score": 85,
  "strengths": ["..."],
  "issues": [
    {
      "issue_type": "bug",
      "severity": "high",
      "line_number": 5,
      "title": "...",
      "explanation": "...",
      "suggestion": "..."
    }
  ],
  "improved_code": "..."
}
```

Error handling covers: `GroqError`, `JSONDecodeError`, and general exceptions — all propagated to the view which sets review status to `failed`.

---

## Project Structure

```
DevLens_AI/
└── backend/
    ├── manage.py
    ├── requirements.txt
    ├── .env                          # Environment config (not committed)
    ├── .gitignore
    │
    ├── config/                       # Django project configuration
    │   ├── settings.py               # App settings, DB config, installed apps
    │   ├── urls.py                   # Root URL routing
    │   ├── wsgi.py
    │   └── asgi.py
    │
    └── reviews/                      # Core Django app
        ├── models.py                 # CodeReview + ReviewIssue models
        ├── serializers.py            # DRF serializers with validation
        ├── views.py                  # API view functions
        ├── urls.py                   # App-level URL patterns
        ├── apps.py                   # App config
        ├── admin.py                  # Django admin registration
        ├── tests.py
        │
        ├── services/
        │   └── ai_service.py         # Groq API integration + prompt logic
        │
        └── migrations/
            └── 0001_initial.py       # Initial DB schema migration
```

---

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Django
SECRET_KEY=your-django-secret-key

# PostgreSQL
DB_NAME=devlens_db
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432

# Groq AI
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=openai/gpt-oss-20b
```

> Never commit `.env` to version control. It is already listed in `.gitignore`.

---

## Local Setup

**Prerequisites:** Python 3.10+, PostgreSQL, Git

```bash
# 1. Clone the repository
git clone <repo-url>
cd DevLens_AI/backend

# 2. Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
# Copy the .env example above and fill in your values

# 5. Create PostgreSQL database
# In psql: CREATE DATABASE devlens_db;

# 6. Run migrations
python manage.py migrate

# 7. Verify setup
python manage.py check

# 8. Start development server
python manage.py runserver
```

API is available at: `http://localhost:8000/api/reviews/`

---

## Development Roadmap

| Module | Status      | Description                                      |
|--------|-------------|--------------------------------------------------|
| 1      | ✅ Complete  | Django project setup, PostgreSQL connection      |
| 2      | ✅ Complete  | Reviews app, CodeReview + ReviewIssue models     |
| 3      | ✅ Complete  | Serializers, API views, URL routing              |
| 4      | ✅ Complete  | Groq AI service integration                      |
| 5      | 🔲 Planned  | Authentication (JWT / session)                   |
| 6      | 🔲 Planned  | User accounts + review ownership                 |
| 7      | 🔲 Planned  | API documentation (Swagger / drf-spectacular)    |
| 8      | 🔲 Planned  | Async processing with Celery + Redis             |
| 9      | 🔲 Planned  | Frontend (React)                                 |
| 10     | 🔲 Planned  | Docker + deployment                              |

---

## Key Design Decisions

- **No authentication in MVP** — intentional. Auth is a separate, later module.
- **Function-based views over ViewSets** — kept simple for progressive learning and clarity.
- **AI result stored in DB** — results are persisted so they can be retrieved later without re-calling the AI.
- **Structured AI prompt** — the LLM is instructed to return strict JSON, with client-side stripping of markdown fences as a safety measure.
- **Status lifecycle** — `pending → completed/failed` allows the client to detect AI failures gracefully.
- **JSONField for strengths** — avoids a third join table for a simple list of strings.

---

*Built module by module for learning Django architecture and progressively adding complexity.*
