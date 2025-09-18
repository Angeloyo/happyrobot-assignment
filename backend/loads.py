from fastapi import APIRouter, Depends, HTTPException
from auth import verify_api_key
from models import LoadCreate, LoadResponse
from database import get_db_connection
from datetime import datetime

router = APIRouter()

def generate_load_id():
    """Generate a new load ID in format L + YYMMDD + 3-digit sequence"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get current date in YYMMDD format
    today = datetime.now().strftime("%y%m%d")
    prefix = f"L{today}"
    
    # Find the highest sequence number for today
    cursor.execute("""
        SELECT load_id FROM loads 
        WHERE load_id LIKE %s 
        ORDER BY load_id DESC 
        LIMIT 1
    """, (f"{prefix}%",))
    
    result = cursor.fetchone()
    
    if result:
        # Extract sequence number and increment
        last_id = result[0]
        sequence = int(last_id[-3:]) + 1
    else:
        # First load of the day
        sequence = 1
    
    cursor.close()
    conn.close()
    
    return f"{prefix}{sequence:03d}"

@router.post("/loads", response_model=LoadResponse, dependencies=[Depends(verify_api_key)])
def create_load(load: LoadCreate):
    """Create a new load"""
    try:
        # Generate new load ID
        load_id = generate_load_id()
        
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insert into database
        cursor.execute("""
            INSERT INTO loads (
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
                dimensions
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING created_at
        """, (
            load_id,
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
        
        created_at = cursor.fetchone()[0]
        conn.commit()
        
        # Return the created load
        return LoadResponse(
            load_id=load_id,
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

@router.get("/loads/search", dependencies=[Depends(verify_api_key)])
def search_loads(origin: str = None, destination: str = None, load_id: str = None):
    """Search loads by load_id, origin and/or destination"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        where_conditions = []
        params = []
        
        if load_id:
            where_conditions.append("load_id ILIKE %s")
            params.append(f"%{load_id}%")
        
        if origin:
            where_conditions.append("origin ILIKE %s")
            params.append(f"%{origin}%")
        
        if destination:
            where_conditions.append("destination ILIKE %s")
            params.append(f"%{destination}%")
        
        where_clause = ""
        if where_conditions:
            where_clause = "WHERE " + " AND ".join(where_conditions)
        
        cursor.execute(f"""
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
            {where_clause}
            ORDER BY created_at DESC
        """, params)
        
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
