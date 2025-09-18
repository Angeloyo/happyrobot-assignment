from fastapi import APIRouter, Depends, HTTPException
from auth import verify_api_key
from models import CallLogCreate, CallLogResponse
from database import get_db_connection

router = APIRouter()

@router.post("/call-logs", response_model=CallLogResponse, dependencies=[Depends(verify_api_key)])
def create_call_log(call_log: CallLogCreate):
    """Create a new call log"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO call_logs (
                mc_number,
                carrier_name,
                notes,
                sentiment,
                result,
                initial_rate,
                final_rate
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING call_id, created_at
        """, (
            call_log.mc_number,
            call_log.carrier_name,
            call_log.notes,
            call_log.sentiment,
            call_log.result,
            call_log.initial_rate,
            call_log.final_rate
        ))
        
        call_id, created_at = cursor.fetchone()
        conn.commit()
        
        return CallLogResponse(
            call_id=str(call_id),
            mc_number=call_log.mc_number,
            carrier_name=call_log.carrier_name,
            notes=call_log.notes,
            sentiment=call_log.sentiment,
            result=call_log.result,
            initial_rate=call_log.initial_rate,
            final_rate=call_log.final_rate,
            created_at=created_at
        )
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()