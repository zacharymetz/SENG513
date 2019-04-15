--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.14
-- Dumped by pg_dump version 10.4

-- Started on 2019-04-14 22:53:23

SET statement_timeout = 0;
SET lock_timeout = 0;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 9 (class 2615 OID 18153)
-- Name: geo; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA geo;


ALTER SCHEMA geo OWNER TO postgres;

--
-- TOC entry 1 (class 3079 OID 12393)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 2324 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 2 (class 3079 OID 18503)
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- TOC entry 2325 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- TOC entry 221 (class 1255 OID 40983)
-- Name: fun(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.fun() RETURNS text
    LANGUAGE plpgsql
    AS $$
begin
IF EXISTS (SELECT academicgroupid FROM public.academicgroup WHERE code = 'AR') THEN
  REturn(SELECT academicgroupid
	FROM public.academicgroup
	WHERE code = 'AR');
ELSE
   INSERT INTO public.academicgroup(code, longname) VALUES ('AR','sadffdasfdas') Returning *;
END IF;
end
$$;


ALTER FUNCTION public.fun() OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 200 (class 1259 OID 18201)
-- Name: city; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.city (
    cityid integer NOT NULL,
    name text NOT NULL,
    stateid integer,
    countryid integer NOT NULL
);


ALTER TABLE geo.city OWNER TO postgres;

--
-- TOC entry 199 (class 1259 OID 18199)
-- Name: city_cityid_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.city_cityid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geo.city_cityid_seq OWNER TO postgres;

--
-- TOC entry 2326 (class 0 OID 0)
-- Dependencies: 199
-- Name: city_cityid_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.city_cityid_seq OWNED BY geo.city.cityid;


--
-- TOC entry 196 (class 1259 OID 18156)
-- Name: country; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.country (
    countryid integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE geo.country OWNER TO postgres;

--
-- TOC entry 195 (class 1259 OID 18154)
-- Name: country_countryid_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.country_countryid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geo.country_countryid_seq OWNER TO postgres;

--
-- TOC entry 2327 (class 0 OID 0)
-- Dependencies: 195
-- Name: country_countryid_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.country_countryid_seq OWNED BY geo.country.countryid;


--
-- TOC entry 198 (class 1259 OID 18183)
-- Name: state; Type: TABLE; Schema: geo; Owner: postgres
--

CREATE TABLE geo.state (
    stateid integer NOT NULL,
    statename text NOT NULL,
    countryid integer NOT NULL
);


ALTER TABLE geo.state OWNER TO postgres;

--
-- TOC entry 197 (class 1259 OID 18181)
-- Name: state_stateid_seq; Type: SEQUENCE; Schema: geo; Owner: postgres
--

CREATE SEQUENCE geo.state_stateid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE geo.state_stateid_seq OWNER TO postgres;

--
-- TOC entry 2328 (class 0 OID 0)
-- Dependencies: 197
-- Name: state_stateid_seq; Type: SEQUENCE OWNED BY; Schema: geo; Owner: postgres
--

ALTER SEQUENCE geo.state_stateid_seq OWNED BY geo.state.stateid;


--
-- TOC entry 186 (class 1259 OID 17074)
-- Name: faculty; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.faculty (
    facultyid integer NOT NULL,
    facultycode text,
    longname text,
    insitutionid integer,
    imageid integer
);


ALTER TABLE public.faculty OWNER TO postgres;

--
-- TOC entry 185 (class 1259 OID 17072)
-- Name: academicgroup_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.academicgroup_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.academicgroup_id_seq OWNER TO postgres;

--
-- TOC entry 2329 (class 0 OID 0)
-- Dependencies: 185
-- Name: academicgroup_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.academicgroup_id_seq OWNED BY public.faculty.facultyid;


--
-- TOC entry 204 (class 1259 OID 18388)
-- Name: account; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.account (
    accountid integer NOT NULL,
    email text NOT NULL,
    passworddigest text NOT NULL,
    firstname text,
    lastname text,
    phonenumber text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.account OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 18386)
-- Name: account_accountid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.account_accountid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.account_accountid_seq OWNER TO postgres;

--
-- TOC entry 2330 (class 0 OID 0)
-- Dependencies: 203
-- Name: account_accountid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.account_accountid_seq OWNED BY public.account.accountid;


--
-- TOC entry 206 (class 1259 OID 18416)
-- Name: accountinstitution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accountinstitution (
    accountinstitutionid integer NOT NULL,
    accountid integer,
    institutionid integer,
    permission text DEFAULT '*'::text
);


ALTER TABLE public.accountinstitution OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 18414)
-- Name: accountinstitution_accountinstitutionid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accountinstitution_accountinstitutionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accountinstitution_accountinstitutionid_seq OWNER TO postgres;

--
-- TOC entry 2331 (class 0 OID 0)
-- Dependencies: 205
-- Name: accountinstitution_accountinstitutionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accountinstitution_accountinstitutionid_seq OWNED BY public.accountinstitution.accountinstitutionid;


--
-- TOC entry 194 (class 1259 OID 17244)
-- Name: class; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.class (
    id integer NOT NULL,
    courseid integer,
    instructorid integer,
    classtype text,
    section text,
    term integer NOT NULL,
    locationid integer,
    classroom text,
    roomsize integer DEFAULT 0,
    canenroll boolean DEFAULT false NOT NULL,
    enrolltotal integer DEFAULT 0 NOT NULL,
    enrollcap integer DEFAULT 0 NOT NULL,
    waitlistcap integer DEFAULT 0 NOT NULL,
    reservedcapacity boolean DEFAULT false NOT NULL,
    departnmentconsentrequired boolean DEFAULT false NOT NULL,
    mettingpatternstring text,
    startdate date,
    enddate date,
    starttime time without time zone,
    endtime time without time zone,
    duration integer,
    monday boolean DEFAULT false,
    tuesday boolean DEFAULT false,
    wednesday boolean DEFAULT false,
    thursday boolean DEFAULT false,
    friday boolean DEFAULT false,
    saturday boolean DEFAULT false,
    sunday boolean DEFAULT false
);


ALTER TABLE public.class OWNER TO postgres;

--
-- TOC entry 193 (class 1259 OID 17242)
-- Name: class_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.class_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.class_id_seq OWNER TO postgres;

--
-- TOC entry 2332 (class 0 OID 0)
-- Dependencies: 193
-- Name: class_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.class_id_seq OWNED BY public.class.id;


--
-- TOC entry 192 (class 1259 OID 17186)
-- Name: course; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.course (
    courseid integer NOT NULL,
    departmentid integer,
    catalognumber text,
    description text,
    topicdescription text,
    notes text,
    untis real,
    ucalgarycourseid integer
);


ALTER TABLE public.course OWNER TO postgres;

--
-- TOC entry 191 (class 1259 OID 17184)
-- Name: course_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.course_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.course_id_seq OWNER TO postgres;

--
-- TOC entry 2333 (class 0 OID 0)
-- Dependencies: 191
-- Name: course_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.course_id_seq OWNED BY public.course.courseid;


--
-- TOC entry 188 (class 1259 OID 17085)
-- Name: department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.department (
    departmentid integer NOT NULL,
    facultyid integer,
    code text,
    name text
);


ALTER TABLE public.department OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 41006)
-- Name: file; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.file (
    fileid integer NOT NULL,
    filename text NOT NULL,
    location text NOT NULL
);


