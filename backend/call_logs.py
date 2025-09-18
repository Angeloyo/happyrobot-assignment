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
                load_id,
                mc_number,
                carrier_name,
                notes,
                sentiment,
                result,
                final_rate
            ) VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING call_id, created_at
        """, (
            call_log.load_id,
            call_log.mc_number,
            call_log.carrier_name,
            call_log.notes,
            call_log.sentiment,
            call_log.result,
            call_log.final_rate
        ))
        
        call_id, created_at = cursor.fetchone()
        conn.commit()
        
        return CallLogResponse(
            call_id=str(call_id),
            load_id=call_log.load_id,
            mc_number=call_log.mc_number,
            carrier_name=call_log.carrier_name,
            notes=call_log.notes,
            sentiment=call_log.sentiment,
            result=call_log.result,
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

@router.get("/call-logs", dependencies=[Depends(verify_api_key)])
def get_call_logs():
    """Get all call logs"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                call_id,
                load_id,
                mc_number,
                carrier_name,
                notes,
                sentiment,
                result,
                final_rate,
                created_at
            FROM call_logs
            ORDER BY created_at DESC
        """)
        
        call_logs = []
        for row in cursor.fetchall():
            call_logs.append(CallLogResponse(
                call_id=str(row[0]),
                load_id=row[1],
                mc_number=row[2],
                carrier_name=row[3],
                notes=row[4],
                sentiment=row[5],
                result=row[6],
                final_rate=float(row[7]) if row[7] is not None else None,
                created_at=row[8]
            ))
        
        return call_logs
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()