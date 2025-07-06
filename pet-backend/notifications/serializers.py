from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    actor = serializers.StringRelatedField()

    class Meta:
        model = Notification
        fields = ['id', 'verb', 'actor', 'target', 'is_read', 'timestamp']
