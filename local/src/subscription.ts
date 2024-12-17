import type { CommitEvent } from "@skyware/jetstream";
import { JetstreamSubscriptionBase, isPost } from "./util/subscription";
import type { Record } from "./lexicon/types/app/bsky/feed/post";

function filter(ev: event): boolean {
	// only alf-related posts
	if (ev.post.text.toLowerCase().includes("alf")) {
		return true;
	}
	return false;
}

type event = { uri: string; did: string; time_us: number; post: Record };
export class JetstreamSubscription extends JetstreamSubscriptionBase {
	async handleEvent(evt: CommitEvent<"app.bsky.feed.post">) {
		if (!(evt.commit.operation === "create" && isPost(evt.commit.record))) return;
		const post = evt.commit.record;
		const uri = `at://${evt.did}/${evt.commit.collection}/${evt.commit.rkey}`;
		// This logs the text of every post off the firehose.
		// Just for fun :)
		// Delete before actually using
		console.log(post.text);

		const evForFilter: event = { ...evt, post: evt.commit.record, uri };
		if (filter(evForFilter)) {
			await this.db
				.insertInto("post")
				.ignore()
				.values({ uri, cid: evt.commit.cid, indexedAt: new Date().toISOString() })
				.execute();
		}
	}
}
