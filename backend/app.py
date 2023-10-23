from flask import Flask
from flask_restx import Api
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from recipes import recipe_ns
from auth import auth_ns
from exts import db


def create_app(config):
    app = Flask(__name__)
    CORS(app)
    app.config.from_object(config)
    db.init_app(app)
    migrate = Migrate(app, db)
    JWTManager(app)
    api = Api(app, doc="/docs")
    api.add_namespace(auth_ns)
    api.add_namespace(recipe_ns)
    #
    # @app.shell_context_processors
    # def make_shell_context():
    #     return {
    #         "db": db,
    #         "Recipe": Recipe
    #     }

    return app



