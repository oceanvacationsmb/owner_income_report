const fs = require("fs");

const key = "8a32863cba1cd5066ef2c40ddd064ccb591c4111d70c650b75bcff6f6bab955c7504394415775586795e2f7408cb61b12277841485f5dc0b65b22b32a31ce7c3";
const url = "https://report.guesty.com/api/shared-reservations-reports?timezone=America/New_York&skip=0&limit=4000";

function valuesOfMaybeObject(v) {
  if (v == null) return [];
  if (typeof v === "string" || typeof v === "number") return [String(v)];
  if (typeof v === "object") {
    return Object.values(v)
      .flatMap((x) => valuesOfMaybeObject(x))
      .filter(Boolean);
  }
  return [];
}

function extractCodes(row) {
  const candidates = [
    row?.reservationCode,
    row?.confirmationCode,
    row?.code,
    row?.channelConfirmationCode,
    row?.sourceConfirmationCode,
    row?.integrationId,
    row?.ids,
    row?.reservation,
    row?.money,
    row
  ];
  const tokens = candidates
    .flatMap((x) => valuesOfMaybeObject(x))
    .filter((s) => /^[A-Z0-9-]{6,}$/.test(String(s || "")));
  return [...new Set(tokens)];
}

function includesMarch2026(row) {
  const fields = [
    row?.checkIn,
    row?.checkOut,
    row?.checkInDateLocalized,
    row?.checkOutDateLocalized,
    row?.createdAtLocalized,
    row?.reservationDate,
    row?.arrivalDate,
    row?.departureDate,
    row?.reservationCreatedAt
  ].map((v) => String(v || ""));
  return fields.some((v) => v.startsWith("2026-03"));
}

(async () => {
  const r = await fetch(url, {
    headers: {
      accept: "*/*",
      authorization: key,
      "content-type": "application/json"
    }
  });

  if (!r.ok) {
    const out = { status: r.status, body: await r.text() };
    fs.writeFileSync("/tmp/guesty-debug.json", JSON.stringify(out, null, 2));
    process.exit(1);
  }

  const j = await r.json();
  const rows = Array.isArray(j?.results) ? j.results : Array.isArray(j) ? j : [];
  const targets = ["HMQ4SPTED3", "HA-QPH3JMF"];

  const rowsWithTargets = rows.filter((row) => {
    const codes = extractCodes(row);
    return targets.some((t) => codes.includes(t));
  });

  const nmb304bRows = rows.filter((row) => {
    const listingName = String(row?.listingName || row?.listing?.nickname || row?.listing?.title || "");
    return /NMB\s*-\s*304B/i.test(listingName);
  });

  const nmb304bMarchRows = nmb304bRows.filter(includesMarch2026);

  const output = {
    totalRows: rows.length,
    rowsWithTargetsCount: rowsWithTargets.length,
    rowsWithTargets,
    nmb304bRowsCount: nmb304bRows.length,
    nmb304bMarchRowsCount: nmb304bMarchRows.length,
    nmb304bMarchRows,
    firstRowKeys: rows[0] ? Object.keys(rows[0]).sort() : [],
    firstRow: rows[0] || null
  };

  fs.writeFileSync("/tmp/guesty-debug.json", JSON.stringify(output, null, 2));
})();
