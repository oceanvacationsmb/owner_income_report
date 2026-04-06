const key = "8a32863cba1cd5066ef2c40ddd064ccb591c4111d70c650b75bcff6f6bab955c7504394415775586795e2f7408cb61b12277841485f5dc0b65b22b32a31ce7c3";
const url = "https://report.guesty.com/api/shared-reservations-reports?timezone=America/New_York&skip=0&limit=4000";

function firstCode(row) {
  return String(
    row?.reservationCode ||
      row?.confirmationCode ||
      row?.code ||
      row?.channelConfirmationCode ||
      row?.sourceConfirmationCode ||
      ""
  );
}

function includesMarch2026(row) {
  const fields = [
    row?.checkIn,
    row?.checkOut,
    row?.checkInDateLocalized,
    row?.checkOutDateLocalized,
    row?.createdAtLocalized,
    row?.reservationDate
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
    console.error("STATUS", r.status);
    console.error(await r.text());
    process.exit(1);
  }

  const j = await r.json();
  const rows = Array.isArray(j?.results) ? j.results : Array.isArray(j) ? j : [];
  const targetCodes = new Set(["HMQ4SPTED3", "HA-QPH3JMF"]);
  const byCode = rows.filter((row) => targetCodes.has(firstCode(row)));
  const byPropMonth = rows.filter((row) => {
    const listingName = String(row?.listingName || row?.listing?.nickname || "");
    return listingName.includes("NMB - 304B") && includesMarch2026(row);
  });

  const allCodes = rows
    .map((row) => ({
      code: firstCode(row),
      listingName: row?.listingName || row?.listing?.nickname || "",
      checkIn: row?.checkIn || row?.checkInDateLocalized || "",
      checkOut: row?.checkOut || row?.checkOutDateLocalized || ""
    }))
    .filter((x) => x.code)
    .slice(0, 200);

  const result = {
    totalRows: rows.length,
    targetCodeMatches: byCode.length,
    byCode,
    nmb304bMarchCount: byPropMonth.length,
    byPropMonth,
    sampleKeys: rows[0] ? Object.keys(rows[0]).sort() : [],
    sampleCodes: allCodes
  };

  console.log(JSON.stringify(result, null, 2));
})();
