import { BlobRef } from "@atproto/lexicon";
import { ids, lexicons } from "../lexicon/lexicons";
import type { Record as PostRecord } from "../lexicon/types/app/bsky/feed/post";
import type { Database } from "../db";
import { Jetstream, type CommitEvent } from "@skyware/jetstream";
import ws from "ws";

export abstract class JetstreamSubscriptionBase {
	public sub: Jetstream<"app.bsky.feed.post", "app.bsky.feed.post">;
	constructor(
		public db: Database,
		public service: string,
		subscriptionReconnectDelay: number,
	) {
		this.sub = new Jetstream({ endpoint: service, wantedCollections: ["app.bsky.feed.post"], ws });
		const reconnect = (err?: Error) => {
			if (err) {
				console.error("repo subscription errored", err);
			} else {
				console.log("subscription closed");
			}
			setTimeout(() => this.run(), subscriptionReconnectDelay);
		};
		this.sub.on("app.bsky.feed.post", (ev) => this.handleEvent(ev));
		this.sub.on("close", () => reconnect());
		this.sub.on("error", (err) => reconnect(err));
	}

	abstract handleEvent(evt: CommitEvent<"app.bsky.feed.post">): Promise<void>;

	run() {
		this.sub.start();
	}
}

export const isPost = (obj: unknown): obj is PostRecord => {
	return isType(obj, ids.AppBskyFeedPost);
};

const isType = (obj: unknown, nsid: string) => {
	try {
		lexicons.assertValidRecord(nsid, fixBlobRefs(obj));
		return true;
	} catch (err) {
		return false;
	}
};

// @TODO right now record validation fails on BlobRefs
// simply because multiple packages have their own copy
// of the BlobRef class, causing instanceof checks to fail.
// This is a temporary solution.
const fixBlobRefs = (obj: unknown): unknown => {
	if (Array.isArray(obj)) {
		return obj.map(fixBlobRefs);
	}
	if (obj && typeof obj === "object") {
		if (obj.constructor.name === "BlobRef") {
			const blob = obj as BlobRef;
			return new BlobRef(blob.ref, blob.mimeType, blob.size, blob.original);
		}
		return Object.entries(obj).reduce(
			(acc, [key, val]) => {
				return Object.assign(acc, { [key]: fixBlobRefs(val) });
			},
			{} as Record<string, unknown>,
		);
	}
	return obj;
};
