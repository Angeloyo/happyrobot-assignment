
CREATE TABLE IF NOT EXISTS loads (
  load_id            varchar(10) PRIMARY KEY,
  origin             text        NOT NULL,
  destination        text        NOT NULL,
  pickup_datetime    timestamptz NOT NULL,
  delivery_datetime  timestamptz NOT NULL,
  equipment_type     text        NOT NULL,
  loadboard_rate     numeric(10,2) NOT NULL,
  notes              text,
  weight             numeric(10,2),
  commodity_type     text,
  num_of_pieces      integer,
  miles              numeric(10,2),
  dimensions         text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_delivery_after_pickup
    CHECK (delivery_datetime >= pickup_datetime)
);


CREATE TABLE IF NOT EXISTS call_logs (
  call_id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  load_id            varchar(10) REFERENCES loads(load_id),
  mc_number          integer,
  carrier_name       text,
  notes              text,
  sentiment          text,
  result             text,
  final_rate         numeric(10,2),
  created_at         timestamptz NOT NULL DEFAULT now()
);