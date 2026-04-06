const fs = require("fs");

const key = "8a32863cba1cd5066ef2c40ddd064ccb591c4111d70c650b75bcff6f6bab955c7504394415775586795e2f7408cb61b12277841485f5dc0b65b22b32a31ce7c3";
const baseUrl = "https://report.guesty.com/api/shared-reservations-reports?timezone=America/New_York";
const targets = new Set(["HMQ4SPTED3", "HA-QPH3JMF"]);

function scalarValues(v, out = []) {
  if (v == null) return out;
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") {
    out.push(String(v));
    return out;
  }
  if (Array.isArray(v)) {
    for (const x of v) scalarValues(x, out);
    return out;
  }
  if (typeof v === "object") {
    for (const x of Object.values(v)) scalarValues(x, out);
  }
  return out;
}

function rowHasTarget(row) {
  const vals = scalarValues(row);
  for (const v of vals) {
    if (targets.has(v)) return true;
  }
  return false;
}

function getListing(row) {
  return String(row?.["listing.nickname"]?.children || row?.listingName || row?.listing?.nickname || "");
}

function getCode(row) {
  return String(row?.confirmationCode?.children || row?.confirmationCode || row?.reservationCode || "");
}

(async () => {
  const allMatches = [];
  const nmb304bMarch = [];
  const pageSummaries = [];

  const limit = 1000;
  for (let skip = 0; skip <= 20000; skip += limit) {
    const url = `${baseUrl}&skip=${skip}&limit=${limit}`;
    const r = await fetch(url, {
      headers: {
        accept: "*/*",
        authorization: key,
        "content-type": "application/json"
      }
    });
    if (!r.ok) {
      const text = await r.text();
      pageSummaries.push({ skip, ok: false, status: r.status, body: text.slice(0, 300) });
      break;
    }

    const j = await r.json();
    const rows = Array.isArray(j?.results) ? j.results : Array.isArray(j) ? j : [];
    pageSummaries.push({ skip, ok: true, rows: rows.length });

    for (const row of rows) {
      if (rowHasTarget(row)) {
        allMatches.push(row);
      }
      const listing = getListing(row);
      const checkIn = String(row?.checkInDate?.value || row?.checkIn || row?.checkInDateLocalized || "");
      if (/NMB\s*-\s*304B/i.test(listing) && checkIn.startsWith("2026-03")) {
        nmb304bMarch.push({
          code: getCode(row),
          listing,
          checkIn,
          checkOut: String(row?.checkOutDate?.value || row?.checkOut || row?.checkOutDateLocalized || ""),
          row
        });
      }
    }

    if (rows.length < limit) break;
  }

  const out = {
    pageSummaries,
    matchesCount: allMatches.length,
    matchesCodes: allMatches.map(getCode),
    matches: allMatches,
    nmb304bMarchCount: nmb304bMarch.length,
    nmb304bMarch
  };

  fs.writeFileSync("/private/tmp/target-codes-scan.json", JSON.stringify(out, null, 2));
  console.log("WROTE /private/tmp/target-codes-scan.json", { matches: out.matchesCount, nmb304bMarch: out.nmb304bMarchCount });
})();
