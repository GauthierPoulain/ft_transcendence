-- Adminer 4.8.1 PostgreSQL 14.1 (Debian 14.1-1.pgdg110+1) dump

\connect "ft_transcendance";

CREATE TABLE "public"."session" (
    "sid" character varying NOT NULL,
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL,
    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
) WITH (oids = false);

CREATE INDEX "IDX_session_expire" ON "public"."session" USING btree ("expire");


-- 2022-01-19 12:33:49.76396+00