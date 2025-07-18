![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![Django](https://img.shields.io/badge/django-5.1-green)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23336791.svg?&logo=postgresql&logoColor=white)
![Render](https://img.shields.io/badge/hosted%20on-Render-5a3cc4)

# 🐾 CuraPets – Pet Treatment Scheduling System

**CuraPets** is a full-stack web application that enables pet owners to seamlessly book, manage, and receive reminders for veterinary treatment appointments. It also provides a dashboard for doctors to manage their appointments and notifications.

**Note:** the frontend is still under development while the backend is live already.

You can explore the live Swagger docs at:  
👉 [https://curapet.onrender.com/swagger/](https://curapet.onrender.com/swagger/)


---

## 🚀 Features

- 🐶 User registration and login with JWT authentication
- 📅 Appointment booking and management
- 🩺 Doctor dashboard with availability management
- 🔔 Real-time notifications for upcoming appointments
- 📃 Swagger UI for API documentation
- ☁️ Cloudinary integration for pet image uploads
- 📈 Rate limiting & throttling for API security

---

## 🛠️ Tech Stack

**Backend:**
- Django & Django REST Framework
- PostgreSQL
- SimpleJWT for authentication
- Cloudinary for image uploads
- drf-yasg for Swagger documentation

**Frontend:**
- [Vite](https://vitejs.dev/) + [React/Vue](#) *(Replace with actual tech if applicable)*

**Deployment:**
- Render (Web + PostgreSQL services)
- WhiteNoise for static file serving

---

## 🔧 Installation & Setup

### Prerequisites

- Python 3.10+
- PostgreSQL
- pip
- Git

### Clone the Repository

```bash
git clone https://github.com/dev-eyitayo/pet-treatment.git
cd pet-treatment

# Create and activate a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Set environment variables
# (Create a .env file or export them manually)

# Apply migrations
python manage.py migrate

# Collect static files
python manage.py collectstatic --noinput

# Run the server
python manage.py runserver


# .env (example)
DJANGO_SECRET_KEY=your-secret-key
DATABASE_URL=your-database-url
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

### 🔗 Live API


