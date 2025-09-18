from fastapi import APIRouter, Depends, HTTPException
from auth import verify_api_key
from models import LoadCreate, LoadResponse
from database import get_db_connection
import uuid

router = APIRouter()

@router.post("/loads", response_model=LoadResponse, dependencies=[Depends(verify_api_key)])
def create_load(load: LoadCreate):
    """Create a new load"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert into database
        cursor.execute("""
            INSERT INTO loads (
                origin, 
                destination, 
                pickup_datetime, 
                delivery_datetime,
                equipment_type, 
                loadboard_rate, 
                notes,
                weight, 
                commodity_type,
                num_of_pieces, 
                miles, 
                dimensions
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING load_id, created_at
        """, (
            load.origin, 
            load.destination, 
            load.pickup_datetime,
            load.delivery_datetime, 
            load.equipment_type, 
            load.loadboard_rate,
            load.notes, 
            load.weight, 
            load.commodity_type, 
            load.num_of_pieces,
            load.miles, 
            load.dimensions
        ))
        
        load_id, created_at = cursor.fetchone()
        conn.commit()
        
        # Return the created load
        return LoadResponse(
            load_id=str(load_id),
            origin=load.origin,
            destination=load.destination,
            pickup_datetime=load.pickup_datetime,
            delivery_datetime=load.delivery_datetime,
            equipment_type=load.equipment_type,
            loadboard_rate=load.loadboard_rate,
            notes=load.notes,
            weight=load.weight,
            commodity_type=load.commodity_type,
            num_of_pieces=load.num_of_pieces,
            miles=load.miles,
            dimensions=load.dimensions,
            created_at=created_at
        )
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cursor.close()
        conn.close()

@router.get("/loads", dependencies=[Depends(verify_api_key)])
def get_loads():
    """Get all loads"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                load_id, 
                origin, 
                destination, 
                pickup_datetime, 
                delivery_datetime,
                equipment_type, 
                loadboard_rate, 
                notes, 
                weight, 
                commodity_type,
                num_of_pieces, 
                miles, 
                dimensions, 
                created_at
            FROM loads
            ORDER BY created_at DESC
        """)
        
        loads = []
        for row in cursor.fetchall():
            loads.append(LoadResponse(
                load_id=str(row[0]),
                origin=row[1],
                destination=row[2],
                pickup_datetime=row[3],
                delivery_datetime=row[4],
                equipment_type=row[5],
                loadboard_rate=float(row[6]),
                notes=row[7],
                weight=float(row[8]) if row[8] is not None else None,
                commodity_type=row[9],
                num_of_pieces=row[10],
                miles=float(row[11]) if row[11] is not None else None,
                dimensions=row[12],
                created_at=row[13]
            ))
        
        return loads
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cursor.close()
        conn.close()

@router.delete("/loads/{load_id}", dependencies=[Depends(verify_api_key)])
def delete_load(load_id: str):
    """Delete a load"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute("DELETE FROM loads WHERE load_id = %s", (load_id,))
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Load not found")
        
        conn.commit()
        return {"message": "Load deleted successfully"}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    finally:
        cursor.close()
        conn.close()
