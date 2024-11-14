from datetime import datetime
from functools import partial

from sqlmodel import Field, Relationship, SQLModel

PasswordField = partial(
    Field,
    min_length=6,
    max_length=40,
)


class UserFileLink(SQLModel, table=True):
    user_id: int | None = Field(default=None, foreign_key="user.id", primary_key=True)
    file_id: int | None = Field(default=None, foreign_key="file.id", primary_key=True)


class Base(SQLModel):
    created_at: datetime = Field(default=datetime.utcnow(), nullable=False)
    last_edited: datetime = Field(default_factory=datetime.utcnow, nullable=False)


# Shared properties
class UserBase(Base, SQLModel):
    username: str = Field(unique=True, max_length=40, index=True)
    is_active: bool = True
    is_superuser: bool = False


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = PasswordField()


class UserRegister(SQLModel):
    username: str = Field(unique=True, max_length=40, index=True)
    password: str = PasswordField()


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    username: str = Field(default=None, unique=True, max_length=40, index=True)
    password: str = PasswordField(default=None)


class UpdatePassword(SQLModel):
    current_password: str = PasswordField()
    new_password: str = PasswordField()


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)

    files: list["File"] = Relationship(back_populates="users", link_model=UserFileLink)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: int


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"
    is_superuser: bool = False


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = PasswordField()


"""Files"""
class FileBase(Base):
    download_count: int = Field(default=0)
    size: float
    name: str


class File(FileBase, table=True):
    id: int = Field(default=None, primary_key=True)

    users: list["User"] = Relationship(back_populates="files", link_model=UserFileLink)


# Properties to return via API, id is always required
class FilePublic(FileBase):
    id: int


class FilePublicUsers(FilePublic):
    users: list[UserPublic]


class FilesPublic(SQLModel):
    data: list[FilePublic]
    count: int
