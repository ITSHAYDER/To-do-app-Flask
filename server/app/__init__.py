from flask_restful import Api
from flask import request, Flask
from .config import Config
from flask_cors import CORS
from .models import SaveTodos, db
from .Resources import ToDos



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    with app.app_context():
        db.create_all()
    CORS(app)
    api = Api(app)
    api.add_resource(ToDos, '/api/todos')

    return app
