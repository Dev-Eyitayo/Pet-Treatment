from django.test import TestCase
from user.serializers import SignUpSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class SignUpSerializerTests(TestCase):
    def test_valid_signup_data_creates_user(self):
        data = {
            "email": "testuser@example.com",
            "firstname": "Test",
            "lastname": "User",
            "password": "strongpassword",
            "role": "doctor"
        }
        serializer = SignUpSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        user = serializer.save()
        self.assertEqual(user.email, data["email"])
        self.assertEqual(user.role, "doctor")
        self.assertTrue(user.check_password("strongpassword"))

    def test_signup_fails_with_invalid_role(self):
        data = {
            "email": "testuser@example.com",
            "firstname": "Test",
            "lastname": "User",
            "password": "pass12345",
            "role": "admin"
        }
        serializer = SignUpSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("role", serializer.errors)

    def test_signup_requires_email(self):
        data = {
            "firstname": "NoEmail",
            "lastname": "User",
            "password": "strongpassword"
        }
        serializer = SignUpSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)
