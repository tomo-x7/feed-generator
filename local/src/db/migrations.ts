import type { Kysely, Migration, MigrationProvider } from "kysely";

const migrations: Record<string, Migration> = {};

export const migrationProvider: MigrationProvider = {
	async getMigrations() {
		return migrations;
	},
};

migrations["001"] = {
	async up(db: Kysely<unknown>) {
		await db.schema
			.createTable("post")
			.addColumn("uri", "varchar", (col) => col.primaryKey())
			.addColumn("cid", "varchar", (col) => col.notNull())
			.addColumn("indexedAt", "varchar", (col) => col.notNull())
			.execute();
		await db.schema
			.createTable("sub_state")
			.addColumn("service", "varchar", (col) => col.primaryKey())
			.addColumn("cursor", "integer", (col) => col.notNull())
			.execute();
	},
};
