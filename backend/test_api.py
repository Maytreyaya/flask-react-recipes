import unittest
from app import create_app
from config import TestConfig
from exts import db


class TestApi(unittest.TestCase):

    def setUp(self) -> None:
        self.app = create_app(TestConfig)
        self.client = self.app.test_client(self)

        with self.app.app_context():
            # db.init_app(self.app)

            db.create_all()

        self.signup_response = self.client.post(
            "/auth/signup",
            json={
                "username": "testuser",
                "email": "testuser@test.com",
                "password": "password",
            },
        )

        self.login_response = self.client.post(
            "auth/login", json={"username": "testuser", "password": "password"}
        )

        self.access_token = self.login_response.json["access_token"]

    def test_signup(self):

        status_code = self.signup_response.status_code

        self.assertEqual(status_code, 201)

    def test_login(self):

        status_code = self.login_response.status_code

        self.assertEqual(status_code, 200)

    def test_get_all_recipes(self):
        response = self.client.get("/recipe/recipes")

        status_code = response.status_code

        self.assertEqual(status_code, 200)

    def test_create_and_get_recipe(self):

        create_recipe_response = self.client.post(
            "/recipe/recipes",
            json={"title": "Test Cookie", "description": "Test description"},
            headers={"Authorization": f"Bearer {self.access_token}"},
        )

        status_code = create_recipe_response.status_code

        response = self.client.get("/recipe/recipes")
        status_code_get_recipe = response.status_code

        self.assertEqual(status_code, 201)
        self.assertEqual(status_code_get_recipe, 200)

    def test_update_recipe(self):

        create_recipe_response = self.client.post(
            "/recipe/recipes",
            json={"title": "Test Cookie", "description": "Test description"},
            headers={"Authorization": f"Bearer {self.access_token}"},
        )

        id = 1

        update_response = self.client.put(
            f"/recipe/recipe/{id}/",
            json={
                "title": "Test Cookie Updated",
                "description": "Test description updated",
            },
            headers={"Authorization": f"Bearer {self.access_token}"},
        )

        status_code = update_response.status_code
        self.assertEqual(status_code, 200)

    def test_delete_recipe(self):
        create_recipe_response = self.client.post(
            "/recipe/recipes",
            json={"title": "Test Cookie", "description": "Test description"},
            headers={"Authorization": f"Bearer {self.access_token}"},
        )

        id = 1
        delete_response = self.client.delete(
            f"/recipe/recipe/{id}/", headers={"Authorization": f"Bearer {self.access_token}"}
        )

        status_code = delete_response.status_code

        print(delete_response.json)

        self.assertEqual(status_code, 200)

    def tearDown(self) -> None:
        with self.app.app_context():
            db.session.remove()
            db.drop_all()


if __name__ == "__main__":
    unittest.main()