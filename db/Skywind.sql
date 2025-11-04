--
-- PostgreSQL database dump
--

\restrict 76gf4OtfzqZDwhrJpTGimNQ4QHyCHx2f25CPUJpiMtE2K1RaU8hnbZC6hfL65sN

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

-- Started on 2025-10-23 14:14:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5052 (class 1262 OID 16927)
-- Name: skywind; Type: DATABASE; Schema: -; Owner: postgres
--


ALTER DATABASE skywind OWNER TO postgres;

\unrestrict 76gf4OtfzqZDwhrJpTGimNQ4QHyCHx2f25CPUJpiMtE2K1RaU8hnbZC6hfL65sN
\connect skywind
\restrict 76gf4OtfzqZDwhrJpTGimNQ4QHyCHx2f25CPUJpiMtE2K1RaU8hnbZC6hfL65sN

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16964)
-- Name: address; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.address (
    address_id integer NOT NULL,
    user_id integer,
    street character varying(100),
    city character varying(50),
    state character varying(50),
    zip_code character varying(20),
    country character varying(50)
);


ALTER TABLE public.address OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16963)
-- Name: address_address_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.address_address_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.address_address_id_seq OWNER TO postgres;

--
-- TOC entry 5053 (class 0 OID 0)
-- Dependencies: 219
-- Name: address_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.address_address_id_seq OWNED BY public.address.address_id;


--
-- TOC entry 222 (class 1259 OID 16977)
-- Name: brand; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brand (
    brand_id integer NOT NULL,
    name character varying(100)
);


ALTER TABLE public.brand OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16976)
-- Name: brand_brand_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.brand_brand_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brand_brand_id_seq OWNER TO postgres;

--
-- TOC entry 5054 (class 0 OID 0)
-- Dependencies: 221
-- Name: brand_brand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.brand_brand_id_seq OWNED BY public.brand.brand_id;


--
-- TOC entry 226 (class 1259 OID 17015)
-- Name: cart; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart (
    cart_id integer NOT NULL,
    buyer_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


ALTER TABLE public.cart OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 17014)
-- Name: cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_cart_id_seq OWNER TO postgres;

--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 225
-- Name: cart_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_cart_id_seq OWNED BY public.cart.cart_id;


--
-- TOC entry 228 (class 1259 OID 17028)
-- Name: cartitem; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cartitem (
    cart_item_id integer NOT NULL,
    cart_id integer,
    product_id integer,
    quantity integer
);


ALTER TABLE public.cartitem OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 17027)
-- Name: cartitem_cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cartitem_cart_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cartitem_cart_item_id_seq OWNER TO postgres;

--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 227
-- Name: cartitem_cart_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cartitem_cart_item_id_seq OWNED BY public.cartitem.cart_item_id;


--
-- TOC entry 246 (class 1259 OID 17250)
-- Name: image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.image (
    image_id integer NOT NULL,
    product_id integer,
    name text NOT NULL,
    path text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.image OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 17249)
-- Name: image_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.image_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.image_image_id_seq OWNER TO postgres;

--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 245
-- Name: image_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.image_image_id_seq OWNED BY public.image.image_id;


--
-- TOC entry 240 (class 1259 OID 17118)
-- Name: inventoryinfo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventoryinfo (
    inventory_id integer NOT NULL,
    warehouse_id integer,
    product_id integer,
    quantity integer,
    last_updated timestamp without time zone
);


ALTER TABLE public.inventoryinfo OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 17117)
-- Name: inventoryinfo_inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventoryinfo_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventoryinfo_inventory_id_seq OWNER TO postgres;

--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 239
-- Name: inventoryinfo_inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventoryinfo_inventory_id_seq OWNED BY public.inventoryinfo.inventory_id;


--
-- TOC entry 232 (class 1259 OID 17059)
-- Name: orderdetail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orderdetail (
    order_detail_id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer,
    price numeric(10,2)
);


ALTER TABLE public.orderdetail OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 17058)
-- Name: orderdetail_order_detail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orderdetail_order_detail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orderdetail_order_detail_id_seq OWNER TO postgres;

--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 231
-- Name: orderdetail_order_detail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orderdetail_order_detail_id_seq OWNED BY public.orderdetail.order_detail_id;


--
-- TOC entry 230 (class 1259 OID 17046)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    order_id integer NOT NULL,
    buyer_id integer,
    order_date timestamp without time zone,
    total_amount numeric(10,2),
    status character varying(30)
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17045)
-- Name: orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_order_id_seq OWNER TO postgres;

--
-- TOC entry 5060 (class 0 OID 0)
-- Dependencies: 229
-- Name: orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_order_id_seq OWNED BY public.orders.order_id;


--
-- TOC entry 234 (class 1259 OID 17077)
-- Name: payment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payment (
    payment_id integer NOT NULL,
    order_id integer,
    payment_date timestamp without time zone,
    method character varying(30),
    status character varying(30),
    amount numeric(10,2)
);


ALTER TABLE public.payment OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 17076)
-- Name: payment_payment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.payment_payment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.payment_payment_id_seq OWNER TO postgres;

--
-- TOC entry 5061 (class 0 OID 0)
-- Dependencies: 233
-- Name: payment_payment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.payment_payment_id_seq OWNED BY public.payment.payment_id;


--
-- TOC entry 242 (class 1259 OID 17140)
-- Name: product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product (
    product_id integer CONSTRAINT product_new_product_id_not_null NOT NULL,
    name character varying(100),
    price numeric,
    stock integer,
    brand_id integer,
    promo_id integer,
    cpu character varying(100),
    ram character varying(50),
    ssd character varying(50),
    vga character varying(100),
    man_hinh character varying(100),
    is_hot boolean
);


ALTER TABLE public.product OWNER TO postgres;

--
-- TOC entry 241 (class 1259 OID 17139)
-- Name: product_new_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_new_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_new_product_id_seq OWNER TO postgres;

--
-- TOC entry 5062 (class 0 OID 0)
-- Dependencies: 241
-- Name: product_new_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_new_product_id_seq OWNED BY public.product.product_id;


--
-- TOC entry 224 (class 1259 OID 16985)
-- Name: promotion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promotion (
    promo_id integer NOT NULL,
    description text,
    discount_rate numeric(5,2),
    start_date date,
    end_date date
);


ALTER TABLE public.promotion OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16984)
-- Name: promotion_promo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.promotion_promo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promotion_promo_id_seq OWNER TO postgres;

--
-- TOC entry 5063 (class 0 OID 0)
-- Dependencies: 223
-- Name: promotion_promo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.promotion_promo_id_seq OWNED BY public.promotion.promo_id;


--
-- TOC entry 236 (class 1259 OID 17090)
-- Name: rating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rating (
    rating_id integer NOT NULL,
    product_id integer,
    buyer_id integer,
    rating integer,
    comment text,
    created_at timestamp without time zone
);


ALTER TABLE public.rating OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 17089)
-- Name: rating_rating_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rating_rating_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rating_rating_id_seq OWNER TO postgres;

--
-- TOC entry 5064 (class 0 OID 0)
-- Dependencies: 235
-- Name: rating_rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rating_rating_id_seq OWNED BY public.rating.rating_id;


--
-- TOC entry 244 (class 1259 OID 17199)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(512) NOT NULL,
    email character varying(100),
    is_active boolean DEFAULT true,
    role character varying(20) DEFAULT 'user'::character varying
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 17198)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- TOC entry 5065 (class 0 OID 0)
-- Dependencies: 243
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- TOC entry 238 (class 1259 OID 17110)
-- Name: warehouse; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.warehouse (
    warehouse_id integer NOT NULL,
    name character varying(100),
    location character varying(100)
);


ALTER TABLE public.warehouse OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 17109)
-- Name: warehouse_warehouse_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.warehouse_warehouse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.warehouse_warehouse_id_seq OWNER TO postgres;

--
-- TOC entry 5066 (class 0 OID 0)
-- Dependencies: 237
-- Name: warehouse_warehouse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.warehouse_warehouse_id_seq OWNED BY public.warehouse.warehouse_id;


--
-- TOC entry 4820 (class 2604 OID 16967)
-- Name: address address_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address ALTER COLUMN address_id SET DEFAULT nextval('public.address_address_id_seq'::regclass);


--
-- TOC entry 4821 (class 2604 OID 16980)
-- Name: brand brand_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand ALTER COLUMN brand_id SET DEFAULT nextval('public.brand_brand_id_seq'::regclass);


--
-- TOC entry 4823 (class 2604 OID 17018)
-- Name: cart cart_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart ALTER COLUMN cart_id SET DEFAULT nextval('public.cart_cart_id_seq'::regclass);


--
-- TOC entry 4824 (class 2604 OID 17031)
-- Name: cartitem cart_item_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitem ALTER COLUMN cart_item_id SET DEFAULT nextval('public.cartitem_cart_item_id_seq'::regclass);


--
-- TOC entry 4835 (class 2604 OID 17253)
-- Name: image image_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image ALTER COLUMN image_id SET DEFAULT nextval('public.image_image_id_seq'::regclass);


--
-- TOC entry 4830 (class 2604 OID 17121)
-- Name: inventoryinfo inventory_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventoryinfo ALTER COLUMN inventory_id SET DEFAULT nextval('public.inventoryinfo_inventory_id_seq'::regclass);


--
-- TOC entry 4826 (class 2604 OID 17062)
-- Name: orderdetail order_detail_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderdetail ALTER COLUMN order_detail_id SET DEFAULT nextval('public.orderdetail_order_detail_id_seq'::regclass);


--
-- TOC entry 4825 (class 2604 OID 17049)
-- Name: orders order_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN order_id SET DEFAULT nextval('public.orders_order_id_seq'::regclass);


--
-- TOC entry 4827 (class 2604 OID 17080)
-- Name: payment payment_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment ALTER COLUMN payment_id SET DEFAULT nextval('public.payment_payment_id_seq'::regclass);


--
-- TOC entry 4831 (class 2604 OID 17143)
-- Name: product product_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product ALTER COLUMN product_id SET DEFAULT nextval('public.product_new_product_id_seq'::regclass);


--
-- TOC entry 4822 (class 2604 OID 16988)
-- Name: promotion promo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion ALTER COLUMN promo_id SET DEFAULT nextval('public.promotion_promo_id_seq'::regclass);


--
-- TOC entry 4828 (class 2604 OID 17093)
-- Name: rating rating_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating ALTER COLUMN rating_id SET DEFAULT nextval('public.rating_rating_id_seq'::regclass);


--
-- TOC entry 4832 (class 2604 OID 17202)
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- TOC entry 4829 (class 2604 OID 17113)
-- Name: warehouse warehouse_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse ALTER COLUMN warehouse_id SET DEFAULT nextval('public.warehouse_warehouse_id_seq'::regclass);


--
-- TOC entry 5020 (class 0 OID 16964)
-- Dependencies: 220
-- Data for Name: address; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5022 (class 0 OID 16977)
-- Dependencies: 222
-- Data for Name: brand; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.brand VALUES (1, 'Asus');
INSERT INTO public.brand VALUES (2, 'Acer');
INSERT INTO public.brand VALUES (3, 'Dell');
INSERT INTO public.brand VALUES (4, 'HP');
INSERT INTO public.brand VALUES (5, 'Lenovo');
INSERT INTO public.brand VALUES (6, 'MSI');


