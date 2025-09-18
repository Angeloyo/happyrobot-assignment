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
}
