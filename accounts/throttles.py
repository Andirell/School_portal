from rest_framework.throttling import AnonRateThrottle


# Each throttle has its own scope so they don't share the same counter.
# The rates live in REST_FRAMEWORK['DEFAULT_THROTTLE_RATES'] in settings.
class SignInThrottle(AnonRateThrottle):
    scope = 'signin'


class PasswordResetThrottle(AnonRateThrottle):
    scope = 'password_reset'
