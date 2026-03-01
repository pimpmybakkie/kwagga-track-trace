const db = {
  shipments: {
    "KWG-1001": {
      tracking: "KWG-1001",
      statusKey: "in_transit",
      eta: "2026-03-03 16:00",
      last: { place: "Johannesburg Depot", lat: -26.2041, lng: 28.0473, time: "2026-03-01 09:20" },
      events: [
        { titleKey:"parcel_received", place:"Pretoria", time:"2026-02-28 12:10", noteEn:"Item received from sender.", noteAf:"Item is ontvang by sender." },
        { titleKey:"sorting", place:"Pretoria Hub", time:"2026-02-28 18:05", noteEn:"Scanned for routing.", noteAf:"Gescan vir roete." },
        { titleKey:"in_transit", place:"Johannesburg Depot", time:"2026-03-01 09:20", noteEn:"Moving between depots.", noteAf:"Vervoer tussen depots." }
      ]
    }
  }
};

export async function handler(event) {
  const tracking = (event.queryStringParameters?.tracking || "").trim().toUpperCase();
  const ship = db.shipments[tracking];

  if (!ship) {
    return { statusCode: 404, headers: { "content-type": "application/json" }, body: JSON.stringify({ ok: false }) };
  }

  return {
    statusCode: 200,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ok: true, shipment: ship })
  };
}
