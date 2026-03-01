export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: JSON.stringify({ ok: false, error: "Method not allowed" }) };
    }

    const { pin } = JSON.parse(event.body || "{}");
    const realPin = process.env.ADMIN_PIN || "";

    if (!pin || pin !== realPin) {
      return { statusCode: 401, body: JSON.stringify({ ok: false, error: "Unauthorized" }) };
    }

    // Simple token (demo). Better: JWT, but this is enough to hide the PIN from clients.
    const token = Buffer.from(`admin:${Date.now()}:${Math.random()}`).toString("base64");

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok: true, token })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: "Server error" }) };
  }
}
