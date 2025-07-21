from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()

class CustomUserModelTests(TestCase):
    """test if user account creation with email is ssuccessful """
    def test_create_user_with_email_successful(self):
        user = User.objects.create_user(
            email = "johndoe@gmail.com",
            firstname= "John",
            lastname = "Doe",
            password = "pass12345"
        )
        self.assertEqual(user.firstname, "John")
        self.assertEqual(user.lastname, "Doe")
        self.assertEqual(user.email, "johndoe@gmail.com")
        self.assertTrue(user.check_password("pass12345"))
        self.assertEqual(user.role, "user")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        
    def test_super_user_creation_successful(self):
        """ test that super user account can be created successfully """
        admin = User.objects.create_superuser(
            email="admin@gmail.com",
            firstname="Admin",
            lastname = "Super",
            password="pass12345",
        )
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_staff)
        self.assertEqual(admin.role, "admin")
        
    def test_user_email_is_required(self):
        """Test that creating user without email raises error"""
        with self.assertRaises(ValueError):
            User.objects.create_user(
                email='',
                firstname='NoEmail',
                lastname='User',
                password='test123'
            )

    