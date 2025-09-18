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
        
        # Create booking if result is Success
        booking_created = False
        if call_log.result and call_log.result.lower() == "success" and call_log.load_id:
            try:
                cursor.execute("""
                    INSERT INTO bookings (load_id, call_id)
                    VALUES (%s, %s)
                """, (call_log.load_id, call_id))
                conn.commit()
                booking_created = True
            except Exception as booking_error:
                # If booking fails continue without failing the call log
                conn.rollback()
                print(f"Booking creation failed: {booking_error}")
        
        return CallLogResponse(
            call_id=str(call_id),
            load_id=call_log.load_id,
            mc_number=call_log.mc_number,
            carrier_name=call_log.carrier_name,
            notes=call_log.notes,
            sentiment=call_log.sentiment,
            result=call_log.result,
            final_rate=call_log.final_rate,
            created_at=created_at,
            booking_created=booking_created
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

@router.get("/call-logs-full", dependencies=[Depends(verify_api_key)])
def get_call_logs_full():
    """Get all call logs with load details"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                cl.call_id,
                cl.load_id,
                cl.mc_number,
                cl.carrier_name,
                cl.notes,
                cl.sentiment,
                cl.result,
                cl.final_rate,
                cl.created_at,
                l.origin,
                l.destination,
                l.pickup_datetime,
                l.delivery_datetime,
                l.equipment_type,
                l.loadboard_rate,
                l.notes,
                l.weight,
                l.commodity_type,
                l.num_of_pieces,
                l.miles,
                l.dimensions,
                l.created_at
            FROM call_logs cl
            LEFT JOIN loads l ON cl.load_id = l.load_id
            ORDER BY cl.created_at DESC
        """)
        
        call_logs_full = []
        for row in cursor.fetchall():
            call_log_data = {
                "call_id": str(row[0]),
                "load_id": row[1],
                "mc_number": row[2],
                "carrier_name": row[3],
                "notes": row[4],
                "sentiment": row[5],
                "result": row[6],
                "final_rate": float(row[7]) if row[7] is not None else None,
                "created_at": row[8],
                "load_details": {
                    "origin": row[9],
                    "destination": row[10],
                    "pickup_datetime": row[11],
                    "delivery_datetime": row[12],
                    "equipment_type": row[13],
                    "loadboard_rate": float(row[14]) if row[14] is not None else None,
                    "notes": row[15],
                    "weight": float(row[16]) if row[16] is not None else None,
                    "commodity_type": row[17],
                    "num_of_pieces": row[18],
                    "miles": float(row[19]) if row[19] is not None else None,
                    "dimensions": row[20],
                    "created_at": row[21],
                } if row[9] is not None else None
            }
            call_logs_full.append(call_log_data)
        
        return call_logs_full
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()