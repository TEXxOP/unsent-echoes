import { getDb } from "../../../db";
import { inboxes } from "../../../db/schema";
import { generateInboxKey, hashInboxKey, normalizeHandle } from "../../../lib/inbox";

export async function POST(request: Request) {
  try {
    const { handle: rawHandle } = (await request.json()) as { handle?: unknown };
    const handle = normalizeHandle(rawHandle);
    if (!handle) {
      return Response.json(
        { error: "Use 3–24 lowercase letters, numbers, or underscores." },
        { status: 400 }
      );
    }

    const inboxKey = generateInboxKey();
    const inboxKeyHash = await hashInboxKey(inboxKey);
    if (!inboxKeyHash) throw new Error("Could not secure the inbox key.");

    const db = getDb();
    await db.insert(inboxes).values({ handle, inboxKeyHash, createdAt: new Date().toISOString() });
    return Response.json({ handle, inboxKey }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not claim that handle.";
    if (message.includes("UNIQUE constraint failed")) {
      return Response.json(
        { error: "That handle is already held. Try another." },
        { status: 409 }
      );
    }
    return Response.json({ error: "Could not claim that handle." }, { status: 500 });
  }
}
