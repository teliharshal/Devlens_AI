
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import CodeReview, ReviewIssue
from .serializers import CodeReviewSerializer
from .services.ai_service import analyze_code

@api_view(['GET', 'POST'])
def review_list(request):
    if request.method == 'GET':
        reviews = CodeReview.objects.all()
        serializer = CodeReviewSerializer(reviews, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        serializer = CodeReviewSerializer(data=request.data)
        if serializer.is_valid():
            review = serializer.save(status='pending')
            
            try:
                ai_result = analyze_code(review.code, review.language)
                
                review.summary = ai_result.get('summary', '')
                review.score = ai_result.get('score', None)
                review.strengths = ai_result.get('strengths', [])
                review.improved_code = ai_result.get('improved_code', '')
                review.status = 'completed'
                review.save()
                
                issues = ai_result.get('issues', [])
                for issue_data in issues:
                    ReviewIssue.objects.create(
                        review=review,
                        issue_type=issue_data.get('issue_type', 'other'),
                        severity=issue_data.get('severity', 'low'),
                        line_number=issue_data.get('line_number'),
                        title=issue_data.get('title', 'Issue'),
                        explanation=issue_data.get('explanation', ''),
                        suggestion=issue_data.get('suggestion', '')
                    )
                
                # refresh to get issues
                review.refresh_from_db()
                return Response(CodeReviewSerializer(review).data, status=status.HTTP_201_CREATED)
                
            except Exception as e:
                review.status = 'failed'
                review.save()
                return Response({'error': 'An error occurred during AI analysis. Please try again.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def review_detail(request, pk):
    try:
        review = CodeReview.objects.get(pk=pk)
    except CodeReview.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    serializer = CodeReviewSerializer(review)
    return Response(serializer.data)
