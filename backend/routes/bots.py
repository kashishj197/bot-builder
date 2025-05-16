from fastapi import APIRouter, Depends

from backend.services.auth import get_current_user


router = APIRouter()

@router.post("/bots")
def get_bots(current_user = Depends(get_current_user)):
    return {"message": f"Bots endpoint is working for {current_user.email}!"}