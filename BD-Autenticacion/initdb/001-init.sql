
CREATE DATABASE usuarios connection LIMIT 10;

create user ignacio superuser createdb createrole encrypted password 'ignacio' connection limit 1;
GRANT ALL PRIVILEGES ON DATABASE personas TO ignacio;
\connect personas
GRANT ALL ON SCHEMA public TO ignacio;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ignacio;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO ignacio;


