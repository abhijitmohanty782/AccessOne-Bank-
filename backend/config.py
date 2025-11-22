import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    DEBUG = os.environ.get('FLASK_ENV') == 'development'
    PORT = int(os.environ.get('PORT', 5000))
    MONGO_URI = os.environ.get('MONGO_URI', 'mongodb://localhost:27017/bank_app')
    # Mail settings (Flask-Mail)
    MAIL_SERVER = os.environ.get('MAIL_SERVER', 'official.accessone@gmail.com')
    MAIL_PORT = int(os.environ.get('MAIL_PORT', 587))
    MAIL_USE_TLS = os.environ.get('MAIL_USE_TLS', 'true').lower() == 'true'
    MAIL_USE_SSL = os.environ.get('MAIL_USE_SSL', 'false').lower() == 'true'
    MAIL_USERNAME = os.environ.get('do not reply')
    MAIL_PASSWORD = os.environ.get('GiXpp69kht6lXWoZcrrYrgYFRkYLt9dJAJdYvPCJp8nXV7yjCg')
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER', os.environ.get('MAIL_USERNAME'))
