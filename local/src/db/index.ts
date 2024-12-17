import { TiDBServerlessDialect } from "@tidbcloud/kysely";
import { Kysely, Migrator } from "kysely";
import type { DatabaseSchema } from "./schema";
import { migrationProvider } from "./migrations";

export const createDb = (databaseURL: string): Database => {
	return new Kysely<DatabaseSchema>({
		dialect: new TiDBServerlessDialect({
			url: databaseURL,
		}),
	});
};

export const migrateToLatest = async (db: Database) => {
	const migrator = new Migrator({ db, provider: migrationProvider });
	const { error } = await migrator.migrateToLatest();
	if (error) throw error;
};

export type Database = Kysely<DatabaseSchema>;
