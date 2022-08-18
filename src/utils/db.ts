import { logger } from "./logger";
import { config } from "./config";
import mongoose from "mongoose";

export async function connectToDb() {
	try {
		await mongoose.connect(config.DATABASE_URL);
		logger.info(`Connected to database`);
	} catch (error) {
		logger.error(error, `Failed to connect to database`);
		process.exit(1);
	}
}

export function disconnectFromDb() {
	return mongoose.connection.close();
}
