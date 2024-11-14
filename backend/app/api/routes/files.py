import shutil

from fastapi import APIRouter, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy import func
from sqlmodel import Session, select

from app import crud
from app import models as md
from app.api.deps import CurrentSuperUser, CurrentUser, SessionDep
from app.core.config import UPLOAD_DIR
from utils.logger import get_download_file_logger

router = APIRouter()

file_logger = get_download_file_logger()


def get_db_obj_or_err[T](session: Session, obj_id: int, obj_model: T) -> T:
    db_obj = session.get(obj_model, obj_id)
    if db_obj:
        return db_obj
    raise HTTPException(status_code=404, detail="Not found")


def get_file_by_id(file_dir_id: int | str):
    file_path = UPLOAD_DIR / str(file_dir_id)
    if file_path.exists() and file_path.is_dir():
        files = list(file_path.iterdir())  # Get all items in the directory
        if files:  # If there are files
            first_file = files[0]  # Get the first file
            return first_file


@router.get("/{file_id}")
def download_file(session: SessionDep, user: CurrentUser, file_id: int):
    db_file = get_db_obj_or_err(session, file_id, md.File)
    if user not in db_file.users and not user.is_superuser:
        raise HTTPException(status_code=403, detail="Forbidden")
    if file_out := get_file_by_id(file_id):
        db_file.download_count += 1
        session.commit()
        file_logger.info(f"User {user.username} downloaded file {file_out}")
        return FileResponse(file_out, media_type="image/png")
    return HTTPException(status_code=404, detail="File not found")


@router.get("/info/{file_id}", response_model=md.FilePublicUsers)
def get_file_info(session: SessionDep, _: CurrentSuperUser, file_id: int):
    return get_db_obj_or_err(session, file_id, md.File)


@router.get("/", response_model=md.FilesPublic)
def read_files(
    session: SessionDep, current_user: CurrentUser, offset: int = 0, limit: int = 3
):
    if current_user.is_superuser:
        count_statement = select(func.count()).select_from(md.File)
        count = session.exec(count_statement).one()
        statement = select(md.File).offset(offset).limit(limit)
        items = session.exec(statement).all()
    else:
        count_statement = (
            select(func.count())
            .select_from(md.File)
            .join(md.File.users)
            .where(md.User.id == current_user.id)
        )
        count = session.exec(count_statement).one()

        statement = (
            select(md.File)
            .join(md.File.users)
            .where(md.User.id == current_user.id)
            .offset(offset)
            .limit(limit)
        )
        items = session.exec(statement).all()

    return md.FilesPublic(data=items, count=count)


@router.post("/", response_model=md.FilePublic)
async def upload_file(
    session: SessionDep,
    _: CurrentSuperUser,
    file: UploadFile,
):
    db_obj = md.File(size=file.size, name=file.filename)
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)

    file_unique_dir = UPLOAD_DIR / str(db_obj.id)
    file_unique_dir.mkdir(exist_ok=True)
    file_location = file_unique_dir / file.filename
    with open(file_location, "wb") as f:
        f.write(await file.read())
    return db_obj


@router.delete("/{file_id}", status_code=204)
def drop_file(session: SessionDep, file_id: int, _: CurrentSuperUser):

    file_path = UPLOAD_DIR / str(file_id)
    shutil.rmtree(file_path)
    db_file = get_db_obj_or_err(session, file_id, md.File)
    session.delete(db_file)


@router.patch("/access", status_code=204)
def change_access(
    session: SessionDep,
    file_id: int,
    username: str,
    has_access: bool,
    _: CurrentSuperUser,
):
    db_file = get_db_obj_or_err(session, file_id, md.File)
    db_user = crud.get_user_by_username(session=session, username=username)

    if has_access:
        db_file.users.append(db_user)
    else:
        db_file.users.remove(db_user)
    session.add(db_file)
    session.commit()
