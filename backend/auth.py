from flask_restx import Resource, Namespace, fields
from models import User
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (create_access_token,
                                create_refresh_token)

auth_ns = Namespace("auth",
                    description="Namespace for authentication")

signup_model = auth_ns.model(
    "SignUp",
    {
        "username": fields.String,
        "email": fields.String,
        "password": fields.String,
    }
)

login_model = auth_ns.model(
    "Login",
    {
        "username": fields.String,
        "password": fields.String,
    }
)


@auth_ns.route("/signup")
class SignUp(Resource):
    @auth_ns.expect(signup_model)
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

        return make_response(jsonify({"message": "User created successfully"}), 201)


@auth_ns.route("/login")
class Login(Resource):
    @auth_ns.expect(login_model)
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


@auth_ns.route("/refresh")
class RefreshResource(Resource):
    @jwt_required(refresh=True)
    def post(self):
        user = get_jwt_identity()

        new_access_token = create_access_token(identity=user)

        return make_response(jsonify({
            "access_token": new_access_token,
        }, 200))
