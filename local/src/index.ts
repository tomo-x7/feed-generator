import dotenv from "dotenv";
import FeedGenerator from "./server";

const run = async () => {
	dotenv.config();
	const server = FeedGenerator.create({
		databaseURL: maybeStr(process.env.DATABASE_URL) ?? throwError("DATABASE_URL not found"),
		subscriptionEndpoint:
			maybeStr(process.env.FEEDGEN_SUBSCRIPTION_ENDPOINT) ?? "wss://jetstream1.us-west.bsky.network/subscribe",
		subscriptionReconnectDelay: maybeInt(process.env.FEEDGEN_SUBSCRIPTION_RECONNECT_DELAY) ?? 3000,
	});
	await server.start();
	console.log("🤖 running feed generator");
};

const maybeStr = (val?: string) => {
	if (!val) return undefined;
	return val;
};

const maybeInt = (val?: string) => {
	if (!val) return undefined;
	const int = Number.parseInt(val, 10);
	if (Number.isNaN(int)) return undefined;
	return int;
};

const throwError = (err: string) => {
	throw new Error(err);
};

run();
