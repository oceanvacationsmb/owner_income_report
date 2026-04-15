/**
 * tmp-debug-elevator.js
 * Run: node tmp-debug-elevator.js
 *
 * Fetches ALL reservations using the admin Guesty key, then prints a
 * breakdown of every reservation that has the elevator custom field set.
 * For each one it shows:
 *   - hostPayout (what we store as grossPayout)
 *   - fareAccommodation + fareCleaning (what the payout *should* be minus taxes/channel fee)
 *   - every invoiceItem key + amount
 *
 * This tells us the exact invoice-item key Guesty uses for the elevator fee.
 */

const ADMIN_KEY =
  "ada6fa4f86889add1196b0151fec4b77949586b9c1c7459c2bfd05cfab466f34d72197d1bd5beaeefb8ad2295dedb1b60d6c8de7a45985c85623ffdfb22b36a6";

const BASE_URL =
  "https://report.guesty.com/api/shared-reservations-reports?timezone=America/New_York";

const ELEVATOR_FIELD_ID = "69682ec2a604dc001460d3c5";

// ── helpers ─────────────────────────────────────────────────────────────────

function pickNum(v) {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v.replace(/[$,]/g, "").trim());
    return isNaN(n) ? 0 : n;
  }
  if (typeof v === "object" && v !== null) {
    for (const k of ["value", "amount", "children"]) {
      if (v[k] != null) {
        const n = pickNum(v[k]);
        if (n !== 0) return n;
      }
    }
  }
  return 0;
}

function getElevatorValue(row) {
  // Flat dot-notation key (most common from Guesty shared reports)
  const flatKey = `customFields.${ELEVATOR_FIELD_ID}`;
  const rawKey = `rawCustomFields.${ELEVATOR_FIELD_ID}`;
  if (row[flatKey] != null) return row[flatKey];
  if (row[rawKey] != null) return row[rawKey];

  // Nested customFields object or array
  const nested = row.customFields || row.custom_fields;
  if (nested && typeof nested === "object") {
    if (Array.isArray(nested)) {
      const field = nested.find(f => f.fieldId === ELEVATOR_FIELD_ID || f.id === ELEVATOR_FIELD_ID);
      if (field) return field.value || field.fieldValue;
    } else {
      if (nested[ELEVATOR_FIELD_ID] != null) return nested[ELEVATOR_FIELD_ID];
    }
  }
  return null;
}

function hasElevator(row) {
  const raw = getElevatorValue(row);
  if (raw == null) return false;
  // Handle object values like {value: "Yes"}
  const v = typeof raw === "object" && raw !== null
    ? String(raw.value || raw.children || raw.label || "").toLowerCase()
    : String(raw).toLowerCase();
  return ["yes", "y", "true", "1", "required", "elevator", "notice"].includes(v);
}

function getAllInvoiceItems(row) {
  const items = {};

  // 1. Flat dot-notation keys: "money.invoiceItems.KEY" or "money.invoiceItems.KEY.value"
  for (const key of Object.keys(row)) {
    const m = key.match(/^money\.invoiceItems\.([^.]+)(?:\.value)?$/);
    if (m) {
      const name = m[1];
      if (!(name in items)) items[name] = pickNum(row[key]);
    }
  }

  // 2. Nested money.invoiceItems object
  const nested = row.money?.invoiceItems || row["money.invoiceItems"];
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    for (const [k, v] of Object.entries(nested)) {
      if (!(k in items)) items[k] = pickNum(v);
    }
  }

  return items;
}

// ── fetch all pages ──────────────────────────────────────────────────────────

