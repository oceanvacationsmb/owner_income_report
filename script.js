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
let reservationsData = [];

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
    .then(r => r.json())
    .then(data => {
      // Handle the Guesty API response - could be array or object with data property
      reservationsData = Array.isArray(data) ? data : (data.data || data.reservations || []);
      renderOwnerDashboard();
    })
    .catch(err => {
      console.error(err);
      alert("Could not load report");
    });
}

// Helper function to safely get nested field values
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, prop) => current?.[prop], obj) || "";
}

// Field getter functions for Guesty API structure
function getReservationCode(row) {
  return getNestedValue(row, "confirmationCode.children") || "";
}

function getPlatform(row) {
  return getNestedValue(row, "integration.platform.children") || "";
}

function getCheckIn(row) {
  return getNestedValue(row, "checkInDate.value") || "";
}

function getCheckOut(row) {
  return getNestedValue(row, "checkOutDate.value") || "";
}

function getAccommodation(row) {
  return toNumber(getNestedValue(row, "money.fareAccommodation.value"));
}

function getLengthOfStayDiscount(row) {
  return toNumber(getNestedValue(row, "lengthOfStayDiscount.value"));
}

function getMarkup(row) {
  return toNumber(getNestedValue(row, "money.invoiceItems.MAR.value"));
}

// Calculate Net Accommodation
function getNetAccommodation(row) {
  const accommodation = getAccommodation(row);
  const discount = getLengthOfStayDiscount(row);
  const markup = getMarkup(row);
  return accommodation + discount - markup;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US");
}

function getExpectedPayoutDate(checkOutDate) {
  const d = new Date(checkOutDate);
  if (isNaN(d)) return "";

  let year = d.getFullYear();
  let month = d.getMonth() + 1;

  if (month > 11) {
    month = 0;
    year += 1;
  }

  const payoutDate = new Date(year, month, 5);
  return payoutDate.toLocaleDateString("en-US");
}

function renderOwnerDashboard() {
  let totalAccommodation = 0;
  let totalPMC = 0;
  let totalOwnerPayout = 0;

  reservationsData.forEach(row => {
    const netAccommodation = getNetAccommodation(row);
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

  reservationsData.forEach(row => {
    const code = getReservationCode(row);
    const platform = getPlatform(row);
    const checkIn = getCheckIn(row);
    const checkOut = getCheckOut(row);

    const netAccommodation = getNetAccommodation(row);
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