--
-- TOC entry 5026 (class 0 OID 17015)
-- Dependencies: 226
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5028 (class 0 OID 17028)
-- Dependencies: 228
-- Data for Name: cartitem; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5046 (class 0 OID 17250)
-- Dependencies: 246
-- Data for Name: image; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.image VALUES (59, 5, 'laptop_asus_vivobook_s14_s3407ca_ly095ws-03_5faa40f2c0c24e85bef7f94cd7b80fe2_master.png', 'uploads/Asus/4/laptop_asus_vivobook_s14_s3407ca_ly095ws-03_5faa40f2c0c24e85bef7f94cd7b80fe2_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (60, 5, 'laptop_asus_vivobook_s14_s3407ca_ly095ws-04_91dca37969b34d328522d473620f30c1_master.png', 'uploads/Asus/4/laptop_asus_vivobook_s14_s3407ca_ly095ws-04_91dca37969b34d328522d473620f30c1_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (64, 6, 'laptop_asus_vivobook_s14_s3407ca_ly096ws-5_38ddbdd657f44d85b7746fe1db177db3_master.png', 'uploads/Asus/5/laptop_asus_vivobook_s14_s3407ca_ly096ws-5_38ddbdd657f44d85b7746fe1db177db3_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (65, 6, 'laptop_asus_vivobook_s14_s3407ca_ly096ws-6_886d048c88e3457d9f205ef26408e26a_master.png', 'uploads/Asus/5/laptop_asus_vivobook_s14_s3407ca_ly096ws-6_886d048c88e3457d9f205ef26408e26a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (66, 6, 'laptop_asus_vivobook_s14_s3407ca_ly096ws-7_a9b04719bc8449deafdbe9a17111eac6_master.png', 'uploads/Asus/5/laptop_asus_vivobook_s14_s3407ca_ly096ws-7_a9b04719bc8449deafdbe9a17111eac6_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (69, 7, 'zenbook_14_ux3405ca_product_photo_3b_ponder_blue_05_f6693bc33b884a8aa90a365fca0af65a_master.jpg', 'uploads/Asus/6/zenbook_14_ux3405ca_product_photo_3b_ponder_blue_05_f6693bc33b884a8aa90a365fca0af65a_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (70, 7, 'zenbook_14_ux3405ca_product_photo_3b_ponder_blue_06_5cb847d66edd4a3f904dfb052b587db4_master.png', 'uploads/Asus/6/zenbook_14_ux3405ca_product_photo_3b_ponder_blue_06_5cb847d66edd4a3f904dfb052b587db4_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (71, 7, 'zenbook_14_ux3405ca_product_photo_3b_ponder_blue_08_035383c7e3aa47748051e934952a4b0d_master.png', 'uploads/Asus/6/zenbook_14_ux3405ca_product_photo_3b_ponder_blue_08_035383c7e3aa47748051e934952a4b0d_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (72, 8, 'asus_vivobook_s16_m5606ka_product_photo_8k_neutral_black_06_1ad6d96fef1846c7886be3764be336c8_master.jpg', 'uploads/Asus/7/asus_vivobook_s16_m5606ka_product_photo_8k_neutral_black_06_1ad6d96fef1846c7886be3764be336c8_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (73, 8, 'asus_vivobook_s16_m5606ka_product_photo_8k_neutral_black_07_2f4099454b554ff0b782d2ebe54316d6_master.jpg', 'uploads/Asus/7/asus_vivobook_s16_m5606ka_product_photo_8k_neutral_black_07_2f4099454b554ff0b782d2ebe54316d6_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (74, 8, 'asus_vivobook_s16_m5606ka_product_photo_8k_neutral_black_13_77e05487fd234fec89d381ce4949dab6_master.jpg', 'uploads/Asus/7/asus_vivobook_s16_m5606ka_product_photo_8k_neutral_black_13_77e05487fd234fec89d381ce4949dab6_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (75, 8, 'us_vivobook_s16_m5606ka_product_photo_8k_neutral_black_05_camera_close_ecca76dc9dcb4888996bc9cc18b399e8_master__1_.jpg', 'uploads/Asus/7/us_vivobook_s16_m5606ka_product_photo_8k_neutral_black_05_camera_close_ecca76dc9dcb4888996bc9cc18b399e8_master__1_.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (76, 8, 'us_vivobook_s16_m5606ka_product_photo_8k_neutral_black_05_camera_close_ecca76dc9dcb4888996bc9cc18b399e8_master.jpg', 'uploads/Asus/7/us_vivobook_s16_m5606ka_product_photo_8k_neutral_black_05_camera_close_ecca76dc9dcb4888996bc9cc18b399e8_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (77, 9, 'zenbook_14_ux3405ca_product_photo_3b_ponder_blue_04_fedf062fa75147bbb0d009ef475105b7_master.png', 'uploads/Asus/8/zenbook_14_ux3405ca_product_photo_3b_ponder_blue_04_fedf062fa75147bbb0d009ef475105b7_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (78, 9, 'zenbook_14_ux3405ca_product_photo_3b_ponder_blue_06_65dda53c57804927ba29393748705da8_master.png', 'uploads/Asus/8/zenbook_14_ux3405ca_product_photo_3b_ponder_blue_06_65dda53c57804927ba29393748705da8_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (79, 9, 'zenbook_14_ux3405ca_product_photo_3b_ponder_blue_08_019fece2377c4e39bdbe8cc408a7f855_master.png', 'uploads/Asus/8/zenbook_14_ux3405ca_product_photo_3b_ponder_blue_08_019fece2377c4e39bdbe8cc408a7f855_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (80, 9, 'zenbook_14_ux3405ca_product_photo_3b_ponder_blue_09_61e55511ba50470ebaabdf2544556daf_master.png', 'uploads/Asus/8/zenbook_14_ux3405ca_product_photo_3b_ponder_blue_09_61e55511ba50470ebaabdf2544556daf_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (81, 10, 'asus_v3607_product_photo_1k_matt__2__c8b58908e469463d87e092c3cc76ddbe_master.png', 'uploads/Asus/9/asus_v3607_product_photo_1k_matt__2__c8b58908e469463d87e092c3cc76ddbe_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (82, 10, 'asus_v3607_product_photo_1k_matt__3__bf7404fb59ff49f2823c802306879109_master.png', 'uploads/Asus/9/asus_v3607_product_photo_1k_matt__3__bf7404fb59ff49f2823c802306879109_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (83, 10, 'asus_v3607_product_photo_1k_matt__4__8117597176f14d19aea1ae86ddec2bff_master.png', 'uploads/Asus/9/asus_v3607_product_photo_1k_matt__4__8117597176f14d19aea1ae86ddec2bff_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (84, 10, 'asus_v3607_product_photo_1k_matt__6__0dbd9e3c9ad04d26957ffd8730114bbb_master.png', 'uploads/Asus/9/asus_v3607_product_photo_1k_matt__6__0dbd9e3c9ad04d26957ffd8730114bbb_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (68, 7, 'zenbook_14_ux3405ca_product_photo_3b_ponder_blue_02_893e42dc16ca44c9ab226772d756c261_master.png', 'uploads/Asus/6/zenbook_14_ux3405ca_product_photo_3b_ponder_blue_04_6db0947238da42f8ae3662574b83b2db_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (240, 96, '1024__4__4bf54c10eb7942d3b36f4139fc8be525_master.png', 'uploads/MSI/8/1024__4__4bf54c10eb7942d3b36f4139fc8be525_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (241, 96, 'ava_e10fafc0165e4a2cb5380668574e512d_master.png', 'uploads/MSI/8/ava_e10fafc0165e4a2cb5380668574e512d_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (242, 97, '1024__1__4ce7108d02d54156b235978be0ab7e5b_master.png', 'uploads/MSI/9/1024__1__4ce7108d02d54156b235978be0ab7e5b_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (7, 12, 'gearvn-laptop-acer-aspire-5-a515-58p-71ej-1_e9e697ec1a934534891d0129e495e9b9_master.png', 'uploads/Acer/2/gearvn-laptop-acer-aspire-5-a515-58p-71ej-1_e9e697ec1a934534891d0129e495e9b9_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (8, 12, 'gearvn-laptop-acer-aspire-5-a515-58p-71ej-2_cf332b9be35e4974bad323aac17a4f9a_master.png', 'uploads/Acer/2/gearvn-laptop-acer-aspire-5-a515-58p-71ej-2_cf332b9be35e4974bad323aac17a4f9a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (9, 12, 'gearvn-laptop-acer-aspire-5-a515-58p-71ej-3_14d9c51b2e4545abb018edf17604da04_master.png', 'uploads/Acer/2/gearvn-laptop-acer-aspire-5-a515-58p-71ej-3_14d9c51b2e4545abb018edf17604da04_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (10, 12, 'gearvn-laptop-acer-aspire-5-a515-58p-71ej-4_256cd42ce244420c9f774e99f70859f4_master.png', 'uploads/Acer/2/gearvn-laptop-acer-aspire-5-a515-58p-71ej-4_256cd42ce244420c9f774e99f70859f4_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (11, 12, 'gearvn-laptop-acer-aspire-5-a515-58p-71ej-5_0bf9279d69794995bcbe9bd6bfce91ab_master.png', 'uploads/Acer/2/gearvn-laptop-acer-aspire-5-a515-58p-71ej-5_0bf9279d69794995bcbe9bd6bfce91ab_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (243, 97, '1024__2__e323762b4e0749d5bf01fcb59b079d07_master.png', 'uploads/MSI/9/1024__2__e323762b4e0749d5bf01fcb59b079d07_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (244, 97, '1024__3__b0b60e4f3ae94844933c8df056c6dd28_master.png', 'uploads/MSI/9/1024__3__b0b60e4f3ae94844933c8df056c6dd28_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (245, 97, '1024__4__5121f1fa4475431e8b50de0bc873c6c3_master.png', 'uploads/MSI/9/1024__4__5121f1fa4475431e8b50de0bc873c6c3_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (246, 97, '1024__5__35851d9a4da64ffda7c6c4918596f5f1_master.png', 'uploads/MSI/9/1024__5__35851d9a4da64ffda7c6c4918596f5f1_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (45, 2, 'b1403__standard_04__off_tp_05269c0d3f9a49aaaa2d131762526822_master.jpg', 'uploads/Asus/1/b1403__standard_04__off_tp_05269c0d3f9a49aaaa2d131762526822_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (46, 2, 'b1403__standard_08__tp_2a15aa555e784c099b142ac1b79e1865_master.jpg', 'uploads/Asus/1/b1403__standard_08__tp_2a15aa555e784c099b142ac1b79e1865_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (47, 2, 'b1403__standard_11__tp_f43fc2411926457ba62777bb51d0d3b7_master.jpg', 'uploads/Asus/1/b1403__standard_11__tp_f43fc2411926457ba62777bb51d0d3b7_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (48, 2, 'b1403__standard_12__02_tp_5465acf51536435fb0a01e3550247a80_master.png', 'uploads/Asus/1/b1403__standard_12__02_tp_5465acf51536435fb0a01e3550247a80_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (49, 2, 'b1403__standard_13__tp_c9527288de4a4b8a92c9cc20788ecaa6_master.jpg', 'uploads/Asus/1/b1403__standard_13__tp_c9527288de4a4b8a92c9cc20788ecaa6_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (50, 3, 'expertbook-p1-p1403cva-i5se16-50w__1__addb2c8932194026bab6f5d03898f1df_f593d8708adb49caac4c2284eda58a7b_master.png', 'uploads/Asus/2/expertbook-p1-p1403cva-i5se16-50w__1__addb2c8932194026bab6f5d03898f1df_f593d8708adb49caac4c2284eda58a7b_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (51, 3, 'expertbook-p1-p1403cva-i5se16-50w__2__0c0f07648a7e4c3594d8c598be443be6_6169f1bdb955470397ad6959b5945488_master.png', 'uploads/Asus/2/expertbook-p1-p1403cva-i5se16-50w__2__0c0f07648a7e4c3594d8c598be443be6_6169f1bdb955470397ad6959b5945488_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (52, 3, 'expertbook-p1-p1403cva-i5se16-50w__3__e7bf0aafc98f43c6a824af19da7d4168_1220e8883fd44e15919274a9785e6c61_master.png', 'uploads/Asus/2/expertbook-p1-p1403cva-i5se16-50w__3__e7bf0aafc98f43c6a824af19da7d4168_1220e8883fd44e15919274a9785e6c61_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (53, 3, 'expertbook-p1-p1403cva-i5se16-50w__5__b545d7ea621d4177aaafc2ac6b27dc64_57ce869fa7d144a7b7fce264c4dd7f80_master.png', 'uploads/Asus/2/expertbook-p1-p1403cva-i5se16-50w__5__b545d7ea621d4177aaafc2ac6b27dc64_57ce869fa7d144a7b7fce264c4dd7f80_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (54, 3, 'expertbook-p1-p1403cva-i5se16-50w__8__f9120f92bbcf40409391d8b907b7c630_0b12de755584415689fecd42c6a95e6a_master.png', 'uploads/Asus/2/expertbook-p1-p1403cva-i5se16-50w__8__f9120f92bbcf40409391d8b907b7c630_0b12de755584415689fecd42c6a95e6a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (55, 4, 'expertbook-p1-p1403cva-i5se16-50_75afdd8506f04d11b13f57a022b6c108_master.png', 'uploads/Asus/3/expertbook-p1-p1403cva-i5se16-50_75afdd8506f04d11b13f57a022b6c108_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (56, 4, 'expertbook-p1-p1403cva-i5se16-50__2__f416d9cfcd904bab941b809fe36cecf8_master.png', 'uploads/Asus/3/expertbook-p1-p1403cva-i5se16-50__2__f416d9cfcd904bab941b809fe36cecf8_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (57, 4, 'expertbook-p1-p1403cva-i5se16-50__3__6f8529c2e42048858d96df4044399d5a_master.png', 'uploads/Asus/3/expertbook-p1-p1403cva-i5se16-50__3__6f8529c2e42048858d96df4044399d5a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (58, 5, 'laptop_asus_vivobook_s14_s3407ca_ly095ws-02_84ba126e70334809a61a2ac41c8883df_master.png', 'uploads/Asus/4/laptop_asus_vivobook_s14_s3407ca_ly095ws-02_84ba126e70334809a61a2ac41c8883df_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (102, 65, '29988_laptop_dell_15_dc15250_dc1__2__6256d0776d2f47b4b85cb7b69ee76d3b_master.png', 'uploads/Dell/4/29988_laptop_dell_15_dc15250_dc1__2__6256d0776d2f47b4b85cb7b69ee76d3b_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (103, 65, '29988_laptop_dell_15_dc15250_dc1__6__fc34cc684a234ed1a829661d103fefcc_master.png', 'uploads/Dell/4/29988_laptop_dell_15_dc15250_dc1__6__fc34cc684a234ed1a829661d103fefcc_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (104, 66, 'laptop-dell-inspiron-15-5502-1xgr11-1_195db43e59e3425c9de7b7228286b7a5_5015a1b0862f43698d3067d154f86c59_master.jpg', 'uploads/Dell/5/laptop-dell-inspiron-15-5502-1xgr11-1_195db43e59e3425c9de7b7228286b7a5_5015a1b0862f43698d3067d154f86c59_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (105, 66, 'laptop-dell-inspiron-15-5502-1xgr11-2_55317e8c4af846baa3e05f74f995f847_cb9e536273134d50a9bd54c8e59677d1_master.jpg', 'uploads/Dell/5/laptop-dell-inspiron-15-5502-1xgr11-2_55317e8c4af846baa3e05f74f995f847_cb9e536273134d50a9bd54c8e59677d1_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (106, 66, 'laptop-dell-inspiron-15-5502-1xgr11-5_1a4a02b6a3864c25a9c1ee48c0882306_bda627a841f2481db627499fcd683371_master.jpg', 'uploads/Dell/5/laptop-dell-inspiron-15-5502-1xgr11-5_1a4a02b6a3864c25a9c1ee48c0882306_bda627a841f2481db627499fcd683371_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (107, 66, 'laptop-dell-inspiron-15-5502-1xgr11-6_ba217c963bb74b9f85f1f19d73413e74_17acb0bc4a77413ba8c48f9497b6cf24_master.jpg', 'uploads/Dell/5/laptop-dell-inspiron-15-5502-1xgr11-6_ba217c963bb74b9f85f1f19d73413e74_17acb0bc4a77413ba8c48f9497b6cf24_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (108, 66, 'n-laptop-dell-inspiron-15-5502-1xgr11_dacf9828fa3f428aac97e63f27c4a448_0b90e460a73843efaaba74989ca73da5_master.jpg', 'uploads/Dell/5/n-laptop-dell-inspiron-15-5502-1xgr11_dacf9828fa3f428aac97e63f27c4a448_0b90e460a73843efaaba74989ca73da5_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (109, 67, '1_f636f001e8b243b4925c124b558d5adb_ef53c5e9f5a2475b9e7fe0e11882b9fa_master.png', 'uploads/Dell/6/1_f636f001e8b243b4925c124b558d5adb_ef53c5e9f5a2475b9e7fe0e11882b9fa_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (110, 67, '2_bee9355e3d6a4f358d890907ae4f2e5d_f3524509832946e18be7f52090be6ea4_master.png', 'uploads/Dell/6/2_bee9355e3d6a4f358d890907ae4f2e5d_f3524509832946e18be7f52090be6ea4_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (111, 67, '3_dfb75564afbe4e048e19a1b4658055c0_8ac5dcfdad0142b09b5f9159d79258bd_master.png', 'uploads/Dell/6/3_dfb75564afbe4e048e19a1b4658055c0_8ac5dcfdad0142b09b5f9159d79258bd_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (112, 67, '4_4b720d5498af4a90955dba5804c3a85f_4ce60bb4e0654e76aee5a81303ab8ff0_master.png', 'uploads/Dell/6/4_4b720d5498af4a90955dba5804c3a85f_4ce60bb4e0654e76aee5a81303ab8ff0_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (113, 67, '6_09207f1c93b841a3a69c10c84a198b05_040f2d8e0a0540de882bb687c5c97e57_master.png', 'uploads/Dell/6/6_09207f1c93b841a3a69c10c84a198b05_040f2d8e0a0540de882bb687c5c97e57_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (114, 68, '1_40c40b4be0c04569bdc41b9508a598a6_dca876630ff949838f2c69e7a2adf3b7_master.jpg', 'uploads/Dell/7/1_40c40b4be0c04569bdc41b9508a598a6_dca876630ff949838f2c69e7a2adf3b7_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (115, 68, '2_e1b35e20120d4352b4e1490ed9c542f2_b1d8424c54454b9b9656aae657b8a74f_master.jpg', 'uploads/Dell/7/2_e1b35e20120d4352b4e1490ed9c542f2_b1d8424c54454b9b9656aae657b8a74f_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (116, 68, '3_2e9f2a4da0454663a48e8fef4dd6b75e_20db44e639b14357b2b5a5c98497854d_master.jpg', 'uploads/Dell/7/3_2e9f2a4da0454663a48e8fef4dd6b75e_20db44e639b14357b2b5a5c98497854d_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (117, 69, 'z4252850982548_99a43e5e8d9b75aa366d4218b0e490dd_08aa5dae6d8d46ae90aca5f21d42f422_master.jpg', 'uploads/Dell/8/z4252850982548_99a43e5e8d9b75aa366d4218b0e490dd_08aa5dae6d8d46ae90aca5f21d42f422_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (118, 69, 'z4252851457456_74a28d1cf92edd39394a27d8d8d0703d_dfbfc58deaee4f7d8c6d1499a5af62bf_master.jpg', 'uploads/Dell/8/z4252851457456_74a28d1cf92edd39394a27d8d8d0703d_dfbfc58deaee4f7d8c6d1499a5af62bf_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (119, 69, 'z4252861518750_d9c71fd336f99bf2e9ac7403f24398f4_7647462cfd71413cbb827a7477cab830_master.jpg', 'uploads/Dell/8/z4252861518750_d9c71fd336f99bf2e9ac7403f24398f4_7647462cfd71413cbb827a7477cab830_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (67, 7, 'zenbook_14_ux3405ca_product_photo_3b_ponder_blue_02_893e42dc16ca44c9ab226772d756c261_master.png', 'uploads/Asus/6/zenbook_14_ux3405ca_product_photo_3b_ponder_blue_02_893e42dc16ca44c9ab226772d756c261_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (85, 62, 'ava_0a30ce7dc91d4bf9bc058f46086f636d_master.png', 'uploads/Dell/1/ava_0a30ce7dc91d4bf9bc058f46086f636d_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (86, 62, 'notebook-inspiron-15-3530-nt-plastic-silver-gallery-2_111e97c017a64ad0befd867afb3d54b5_master.png', 'uploads/Dell/1/notebook-inspiron-15-3530-nt-plastic-silver-gallery-2_111e97c017a64ad0befd867afb3d54b5_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (87, 62, 'notebook-inspiron-15-3530-nt-plastic-silver-gallery-3_545aaf6b8b46447bae7ba8e92568cb04_master.png', 'uploads/Dell/1/notebook-inspiron-15-3530-nt-plastic-silver-gallery-3_545aaf6b8b46447bae7ba8e92568cb04_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (88, 62, 'notebook-inspiron-15-3530-nt-plastic-silver-gallery-5_16fca8e2a9284d7f8a71e68c6e0b5bc7_master.png', 'uploads/Dell/1/notebook-inspiron-15-3530-nt-plastic-silver-gallery-5_16fca8e2a9284d7f8a71e68c6e0b5bc7_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (89, 62, 'notebook-inspiron-15-3530-nt-plastic-usbc-silver-gallery-4_6f61376f76984e2daf601249b2bb947a_master.png', 'uploads/Dell/1/notebook-inspiron-15-3530-nt-plastic-usbc-silver-gallery-4_6f61376f76984e2daf601249b2bb947a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (101, 65, '29988_laptop_dell_15_dc15250_dc1__1__26ab1d10c0a44d0d96bb8180ff13d4ef_master.png', 'uploads/Dell/4/29988_laptop_dell_15_dc15250_dc1__1__26ab1d10c0a44d0d96bb8180ff13d4ef_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (92, 63, 'web-23_b2f85803fe8f4b6aab30e29bb24764f1_master.jpg', 'uploads/Dell/2/web-23_b2f85803fe8f4b6aab30e29bb24764f1_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (93, 63, 'web-27_a854e0a0d11a46aca2ab1487a1d7aa10_master.jpg', 'uploads/Dell/2/web-27_a854e0a0d11a46aca2ab1487a1d7aa10_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (95, 64, 'notebook-inspiron-14-7430-silver-fpr-gallery-2_775d712dd05041e7b1cdabfcee5579ac_master.png', 'uploads/Dell/3/notebook-inspiron-14-7430-silver-fpr-gallery-2_775d712dd05041e7b1cdabfcee5579ac_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (96, 64, 'notebook-inspiron-14-7430-silver-fpr-gallery-5_a67556c51bef417db7384474189ff584_master.png', 'uploads/Dell/3/notebook-inspiron-14-7430-silver-fpr-gallery-5_a67556c51bef417db7384474189ff584_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (97, 64, 'notebook-inspiron-14-7430-silver-gallery-1_cee09245e30b468683f9310775b3b60a_master.png', 'uploads/Dell/3/notebook-inspiron-14-7430-silver-gallery-1_cee09245e30b468683f9310775b3b60a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (98, 64, 'notebook-inspiron-14-7430-silver-gallery-2_51463e28df074ca2bee91592fa5296ba_master.png', 'uploads/Dell/3/notebook-inspiron-14-7430-silver-gallery-2_51463e28df074ca2bee91592fa5296ba_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (99, 64, 'notebook-inspiron-14-7430-silver-gallery-4_51dd62e0ff3b4652a9e20a569448d713_master.png', 'uploads/Dell/3/notebook-inspiron-14-7430-silver-gallery-4_51dd62e0ff3b4652a9e20a569448d713_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (90, 63, 'web-1_553750fe7deb48d0b823ea21fd118285_master.jpg', 'uploads/Dell/2/web-10_df3520cbc21b4e7ab5589c28e7244371_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (91, 63, 'web-10_df3520cbc21b4e7ab5589c28e7244371_master.jpg', 'uploads/Dell/2/web-1_553750fe7deb48d0b823ea21fd118285_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (100, 65, '29988_laptop_dell_15_dc15250_dc1_07b9006bfd9d4629a1b8c7988f2f0a11_master.png', 'uploads/Dell/4/29988_laptop_dell_15_dc15250_dc1_07b9006bfd9d4629a1b8c7988f2f0a11_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (127, 71, '6l1y2pa_bc802bb991424d33a1104ae3c7cf155c_master.png', 'uploads/HP/1/6l1y2pa_bc802bb991424d33a1104ae3c7cf155c_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (128, 71, 'c08227589_e208614369714232851b4c43761bb0a0_master.png', 'uploads/HP/1/c08227589_e208614369714232851b4c43761bb0a0_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (129, 71, 'c08227618_c5a25a88eaef4722bc7021742e5b32f5_master.png', 'uploads/HP/1/c08227618_c5a25a88eaef4722bc7021742e5b32f5_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (130, 72, 'khung-laptop-23_03f20bb41507487abf68f77db04635ef_master.png', 'uploads/HP/2/khung-laptop-23_03f20bb41507487abf68f77db04635ef_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (131, 72, 'victus-16-s0078ax-8c5n7pa-r5-7640hs_1_bbf8ff87056f48bf9310a4a2609e1ffe_8127d1a97cd94bb6a4659fee5667d423_master.png', 'uploads/HP/2/victus-16-s0078ax-8c5n7pa-r5-7640hs_1_bbf8ff87056f48bf9310a4a2609e1ffe_8127d1a97cd94bb6a4659fee5667d423_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (132, 72, 'victus-16-s0078ax-8c5n7pa-r5-7640hs_2_a2117f21f3124c3297286e75f974eb4e_894c3a76873c4a70b7cde64673dac4c1_master.png', 'uploads/HP/2/victus-16-s0078ax-8c5n7pa-r5-7640hs_2_a2117f21f3124c3297286e75f974eb4e_894c3a76873c4a70b7cde64673dac4c1_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (133, 72, 'victus-16-s0078ax-8c5n7pa-r5-7640hs_3_d644455584c5475a81c9620497d6f452_c4f795ca2b414e369bb8fbf7106543d4_master.png', 'uploads/HP/2/victus-16-s0078ax-8c5n7pa-r5-7640hs_3_d644455584c5475a81c9620497d6f452_c4f795ca2b414e369bb8fbf7106543d4_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (134, 73, '8c5l4pa_3f962864dbf342cfbe41be079f0ed0c9_master.png', 'uploads/HP/3/8c5l4pa_3f962864dbf342cfbe41be079f0ed0c9_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (135, 73, 'c07965959_21ed8be3416a46489e95e8361abafae6_master.png', 'uploads/HP/3/c07965959_21ed8be3416a46489e95e8361abafae6_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (136, 73, 'c07993727_28825ddea97e4c2997786ea1b5431401_master.png', 'uploads/HP/3/c07993727_28825ddea97e4c2997786ea1b5431401_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (152, 78, 'a4qca5j1ge_a05bcf55690b493a8de4c20d59705f6c_master.png', 'uploads/HP/8/a4qca5j1ge_a05bcf55690b493a8de4c20d59705f6c_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (153, 78, 'dak8r5vaqq_f6b9d3e708644144aa2e09c6b25e9108_master.png', 'uploads/HP/8/dak8r5vaqq_f6b9d3e708644144aa2e09c6b25e9108_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (154, 78, 'nwkrzfihgt_37116adc740b4ee2ad4b2be0aabf9347_master.png', 'uploads/HP/8/nwkrzfihgt_37116adc740b4ee2ad4b2be0aabf9347_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (155, 78, 'p6ghjptzev_a2ef0d39d5434946862151af685eb339_master.png', 'uploads/HP/8/p6ghjptzev_a2ef0d39d5434946862151af685eb339_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (156, 79, 'hp_envy_13__1__38c7e774a3cc44ad83f0915028e7eac4_339c882402f644d48493059a4c3b3d28_master.png', 'uploads/HP/9/hp_envy_13__1__38c7e774a3cc44ad83f0915028e7eac4_339c882402f644d48493059a4c3b3d28_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (157, 79, 'hp_envy_13__3__752360fa7e9b47a8924a605e08de4b95_885db2aef898421b9ee04a0c837fc8bb_master.png', 'uploads/HP/9/hp_envy_13__3__752360fa7e9b47a8924a605e08de4b95_885db2aef898421b9ee04a0c837fc8bb_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (158, 79, 'hp_envy_13__5__6da0e4fd80b14e3880e3a362cf2ba195_6f12cafb605d4de4be1ecf3a8e462687_master.png', 'uploads/HP/9/hp_envy_13__5__6da0e4fd80b14e3880e3a362cf2ba195_6f12cafb605d4de4be1ecf3a8e462687_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (159, 80, 'ideapad_slim_3_15irh10_ct2_05_d126cf2aa906474e9e62716af0f6d603_master.png', 'uploads/Lenovo/1/ideapad_slim_3_15irh10_ct2_05_d126cf2aa906474e9e62716af0f6d603_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (160, 80, 'ideapad_slim_3_15irh10_ct2_06_bc46c944e3794b06a219ea625da4e568_master.png', 'uploads/Lenovo/1/ideapad_slim_3_15irh10_ct2_06_bc46c944e3794b06a219ea625da4e568_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (161, 80, 'ideapad_slim_3_15irh10_ct2_09_5a0bfeaa8b1b42c89245a7adf6ba6bcd_master.png', 'uploads/Lenovo/1/ideapad_slim_3_15irh10_ct2_09_5a0bfeaa8b1b42c89245a7adf6ba6bcd_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (162, 80, 'ideapad_slim_3_15irh10_ct2_10_c0d0191c44df421289343df31044e63f_master.png', 'uploads/Lenovo/1/ideapad_slim_3_15irh10_ct2_10_c0d0191c44df421289343df31044e63f_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (163, 80, 'ideapad_slim_3_15irh10_ct2_11_4a51d3665c7a4acca83a265445d6412a_master.png', 'uploads/Lenovo/1/ideapad_slim_3_15irh10_ct2_11_4a51d3665c7a4acca83a265445d6412a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (164, 81, 'ava_2f0fb96551644a17ab6eec4c979d0f77_master.png', 'uploads/Lenovo/2/ava_2f0fb96551644a17ab6eec4c979d0f77_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (165, 81, 'lenovo_v14_g4_iru_ct1_07_fca2359a3cc443ecab107ca900aadae1_master.png', 'uploads/Lenovo/2/lenovo_v14_g4_iru_ct1_07_fca2359a3cc443ecab107ca900aadae1_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (166, 81, 'lenovo_v14_g4_iru_ct1_09_cec3749729ee42f3ab1b318c2348639e_master.png', 'uploads/Lenovo/2/lenovo_v14_g4_iru_ct1_09_cec3749729ee42f3ab1b318c2348639e_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (167, 81, 'lenovo_v14_g4_iru_ct1_10_70cf744dc69741b1aa36a326bcfa4f6c_master.png', 'uploads/Lenovo/2/lenovo_v14_g4_iru_ct1_10_70cf744dc69741b1aa36a326bcfa4f6c_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (168, 81, 'lenovo_v14_g4_iru_ct2_06_9ac02d6d4b384709b3b32f27f75166aa_master.png', 'uploads/Lenovo/2/lenovo_v14_g4_iru_ct2_06_9ac02d6d4b384709b3b32f27f75166aa_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (223, 93, '1024__2__c334613800784c14b5bcb9ec7c1076cd_master.png', 'uploads/MSI/5/1024__2__c334613800784c14b5bcb9ec7c1076cd_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (187, 86, 'legion_5_15irx10_ct1_02_3956e3fe2fd640f29a51788d335c186d_master.png', 'uploads/Lenovo/7/legion_5_15irx10_ct1_02_3956e3fe2fd640f29a51788d335c186d_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (188, 86, 'legion_5_15irx10_ct1_04_0ec53e72304444a9b951dd58a0112481_master.png', 'uploads/Lenovo/7/legion_5_15irx10_ct1_04_0ec53e72304444a9b951dd58a0112481_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (189, 86, 'legion_5_15irx10_ct1_07_735409e4c9134d4b8046f91cb1541be2_master.png', 'uploads/Lenovo/7/legion_5_15irx10_ct1_07_735409e4c9134d4b8046f91cb1541be2_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (190, 86, 'legion_5_15irx10_ct1_09_d5ef468cf25e43c7b53ad668468697b6_master.png', 'uploads/Lenovo/7/legion_5_15irx10_ct1_09_d5ef468cf25e43c7b53ad668468697b6_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (191, 86, 'legion_5_15irx10_ct2_02_9a9aeb25d9e44233947f14169266528e_master.png', 'uploads/Lenovo/7/legion_5_15irx10_ct2_02_9a9aeb25d9e44233947f14169266528e_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (192, 87, 'legion_5_15ahp10_ct1_01_788051b77e9a4809b75e5ce978c08cb7_master.png', 'uploads/Lenovo/8/legion_5_15ahp10_ct1_01_788051b77e9a4809b75e5ce978c08cb7_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (193, 87, 'legion_5_15ahp10_ct1_03_a25882e1b486439a9f93929a48a60b41_master.png', 'uploads/Lenovo/8/legion_5_15ahp10_ct1_03_a25882e1b486439a9f93929a48a60b41_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (3, 11, 'acer_aspire_lite_14_ai_al14_71p_1aa3706aef4a42d7ba7ed60c70371dce_master.png', 'uploads/Acer/1/acer_aspire_lite_14_ai_al14_71p_1aa3706aef4a42d7ba7ed60c70371dce_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (4, 11, 'acer_aspire_lite_14_ai_al14_71p__1__ddc6f70815b4406ead6bce0f25de0d4e_master.png', 'uploads/Acer/1/acer_aspire_lite_14_ai_al14_71p__1__ddc6f70815b4406ead6bce0f25de0d4e_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (5, 11, 'acer_aspire_lite_14_ai_al14_71p__2__361b2c80b61a4e79991708cd6c5c607c_master.png', 'uploads/Acer/1/acer_aspire_lite_14_ai_al14_71p__2__361b2c80b61a4e79991708cd6c5c607c_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (6, 11, 'acer_aspire_lite_14_ai_al14_71p__4__f9700b8a593a4023beb25c2cb0012cc7_master.png', 'uploads/Acer/1/acer_aspire_lite_14_ai_al14_71p__4__f9700b8a593a4023beb25c2cb0012cc7_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (61, 5, 'laptop_asus_vivobook_s14_s3407ca_ly095ws-05_1fe5626519f04366921bf300e3bf66f2_master.png', 'uploads/Asus/4/laptop_asus_vivobook_s14_s3407ca_ly095ws-05_1fe5626519f04366921bf300e3bf66f2_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (62, 6, 'laptop_asus_vivobook_s14_s3407ca_ly096ws-2_38a0553870eb4fae8ccf2345a592d4e4_master.png', 'uploads/Asus/5/laptop_asus_vivobook_s14_s3407ca_ly096ws-2_38a0553870eb4fae8ccf2345a592d4e4_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (63, 6, 'laptop_asus_vivobook_s14_s3407ca_ly096ws-4_1f6b6d44a993445cbbc7771eddf5d4ae_master.png', 'uploads/Asus/5/laptop_asus_vivobook_s14_s3407ca_ly096ws-4_1f6b6d44a993445cbbc7771eddf5d4ae_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (120, 69, 'z4252863172078_2876146b169ea38fc161527a5d238e70_4831bfdf8974467790829368227f2bfc_master.jpg', 'uploads/Dell/8/z4252863172078_2876146b169ea38fc161527a5d238e70_4831bfdf8974467790829368227f2bfc_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (121, 69, 'z4252864080995_80e9361cf7312cbfd2ba2e1b2ac2a44a_8e16e4e1b3b540b189fad21e361da24e_master.jpg', 'uploads/Dell/8/z4252864080995_80e9361cf7312cbfd2ba2e1b2ac2a44a_8e16e4e1b3b540b189fad21e361da24e_master.jpg', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (122, 70, 'ava_49faeda979774294952e490d41f3c020_master.png', 'uploads/Dell/9/ava_49faeda979774294952e490d41f3c020_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (123, 70, 'laptop-inspiron-16-5640-ice-blue-fpr-gallery-12_609866d74e7d446da3998ebff26ed619_master.png', 'uploads/Dell/9/laptop-inspiron-16-5640-ice-blue-fpr-gallery-12_609866d74e7d446da3998ebff26ed619_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (124, 70, 'laptop-inspiron-16-5640-ice-blue-fpr-gallery-14_6e5d97bb4dc847789fb712257bf74b6d_master.png', 'uploads/Dell/9/laptop-inspiron-16-5640-ice-blue-fpr-gallery-14_6e5d97bb4dc847789fb712257bf74b6d_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (125, 70, 'laptop-inspiron-16-5640-ice-blue-fpr-gallery-1_b160e4529bc2451ca6beaca1f6bc5864_master.png', 'uploads/Dell/9/laptop-inspiron-16-5640-ice-blue-fpr-gallery-1_b160e4529bc2451ca6beaca1f6bc5864_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (126, 70, 'laptop-inspiron-16-5640t-ice-blue-fpr-gallery-2_ab9b39c86ece4c2784b33551f7d9962e_master.png', 'uploads/Dell/9/laptop-inspiron-16-5640t-ice-blue-fpr-gallery-2_ab9b39c86ece4c2784b33551f7d9962e_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (137, 74, '8c5l2pa_20b0504ddd7e445d8486a02ca9f5fdca_master.png', 'uploads/HP/4/8c5l2pa_20b0504ddd7e445d8486a02ca9f5fdca_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (138, 74, 'c07965959_c0b5eb221f354b03b73a5231f4c623e0_master.png', 'uploads/HP/4/c07965959_c0b5eb221f354b03b73a5231f4c623e0_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (139, 74, 'c07993727_d5a8e218ace445be94747c5958e3dcbc_master.png', 'uploads/HP/4/c07993727_d5a8e218ace445be94747c5958e3dcbc_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (140, 75, '8ngitvensp_46112efa51654a94ab768b834aeaec68_master.png', 'uploads/HP/5/8ngitvensp_46112efa51654a94ab768b834aeaec68_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (141, 75, 'af4lhmww5i_a0e1976f7e564523b3f0fc7f1b911222_master.png', 'uploads/HP/5/af4lhmww5i_a0e1976f7e564523b3f0fc7f1b911222_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (142, 75, 'uplgveyxze_e7f97712d9cd407486549bfa86db2480_master.png', 'uploads/HP/5/uplgveyxze_e7f97712d9cd407486549bfa86db2480_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (224, 93, '1024__3__ee336eaf7b2e4b42924ee313b6e6eaf1_master.png', 'uploads/MSI/5/1024__3__ee336eaf7b2e4b42924ee313b6e6eaf1_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (143, 75, 'x0vmo0xiq2_dec865dbaba64992b694e9e8e81e78f5_master.png', 'uploads/HP/5/x0vmo0xiq2_dec865dbaba64992b694e9e8e81e78f5_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (144, 76, '8ngitvensp_e92996037e4a48ac878ca631244d7766_master.png', 'uploads/HP/6/8ngitvensp_e92996037e4a48ac878ca631244d7766_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (145, 76, 'af4lhmww5i_ecf7eb9ba8e9454897cbd78a0549e09a_master.png', 'uploads/HP/6/af4lhmww5i_ecf7eb9ba8e9454897cbd78a0549e09a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (146, 76, 'uplgveyxze_08c0b2c081824b1cb545efa56a133a38_master.png', 'uploads/HP/6/uplgveyxze_08c0b2c081824b1cb545efa56a133a38_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (147, 76, 'x0vmo0xiq2_1fabc46379244ea39a4039bb19a602c1_master.png', 'uploads/HP/6/x0vmo0xiq2_1fabc46379244ea39a4039bb19a602c1_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (148, 77, 'a4qca5j1ge_deb182a871864c9b98f27130cfc4ba26_master.png', 'uploads/HP/7/a4qca5j1ge_deb182a871864c9b98f27130cfc4ba26_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (149, 77, 'dak8r5vaqq_6d71d48e43394a49a8a7a108e5cec08c_master.png', 'uploads/HP/7/dak8r5vaqq_6d71d48e43394a49a8a7a108e5cec08c_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (150, 77, 'nwkrzfihgt_148cc20149144cf69afa8e730492754c_master.png', 'uploads/HP/7/nwkrzfihgt_148cc20149144cf69afa8e730492754c_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (151, 77, 'p6ghjptzev_694a3695d0594b7587a447778eb9dd00_master.png', 'uploads/HP/7/p6ghjptzev_694a3695d0594b7587a447778eb9dd00_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (169, 82, 'ideapad_slim_3_14irh10_ct1_05_266b9bc35f8740d69b89d02faf1f2036_master__1_.png', 'uploads/Lenovo/3/ideapad_slim_3_14irh10_ct1_05_266b9bc35f8740d69b89d02faf1f2036_master__1_.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (170, 82, 'ideapad_slim_3_14irh10_ct1_05_266b9bc35f8740d69b89d02faf1f2036_master.png', 'uploads/Lenovo/3/ideapad_slim_3_14irh10_ct1_05_266b9bc35f8740d69b89d02faf1f2036_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (171, 82, 'ideapad_slim_3_14irh10_ct1_07_69809ba3e93f4221a5d234c0790460ab_master.png', 'uploads/Lenovo/3/ideapad_slim_3_14irh10_ct1_07_69809ba3e93f4221a5d234c0790460ab_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (172, 82, 'ideapad_slim_3_14irh10_ct2_07_4a38d69ba0a94a8ca5888fd2241072e9_master.png', 'uploads/Lenovo/3/ideapad_slim_3_14irh10_ct2_07_4a38d69ba0a94a8ca5888fd2241072e9_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (173, 82, 'ideapad_slim_3_14irh10_ct2_08_7408b9ead5d149d0a406c036154727d4_master.png', 'uploads/Lenovo/3/ideapad_slim_3_14irh10_ct2_08_7408b9ead5d149d0a406c036154727d4_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (174, 83, 'top-gaming-gigabyte-g5-mf-e2vn333sh-2_dc96156308be4cf380b05e5b548056bc_bd039b262315476db471108e97895b7f_master.png', 'uploads/Lenovo/4/top-gaming-gigabyte-g5-mf-e2vn333sh-2_dc96156308be4cf380b05e5b548056bc_bd039b262315476db471108e97895b7f_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (175, 83, 'top-gaming-gigabyte-g5-mf-e2vn333sh-3_e0a132cf3259491c9257edaf73fb4c6c_df22ce8aa5234cec851e3cc9f76da364_master.png', 'uploads/Lenovo/4/top-gaming-gigabyte-g5-mf-e2vn333sh-3_e0a132cf3259491c9257edaf73fb4c6c_df22ce8aa5234cec851e3cc9f76da364_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (176, 83, 'top-gaming-gigabyte-g5-mf-e2vn333sh-4_3677abdfcc2046b09d49ef32646aeee5_ef4727c7a9db4720af80f035adc48696_master.png', 'uploads/Lenovo/4/top-gaming-gigabyte-g5-mf-e2vn333sh-4_3677abdfcc2046b09d49ef32646aeee5_ef4727c7a9db4720af80f035adc48696_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (177, 84, 'ava-tr_ng_55aa8d4e4097471dac9cdd881840d92a_master.png', 'uploads/Lenovo/5/ava-tr_ng_55aa8d4e4097471dac9cdd881840d92a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (178, 84, 'loq_15ahp9_ct1_08_ca01ff6dcfa24894a64df83cc14a2d7f_master.png', 'uploads/Lenovo/5/loq_15ahp9_ct1_08_ca01ff6dcfa24894a64df83cc14a2d7f_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (179, 84, 'loq_15ahp9_ct2_04_620eee9927d9439b87f3540368b75bab_master.png', 'uploads/Lenovo/5/loq_15ahp9_ct2_04_620eee9927d9439b87f3540368b75bab_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (180, 84, 'loq_15ahp9_ct2_06_007bb3cfb00c4c55b55c300e019333ac_master.png', 'uploads/Lenovo/5/loq_15ahp9_ct2_06_007bb3cfb00c4c55b55c300e019333ac_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (182, 85, 'ava-tr_ng_ef1951530ba1499c97992f24e130a027_master.png', 'uploads/Lenovo/6/ava-tr_ng_ef1951530ba1499c97992f24e130a027_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (183, 85, 'loq_15ahp9_ct1_08_c5c95e1a9af240169755ec26afd10f35_master.png', 'uploads/Lenovo/6/loq_15ahp9_ct1_08_c5c95e1a9af240169755ec26afd10f35_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (184, 85, 'loq_15ahp9_ct2_04_ff9f20a9d08d4d0aafc4518b59d1313b_master.png', 'uploads/Lenovo/6/loq_15ahp9_ct2_04_ff9f20a9d08d4d0aafc4518b59d1313b_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (185, 85, 'white_backlit_loq_15arp9_ct1_03_a030ea98af1f4369a44f45f843bda115_master.png', 'uploads/Lenovo/6/white_backlit_loq_15arp9_ct1_03_a030ea98af1f4369a44f45f843bda115_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (186, 85, 'white_backlit_loq_15arp9_ct2_01_7da99ac14a534e86b7cae92336341814_master.png', 'uploads/Lenovo/6/white_backlit_loq_15arp9_ct2_01_7da99ac14a534e86b7cae92336341814_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (194, 87, 'legion_5_15ahp10_ct1_04_82a970decaf3497a8759653d29b9b56b_master.png', 'uploads/Lenovo/8/legion_5_15ahp10_ct1_04_82a970decaf3497a8759653d29b9b56b_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (12, 13, 'gearvn-laptop-acer-aspire-5-a515-58m-79r7-1_fc24c1d89e264f0dac67c840aba8e473_master.png', 'uploads/Acer/3/gearvn-laptop-acer-aspire-5-a515-58m-79r7-1_fc24c1d89e264f0dac67c840aba8e473_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (13, 13, 'gearvn-laptop-acer-aspire-5-a515-58m-79r7-2_d421b17dcebd45149188eb182dfcf92a_master.png', 'uploads/Acer/3/gearvn-laptop-acer-aspire-5-a515-58m-79r7-2_d421b17dcebd45149188eb182dfcf92a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (14, 13, 'gearvn-laptop-acer-aspire-5-a515-58m-79r7-4_03052af25c0543f2bce6b6acfdc1dd3a_master.png', 'uploads/Acer/3/gearvn-laptop-acer-aspire-5-a515-58m-79r7-4_03052af25c0543f2bce6b6acfdc1dd3a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (15, 14, 'wift-go-ai-2024-gen-2-sfg14-73-71zx_1_ccc2cc55cf11451086e09eac92cae064_ed8a6356d9374b53a4c13abaea1658a8_master.png', 'uploads/Acer/4/wift-go-ai-2024-gen-2-sfg14-73-71zx_1_ccc2cc55cf11451086e09eac92cae064_ed8a6356d9374b53a4c13abaea1658a8_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (16, 14, 'wift-go-ai-2024-gen-2-sfg14-73-71zx_2_bf3212f799624e22a2802c5a3797ee03_9c201d92d7544ab893c26e82f5c0910f_master.png', 'uploads/Acer/4/wift-go-ai-2024-gen-2-sfg14-73-71zx_2_bf3212f799624e22a2802c5a3797ee03_9c201d92d7544ab893c26e82f5c0910f_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (17, 14, 'wift-go-ai-2024-gen-2-sfg14-73-71zx_3_b95fb967509d4f8f98f03fcae16e41cc_b631a211479f428cab5e7fd0da0c98d2_master.png', 'uploads/Acer/4/wift-go-ai-2024-gen-2-sfg14-73-71zx_3_b95fb967509d4f8f98f03fcae16e41cc_b631a211479f428cab5e7fd0da0c98d2_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (18, 14, 'wift-go-ai-2024-gen-2-sfg14-73-71zx_4_c18cb262ac76458a8a26ecc5fded597a_ec9d03b649ef4f19a589c23530e315f3_master.png', 'uploads/Acer/4/wift-go-ai-2024-gen-2-sfg14-73-71zx_4_c18cb262ac76458a8a26ecc5fded597a_ec9d03b649ef4f19a589c23530e315f3_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (19, 15, 'laptop-acer-swift-go-sfg14-74t-5_8aff15961f584387b45046dee7a45990_master.png', 'uploads/Acer/5/laptop-acer-swift-go-sfg14-74t-5_8aff15961f584387b45046dee7a45990_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (20, 15, 'laptop-acer-swift-go-sfg14-74t-5__1__1e649bfbf83a4c7a992293153cb97040_master.png', 'uploads/Acer/5/laptop-acer-swift-go-sfg14-74t-5__1__1e649bfbf83a4c7a992293153cb97040_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (21, 15, 'laptop-acer-swift-go-sfg14-74t-5__2__b9c1de6033bb444e952cf2a19a472fa5_master.png', 'uploads/Acer/5/laptop-acer-swift-go-sfg14-74t-5__2__b9c1de6033bb444e952cf2a19a472fa5_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (22, 16, 'wift-go-ai-2024-gen-2-sfg14-73-71zx_1_ccc2cc55cf11451086e09eac92cae064_cebd993058e6471d8b7b7d2dccb51ca3_master.png', 'uploads/Acer/6/wift-go-ai-2024-gen-2-sfg14-73-71zx_1_ccc2cc55cf11451086e09eac92cae064_cebd993058e6471d8b7b7d2dccb51ca3_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (195, 87, 'legion_5_15ahp10_ct1_06_9e2ac7365a01492787ee1152a7a022c2_master.png', 'uploads/Lenovo/8/legion_5_15ahp10_ct1_06_9e2ac7365a01492787ee1152a7a022c2_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (196, 87, 'legion_5_15ahp10_ct1_09_c0a90885af184e2aa37ab76ca29ef07d_master.png', 'uploads/Lenovo/8/legion_5_15ahp10_ct1_09_c0a90885af184e2aa37ab76ca29ef07d_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (197, 88, 'loq_15irx10_ct1_01_55e15dcec48741cbbdf1ec337306856a_master.png', 'uploads/Lenovo/9/loq_15irx10_ct1_01_55e15dcec48741cbbdf1ec337306856a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (198, 88, 'loq_15irx10_ct1_02_ee16f7feac1f4fbfaf81c18bdac42be4_master.png', 'uploads/Lenovo/9/loq_15irx10_ct1_02_ee16f7feac1f4fbfaf81c18bdac42be4_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (199, 88, 'loq_15irx10_ct1_03_b9382530088245e3a807427720548db7_master.png', 'uploads/Lenovo/9/loq_15irx10_ct1_03_b9382530088245e3a807427720548db7_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (200, 88, 'loq_15irx10_ct1_06_88263af3b8454957aa2ab6fcbe00a23d_master.png', 'uploads/Lenovo/9/loq_15irx10_ct1_06_88263af3b8454957aa2ab6fcbe00a23d_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (23, 16, 'wift-go-ai-2024-gen-2-sfg14-73-71zx_2_bf3212f799624e22a2802c5a3797ee03_53838013640b49dea42fa49effd90e95_master.png', 'uploads/Acer/6/wift-go-ai-2024-gen-2-sfg14-73-71zx_2_bf3212f799624e22a2802c5a3797ee03_53838013640b49dea42fa49effd90e95_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (24, 16, 'wift-go-ai-2024-gen-2-sfg14-73-71zx_3_b95fb967509d4f8f98f03fcae16e41cc_a346efc3b9564db4882c1c601ce4d254_master.png', 'uploads/Acer/6/wift-go-ai-2024-gen-2-sfg14-73-71zx_3_b95fb967509d4f8f98f03fcae16e41cc_a346efc3b9564db4882c1c601ce4d254_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (25, 16, 'wift-go-ai-2024-gen-2-sfg14-73-71zx_4_c18cb262ac76458a8a26ecc5fded597a_84a7049184d8486aad0e3f3a156186b1_master.png', 'uploads/Acer/6/wift-go-ai-2024-gen-2-sfg14-73-71zx_4_c18cb262ac76458a8a26ecc5fded597a_84a7049184d8486aad0e3f3a156186b1_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (26, 17, 'acer_aspire_lite_14_ai_al14_71p_1aa3706aef4a42d7ba7ed60c70371dce_master.png', 'uploads/Acer/6/1/acer_aspire_lite_14_ai_al14_71p_1aa3706aef4a42d7ba7ed60c70371dce_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (27, 17, 'acer_aspire_lite_14_ai_al14_71p__1__ddc6f70815b4406ead6bce0f25de0d4e_master.png', 'uploads/Acer/6/1/acer_aspire_lite_14_ai_al14_71p__1__ddc6f70815b4406ead6bce0f25de0d4e_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (28, 17, 'acer_aspire_lite_14_ai_al14_71p__2__361b2c80b61a4e79991708cd6c5c607c_master.png', 'uploads/Acer/6/1/acer_aspire_lite_14_ai_al14_71p__2__361b2c80b61a4e79991708cd6c5c607c_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (29, 17, 'acer_aspire_lite_14_ai_al14_71p__4__f9700b8a593a4023beb25c2cb0012cc7_master.png', 'uploads/Acer/6/1/acer_aspire_lite_14_ai_al14_71p__4__f9700b8a593a4023beb25c2cb0012cc7_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (201, 88, 'loq_15irx10_ct1_07_cec9ddfb256c4911a3bd20d83b577f2c_master.png', 'uploads/Lenovo/9/loq_15irx10_ct1_07_cec9ddfb256c4911a3bd20d83b577f2c_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (202, 89, '1024_6867f9eb7c6348f1a9d078053c7de4df_master.png', 'uploads/MSI/1/1024_6867f9eb7c6348f1a9d078053c7de4df_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (203, 89, '1024__1__ac9aa9cc02de4a38902aca71afc49921_master.png', 'uploads/MSI/1/1024__1__ac9aa9cc02de4a38902aca71afc49921_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (204, 89, '1024__2__92b8449268e54110be034cb6ae6483bb_master.png', 'uploads/MSI/1/1024__2__92b8449268e54110be034cb6ae6483bb_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (205, 89, '1024__3__1e37042816724bcca7d7256859a8a8e1_master.png', 'uploads/MSI/1/1024__3__1e37042816724bcca7d7256859a8a8e1_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (206, 89, '1024__4__5291c0a959244fa49cadf589187dd321_master.png', 'uploads/MSI/1/1024__4__5291c0a959244fa49cadf589187dd321_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (207, 90, 'msi_modern_15_h_ai_c2h_black_01_5e55a62380cd4649b96c8724d6fa562b_master.png', 'uploads/MSI/2/msi_modern_15_h_ai_c2h_black_01_5e55a62380cd4649b96c8724d6fa562b_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (208, 90, 'msi_modern_15_h_ai_c2h_black_02_9b53ee5be8b842d1b70cc182e336a6c9_master.png', 'uploads/MSI/2/msi_modern_15_h_ai_c2h_black_02_9b53ee5be8b842d1b70cc182e336a6c9_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (209, 90, 'msi_modern_15_h_ai_c2h_black_04_f746c87a92424482809dfa36e31c557f_master.png', 'uploads/MSI/2/msi_modern_15_h_ai_c2h_black_04_f746c87a92424482809dfa36e31c557f_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (210, 90, 'msi_modern_15_h_ai_c2h_black_06_cb81af0e6b504ee6b6673ec5ec30bd44_master.png', 'uploads/MSI/2/msi_modern_15_h_ai_c2h_black_06_cb81af0e6b504ee6b6673ec5ec30bd44_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (211, 90, 'msi_modern_15_h_ai_c2h_black_07_338093fbc6f046ecafbcfd256b04e2db_master.png', 'uploads/MSI/2/msi_modern_15_h_ai_c2h_black_07_338093fbc6f046ecafbcfd256b04e2db_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (212, 91, '1024_8436341f302f44a296f3e50994f2c6e8_master.png', 'uploads/MSI/3/1024_8436341f302f44a296f3e50994f2c6e8_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (213, 91, '1024__1__b61842c73fff4821a93470f41c00c2d2_master.png', 'uploads/MSI/3/1024__1__b61842c73fff4821a93470f41c00c2d2_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (214, 91, '1024__2__3d455974aa1a41649d504c354b7352dd_master.png', 'uploads/MSI/3/1024__2__3d455974aa1a41649d504c354b7352dd_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (215, 91, '1024__3__c9df1e9d22594fe08e3090c47800955e_master.png', 'uploads/MSI/3/1024__3__c9df1e9d22594fe08e3090c47800955e_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (216, 91, '1024__4__f564cf39f3464009aefb5b4d41f29616_master.png', 'uploads/MSI/3/1024__4__f564cf39f3464009aefb5b4d41f29616_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (217, 92, '1024__1__2458527b9b124ff8aa1707f9a659425a_master.png', 'uploads/MSI/4/1024__1__2458527b9b124ff8aa1707f9a659425a_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (218, 92, '1024__2__7de1f2fed0d247f6bc984352e3cdb215_master.png', 'uploads/MSI/4/1024__2__7de1f2fed0d247f6bc984352e3cdb215_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (219, 92, '1024__3__7f4ad0dcc1e24f48a630a592c6b916e1_master.png', 'uploads/MSI/4/1024__3__7f4ad0dcc1e24f48a630a592c6b916e1_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (220, 92, '1024__4__d3740c52251048bc990442c4bee01ed8_master.png', 'uploads/MSI/4/1024__4__d3740c52251048bc990442c4bee01ed8_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (221, 92, '1024__5__cdb69e058e5347eaafdb5234a8b0fbc2_master.png', 'uploads/MSI/4/1024__5__cdb69e058e5347eaafdb5234a8b0fbc2_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (222, 93, '1024__1__325a259fe603436b88cbad9459bf737f_master.png', 'uploads/MSI/5/1024__1__325a259fe603436b88cbad9459bf737f_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (225, 93, '1024__4__1e434405a4a8423d85711cd161a03da9_master.png', 'uploads/MSI/5/1024__4__1e434405a4a8423d85711cd161a03da9_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (226, 93, '1024__5__f5baf104021c4a9e965eb7dbd358481f_master.png', 'uploads/MSI/5/1024__5__f5baf104021c4a9e965eb7dbd358481f_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (227, 94, '1024__1__919b0672b0984e2ab3f2a660513c0670_master.png', 'uploads/MSI/6/1024__1__919b0672b0984e2ab3f2a660513c0670_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (228, 94, '1024__2__ef01dfffc1704596bba816718bbfd203_master.png', 'uploads/MSI/6/1024__2__ef01dfffc1704596bba816718bbfd203_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (229, 94, '1024__3__ba35dd9273204dbf9379682850e38944_master.png', 'uploads/MSI/6/1024__3__ba35dd9273204dbf9379682850e38944_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (230, 94, '1024__4__3b1fa543e7274b2683bf503ab6dbe935_master.png', 'uploads/MSI/6/1024__4__3b1fa543e7274b2683bf503ab6dbe935_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (231, 94, '1024__5__ce635f9ddb2c4abfa8dd80c8fae5f473_master.png', 'uploads/MSI/6/1024__5__ce635f9ddb2c4abfa8dd80c8fae5f473_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (232, 95, '1024__1__1755e5c9f3e84b71a96d115e2a57cae6_master.png', 'uploads/MSI/7/1024__1__1755e5c9f3e84b71a96d115e2a57cae6_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (233, 95, '1024__2__dd605e8d883440ff961fd81a7adbb6ff_master.png', 'uploads/MSI/7/1024__2__dd605e8d883440ff961fd81a7adbb6ff_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (234, 95, '1024__3__0e72a34d6d504960925ff8ac74fe1fd8_master.png', 'uploads/MSI/7/1024__3__0e72a34d6d504960925ff8ac74fe1fd8_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (235, 95, '1024__4__0fa101b743b54f5ca115aef05a935e00_master.png', 'uploads/MSI/7/1024__4__0fa101b743b54f5ca115aef05a935e00_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (236, 95, '1024__5__91ba1cd751b24cc284a6d4f7ca556ed1_master.png', 'uploads/MSI/7/1024__5__91ba1cd751b24cc284a6d4f7ca556ed1_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (237, 96, '1024__1__51da43ccf4d7474a96cac0be97ce938d_master.png', 'uploads/MSI/8/1024__1__51da43ccf4d7474a96cac0be97ce938d_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (238, 96, '1024__2__75b72195b1f64cf0b00ef5018698aa0e_master.png', 'uploads/MSI/8/1024__2__75b72195b1f64cf0b00ef5018698aa0e_master.png', '2025-10-16 15:27:54.174285');
INSERT INTO public.image VALUES (239, 96, '1024__3__7ec191a6f2cb43abbe95997fca237fd1_master.png', 'uploads/MSI/8/1024__3__7ec191a6f2cb43abbe95997fca237fd1_master.png', '2025-10-16 15:27:54.174285');


--
-- TOC entry 5040 (class 0 OID 17118)
-- Dependencies: 240
-- Data for Name: inventoryinfo; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5032 (class 0 OID 17059)
-- Dependencies: 232
-- Data for Name: orderdetail; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5030 (class 0 OID 17046)
-- Dependencies: 230
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5034 (class 0 OID 17077)
-- Dependencies: 234
-- Data for Name: payment; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5042 (class 0 OID 17140)
-- Dependencies: 242
-- Data for Name: product; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.product VALUES (4, 'Laptop ASUS Expertbook P1403CVA-i716-50W', 17990000.00, 10, 1, NULL, 'Intel Core i7-13620H', '16GB DDR5', '512GB NVMe PCIe 4.0 SSD', 'Intel UHD Graphics', '14.0 FHD (1920x1080) IPS 60Hz Anti-glare', false);
INSERT INTO public.product VALUES (5, 'Laptop ASUS Vivobook S14 S3407CA LY095WS', 20490000.00, 10, 1, NULL, 'Intel Core Ultra 5 225H', '16GB DDR5 Onboard', '512GB SSD', 'Intel Arc Graphics', '14.0 WUXGA (1920x1200) IPS 60Hz Anti-glare', false);
INSERT INTO public.product VALUES (6, 'Laptop ASUS Vivobook S14 S3407CA LY096WS', 22990000.00, 10, 1, NULL, 'Intel Core Ultra 7 255H', '16GB DDR5 Onboard', '512GB NVMe PCIe 4.0 SSD', 'Intel Arc Graphics', '14.0 WUXGA (1920x1200) IPS 60Hz Anti-glare', false);
INSERT INTO public.product VALUES (7, 'Laptop ASUS Zenbook 14 UX3405CA PZ187WS', 27490000.00, 10, 1, NULL, 'Intel Core Ultra 5 225H', '16GB LPDDR5X', '512GB NVMe PCIe 4.0 SSD', 'Intel Arc Graphics', '14.0 3K OLED 120Hz', false);
INSERT INTO public.product VALUES (8, 'Laptop ASUS Vivobook S16 OLED M5606KA RI016WS', 30990000.00, 10, 1, NULL, 'AMD Ryzen AI 7 350', '24GB LPDDR5X', '512GB NVMe PCIe 4.0 SSD', 'AMD Radeon Graphics', '16.0 3K OLED 120Hz HDR', false);
INSERT INTO public.product VALUES (9, 'Laptop ASUS Zenbook 14 UX3405CA PZ204WS', 34990000.00, 10, 1, NULL, 'Intel Core Ultra 9 285H', '32GB LPDDR5X', '1TB NVMe PCIe 4.0 SSD', 'Intel Arc Graphics', '14.0 3K OLED 120Hz HDR', false);
INSERT INTO public.product VALUES (11, 'Laptop Acer Aspire Lite 14 AL14 71P 55P9', 14990000.00, 10, 2, NULL, 'Intel Core i5-13500H', '16GB DDR5 4800MHz', '512GB PCIe NVMe SSD', 'Intel UHD Graphics', '14 FHD+ (1920x1200) IPS 60Hz', false);
INSERT INTO public.product VALUES (12, 'Laptop Acer Aspire 5 A515 58P 71EJ', 17990000.00, 10, 2, NULL, 'Intel Core i7-1355U', '16GB LPDDR5 4800MHz', '1TB PCIe NVMe SSD', 'Intel UHD Graphics', '15.6 FHD (1920x1080) IPS 60Hz', false);
INSERT INTO public.product VALUES (13, 'Laptop Acer Aspire 5 A515 58M 79R7', 18990000.00, 10, 2, NULL, 'Intel Core i7-13620H', '16GB LPDDR5 4800MHz', '512GB PCIe NVMe Gen4 SSD', 'Intel UHD Graphics', '15.6 FHD (1920x1080) IPS 60Hz', false);
INSERT INTO public.product VALUES (14, 'Laptop Acer Swift Go 14 SFG14 73 57FZ', 22990000.00, 10, 2, NULL, 'Intel Core Ultra 5 125H', '16GB LPDDR5 6400MHz', '512GB PCIe NVMe SSD', 'Intel Arc Graphics', '14 2.8K (2880x1800) OLED 90Hz', false);
INSERT INTO public.product VALUES (15, 'Laptop Acer Swift Go SFG14 74T 55HD', 28990000.00, 10, 2, NULL, 'Intel Core Ultra 5 225H', '16GB LPDDR5 7500MHz', '1TB PCIe NVMe SSD', 'Intel Arc Graphics', '14 FHD+ IPS Touch 60Hz', false);
INSERT INTO public.product VALUES (16, 'Laptop Acer Swift 14 AI SF14 51 53P9', 32490000.00, 10, 2, NULL, 'Intel Core Ultra 5 226V', '16GB LPDDR5 8533MHz', '1TB NVMe PCIe 4.0 SSD', 'Intel Arc Graphics', '14 3K (2880x1800) OLED 90Hz', false);
INSERT INTO public.product VALUES (17, 'Laptop Acer Swift X14 SFX14 72G 77F9', 34490000.00, 10, 2, NULL, 'Intel Core Ultra 7 155H', '32GB LPDDR5 6400MHz', '1TB PCIe NVMe SSD', 'NVIDIA GeForce RTX 4050 6GB', '14.5 2.8K OLED 120Hz', false);
INSERT INTO public.product VALUES (10, 'Laptop gaming ASUS V16 V3607VM RP044W', 33490000.00, 10, 1, NULL, 'Intel Core 7 240H', '16GB DDR5', '1TB NVMe PCIe 4.0 SSD', 'NVIDIA GeForce RTX 5060 8GB', '16.0 WUXGA (1920x1200) 144Hz', false);
INSERT INTO public.product VALUES (3, 'Laptop ASUS Expertbook P1403CVA-i516-50W', 14290000.00, NULL, 1, NULL, 'Intel Core i5-13420H', '16GB DDR5', '512GB NVMe PCIe 4.0 SSD', 'Intel UHD Graphics', '14.0 FHD (1920x1080) IPS 60Hz Anti-glare', false);
INSERT INTO public.product VALUES (62, 'Laptop Dell Inspirion N3530 i5U165W11SLU', 15990000.00, 10, 3, NULL, 'Intel Core i5-1334U up to 4.6GHz', '16GB DDR4 2666MHz', '512GB SSD NVMe PCIe', 'Intel Iris Xe Graphics', '15.6\" FHD 120Hz IPS', false);
INSERT INTO public.product VALUES (63, 'Laptop Dell Inspiron 5440-PUS', 16990000.00, 10, 3, NULL, 'Intel Core i5-1334U up to 4.6GHz', '16GB LPDDR5 4400MHz', '512GB SSD PCIe', 'Intel Graphics', '14.0\" FHD+ IPS 250nits', false);
INSERT INTO public.product VALUES (64, 'Laptop Dell Inspiron T7430 N7430I58W1 Silver', 18990000.00, 10, 3, NULL, 'Intel Core i5-1355U up to 4.6GHz', '8GB LPDDR5 4800MHz', '512GB PCIe SSD', 'Intel Iris Xe Graphics', '14.0\" FHD+ Touch WVA', false);
INSERT INTO public.product VALUES (65, 'Laptop Dell 15 DC15250 i7U161W11SLU', 20990000.00, 10, 3, NULL, 'Intel Core i7-1355U up to 5.0GHz', '16GB DDR4 2666MHz', '1TB PCIe NVMe SSD', 'Intel Iris Xe Graphics', '15.6\" FHD 120Hz IPS', false);
INSERT INTO public.product VALUES (66, 'Laptop Dell Inspiron 15 5502 1XGR11', 20490000.00, 10, 3, NULL, 'Intel Core i5-1135G7 up to 4.2GHz', '8GB DDR4 3200MHz', '512GB NVMe SSD', 'Intel Iris Xe Graphics', '15.6\" FHD 60Hz IPS', false);
INSERT INTO public.product VALUES (67, 'Laptop Dell Vostro 15 5502 70231340', 21990000.00, 10, 3, NULL, 'Intel Core i5-1135G7 up to 4.2GHz', '8GB DDR4 3200MHz', '256GB SSD NVMe', 'Intel Iris Xe Graphics', '15.6\" FHD Anti-Glare', false);
INSERT INTO public.product VALUES (68, 'Laptop Dell Inspiron 15 7501 X3MRY1', 30490000.00, 10, 3, NULL, 'Intel Core i7-10750H up to 5.0GHz', '8GB DDR4 2933MHz', '512GB PCIe SSD', 'NVIDIA GeForce GTX 1650Ti 4GB', '15.6\" FHD 60Hz WVA', true);
INSERT INTO public.product VALUES (69, 'Laptop Dell G15 5530 i7H161W11GR4060', 37990000.00, 10, 3, NULL, 'Intel Core i7-13650HX up to 4.9GHz', '16GB DDR5 4800MHz', '1TB NVMe SSD', 'NVIDIA GeForce RTX 4060 8GB', '15.6\" FHD 165Hz G-SYNC', true);
INSERT INTO public.product VALUES (70, 'Laptop Dell Inspiron 5640 G14 N6I7512W1-IceBlue', 30290000.00, 10, 3, NULL, 'Intel Core i7-150U up to 5.4GHz', '16GB LPDDR5 5200MHz', '1TB PCIe NVMe SSD', 'NVIDIA GeForce MX570A 2GB', '16.0\" 2.5K 300nits WVA', false);
INSERT INTO public.product VALUES (71, 'Laptop HP 240 G9 6L1Y2PA', 15290000.00, 10, 4, NULL, 'Intel Core i5-1235U up to 4.4GHz', '8GB DDR4 3200MHz', '512GB PCIe 3.0 SSD', 'Intel UHD Graphics', '14\" FHD IPS 250nits', false);
INSERT INTO public.product VALUES (72, 'Laptop HP VICTUS 15-fa2731TX B85LNPA', 19990000.00, 10, 4, NULL, 'Intel Core i5-13420H up to 4.6GHz', '16GB DDR4 3200MHz', '512GB PCIe Gen4 SSD', 'NVIDIA GeForce RTX 3050 6GB', '15.6\" FHD 144Hz IPS', true);
INSERT INTO public.product VALUES (73, 'Laptop HP Pavilion 15 eg3093TU 8C5L4PA', 19290000.00, 10, 4, NULL, 'Intel Core i5-1335U up to 4.6GHz', '16GB DDR4 3200MHz', '512GB PCIe 3.0 SSD', 'Intel Iris Xe Graphics', '15.6\" FHD IPS 250nits', false);
INSERT INTO public.product VALUES (74, 'Laptop HP Pavilion 15 eg3091TU 8C5L2PA', 22990000.00, 10, 4, NULL, 'Intel Core i7-1355U up to 5.0GHz', '16GB DDR4 3200MHz', '512GB PCIe 3.0 SSD', 'Intel Iris Xe Graphics', '15.6\" FHD IPS 250nits', false);
INSERT INTO public.product VALUES (75, 'Laptop HP VICTUS 15 fb3116AX BX8U4PA', 20990000.00, 10, 4, NULL, 'AMD Ryzen 7 7445H up to 4.7GHz', '16GB DDR5 5600MHz', '512GB PCIe Gen4 SSD', 'NVIDIA GeForce RTX 3050 6GB', '15\" FHD 144Hz IPS', true);
INSERT INTO public.product VALUES (76, 'Laptop HP VICTUS 15 fb3115AX BX9C9PA', 22990000.00, 10, 4, NULL, 'AMD Ryzen 7 7445H up to 4.7GHz', '16GB DDR5 5600MHz', '512GB PCIe Gen4 SSD', 'NVIDIA GeForce RTX 4050 6GB', '15\" FHD 144Hz IPS', true);
INSERT INTO public.product VALUES (77, 'Laptop HP OMEN 16-am0178TX BX8Y4PA', 34990000.00, 10, 4, NULL, 'Intel Core Ultra 5 225H up to 4.9GHz', '16GB DDR5 5600MHz', '512GB PCIe Gen4 SSD', 'NVIDIA GeForce RTX 5060 8GB', '16.1\" 2K 165Hz IPS', true);
INSERT INTO public.product VALUES (78, 'Laptop HP OMEN 16-am0180TX BX8Y6PA', 31990000.00, 10, 4, NULL, 'Intel Core Ultra 5 225H up to 4.9GHz', '16GB DDR5 5600MHz', '512GB PCIe Gen4 SSD', 'NVIDIA GeForce RTX 5050 8GB', '16.1\" 2K 165Hz IPS', true);
INSERT INTO public.product VALUES (79, 'Laptop HP Envy 13 BA1534TU 4U6M3PA', 32490000.00, 10, 4, NULL, 'Intel Core i7-1165G7 up to 4.7GHz', '16GB DDR4 3200MHz', '1TB PCIe NVMe SSD', 'Intel Iris Xe Graphics', '13.3\" FHD IPS 400nits', false);
INSERT INTO public.product VALUES (80, 'Laptop Lenovo IdeaPad Slim 3 15IRH10 83K1000JVN', 17990000.00, 10, 5, NULL, 'Intel Core i7-13620H up to 4.9GHz', '8GB soldered + 8GB SO-DIMM DDR5-4800 (16GB)', '512GB SSD M.2 PCIe 4.0x4', 'Intel UHD Graphics', '15.3\" WUXGA IPS 300nits', false);
INSERT INTO public.product VALUES (81, 'Laptop Lenovo V14 G4 IRU 83A000BEVN', 12490000.00, 10, 5, NULL, 'Intel Core i5-13420H up to 4.6GHz', '8GB DDR4 3200MHz', '512GB SSD M.2 PCIe 4.0x4', 'Intel UHD Graphics', '14\" FHD IPS 300nits', false);
INSERT INTO public.product VALUES (82, 'Laptop Lenovo IdeaPad Slim 3 14IRH10 83K0000BVN', 16790000.00, 10, 5, NULL, 'Intel Core i5-13420H up to 4.6GHz', '8GB soldered + 8GB SO-DIMM DDR5-4800 (16GB)', '512GB SSD M.2 PCIe 4.0x4', 'Intel UHD Graphics', '14\" WUXGA OLED 400nits', false);
INSERT INTO public.product VALUES (83, 'Laptop Gigabyte G5 MF E2VN333SH', 21990000.00, 10, 5, NULL, 'Intel Core i5-12500H up to 4.5GHz', '8GB DDR4 3200MHz', '512GB SSD M.2 PCIe G4X4', 'NVIDIA GeForce RTX 4050 6GB', '15.6\" FHD 144Hz IPS', false);
INSERT INTO public.product VALUES (84, 'Laptop Lenovo LOQ 15ARP9 83JC00LVVN', 21490000.00, 10, 5, NULL, 'AMD Ryzen 5 7235HS up to 4.2GHz', '16GB DDR5-4800', '512GB SSD M.2 PCIe 4.0x4', 'NVIDIA GeForce RTX 3050 6GB', '15.6\" FHD 144Hz IPS', true);
INSERT INTO public.product VALUES (85, 'Laptop Lenovo LOQ 15ARP9 83JC00M3VN', 22290000.00, 10, 5, NULL, 'AMD Ryzen 5 7235HS up to 4.2GHz', '16GB DDR5-4800', '1TB SSD M.2 PCIe 4.0x4', 'NVIDIA GeForce RTX 3050 6GB', '15.6\" FHD 144Hz IPS', true);
INSERT INTO public.product VALUES (86, 'Laptop Lenovo Legion 5 15IRX10 83LY00A7VN', 37490000.00, 10, 5, NULL, 'Intel Core i7-14700HX up to 5.5GHz', '16GB DDR5 5600MHz', '512GB SSD M.2 PCIe 4.0x4', 'NVIDIA GeForce RTX 5050 8GB', '15.1\" WQXGA OLED 165Hz', true);
INSERT INTO public.product VALUES (87, 'Laptop Lenovo Legion 5 15AHP10 83M0002YVN', 36990000.00, 10, 5, NULL, 'AMD Ryzen 7 260 up to 5.1GHz', '16GB DDR5 5600MHz', '512GB SSD M.2 PCIe 4.0x4', 'NVIDIA GeForce RTX 5050 8GB', '15.1\" WQXGA OLED 165Hz', true);
INSERT INTO public.product VALUES (88, 'Laptop Lenovo LOQ 15IRX10 83JE006PVN', 31990000.00, 10, 5, NULL, 'Intel Core i7-13650HX up to 4.9GHz', '24GB DDR5 4800MHz', '512GB SSD M.2 PCIe 4.0x4', 'NVIDIA GeForce RTX 5050 8GB', '15.6\" FHD 144Hz IPS', true);
INSERT INTO public.product VALUES (89, 'Laptop MSI Modern 14 H D13MG 217VN', 17990000.00, 10, 6, NULL, 'Intel Core i7-13700H up to 5.0GHz', '16GB (8x2) DDR4 3200MHz', '1TB NVMe PCIe Gen4x4', 'Intel Iris Xe Graphics', '14.0\" FHD+ (1920x1200) IPS 60Hz', false);
INSERT INTO public.product VALUES (2, 'Laptop ASUS ExpertBook B1 BM1403CDA S60974W', 12190000.00, 10, 1, 1, 'AMD Ryzen 5 7535HS', '16GB DDR5', '512GB NVMe PCIe 4.0 SSD', 'AMD Radeon 680M', '14.0 FHD (1920x1080) IPS 60Hz Anti-glare', true);
INSERT INTO public.product VALUES (90, 'Laptop MSI Modern 15 H AI C2HMG 220VN', 19990000.00, 10, 6, NULL, 'Intel Core Ultra 7 255H up to 5.1GHz', '16GB DDR5 5600MHz', '512GB NVMe PCIe Gen4', 'Intel Iris Xe Graphics', '15.6\" FHD IPS 60Hz', false);
INSERT INTO public.product VALUES (91, 'Laptop MSI Modern 15 H C13M 216VN', 18290000.00, 10, 6, NULL, 'Intel Core i7-13700H up to 5.0GHz', '16GB DDR4 3200MHz', '1TB NVMe PCIe Gen4x4', 'Intel Iris Xe Graphics', '15.6\" FHD IPS 60Hz', false);
INSERT INTO public.product VALUES (92, 'Laptop MSI Prestige 14 AI Evo C1MG 080VN', 26490000.00, 10, 6, NULL, 'Intel Core Ultra 5 125H up to 4.5GHz', '32GB DDR5 5600MHz', '512GB NVMe PCIe Gen4', 'Intel Arc Graphics', '14\" 2.8K (2880x1800) OLED 60Hz', true);
INSERT INTO public.product VALUES (93, 'Laptop MSI Venture A14 AI+ A3HMG 004VN', 21990000.00, 10, 6, NULL, 'AMD Ryzen AI 5 340 up to 4.8GHz', '16GB (2x8) DDR5', '512GB NVMe PCIe Gen4x4', 'AMD Radeon Graphics', '14\" 2.8K (2880x1800) OLED 120Hz', false);
INSERT INTO public.product VALUES (94, 'Laptop MSI Prestige 14 AI Evo C1MG 081VN', 24490000.00, 10, 6, NULL, 'Intel Core Ultra 5 125H up to 4.5GHz', '16GB (8x2) DDR5 5600MHz', '512GB NVMe PCIe Gen4', 'Intel Arc Graphics', '14\" 2.8K OLED 60Hz', true);
INSERT INTO public.product VALUES (95, 'Laptop MSI Katana 15 HX B14WEK 027VN', 33490000.00, 10, 6, NULL, 'Intel Core i7-14650HX up to 5.2GHz', '32GB (2x16) DDR5 5600MHz', '512GB NVMe PCIe Gen4', 'NVIDIA GeForce RTX 5050 8GB', '15.6\" QHD (2560x1440) 165Hz IPS', true);
INSERT INTO public.product VALUES (96, 'Laptop MSI Prestige 14 AI Studio C1VEG 056VN', 33590000.00, 10, 6, NULL, 'Intel Core Ultra 7 155H up to 4.8GHz', '32GB (16x2) DDR5 5600MHz', '1TB NVMe PCIe Gen4x4', 'NVIDIA GeForce RTX 4050 6GB', '14\" 2.8K IPS 100% DCI-P3', true);
INSERT INTO public.product VALUES (97, 'Laptop MSI Prestige 14 AI+ Evo C2VMG 020VN', 35490000.00, 10, 6, NULL, 'Intel Core Ultra 7 258V', '32GB LPDDR5x 8533MHz (onboard)', '1TB NVMe PCIe Gen4', 'Intel Arc 140V', '14\" 2.8K OLED 120Hz', true);


--
-- TOC entry 5024 (class 0 OID 16985)
-- Dependencies: 224
-- Data for Name: promotion; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.promotion VALUES (1, 'Giảm 20% mùa lễ hội', 0.20, '2025-10-10', '2025-10-25');
INSERT INTO public.promotion VALUES (2, 'Giảm 10% cuối tuần', 0.10, '2025-10-17', '2025-10-19');
INSERT INTO public.promotion VALUES (3, 'Khuyến mãi đã hết hạn', 0.15, '2025-09-01', '2025-09-10');


--
-- TOC entry 5036 (class 0 OID 17090)
-- Dependencies: 236
-- Data for Name: rating; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5044 (class 0 OID 17199)
-- Dependencies: 244
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users VALUES (2, 'Nguyễn Sơn ', 'scrypt:32768:8:1$zTYEqobVOTns9FvH$5c35db6963e490b668ed539c9275010b12fb6daf558b03be684586b1679bfd29d9fc0be5b5475eafb5e083ee97599dc55dea0d65bd21fe1ead95ea4351121c5f', '3122411074@gmail.com', true, 'user');
INSERT INTO public.users VALUES (3, 'Gia Hưng', 'scrypt:32768:8:1$7pdmzlPsNCrGtbSq$55792e40eb1572f52de18ee4946a69dea405583f5028646e4e5c0fb57610b373055d6e99fcfc9698d19e860a51ee5c7b739d77dc978d762b8e2d0d131e8f9340', 'giahung10092004@gmail.com', true, 'admin');


--
-- TOC entry 5038 (class 0 OID 17110)
-- Dependencies: 238
-- Data for Name: warehouse; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 5067 (class 0 OID 0)
-- Dependencies: 219
-- Name: address_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.address_address_id_seq', 1, false);


--
-- TOC entry 5068 (class 0 OID 0)
-- Dependencies: 221
-- Name: brand_brand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.brand_brand_id_seq', 1, true);


--
-- TOC entry 5069 (class 0 OID 0)
-- Dependencies: 225
-- Name: cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_cart_id_seq', 1, false);


--
-- TOC entry 5070 (class 0 OID 0)
-- Dependencies: 227
-- Name: cartitem_cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cartitem_cart_item_id_seq', 1, false);


--
-- TOC entry 5071 (class 0 OID 0)
-- Dependencies: 245
-- Name: image_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.image_image_id_seq', 246, true);


--
-- TOC entry 5072 (class 0 OID 0)
-- Dependencies: 239
-- Name: inventoryinfo_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventoryinfo_inventory_id_seq', 1, false);


--
-- TOC entry 5073 (class 0 OID 0)
-- Dependencies: 231
-- Name: orderdetail_order_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orderdetail_order_detail_id_seq', 1, false);


--
-- TOC entry 5074 (class 0 OID 0)
-- Dependencies: 229
-- Name: orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_order_id_seq', 1, false);


--
-- TOC entry 5075 (class 0 OID 0)
-- Dependencies: 233
-- Name: payment_payment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.payment_payment_id_seq', 1, false);


--
-- TOC entry 5076 (class 0 OID 0)
-- Dependencies: 241
-- Name: product_new_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_new_product_id_seq', 97, true);


--
-- TOC entry 5077 (class 0 OID 0)
-- Dependencies: 223
-- Name: promotion_promo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.promotion_promo_id_seq', 3, true);


--
-- TOC entry 5078 (class 0 OID 0)
-- Dependencies: 235
-- Name: rating_rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rating_rating_id_seq', 1, false);


--
-- TOC entry 5079 (class 0 OID 0)
-- Dependencies: 243
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 3, true);


--
-- TOC entry 5080 (class 0 OID 0)
-- Dependencies: 237
-- Name: warehouse_warehouse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.warehouse_warehouse_id_seq', 1, false);


--
-- TOC entry 4838 (class 2606 OID 16970)
-- Name: address address_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.address
    ADD CONSTRAINT address_pkey PRIMARY KEY (address_id);


--
-- TOC entry 4840 (class 2606 OID 16983)
-- Name: brand brand_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_pkey PRIMARY KEY (brand_id);


--
-- TOC entry 4844 (class 2606 OID 17021)
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (cart_id);


--
-- TOC entry 4846 (class 2606 OID 17034)
-- Name: cartitem cartitem_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitem
    ADD CONSTRAINT cartitem_pkey PRIMARY KEY (cart_item_id);


--
-- TOC entry 4864 (class 2606 OID 17261)
-- Name: image image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_pkey PRIMARY KEY (image_id);


--
-- TOC entry 4858 (class 2606 OID 17124)
-- Name: inventoryinfo inventoryinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventoryinfo
    ADD CONSTRAINT inventoryinfo_pkey PRIMARY KEY (inventory_id);


--
-- TOC entry 4850 (class 2606 OID 17065)
-- Name: orderdetail orderdetail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderdetail
    ADD CONSTRAINT orderdetail_pkey PRIMARY KEY (order_detail_id);


--
-- TOC entry 4848 (class 2606 OID 17052)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (order_id);


--
-- TOC entry 4852 (class 2606 OID 17083)
-- Name: payment payment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4860 (class 2606 OID 17148)
-- Name: product product_new_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_new_pkey PRIMARY KEY (product_id);


--
-- TOC entry 4842 (class 2606 OID 16993)
-- Name: promotion promotion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promotion
    ADD CONSTRAINT promotion_pkey PRIMARY KEY (promo_id);


--
-- TOC entry 4854 (class 2606 OID 17098)
-- Name: rating rating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rating
    ADD CONSTRAINT rating_pkey PRIMARY KEY (rating_id);


--
-- TOC entry 4862 (class 2606 OID 17209)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4856 (class 2606 OID 17116)
-- Name: warehouse warehouse_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.warehouse
    ADD CONSTRAINT warehouse_pkey PRIMARY KEY (warehouse_id);


--
-- TOC entry 4865 (class 2606 OID 17035)
-- Name: cartitem cartitem_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cartitem
    ADD CONSTRAINT cartitem_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(cart_id);


--
-- TOC entry 4871 (class 2606 OID 17262)
-- Name: image image_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.image
    ADD CONSTRAINT image_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.product(product_id) ON DELETE CASCADE;


--
-- TOC entry 4868 (class 2606 OID 17125)
-- Name: inventoryinfo inventoryinfo_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventoryinfo
    ADD CONSTRAINT inventoryinfo_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouse(warehouse_id);


--
-- TOC entry 4866 (class 2606 OID 17066)
-- Name: orderdetail orderdetail_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orderdetail
    ADD CONSTRAINT orderdetail_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- TOC entry 4867 (class 2606 OID 17084)
-- Name: payment payment_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payment
    ADD CONSTRAINT payment_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(order_id);


--
-- TOC entry 4869 (class 2606 OID 17149)
-- Name: product product_new_brand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_new_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brand(brand_id);


--
-- TOC entry 4870 (class 2606 OID 17154)
-- Name: product product_new_promo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product
    ADD CONSTRAINT product_new_promo_id_fkey FOREIGN KEY (promo_id) REFERENCES public.promotion(promo_id);


-- Completed on 2025-10-23 14:14:10

--
-- PostgreSQL database dump complete
--

\unrestrict 76gf4OtfzqZDwhrJpTGimNQ4QHyCHx2f25CPUJpiMtE2K1RaU8hnbZC6hfL65sN

