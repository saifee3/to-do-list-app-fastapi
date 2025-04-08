from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_jwt_auth import AuthJWT
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Task

router = APIRouter()

class TaskCreate(BaseModel):
    title: str
    description: str = None

class TaskUpdate(BaseModel):
    title: str = None
    description: str = None
    completed: bool = None

class Settings(BaseModel):
    authjwt_secret_key: str = "your-secret-key"

@AuthJWT.load_config
def get_config():
    return Settings()


@router.post("/tasks")
def create_task(
    task_data: TaskCreate,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db)
):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    new_task = Task( title=task_data.title,  description=task_data.description,  user_id=user_id )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return {"message": "Task created","task": {  "id": new_task.id, "title": new_task.title,  "description": new_task.description,  "completed": new_task.completed } },status.HTTP_201_CREATED


@router.get("/tasks")
def get_tasks(
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db)
):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    tasks = db.query(Task).filter(Task.user_id == user_id).all()
    return {"tasks": tasks  }


@router.patch("/tasks/{task_id}")
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db)
):
    Authorize.jwt_required()
    user_id = Authorize.get_jwt_subject()
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    if task_data.title is not None:
        task.title = task_data.title
    if task_data.description is not None:
        task.description = task_data.description
    if task_data.completed is not None:
        task.completed = task_data.completed

    db.commit()
    db.refresh(task)
    return { "message": "Task updated",  "task": {   "id": task.id,  "title": task.title,  "description": task.description,   "completed": task.completed } }


@router.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    Authorize: AuthJWT = Depends(),
    db: Session = Depends(get_db)
):
    Authorize.jwt_required()

    user_id = Authorize.get_jwt_subject()
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    db.delete(task)
    db.commit()
    return {     "message": "Task deleted",   "task": {  "id": task.id,  "title": task.title, "description": task.description,   "completed": task.completed   } }