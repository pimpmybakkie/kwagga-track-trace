let memoryDb = {
  shipments: {
    "KWG-1001": {
      tracking: "KWG-1001",
      statusKey: "in_transit",
      eta: "2026-03-03 16:00",
      last: { place: "Johannesburg Depot", lat: -26.2041, lng: 28.0473, time: "2026-03-01 09:20" },
      events: []
    }
  }
};

// Demo auth: just check header exists.
// (Real system: verify JWT. But PIN stays hidden either way.)
function isAuthed(event){
  const auth = event.headers?.authorization || event.headers?.Authorization || "";
  return auth.startsWith("Bearer ");
}

export async function handler(event) {
  try {
    if (!isAuthed(event)) {
      return { statusCode: 401, body: JSON.stringify({ ok: false, error: "Unauthorized" }) };
    }

    if (event.httpMethod === "GET") {
      return {
        statusCode: 200,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ok: true, shipments: memoryDb.shipments })
      };
    }

    if (event.httpMethod === "POST") {
      const payload = JSON.parse(event.body || "{}");
      if (!payload.tracking) {
        return { statusCode: 400, body: JSON.stringify({ ok:false, error:"tracking required" }) };
      }
      memoryDb.shipments[payload.tracking.toUpperCase()] = payload;
      return { statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify({ ok:true }) };
    }

    if (event.httpMethod === "DELETE") {
      const tracking = (event.queryStringParameters?.tracking || "").trim().toUpperCase();
      if (!tracking || !memoryDb.shipments[tracking]) {
        return { statusCode: 404, body: JSON.stringify({ ok:false }) };
      }
      delete memoryDb.shipments[tracking];
      return { statusCode: 200, headers: { "content-type": "application/json" }, body: JSON.stringify({ ok:true }) };
    }

    return { statusCode: 405, body: JSON.stringify({ ok:false, error:"Method not allowed" }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ ok:false, error:"Server error" }) };
  }
}
