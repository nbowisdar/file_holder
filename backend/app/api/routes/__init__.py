import importlib
import os

from fastapi import APIRouter


def load_routes(router: APIRouter = APIRouter()) -> APIRouter:
    # Path to the current directory (routes)
    routes_path = os.path.dirname(__file__)

    # Loop through all Python files in the routes directory
    for filename in os.listdir(routes_path):
        if filename.endswith(".py") and filename != "__init__.py":
            # Import the module dynamically
            filename = filename[:-3]  # Remove .py extension
            module_name = f"{__name__}.{filename}"
            print(f"Loading router from {module_name}", end=" ")
            module = importlib.import_module(module_name)
            # Attach the router to the main_router if it exists
            if hasattr(module, "router"):
                router.include_router(module.router, prefix=f"/{filename}", tags=[filename])
                print("Loaded!")
    return router
