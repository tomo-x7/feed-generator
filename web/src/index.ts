import dotenv from "dotenv";
import FeedGenerator from "./server";

const run = async () => {
	dotenv.config();
	const hostname = maybeStr(process.env.FEEDGEN_HOSTNAME) ?? "example.com";
	const serviceDid = maybeStr(process.env.FEEDGEN_SERVICE_DID) ?? `did:web:${hostname}`;
	const server = FeedGenerator.create({
		port: maybeInt(process.env.FEEDGEN_PORT) ?? 3000,
		listenhost: maybeStr(process.env.FEEDGEN_LISTENHOST) ?? "localhost",
		databaseURL: maybeStr(process.env.DATABASE_URL) ?? throwError("DATABASE_URL not found"),
		publisherDid: maybeStr(process.env.FEEDGEN_PUBLISHER_DID) ?? "did:example:alice",
		hostname,
		serviceDid,
	});
	await server.start();
	console.log(`🤖 running feed generator at http://${server.cfg.listenhost}:${server.cfg.port}`);
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
