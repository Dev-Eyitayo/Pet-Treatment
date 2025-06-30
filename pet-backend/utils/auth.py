
def get_safe_user(view):
    user = view.request.user
    if getattr(view, 'swagger_fake_view', False) or not user.is_authenticated:
        return None
    return user
