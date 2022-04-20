import dotenv from "dotenv";

// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: ".env" });

const configuration = {
    PORT: process.env.PORT,
    URI_MONGO: process.env.URI_MONGO,
    SECRET_KEY: process.env.SECRET_KEY,
};

export default configuration;