from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import chatbot_routes, helper_routes  # <-- Import our renamed routers
from .core.config import get_settings           # <-- Import our merged config
from fastapi.responses import HTMLResponse
from pathlib import Path

def create_app() -> FastAPI:
    cfg = get_settings()
    
    # 1. Create the single, unified app
    app = FastAPI(
        title="Unified Bank Backend",
        description="A single backend combining the Chatbot and Helper services",
        version="1.0.0",
    )

    # 2. Add CORS middleware once
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # You can tighten this in production
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # 3. Include the Chatbot router
    # All routes from chatbot will now be at /chatbot/...
    app.include_router(
        chatbot_routes.router, 
        prefix="/chatbot",
        tags=["Chatbot"]
    )

    # 4. Include the Helper router
    # All routes from helper will now be at /helper/...
    app.include_router(
        helper_routes.router, 
        prefix="/helper",
        tags=["Helper"]
    )

    # 5. Add the health check once
    @app.get("/ping")
    async def ping():  # health check
        return {"status": "ok", "env": cfg.env}
    
    @app.get("/", response_class=HTMLResponse, include_in_schema=False)
    async def read_root():
        """
        Serves the main index.html file from the project root.
        """
        # Path goes from app/main.py -> app/ -> Unified_Bank_Backend/
        root_dir = Path(__file__).parent.parent
        index_path = root_dir / "index.html"

        if not index_path.exists():
            return HTMLResponse("index.html not found", status_code=404)

        with open(index_path, "r") as f:
            return HTMLResponse(content=f.read(), status_code=200)

    return app

# The main app instance to be run by uvicorn
app = create_app()
