import { config } from "./utils/config";
import { createServer } from "./utils/createServer";
import { connectToDb, disconnectFromDb } from "./utils/db";
import { logger } from "./utils/logger";

const signals = ["SIGINT", "SIGTERM", "SIGHUP"] as const;

async function gracefullShutdown({
	signal,
	server,
}: {
	signal: typeof signals[number];
	server: Awaited<ReturnType<typeof createServer>>;
}) {
	logger.info(`Received ${signal} signal, shutting down`);
	await server.close();

	await disconnectFromDb();

	process.exit(0);
}

async function startServer() {
	const server = await createServer();

	server.listen({
		port: config.PORT,
		host: config.HOST,
	});

	await connectToDb();

	logger.info(`Server listening`);

	for (const signal of signals) {
		process.on(signal, () => gracefullShutdown({ signal, server }));
	}
}

startServer();
