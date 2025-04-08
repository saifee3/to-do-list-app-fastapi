from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from backend.database import get_db, Base
from backend.routes import user, task
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel

app = FastAPI(title="Todo App API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user.router, prefix="/api")
app.include_router(task.router, prefix="/api")

class Settings(BaseModel):
    authjwt_secret_key: str = "your-secret-key"

@AuthJWT.load_config
def get_config():
    return Settings()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)