async function fetchPage(skip) {
  const url = `${BASE_URL}&skip=${skip}&limit=1000`;
  const res = await fetch(url, {
    headers: { accept: "*/*", authorization: ADMIN_KEY, "content-type": "application/json" },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Guesty ${res.status}: ${text.slice(0, 300)}`);
  }
  const json = await res.json();
  return Array.isArray(json) ? json : json.results || json.data || [];
}

async function fetchAll() {
  let all = [];
  let skip = 0;
  while (true) {
    process.stdout.write(`  fetching skip=${skip}...\r`);
    const page = await fetchPage(skip);
    all = all.concat(page);
    if (page.length < 1000) break;
    skip += 1000;
  }
  return all;
}

// ── main ─────────────────────────────────────────────────────────────────────

(async () => {
  console.log("Fetching all reservations from Guesty (admin key)...");
  let rows;
  try {
    rows = await fetchAll();
  } catch (err) {
    console.error("Fetch failed:", err.message);
    process.exit(1);
  }
  console.log(`\nTotal rows fetched: ${rows.length}`);

  const elevatorRows = rows.filter(hasElevator);
  console.log(`Rows with elevator field set: ${elevatorRows.length}\n`);

  if (elevatorRows.length === 0) {
    console.log("No elevator reservations found with that field set to yes/true/etc.");
    console.log("\nSampling the first 10 rows to show what values the elevator field actually has:\n");
    rows.slice(0, 10).forEach((row, i) => {
      const code = row.confirmationCode || row.reservationCode || row.code || `row-${i}`;
      const rawVal = getElevatorValue(row);
      console.log(`  ${code}: customFields.${ELEVATOR_FIELD_ID} = ${JSON.stringify(rawVal)}`);
    });
    console.log("\nIf the field shows a value like 'Yes' or an object, update the check in hasElevator().");
    console.log("Run the script again after fixing. Or paste the output above here for review.");
    return;
  }

  // For each elevator reservation, print a breakdown
  let anyGap = false;
  elevatorRows.slice(0, 20).forEach((row, i) => {
    const code =
      row.confirmationCode || row.reservationCode || row.code || `row-${i}`;
    const listing =
      row["listing.nickname"] || row.listingNickname || row.listing?.nickname || "?";
    const checkIn = row["checkInDate"]?.value || row.checkInDate || row.checkIn || "?";

    const hostPayout = pickNum(
      row["money.hostPayout"]?.value ?? row["money.hostPayout"] ?? row.money?.hostPayout?.value ?? row.money?.hostPayout ?? row.hostPayout
    );
    const fareAccomm = pickNum(
      row["money.fareAccommodation"]?.value ?? row["money.fareAccommodation"] ?? row.money?.fareAccommodation?.value ?? row.money?.fareAccommodation
    );
    const fareCleaning = pickNum(
      row["money.fareCleaning"]?.value ?? row["money.fareCleaning"] ?? row.money?.fareCleaning?.value ?? row.money?.fareCleaning
    );
    const fareTaxes = pickNum(
      row["money.fareTaxes"]?.value ?? row["money.fareTaxes"] ?? row.money?.fareTaxes?.value ?? row.money?.fareTaxes
    );
    const hostServiceFee = pickNum(
      row["money.hostServiceFee"]?.value ?? row["money.hostServiceFee"] ?? row.money?.hostServiceFee?.value ?? row.money?.hostServiceFee
    );

    const expectedPayout = fareAccomm + fareCleaning - fareTaxes - hostServiceFee;
    const gap = expectedPayout - hostPayout;

    const invoiceItems = getAllInvoiceItems(row);
    const nonZeroItems = Object.entries(invoiceItems).filter(([, v]) => v !== 0);

    if (gap !== 0) anyGap = true;

    console.log(`─── ${code} | ${listing} | check-in: ${checkIn} ───`);
    console.log(`  hostPayout           : $${hostPayout.toFixed(2)}`);
    console.log(`  fareAccommodation    : $${fareAccomm.toFixed(2)}`);
    console.log(`  fareCleaning         : $${fareCleaning.toFixed(2)}`);
    console.log(`  fareTaxes            : $${fareTaxes.toFixed(2)}`);
    console.log(`  hostServiceFee       : $${hostServiceFee.toFixed(2)}`);
    console.log(`  expectedPayout       : $${expectedPayout.toFixed(2)}  (accommodation + cleaning - taxes - hostServiceFee)`);
    console.log(`  gap (expected-actual): $${gap.toFixed(2)}  ← elevator deduction if non-zero`);
    console.log(`  invoice items (non-zero):`);
    if (nonZeroItems.length === 0) {
      console.log("    (none found — field names may be nested differently)");
    } else {
      nonZeroItems.forEach(([k, v]) => console.log(`    ${k}: $${Number(v).toFixed(2)}`));
    }
    console.log();
  });

  if (anyGap) {
    console.log("=== ACTION NEEDED ===");
    console.log("There is a gap between expectedPayout and hostPayout on elevator reservations.");
    console.log("Look at the invoice item names printed above to find the elevator fee key.");
    console.log("Share those invoice item names and we will add them back to grossPayout in script.js.");
  } else {
    console.log("=== No gap found ===");
    console.log("hostPayout matches expectedPayout on all elevator reservations.");
    console.log("The $150 discrepancy is somewhere else — share the output above with your developer.");
  }
})();
