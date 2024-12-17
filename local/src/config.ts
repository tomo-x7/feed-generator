import type { Database } from "./db";

export type AppContext = {
	db: Database;
	cfg: Config;
};

export type Config = {
	databaseURL: string;
	subscriptionEndpoint: string;
	subscriptionReconnectDelay: number;
};
