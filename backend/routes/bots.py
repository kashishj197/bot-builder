from fastapi import APIRouter, Depends, HTTPException, status

from sqlalchemy.orm import Session
from services.bot import create_bot_in_neo
from utils.db import get_db
from db.models import User
from schemas.bot import BotCreate
from services.auth import get_current_user


router = APIRouter()

@router.post("/bots")
def create_bot(
    bot_data: BotCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        bot_id = create_bot_in_neo(bot_data.name, current_user.id)
        return {
            "message": "Bot created successfully",
            "bot_id": str(bot_id)
        }
    except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))