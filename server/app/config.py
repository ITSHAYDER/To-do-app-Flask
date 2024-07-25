import os



class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///site.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False  
    SECRET_KEY = os.getenv('SECRET_KEY', 'mysecretkey')