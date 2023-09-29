from flask import Flask, request
from flask_restx import Api, Resource, fields
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import requests

from config import DevConfig
from models import Recipe
from exts import db

app = Flask(__name__)
app.config.from_object(DevConfig)

db.init_app(app)

migrate = Migrate(app, db)

api = Api(app, doc="/docs")

recipe_model = api.model(
    "Recipe",
    {
        "id": fields.Integer,
        "title": fields.String,
        "description": fields.String,
    }
)


@api.route("/hello")
class Hello(Resource):
    def get(self):
        return {"message": "hello_world"}


@api.route("/recipes")
class RecipesResource(Resource):
    @api.marshal_list_with(recipe_model)
    def get(self):
        """Get all recipes"""
        recipes = Recipe.query.all()

        return recipes

    @api.marshal_with(recipe_model, envelope="resource")
    def post(self):
        """Create a new recipe"""
        data = request.get_json()
        if not data:
            return {"message": "Invalid JSON data"}, 400
        new_recipe = Recipe(title=data.get("title"),
                            description=data.get("description"),
                            )
        new_recipe.save()

        return new_recipe, 201


@api.route("/recipe/<int:id>/")
class RecipeResource(Resource):
    @api.marshal_with(recipe_model)
    def get(self, id: int):
        result = Recipe.query.get_or_404(id)
        return result

    @api.marshal_with(recipe_model)
    def put(self, id: int):
        """Update a recipe by id"""
        recipe_to_upd = Recipe.query.get_or_404(id)
        data = request.get_json()

        recipe_to_upd.update(data.get("title"),
                             data.get("description"))
        return recipe_to_upd

    @api.marshal_with(recipe_model)
    def delete(self, id: int):
        """Delete recipe by id"""
        recipe_to_del = Recipe.query.get_or_404(id)
        recipe_to_del.delete()

        return recipe_to_del
        pass


@app.route('/')
def hello_world():  # put application's code here
    return 'Hello World!'


if __name__ == '__main__':
    app.run()
