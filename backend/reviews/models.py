from django.db import models

class CodeReview(models.Model):
    LANGUAGE_CHOICES = [
        ('python', 'Python'),
        ('java', 'Java'),
        ('javascript', 'JavaScript'),
        ('typescript', 'TypeScript'),
        ('cpp', 'C++'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    title = models.CharField(max_length=200)
    language = models.CharField(max_length=20, choices=LANGUAGE_CHOICES)
    code = models.TextField()
    summary = models.TextField(blank=True)
    score = models.PositiveSmallIntegerField(null=True, blank=True)
    strengths = models.JSONField(default=list, blank=True)
    improved_code = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class ReviewIssue(models.Model):
    ISSUE_TYPE_CHOICES = [
        ('bug', 'Bug'),
        ('security', 'Security'),
        ('performance', 'Performance'),
        ('maintainability', 'Maintainability'),
        ('style', 'Style'),
        ('other', 'Other'),
    ]
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]

    review = models.ForeignKey(CodeReview, on_delete=models.CASCADE, related_name='issues')
    issue_type = models.CharField(max_length=20, choices=ISSUE_TYPE_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    line_number = models.PositiveIntegerField(null=True, blank=True)
    title = models.CharField(max_length=200)
    explanation = models.TextField()
    suggestion = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
