from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LoadCreate(BaseModel):
    origin: str
    destination: str
    pickup_datetime: datetime
    delivery_datetime: datetime
    equipment_type: str
    loadboard_rate: float
    notes: Optional[str] = None
    weight: Optional[float] = None
    commodity_type: Optional[str] = None
    num_of_pieces: Optional[int] = None
    miles: Optional[float] = None
    dimensions: Optional[str] = None

class LoadResponse(BaseModel):
    load_id: str

    origin: str
    destination: str
    pickup_datetime: datetime
    delivery_datetime: datetime
    equipment_type: str
    loadboard_rate: float
    notes: Optional[str] = None
    weight: Optional[float] = None
    commodity_type: Optional[str] = None
    num_of_pieces: Optional[int] = None
    miles: Optional[float] = None
    dimensions: Optional[str] = None
    
    created_at: datetime
    is_booked: Optional[bool] = False

class CallLogCreate(BaseModel):
    load_id: Optional[str] = None
    mc_number: Optional[int] = None
    carrier_name: Optional[str] = None
    notes: Optional[str] = None
    sentiment: Optional[str] = None
    result: Optional[str] = None
    final_rate: Optional[float] = None

class CallLogResponse(BaseModel):
    call_id: str
    load_id: Optional[str] = None
    mc_number: Optional[int] = None
    carrier_name: Optional[str] = None
    notes: Optional[str] = None
    sentiment: Optional[str] = None
    result: Optional[str] = None
    final_rate: Optional[float] = None
    created_at: datetime
    booking_created: Optional[bool] = False
