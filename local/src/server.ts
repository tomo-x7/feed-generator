import { createDb, type Database, migrateToLatest } from "./db";
import { JetstreamSubscription } from "./subscription";
import type { Config } from "./config";

export class FeedGenerator {
	public db: Database;
	public jetstream: JetstreamSubscription;
	public cfg: Config;

	constructor(db: Database, jetstream: JetstreamSubscription, cfg: Config) {
		this.db = db;
		this.jetstream = jetstream;
		this.cfg = cfg;
	}

	static create(cfg: Config) {
		const db = createDb(cfg.databaseURL);
		const firehose = new JetstreamSubscription(db, cfg.subscriptionEndpoint, cfg.subscriptionReconnectDelay);
		return new FeedGenerator(db, firehose, cfg);
	}

	async start() {
		await migrateToLatest(this.db);
		this.jetstream.run();
	}
}

export default FeedGenerator;
