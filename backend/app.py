from flask import Flask
from flask_restx import Api
from flask_migrate import Migrate
from config import DevConfig
from exts import db
from flask_jwt_extended import JWTManager
from models import Recipe
from recipes import recipe_ns
from auth import auth_ns


def create_app(config):
    app = Flask(__name__)
    app.config.from_object(config)
    db.init_app(app)
    migrate = Migrate(app, db)
    JWTManager(app)
    api = Api(app, doc="/docs")
    api.add_namespace(auth_ns)
    api.add_namespace(recipe_ns)


    # @app.shell_context_processors
    # def make_shell_context():
    #     return {
    #         "db": db,
    #         "Recipe": Recipe
    #     }

    return app



