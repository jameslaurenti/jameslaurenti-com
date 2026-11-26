import { GameError, NotConfigured, addIdea, getState, removeIdea, tap } from "../store";

/**
 * GET  /experiments/thanksgiving/api           -> current board
 * POST /experiments/thanksgiving/api  { action: "add", text }        -> board + { added: { id, key } }
 *                                     { action: "tap", id, delta }   -> board (delta is 1 or -1)
 *                                     { action: "remove", id, key }  -> board
 *
 * Open to anyone with the link, by design. Every response is the full board, so a phone
 * that just tapped sees everyone else's taps in the same round trip.
 */
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

function fail(err: unknown) {
  if (err instanceof NotConfigured) {
    return Response.json({ error: "not-configured" }, { status: 503, headers: NO_STORE });
  }
  if (err instanceof GameError) {
    return Response.json({ error: err.message }, { status: err.status, headers: NO_STORE });
  }
  console.error("thanksgiving api", err);
  return Response.json({ error: "Something went wrong. Try again." }, { status: 500, headers: NO_STORE });
}

export async function GET() {
  try {
    return Response.json(await getState(), { headers: NO_STORE });
  } catch (err) {
    return fail(err);
  }
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 2000) throw new GameError("Too long.", 413);
    body = JSON.parse(text);
    if (!body || typeof body !== "object") throw new GameError("Bad request.", 400);
  } catch (err) {
    return fail(err instanceof GameError ? err : new GameError("Bad request.", 400));
  }

  try {
    let added: { id: string; key: string } | undefined;
    switch (body.action) {
      case "add":
        added = await addIdea(body.text);
        break;
      case "tap":
        await tap(body.id, body.delta);
        break;
      case "remove":
        await removeIdea(body.id, body.key);
        break;
      default:
        throw new GameError("Unknown action.", 400);
    }
    const state = await getState();
    return Response.json(added ? { ...state, added } : state, { headers: NO_STORE });
  } catch (err) {
    return fail(err);
  }
}
