import os
import json
from groq import Groq, GroqError

def analyze_code(code: str, language: str) -> dict:
    api_key = os.getenv('GROQ_API_KEY')
    model_name = os.getenv('GROQ_MODEL', 'openai/gpt-oss-20b')
    
    if not api_key:
        raise ValueError("GROQ_API_KEY is not set.")
        
    client = Groq(api_key=api_key)
    
    prompt = f"""
    You are an expert code reviewer. Review the following {language} code.
    Provide the response in raw JSON format strictly matching this structure:
    {{
      "summary": "Brief summary of the code",
      "score": 85,
      "strengths": ["list", "of", "strengths"],
      "issues": [
        {{
          "issue_type": "bug|security|performance|maintainability|style|other",
          "severity": "low|medium|high|critical",
          "line_number": 12,
          "title": "Short title",
          "explanation": "Detailed explanation",
          "suggestion": "How to fix it"
        }}
      ],
      "improved_code": "The full improved code if applicable, else empty string"
    }}
    
    Code to review:
    ```{language}
    {code}
    ```
    """
    
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model=model_name,
        )
        
        text = response.choices[0].message.content.strip()
        if text.startswith('```json'):
            text = text[7:]
        if text.endswith('```'):
            text = text[:-3]
            
        result = json.loads(text.strip())
        return result
        
    except GroqError as e:
        raise Exception(f"Groq API error: {str(e)}")
    except (json.JSONDecodeError, AttributeError) as e:
        raise Exception(f"Failed to parse AI response: {str(e)}")
    except Exception as e:
        raise Exception(f"An unexpected error occurred: {str(e)}")
