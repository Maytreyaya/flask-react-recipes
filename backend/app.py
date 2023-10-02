from flask import Flask, request, jsonify
from flask_restx import Api, Resource, fields
from flask_migrate import Migrate
from config import DevConfig
from models import Recipe, User
from exts import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (JWTManager,
                                create_access_token,
                                create_refresh_token,
                                jwt_required)

app = Flask(__name__)
app.config.from_object(DevConfig)

db.init_app(app)

migrate = Migrate(app, db)

JWTManager(app)

api = Api(app, doc="/docs")

recipe_model = api.model(
    "Recipe",
    {
        "id": fields.Integer,
        "title": fields.String,
        "description": fields.String,
    }
)

signup_model = api.model(
    "SignUp",
    {
        "username": fields.String,
        "email": fields.String,
        "password": fields.String,
    }
)

login_model = api.model(
    "Login",
    {
        "username": fields.String,
        "password": fields.String,
    }
)


@api.route("/hello")
class Hello(Resource):
    def get(self):
        return {"message": "hello_world"}


@api.route("/signup")
class SignUp(Resource):
    @api.expect(signup_model)
    def post(self):
        data = request.get_json()
        username = data.get("username")
        db_user = User.query.filter_by(username=username).first()

        if db_user:
            return jsonify({"message": f"Username {username} is taken, choose another one"}, 400)

        if not data:
            return {"message": "Invalid JSON data"}, 400
        new_user = User(username=data.get("username"),
                        email=data.get("email"),
                        password=generate_password_hash(data.get("password")))
        new_user.save()

        return jsonify({"message": "User successfully created"})


@api.route("/login")
class Login(Resource):
    @api.expect(login_model)
    def post(self):
        data = request.get_json()

        username = data.get("username")
        password = data.get("password")

        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            access_token = create_access_token(identity=user.username)
            refresh_token = create_refresh_token(identity=user.username)

            return jsonify(
                {
                 "access_token": access_token,
                 "refresh_token": refresh_token
                 }
            )


@api.route("/recipes")
class RecipesResource(Resource):
    @api.marshal_list_with(recipe_model)
    def get(self):
        """Get all recipes"""
        recipes = Recipe.query.all()

        return recipes

    @api.marshal_with(recipe_model)
    @api.expect(recipe_model)
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


@api.route("/recipe/<int:id>/")
class RecipeResource(Resource):
    @api.marshal_with(recipe_model)
    def get(self, id: int):
        result = Recipe.query.get_or_404(id)
        return result

    @jwt_required()
    @api.marshal_with(recipe_model)
    def put(self, id: int):
        """Update a recipe by id"""
        recipe_to_upd = Recipe.query.get_or_404(id)
        data = request.get_json()

        recipe_to_upd.update(data.get("title"),
                             data.get("description"))
        return recipe_to_upd

    @api.marshal_with(recipe_model)
    @jwt_required()
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
