from rest_framework import serializers
from .models import CodeReview, ReviewIssue

class ReviewIssueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewIssue
        fields = ['id', 'issue_type', 'severity', 'line_number', 'title', 'explanation', 'suggestion', 'created_at']

class CodeReviewSerializer(serializers.ModelSerializer):
    issues = ReviewIssueSerializer(many=True, read_only=True)

    class Meta:
        model = CodeReview
        fields = ['id', 'title', 'language', 'code', 'summary', 'score', 'strengths', 'improved_code', 'status', 'created_at', 'updated_at', 'issues']
        read_only_fields = ['summary', 'score', 'strengths', 'improved_code', 'status', 'created_at', 'updated_at']

    def validate_language(self, value):
        valid_languages = dict(CodeReview.LANGUAGE_CHOICES).keys()
        if value not in valid_languages:
            raise serializers.ValidationError(f"Unsupported language. Supported are: {', '.join(valid_languages)}")
        return value
