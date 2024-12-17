import type { Database } from "./db";
import type { DidResolver } from "@atproto/identity";

export type AppContext = {
	db: Database;
	didResolver: DidResolver;
	cfg: Config;
};

export type Config = {
	port: number;
	listenhost: string;
	hostname: string;
	databaseURL: string;
	serviceDid: string;
	publisherDid: string;
};
