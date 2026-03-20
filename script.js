const OWNERS = {
  "ti3155@yahoo.com": {
    password: "1234",
    ownerName: "ZACK TEST",
    propertyName: "1463 Wild Iris Dr.",
    pmcPercent: 20,
    guestyReportUrl: "https://report.guesty.com/apps/reservations?apiKey=1a58fc1af3815f9023a08e09c590a05f3f3d1c73dbc3ab2e19985ecfe0003aa87acc7e264983e31d5b10a98cf4fd9b4789de3cb864daf2031e42aae6266c92f5"
  }
};

let currentOwner = null;
let csvData = [];

function toNumber(v) {
  return Number(String(v || 0).replace(/[$,]/g, "").trim()) || 0;
}

function formatMoney(v) {
  return `$${Number(v || 0).toFixed(2)}`;
}

function loginOwner() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value.trim();
  const loginError = document.getElementById("loginError");

  loginError.textContent = "";

  const owner = OWNERS[email];

  if (!owner || owner.password !== password) {
    loginError.textContent = "Invalid email or password";
    return;
  }

  currentOwner = owner;
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("ownerPortal").style.display = "block";
  document.getElementById("portalTitle").textContent = `${owner.ownerName} Statement`;

  loadOwnerReport();
}

function loadOwnerReport() {
  if (!currentOwner || !currentOwner.guestyReportUrl) return;

  fetch(currentOwner.guestyReportUrl)
    .then(r => r.text())
    .then(csv => {
      const result = Papa.parse(csv, {
        header: true,
        skipEmptyLines: true
      });

      csvData = result.data || [];
      renderOwnerDashboard();
    })
    .catch(err => {
      console.error(err);
      alert("Could not load report");
    });
}

function getField(row, possibleNames) {
  for (const name of possibleNames) {
    if (row[name] !== undefined) return row[name];
  }
  return "";
}

function parseDateFlexible(dateStr) {
  if (!dateStr) return null;

  const raw = String(dateStr).trim();

  let d = new Date(raw);
  if (!isNaN(d)) return d;

  const parts = raw.split(/[\/\-]/);
  if (parts.length === 3) {
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    d = new Date(year, month, day);
    if (!isNaN(d)) return d;
  }

  return null;
}

function formatDateDisplay(dateStr) {
  const d = parseDateFlexible(dateStr);
  if (!d) return dateStr || "";
  return d.toLocaleDateString("en-US");
}

function getExpectedPayoutDate(checkOutDate) {
  const d = parseDateFlexible(checkOutDate);
  if (!d) return "";

  let year = d.getFullYear();
  let month = d.getMonth() + 1;

  if (month > 11) {
    month = 0;
    year += 1;
  }

  const payoutDate = new Date(year, month, 5);
  return payoutDate.toLocaleDateString("en-US");
}

function getMarkupAmount(row) {
  return toNumber(
    getField(row, [
      "MARKUP",
      "Markup",
      "markup",
      "OWNER MARKUP",
      "Owner Markup"
    ])
  );
}

function getAccommodationFare(row) {
  return toNumber(
    getField(row, [
      "ACCOMMODATION FARE",
      "Accommodation Fare",
      "accommodation fare"
    ])
  );
}

function getReservationCode(row) {
  return getField(row, [
    "CODE",
    "Code",
    "RESERVATION CODE",
    "Reservation Code"
  ]) || "";
}

function getPlatform(row) {
  return getField(row, [
    "PLATFORM",
    "Platform",
    "CHANNEL",
    "Channel"
  ]) || "";
}

function getCheckIn(row) {
  return getField(row, [
    "CHECK-IN DATE",
    "Check-in Date",
    "CHECK IN",
    "Check In"
  ]) || "";
}

function getCheckOut(row) {
  return getField(row, [
    "CHECK-OUT DATE",
    "Check-out Date",
    "CHECK OUT",
    "Check Out"
  ]) || "";
}

function renderOwnerDashboard() {
  let totalAccommodation = 0;
  let totalPMC = 0;
  let totalOwnerPayout = 0;

  csvData.forEach(row => {
    const accommodationFare = getAccommodationFare(row);
    const markup = getMarkupAmount(row);
    const netAccommodation = accommodationFare - markup;
    const pmc = netAccommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = netAccommodation - pmc;

    totalAccommodation += netAccommodation;
    totalPMC += pmc;
    totalOwnerPayout += ownerPayout;
  });

  document.getElementById("summary").innerHTML = `
    <div class="summary-box">
      <div class="summary-label">Owner</div>
      <div class="summary-value">${currentOwner.ownerName}</div>
    </div>
    <div class="summary-box">
      <div class="summary-label">Property</div>
      <div class="summary-value">${currentOwner.propertyName}</div>
    </div>
    <div class="summary-box">
      <div class="summary-label">PMC %</div>
      <div class="summary-value">${currentOwner.pmcPercent}%</div>
    </div>
    <div class="summary-box">
      <div class="summary-label">Total Accommodation</div>
      <div class="summary-value">${formatMoney(totalAccommodation)}</div>
    </div>
    <div class="summary-box">
      <div class="summary-label">Total PMC</div>
      <div class="summary-value">${formatMoney(totalPMC)}</div>
    </div>
    <div class="summary-box">
      <div class="summary-label">Total Owner Payout</div>
      <div class="summary-value">${formatMoney(totalOwnerPayout)}</div>
    </div>
  `;

  renderReservationsTable();
}

function renderReservationsTable() {
  const tbody = document.getElementById("reservationsBody");
  tbody.innerHTML = "";

  csvData.forEach(row => {
    const code = getReservationCode(row);
    const platform = getPlatform(row);
    const checkIn = getCheckIn(row);
    const checkOut = getCheckOut(row);

    const accommodationFare = getAccommodationFare(row);
    const markup = getMarkupAmount(row);
    const netAccommodation = accommodationFare - markup;
    const pmc = netAccommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = netAccommodation - pmc;
    const expectedPayoutDate = getExpectedPayoutDate(checkOut);

    tbody.innerHTML += `
      <tr>
        <td>${code}</td>
        <td>${platform}</td>
        <td>${formatDateDisplay(checkIn)}</td>
        <td>${formatDateDisplay(checkOut)}</td>
        <td>${formatMoney(netAccommodation)}</td>
        <td>${formatMoney(pmc)}</td>
        <td>${formatMoney(ownerPayout)}</td>
        <td>${expectedPayoutDate}</td>
      </tr>
    `;
  });
}