ALTER TABLE public.file OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 41004)
-- Name: file_fileid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.file_fileid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.file_fileid_seq OWNER TO postgres;

--
-- TOC entry 2334 (class 0 OID 0)
-- Dependencies: 209
-- Name: file_fileid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.file_fileid_seq OWNED BY public.file.fileid;


--
-- TOC entry 208 (class 1259 OID 18440)
-- Name: institution; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.institution (
    institutionid integer NOT NULL,
    name text NOT NULL,
    shortname text,
    streetnumber text,
    streetname text,
    postalcode text,
    cityid integer,
    stateid integer,
    countryid integer,
    brandcolor0 integer DEFAULT 0,
    brandcolor1 integer DEFAULT 0,
    inialized boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL,
    logoimage integer,
    backgroundimage integer
);


ALTER TABLE public.institution OWNER TO postgres;

--
-- TOC entry 207 (class 1259 OID 18438)
-- Name: institution_institutionid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.institution_institutionid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.institution_institutionid_seq OWNER TO postgres;

--
-- TOC entry 2335 (class 0 OID 0)
-- Dependencies: 207
-- Name: institution_institutionid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.institution_institutionid_seq OWNED BY public.institution.institutionid;


--
-- TOC entry 184 (class 1259 OID 17063)
-- Name: instructor; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.instructor (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.instructor OWNER TO postgres;

--
-- TOC entry 183 (class 1259 OID 17061)
-- Name: instructor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.instructor_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.instructor_id_seq OWNER TO postgres;

--
-- TOC entry 2336 (class 0 OID 0)
-- Dependencies: 183
-- Name: instructor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.instructor_id_seq OWNED BY public.instructor.id;


--
-- TOC entry 190 (class 1259 OID 17101)
-- Name: location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.location (
    id integer NOT NULL,
    name text
);


ALTER TABLE public.location OWNER TO postgres;

--
-- TOC entry 189 (class 1259 OID 17099)
-- Name: location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.location_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.location_id_seq OWNER TO postgres;

--
-- TOC entry 2337 (class 0 OID 0)
-- Dependencies: 189
-- Name: location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.location_id_seq OWNED BY public.location.id;


--
-- TOC entry 187 (class 1259 OID 17083)
-- Name: subject_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.subject_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.subject_id_seq OWNER TO postgres;

--
-- TOC entry 2338 (class 0 OID 0)
-- Dependencies: 187
-- Name: subject_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.subject_id_seq OWNED BY public.department.departmentid;


--
-- TOC entry 202 (class 1259 OID 18234)
-- Name: uploadedfile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uploadedfile (
    uploadedfileid integer NOT NULL,
    location text NOT NULL
);


ALTER TABLE public.uploadedfile OWNER TO postgres;

--
-- TOC entry 201 (class 1259 OID 18232)
-- Name: uploadedfile_uploadedfileid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.uploadedfile_uploadedfileid_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.uploadedfile_uploadedfileid_seq OWNER TO postgres;

--
-- TOC entry 2339 (class 0 OID 0)
-- Dependencies: 201
-- Name: uploadedfile_uploadedfileid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.uploadedfile_uploadedfileid_seq OWNED BY public.uploadedfile.uploadedfileid;


--
-- TOC entry 2144 (class 2604 OID 18204)
-- Name: city cityid; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.city ALTER COLUMN cityid SET DEFAULT nextval('geo.city_cityid_seq'::regclass);


--
-- TOC entry 2142 (class 2604 OID 18159)
-- Name: country countryid; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.country ALTER COLUMN countryid SET DEFAULT nextval('geo.country_countryid_seq'::regclass);


--
-- TOC entry 2143 (class 2604 OID 18186)
-- Name: state stateid; Type: DEFAULT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.state ALTER COLUMN stateid SET DEFAULT nextval('geo.state_stateid_seq'::regclass);


--
-- TOC entry 2146 (class 2604 OID 18391)
-- Name: account accountid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account ALTER COLUMN accountid SET DEFAULT nextval('public.account_accountid_seq'::regclass);


--
-- TOC entry 2147 (class 2604 OID 18419)
-- Name: accountinstitution accountinstitutionid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accountinstitution ALTER COLUMN accountinstitutionid SET DEFAULT nextval('public.accountinstitution_accountinstitutionid_seq'::regclass);


--
-- TOC entry 2127 (class 2604 OID 17247)
-- Name: class id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class ALTER COLUMN id SET DEFAULT nextval('public.class_id_seq'::regclass);


--
-- TOC entry 2126 (class 2604 OID 17189)
-- Name: course courseid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course ALTER COLUMN courseid SET DEFAULT nextval('public.course_id_seq'::regclass);


--
-- TOC entry 2124 (class 2604 OID 17088)
-- Name: department departmentid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department ALTER COLUMN departmentid SET DEFAULT nextval('public.subject_id_seq'::regclass);


--
-- TOC entry 2123 (class 2604 OID 17077)
-- Name: faculty facultyid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty ALTER COLUMN facultyid SET DEFAULT nextval('public.academicgroup_id_seq'::regclass);


--
-- TOC entry 2153 (class 2604 OID 41009)
-- Name: file fileid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file ALTER COLUMN fileid SET DEFAULT nextval('public.file_fileid_seq'::regclass);


--
-- TOC entry 2149 (class 2604 OID 18443)
-- Name: institution institutionid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.institution ALTER COLUMN institutionid SET DEFAULT nextval('public.institution_institutionid_seq'::regclass);


--
-- TOC entry 2122 (class 2604 OID 17066)
-- Name: instructor id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instructor ALTER COLUMN id SET DEFAULT nextval('public.instructor_id_seq'::regclass);


--
-- TOC entry 2125 (class 2604 OID 17104)
-- Name: location id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location ALTER COLUMN id SET DEFAULT nextval('public.location_id_seq'::regclass);


--
-- TOC entry 2145 (class 2604 OID 18237)
-- Name: uploadedfile uploadedfileid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploadedfile ALTER COLUMN uploadedfileid SET DEFAULT nextval('public.uploadedfile_uploadedfileid_seq'::regclass);


--
-- TOC entry 2175 (class 2606 OID 18209)
-- Name: city city_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.city
    ADD CONSTRAINT city_pkey PRIMARY KEY (cityid);


--
-- TOC entry 2171 (class 2606 OID 18164)
-- Name: country country_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.country
    ADD CONSTRAINT country_pkey PRIMARY KEY (countryid);


--
-- TOC entry 2173 (class 2606 OID 18191)
-- Name: state state_pkey; Type: CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.state
    ADD CONSTRAINT state_pkey PRIMARY KEY (stateid);


--
-- TOC entry 2157 (class 2606 OID 17082)
-- Name: faculty academicgroup_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT academicgroup_pkey PRIMARY KEY (facultyid);


--
-- TOC entry 2179 (class 2606 OID 18396)
-- Name: account account_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.account
    ADD CONSTRAINT account_pkey PRIMARY KEY (accountid);


--
-- TOC entry 2181 (class 2606 OID 18425)
-- Name: accountinstitution accountinstitution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accountinstitution
    ADD CONSTRAINT accountinstitution_pkey PRIMARY KEY (accountinstitutionid);


--
-- TOC entry 2169 (class 2606 OID 17266)
-- Name: class class_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_pkey PRIMARY KEY (id);


--
-- TOC entry 2167 (class 2606 OID 17194)
-- Name: course course_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_pkey PRIMARY KEY (courseid);


--
-- TOC entry 2185 (class 2606 OID 41014)
-- Name: file file_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.file
    ADD CONSTRAINT file_pkey PRIMARY KEY (fileid);


--
-- TOC entry 2183 (class 2606 OID 18451)
-- Name: institution institution_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.institution
    ADD CONSTRAINT institution_pkey PRIMARY KEY (institutionid);


--
-- TOC entry 2155 (class 2606 OID 17071)
-- Name: instructor instructor_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.instructor
    ADD CONSTRAINT instructor_pkey PRIMARY KEY (id);


--
-- TOC entry 2165 (class 2606 OID 17109)
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- TOC entry 2159 (class 2606 OID 41032)
-- Name: faculty news; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT news UNIQUE (facultycode, insitutionid);


--
-- TOC entry 2161 (class 2606 OID 41036)
-- Name: department news1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT news1 UNIQUE (facultyid, code);


--
-- TOC entry 2163 (class 2606 OID 17093)
-- Name: department subject_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT subject_pkey PRIMARY KEY (departmentid);


--
-- TOC entry 2177 (class 2606 OID 18242)
-- Name: uploadedfile uploadedfile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploadedfile
    ADD CONSTRAINT uploadedfile_pkey PRIMARY KEY (uploadedfileid);


--
-- TOC entry 2195 (class 2606 OID 18215)
-- Name: city city_countryid_fkey; Type: FK CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.city
    ADD CONSTRAINT city_countryid_fkey FOREIGN KEY (countryid) REFERENCES geo.country(countryid);


--
-- TOC entry 2194 (class 2606 OID 18210)
-- Name: city city_stateid_fkey; Type: FK CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.city
    ADD CONSTRAINT city_stateid_fkey FOREIGN KEY (stateid) REFERENCES geo.state(stateid);


--
-- TOC entry 2193 (class 2606 OID 18192)
-- Name: state state_countryid_fkey; Type: FK CONSTRAINT; Schema: geo; Owner: postgres
--

ALTER TABLE ONLY geo.state
    ADD CONSTRAINT state_countryid_fkey FOREIGN KEY (countryid) REFERENCES geo.country(countryid);


--
-- TOC entry 2196 (class 2606 OID 18426)
-- Name: accountinstitution accountinstitution_accountid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accountinstitution
    ADD CONSTRAINT accountinstitution_accountid_fkey FOREIGN KEY (accountid) REFERENCES public.account(accountid);


--
-- TOC entry 2190 (class 2606 OID 17267)
-- Name: class class_courseid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_courseid_fkey FOREIGN KEY (courseid) REFERENCES public.course(courseid);


--
-- TOC entry 2191 (class 2606 OID 17272)
-- Name: class class_instructorid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_instructorid_fkey FOREIGN KEY (instructorid) REFERENCES public.instructor(id);


--
-- TOC entry 2192 (class 2606 OID 17277)
-- Name: class class_locationid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.class
    ADD CONSTRAINT class_locationid_fkey FOREIGN KEY (locationid) REFERENCES public.location(id);


--
-- TOC entry 2189 (class 2606 OID 17195)
-- Name: course course_subjectid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.course
    ADD CONSTRAINT course_subjectid_fkey FOREIGN KEY (departmentid) REFERENCES public.department(departmentid);


--
-- TOC entry 2187 (class 2606 OID 41015)
-- Name: faculty faculty_imageid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_imageid_fkey FOREIGN KEY (imageid) REFERENCES public.file(fileid);


--
-- TOC entry 2186 (class 2606 OID 40999)
-- Name: faculty faculty_insitutionid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.faculty
    ADD CONSTRAINT faculty_insitutionid_fkey FOREIGN KEY (insitutionid) REFERENCES public.institution(institutionid);


--
-- TOC entry 2201 (class 2606 OID 41025)
-- Name: institution institution_backgroundimage_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.institution
    ADD CONSTRAINT institution_backgroundimage_fkey FOREIGN KEY (backgroundimage) REFERENCES public.file(fileid);


--
-- TOC entry 2197 (class 2606 OID 18452)
-- Name: institution institution_cityid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.institution
    ADD CONSTRAINT institution_cityid_fkey FOREIGN KEY (cityid) REFERENCES geo.city(cityid);


--
-- TOC entry 2199 (class 2606 OID 18462)
-- Name: institution institution_countryid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.institution
    ADD CONSTRAINT institution_countryid_fkey FOREIGN KEY (countryid) REFERENCES geo.country(countryid);


--
-- TOC entry 2200 (class 2606 OID 41020)
-- Name: institution institution_logoimage_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.institution
    ADD CONSTRAINT institution_logoimage_fkey FOREIGN KEY (logoimage) REFERENCES public.file(fileid);


--
-- TOC entry 2198 (class 2606 OID 18457)
-- Name: institution institution_stateid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.institution
    ADD CONSTRAINT institution_stateid_fkey FOREIGN KEY (stateid) REFERENCES geo.state(stateid);


--
-- TOC entry 2188 (class 2606 OID 17094)
-- Name: department subject_academicgroupid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.department
    ADD CONSTRAINT subject_academicgroupid_fkey FOREIGN KEY (facultyid) REFERENCES public.faculty(facultyid);


--
-- TOC entry 2323 (class 0 OID 0)
-- Dependencies: 7
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2019-04-14 22:53:23

--
-- PostgreSQL database dump complete
--

