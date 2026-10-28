import datetime
import uuid
from fastapi import APIRouter, HTTPException, status, Depends
from app.schemas.user import UserRegister, UserLogin, UserResponse, TokenResponse
from app.auth.jwt_handler import hash_password, verify_password, create_access_token, get_current_user
from app.database.mongodb import db_manager

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    # Check if email exists
    existing = await db_manager.find_one("users", {"email": user_data.email.lower()})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists"
        )

    now_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    user_id = f"usr_{uuid.uuid4().hex[:12]}"

    avatar_url = f"https://api.dicebear.com/7.x/initials/svg?seed={user_data.name}&backgroundColor=2563eb&textColor=ffffff"

    new_user = {
        "_id": user_id,
        "name": user_data.name.strip(),
        "email": user_data.email.lower().strip(),
        "hashed_password": hash_password(user_data.password),
        "avatar_url": avatar_url,
        "created_at": now_iso
    }

    await db_manager.insert_one("users", new_user)

    token = create_access_token({"sub": user_id, "email": new_user["email"]})

    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            name=new_user["name"],
            email=new_user["email"],
            avatar_url=avatar_url,
            created_at=now_iso
        )
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
    user = await db_manager.find_one("users", {"email": credentials.email.lower().strip()})
    if not user or not verify_password(credentials.password, user.get("hashed_password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = str(user["_id"])
    token = create_access_token({"sub": user_id, "email": user["email"]})

    return TokenResponse(
        access_token=token,
        user=UserResponse(
            id=user_id,
            name=user["name"],
            email=user["email"],
            avatar_url=user.get("avatar_url"),
            created_at=user.get("created_at", datetime.datetime.now(datetime.timezone.utc).isoformat())
        )
    )

@router.get("/me", response_model=UserResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user["_id"]),
        name=current_user["name"],
        email=current_user["email"],
        avatar_url=current_user.get("avatar_url"),
        created_at=current_user.get("created_at", "")
    )
