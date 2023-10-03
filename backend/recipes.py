from flask_restx import Resource, Namespace, fields
from flask import request
from flask_jwt_extended import jwt_required
from models import Recipe

recipe_ns = Namespace("recipe",
                      description="Namespace for recipes")

recipe_model = recipe_ns.model(
    "Recipe",
    {
        "id": fields.Integer,
        "title": fields.String,
        "description": fields.String,
    }
)


@recipe_ns.route("/hello")
class Hello(Resource):
    def get(self):
        return {"message": "hello_world"}


@recipe_ns.route("/recipes")
class RecipesResource(Resource):
    @recipe_ns.marshal_list_with(recipe_model)
    def get(self):
        """Get all recipes"""
        recipes = Recipe.query.all()

        return recipes

    @recipe_ns.marshal_with(recipe_model)
    @recipe_ns.expect(recipe_model)
    @jwt_required()
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


@recipe_ns.route("/recipe/<int:id>/")
class RecipeResource(Resource):
    @recipe_ns.marshal_with(recipe_model)
    def get(self, id: int):
        result = Recipe.query.get_or_404(id)
        return result

    @jwt_required()
    @recipe_ns.marshal_with(recipe_model)
    def put(self, id: int):
        """Update a recipe by id"""
        recipe_to_upd = Recipe.query.get_or_404(id)
        data = request.get_json()

        recipe_to_upd.update(data.get("title"),
                             data.get("description"))
        return recipe_to_upd

    @recipe_ns.marshal_with(recipe_model)
    @jwt_required()
    def delete(self, id: int):
        """Delete recipe by id"""
        recipe_to_del = Recipe.query.get_or_404(id)
        recipe_to_del.delete()

        return recipe_to_del
        pass