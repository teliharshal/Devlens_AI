"""
Custom DRF exception handler that ensures all API errors return JSON,
even for unhandled server errors (500) rather than Django's HTML error page.
"""
import logging
from django.http import JsonResponse
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

logger = logging.getLogger(__name__)

def json_exception_handler(exc, context):
    """
    Call DRF's default exception handler first to get the standard error response.
    If DRF can't handle it (returns None for unhandled exceptions), return a
    JSON 500 response instead of Django's HTML error page.
    """
    response = exception_handler(exc, context)

    if response is None:
        # DRF didn't handle this exception — log it and return a safe JSON 500
        logger.error(
            "Unhandled exception in view %s: %s",
            context.get('view', 'unknown'),
            str(exc),
            exc_info=True
        )
        return Response(
            {'error': 'An unexpected server error occurred. Please try again later.'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response
