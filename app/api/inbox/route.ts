import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { inboxes, messages } from "../../../db/schema";
import { hashInboxKey, normalizeHandle } from "../../../lib/inbox";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { handle?: unknown; inboxKey?: unknown };
    const handle = normalizeHandle(payload.handle);
    const inboxKeyHash = await hashInboxKey(payload.inboxKey);
    if (!handle || !inboxKeyHash) {
      return Response.json({ error: "Enter your handle and private inbox key." }, { status: 400 });
    }

    const db = getDb();
    const [inbox] = await db
      .select({ handle: inboxes.handle })
      .from(inboxes)
      .where(and(eq(inboxes.handle, handle), eq(inboxes.inboxKeyHash, inboxKeyHash)))
      .limit(1);

    if (!inbox) {
      return Response.json({ error: "That inbox could not be opened." }, { status: 403 });
    }

    const received = await db
      .select({
        id: messages.id,
        body: messages.body,
        theme: messages.theme,
        createdAt: messages.createdAt,
      })
      .from(messages)
      .where(eq(messages.recipientHandle, handle))
      .orderBy(desc(messages.createdAt), desc(messages.id))
      .limit(100);

    return Response.json({ handle, messages: received });
  } catch {
    return Response.json({ error: "That inbox could not be opened." }, { status: 500 });
  }
}
