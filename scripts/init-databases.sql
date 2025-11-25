-- Initialize separate databases for each microservice
CREATE DATABASE auth_db;
CREATE DATABASE vendor_db;
CREATE DATABASE gateway_db;

-- Grant permissions to user for all databases
GRANT ALL PRIVILEGES ON DATABASE auth_db TO user;
GRANT ALL PRIVILEGES ON DATABASE vendor_db TO user;
GRANT ALL PRIVILEGES ON DATABASE gateway_db TO user;
