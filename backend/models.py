from sqlalchemy import JSON

from exts import db
from werkzeug.security import generate_password_hash


class Recipe(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(), nullable=False)
    description = db.Column(db.Text(), nullable=False)
    ingredients = db.Column(db.JSON(), nullable=True)

    def add_ingredient(self, ingredient_name):
        self.ingredients.append(ingredient_name)

    def remove_ingredient(self, ingredient_name):
        self.ingredients = [ingredient for ingredient in self.ingredients if ingredient != ingredient_name]

    def __repr__(self):
        return f"<Recipe {self.title}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, title: str, description: str):
        self.title = title
        self.description = description

        db.session.commit()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(25), nullable=False, unique=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.Text(), nullable=False)

    def __repr__(self):
        return f"<User: {self.username}>"

    def save(self):
        db.session.add(self)
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    def update(self, username: str, email: str, password: str):
        self.username = username
        self.email = email
        self.password = generate_password_hash(password)

        db.session.commit()
