import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { inboxes, messages } from "../../../db/schema";
import { normalizeHandle, normalizeMessage, normalizeTheme } from "../../../lib/inbox";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      recipientHandle?: unknown;
      message?: unknown;
      theme?: unknown;
    };
    const recipientHandle = normalizeHandle(payload.recipientHandle);
    const body = normalizeMessage(payload.message);
    const theme = normalizeTheme(payload.theme);

    if (!recipientHandle || !body) {
      return Response.json(
        { error: "Choose a valid handle and write a message up to 420 characters." },
        { status: 400 }
      );
    }

    const db = getDb();
    const [inbox] = await db
      .select({ handle: inboxes.handle })
      .from(inboxes)
      .where(eq(inboxes.handle, recipientHandle))
      .limit(1);

    if (!inbox) {
      return Response.json(
        { error: "That inbox does not exist. Check the handle and try again." },
        { status: 404 }
      );
    }

    await db.insert(messages).values({ recipientHandle, body, theme, createdAt: new Date().toISOString() });
    return Response.json({ received: true }, { status: 201 });
  } catch {
    return Response.json({ error: "This message could not be placed." }, { status: 500 });
  }
}
