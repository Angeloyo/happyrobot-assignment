export interface Load {
  load_id: string
  origin: string
  destination: string
  pickup_datetime: string
  delivery_datetime: string
  equipment_type: string
  loadboard_rate: number
  notes?: string
  weight?: number
  commodity_type?: string
  num_of_pieces?: number
  miles?: number
  dimensions?: string
  created_at: string
  is_booked?: boolean // computed field
}

export interface CallLog {
  call_id: string
  load_id?: string
  mc_number?: number
  carrier_name?: string
  notes?: string
  sentiment?: string
  result?: string
  final_rate?: number
  created_at: string
  booking_created?: boolean // computed field
}

export interface CallLogFull {
  call_id: string
  load_id?: string
  mc_number?: number
  carrier_name?: string
  notes?: string
  sentiment?: string
  result?: string
  final_rate?: number
  created_at: string
  load_details?: {
    origin: string
    destination: string
    pickup_datetime: string
    delivery_datetime: string
    equipment_type: string
    loadboard_rate: number
    notes?: string
    weight?: number
    commodity_type?: string
    num_of_pieces?: number
    miles?: number
    dimensions?: string
    created_at: string
  }
}
