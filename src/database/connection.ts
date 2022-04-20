import { connect } from "mongoose";

import configuration from "../configuration/configuration";

const URI_MONGO: string | any = configuration.URI_MONGO;

const dbConnection = async () => {
    try {
        const db = await connect(URI_MONGO);
        console.log("Database is connected to", db.connection.db.databaseName);
    } catch (error: Error | any) {
        throw new Error(error);
    }
};

export default dbConnection;
