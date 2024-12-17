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
			.addColumn("uri", "varchar(255)", (col) => col.primaryKey())
			.addColumn("cid", "varchar(255)", (col) => col.notNull())
			.addColumn("indexedAt", "varchar(255)", (col) => col.notNull())
			.execute();
		await db.schema
			.createTable("sub_state")
			.addColumn("service", "varchar(255)", (col) => col.primaryKey())
			.addColumn("cursor", "integer", (col) => col.notNull())
			.execute();
	},
};
