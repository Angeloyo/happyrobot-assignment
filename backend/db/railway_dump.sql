--
-- PostgreSQL database dump
--

\restrict 6kFg9jlOX52ctgvsofO11ygR1BRs0Jde9YMgwS6QKXARziS2UWGZxSzrcfbdJTh

-- Dumped from database version 17.6 (Debian 17.6-1.pgdg13+1)
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    booking_id uuid DEFAULT gen_random_uuid() NOT NULL,
    load_id character varying(10),
    call_id uuid,
    booking_date timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- Name: call_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.call_logs (
    call_id uuid DEFAULT gen_random_uuid() NOT NULL,
    load_id character varying(10),
    mc_number integer,
    carrier_name text,
    notes text,
    sentiment text,
    result text,
    final_rate numeric(10,2),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.call_logs OWNER TO postgres;

--
-- Name: loads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loads (
    load_id character varying(10) NOT NULL,
    origin text NOT NULL,
    destination text NOT NULL,
    pickup_datetime timestamp with time zone NOT NULL,
    delivery_datetime timestamp with time zone NOT NULL,
    equipment_type text NOT NULL,
    loadboard_rate numeric(10,2) NOT NULL,
    notes text,
    weight numeric(10,2),
    commodity_type text,
    num_of_pieces integer,
    miles numeric(10,2),
    dimensions text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT chk_delivery_after_pickup CHECK ((delivery_datetime >= pickup_datetime))
);


ALTER TABLE public.loads OWNER TO postgres;

--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (booking_id, load_id, call_id, booking_date) FROM stdin;
a42cccd8-25df-47f4-b830-4d76f7622220	L250918001	12cfff6d-a7c6-4bf7-8cf2-e46cbb5efd8c	2025-09-18 19:32:17.031524+00
872e57d8-70d3-464a-953b-e4456b792d4a	L250918003	14b9a47b-147c-4865-b7a6-b00d2fa8b464	2025-09-18 19:32:17.031524+00
e0653e85-1544-4d48-bc8a-ff617117e4f8	L250918007	baceab60-2a45-4582-b19c-f095d6a2672b	2025-09-18 19:32:17.031524+00
a1b2371a-e08f-4c32-9ba1-b670706977ed	L250918009	a51651d1-bc90-4149-a19a-54d74fc89693	2025-09-18 19:32:17.031524+00
24fce1bc-565e-4937-9ef9-caa8dda5b026	L250918004	4eed1a8e-e001-40c6-9da9-0d23047a1c0f	2025-09-18 19:44:02.473212+00
\.


--
-- Data for Name: call_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.call_logs (call_id, load_id, mc_number, carrier_name, notes, sentiment, result, final_rate, created_at) FROM stdin;
12cfff6d-a7c6-4bf7-8cf2-e46cbb5efd8c	L250918001	123456	Fast Freight LLC	Needs to pickup 2 hours late due to dock scheduling	Positive	Success	2600.00	2025-09-18 18:19:43.76409+00
7bb9930b-0122-4732-9e53-192ae620d2bc	L250918002	789012	Desert Transport Co	\N	Negative	Failed: Rate too high	\N	2025-09-18 18:19:43.76409+00
14b9a47b-147c-4865-b7a6-b00d2fa8b464	L250918003	345678	Miami Express Inc	Reefer unit pre-cooled and ready	Positive	Success	3350.00	2025-09-18 18:19:43.76409+00
5cd356a7-dee9-4b8c-9484-c6dc68610138	L250918004	111222	Shady Trucking	\N	Neutral	Failed: MC denied	\N	2025-09-18 18:19:43.76409+00
dce0882b-e8af-48ab-a2c3-ec240b4f9bb6	L250918005	555666	Northwest Haulers	Called about wrong load number L250918020	Neutral	Failed: Could not find load	\N	2025-09-18 18:19:43.76409+00
baceab60-2a45-4582-b19c-f095d6a2672b	L250918007	999000	Boston Bay Transport	\N	Positive	Success	980.00	2025-09-18 18:19:43.76409+00
e31d6b26-8195-47a0-b953-39f64194baf1	L250918008	444555	Vegas Express	Driver available but rate too low	Negative	Failed: Rate too high	\N	2025-09-18 18:19:43.76409+00
a51651d1-bc90-4149-a19a-54d74fc89693	L250918009	888999	Cold Chain Logistics	Experienced with frozen foods, has HACCP certification	Positive	Success	2100.00	2025-09-18 18:19:43.76409+00
359efa14-d750-495a-b28f-edd2d214a11c	L250918002	222333	Phoenix Runners	\N	Neutral	Failed: Rate too high	\N	2025-09-18 18:19:43.76409+00
4eed1a8e-e001-40c6-9da9-0d23047a1c0f	L250918004	121805	FEDEX FREIGHT INC		Positive	Success	1950.00	2025-09-18 19:44:02.467298+00
555d13b5-564e-4fff-8158-1dc29a82daee	L250918006	777888	Steel Haulers Pro	No tarps available	Negative	Failed: Cancelled by caller	\N	2025-09-18 18:19:43.76409+00
6aa824f1-07e3-4097-a01c-7f2ede2093ff	L250918009	666777	Motor City Freight	No frozen foods experience	Neutral	Failed: Cancelled by caller	\N	2025-09-18 18:19:43.76409+00
72bad66b-99f5-4769-a33b-7ed616b3e9f3	L250918010	333444	Plains Transport	Already booked for those pickup dates	Positive	Failed: Cancelled by caller	\N	2025-09-18 18:19:43.76409+00
3850dd63-a93f-4e43-8506-6db17417319a	L250919001	234567	KENT P HOLLENBECK		Negative	Failed: Rate too high	2420.00	2025-09-19 08:13:32.183384+00
\.


--
-- Data for Name: loads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loads (load_id, origin, destination, pickup_datetime, delivery_datetime, equipment_type, loadboard_rate, notes, weight, commodity_type, num_of_pieces, miles, dimensions, created_at) FROM stdin;
L250918001	Chicago, IL	Atlanta, GA	2025-09-22 13:00:00+00	2025-09-24 21:00:00+00	Dry Van	2450.00	Automotive parts - handle with care	42000.00	Auto Parts	85	717.50	53x8.5x9	2025-09-18 16:53:14.202947+00
L250918002	Los Angeles, CA	Phoenix, AZ	2025-09-21 22:00:00+00	2025-09-23 06:59:00+00	Flatbed	1200.00	Steel coils - tarps required	45000.00	Steel Products	12	372.00	48x8.5x8.5	2025-09-18 16:53:14.202947+00
L250918003	Miami, FL	New York, NY	2025-09-23 10:00:00+00	2025-09-25 22:00:00+00	Reefer	3200.00	Fresh produce - maintain 34°F	38000.00	Fresh Produce	150	1280.00	53x8.5x9	2025-09-18 16:53:14.202947+00
L250918004	Dallas, TX	Denver, CO	2025-09-24 17:00:00+00	2025-09-26 14:00:00+00	Dry Van	1850.00	Electronics - fragile cargo	25000.00	Electronics	45	781.00	53x8.5x9	2025-09-18 16:53:14.202947+00
L250918005	Seattle, WA	Portland, OR	2025-09-25 18:00:00+00	2025-09-26 04:00:00+00	Dry Van	650.00	Same day delivery - urgent	18000.00	Retail Goods	25	173.00	26x8.5x9	2025-09-18 16:53:14.202947+00
L250918006	Houston, TX	Memphis, TN	2025-09-26 12:00:00+00	2025-09-28 21:00:00+00	Flatbed	1950.00	Construction materials - heavy load	48000.00	Construction Materials	8	561.00	48x8.5x8.5	2025-09-18 16:53:14.202947+00
L250918007	Boston, MA	Washington, DC	2025-09-27 13:00:00+00	2025-09-28 19:00:00+00	Dry Van	980.00	Pharmaceutical supplies - expedited	12000.00	Pharmaceuticals	30	440.00	28x8.5x9	2025-09-18 16:53:14.202947+00
L250918008	San Francisco, CA	Las Vegas, NV	2025-09-29 00:00:00+00	2025-09-30 07:00:00+00	Dry Van	1350.00	Casino equipment - high value	35000.00	Gaming Equipment	15	569.00	53x8.5x9	2025-09-18 16:53:14.202947+00
L250918009	Detroit, MI	Nashville, TN	2025-09-29 15:00:00+00	2025-10-01 19:00:00+00	Reefer	2100.00	Frozen foods - maintain 0°F	41000.00	Frozen Foods	200	467.00	53x8.5x9	2025-09-18 16:53:14.202947+00
L250918010	Kansas City, MO	Oklahoma City, OK	2025-09-30 18:00:00+00	2025-10-02 00:00:00+00	Dry Van	780.00	General freight - standard delivery	22000.00	General Freight	35	347.00	40x8.5x9	2025-09-18 16:53:14.202947+00
L250919001	Chicago, IL	Atlanta, GA	2025-09-25 09:00:00+00	2025-09-27 14:00:00+00	Flatbed	2350.00	\N	35000.00	Food	\N	700.00	\N	2025-09-19 07:13:33.36241+00
\.


--
-- Name: bookings bookings_load_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_load_id_key UNIQUE (load_id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (booking_id);


--
-- Name: call_logs call_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.call_logs
    ADD CONSTRAINT call_logs_pkey PRIMARY KEY (call_id);


--
-- Name: loads loads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loads
    ADD CONSTRAINT loads_pkey PRIMARY KEY (load_id);


--
-- Name: bookings bookings_call_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_call_id_fkey FOREIGN KEY (call_id) REFERENCES public.call_logs(call_id);


--
-- Name: bookings bookings_load_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_load_id_fkey FOREIGN KEY (load_id) REFERENCES public.loads(load_id);


--
-- Name: call_logs call_logs_load_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.call_logs
    ADD CONSTRAINT call_logs_load_id_fkey FOREIGN KEY (load_id) REFERENCES public.loads(load_id);


--
-- PostgreSQL database dump complete
--

\unrestrict 6kFg9jlOX52ctgvsofO11ygR1BRs0Jde9YMgwS6QKXARziS2UWGZxSzrcfbdJTh

