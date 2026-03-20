// === OWNER CONFIGURATION ===
const OWNERS = {
  "1463@yahoo.com": {
    password: "1234",
    ownerName: "ZACK TEST",
    propertyName: "1463 Basin Trail, Murrells Inlet, SC 29576",
    postalCode: "29576",
    pmcPercent: 12,
    guestyApiKey: "1a58fc1af3815f9023a08e09c590a05f3f3d1c73dbc3ab2e19985ecfe0003aa87acc7e264983e31d5b10a98cf4fd9b4789de3cb864daf2031e42aae6266c92f5",
    cleaningFee: 250
  },
  "11315@yahoo.com": {
    password: "1234",
    ownerName: "ZACK 2",
    propertyName: "Basin Trail, Murrells Inlet, SC 29576",
    postalCode: "11418",
    pmcPercent: 15,
    guestyApiKey: "bbbab438244300805daaf5485d3b516cbeee616fba7e640fc3b80d0b648c01d13e3f70a2bde2abaf9deb3b661aabf1c17453fd4e6d799f380cfd059df66cf01e",
    cleaningFee: 350
  },
  "11313@yahoo.com": {
    password: "1234",
    ownerName: "CARL",
    propertyName: "113B 13th Ave North. Surfside Beach SC 29575",
    postalCode: "29575",
    pmcPercent: 12,
    guestyApiKey: "d6ab951850fef54399e2206f36f4e79fb1b425a8e5c891076036b11f50da8870613a226021487307c8c5f51eae997a08dd7e112d013ef683728ad1d9220ee0b7",
    cleaningFee: 350
  }
};

let currentOwner = null;
let reservationsData = [];
let ownerStayData = [];

// --- LOGIN LOGIC
document.addEventListener("DOMContentLoaded", function() {
  const loginBox = document.getElementById("loginBox");
  const portal = document.getElementById("ownerPortal");
  const loginBtn = document.getElementById("loginBtn");
  const showPwd = document.getElementById("showPwd");
  const ownerPwd = document.getElementById("ownerPassword");

  loginBox.style.display = 'flex';
  portal.style.display = 'none';

  // Show/hide password
  showPwd.onclick = function() {
    ownerPwd.type = ownerPwd.type === 'password' ? 'text' : 'password';
    showPwd.style.color = ownerPwd.type === 'text' ? '#3282b8' : '#aaa';
  };

  loginBtn.onclick = function() {
    const email = (document.getElementById("ownerEmail").value || "").trim().toLowerCase();
    const pw = (ownerPwd.value || "");
    const loginStatus = document.getElementById("loginStatus");

    if (!OWNERS[email]) {
      loginStatus.innerText = "Email not found.";
      return;
    }
    if (OWNERS[email].password !== pw) {
      loginStatus.innerText = "Password incorrect.";
      return;
    }
    currentOwner = OWNERS[email];
    loginBox.style.display = 'none';
    portal.style.display = '';
    loginStatus.innerText = "";
    loadOwnerReport();
  };
});

// --- UTILS
function formatMoney(v) { return `$${Number(v || 0).toLocaleString('en-US', {minimumFractionDigits:2,maximumFractionDigits:2})}`; }
function toNumber(v) { return Number(String(v || 0).replace(/[$,]/g, "").trim()) || 0; }

// --- MAP DATA
function mapGuestyReservation(r) {
  return {
    status: (r.status || r.reservationStatus || r["STATUS"] || r["reservationStatus"] || "").toString(),
    platform: r["integration.platform"] || r.platform || (r.integration || {}).platform || r.integration || "",
    confirmationCode: String(r["confirmationCode"] || r.code || r.reservationCode || "").toUpperCase(),
    checkIn: (r["checkInDate"] && r["checkInDate"].value) || "",
    checkOut: (r["checkOutDate"] && r["checkOutDate"].value) || "",
    ownerStay:
      r["guest.fullName"] && r["guest.fullName"].children &&
      r["guest.fullName"].children.toUpperCase().includes("OWNER STAY") ? "OWNER STAY" : "",
    accommodationFare: toNumber(r["money.fareAccommodation"] && r["money.fareAccommodation"].value),
    totalPayout: toNumber(r["money.hostPayout"] && r["money.hostPayout"].value),
  };
}

// --- DASHBOARD SUMMARY
function renderSummaryBoxes() {
  const summaryBoxes = document.getElementById("summaryBoxes");
  if (!summaryBoxes) return;

  let totalAccommodation = 0, totalPMC = 0, totalOwnerPayout = 0;
  reservationsData.forEach(reservation => {
    const accommodation = toNumber(reservation.accommodationFare || 0);
    const pmc = accommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = accommodation - pmc;
    totalAccommodation += accommodation;
    totalPMC += pmc;
    totalOwnerPayout += ownerPayout;
  });

  // Owner Stay cleaning total
  let totalOwnerStayCleaning = (ownerStayData || []).length * (currentOwner.cleaningFee ? Number(currentOwner.cleaningFee) : 0);

  summaryBoxes.innerHTML = `
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
    <div class="summary-box" style="background:#e0f7fa">
      <div class="summary-label">OWNER STAY</div>
      <div class="summary-value">${formatMoney(totalOwnerStayCleaning)}</div>
    </div>
  `;
}

// --- MAIN TABLE
function renderReservationsTable() {
  const tbody = document.getElementById("reservationsBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!reservationsData.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;">No reservations found</td>
      </tr>
    `;
    return;
  }
  reservationsData.forEach(reservation => {
    const accommodation = toNumber(reservation.accommodationFare);
    const pmc = accommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = accommodation - pmc;
    // Calculate first of next month from checkOut or today's date
    let payoutDate = "";
    if (reservation.checkOut) {
      const d = new Date(reservation.checkOut);
      payoutDate = !isNaN(d) ? new Date(d.getFullYear(), d.getMonth() + 1, 5).toLocaleDateString("en-US") : "";
    }
    const codeToShow = reservation.ownerStay ? reservation.ownerStay : reservation.confirmationCode;
    tbody.innerHTML += `
      <tr>
        <td>${codeToShow}</td>
        <td>${reservation.platform || ""}</td>
        <td>${reservation.checkIn || ""}</td>
        <td>${reservation.checkOut || ""}</td>
        <td>${reservation.ownerStay ? "" : formatMoney(accommodation)}</td>
        <td>${reservation.ownerStay ? "" : formatMoney(pmc)}</td>
        <td>${reservation.ownerStay ? "" : formatMoney(ownerPayout)}</td>
        <td>${payoutDate}</td>
      </tr>
    `;
  });
}

// --- OWNER STAYS TABLE
function renderOwnerStayTable() {
  const container = document.getElementById("ownerStaysTableContainer");
  if (!container) return;
  if (!ownerStayData.length) {
    container.innerHTML = ""; // Hide when empty
    return;
  }
  let tableHtml = `
    <h3 class="section-title">Owner Stays</h3>
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Cleaning Fee</th>
          </tr>
        </thead>
        <tbody>
  `;
  ownerStayData.forEach(reservation => {
    tableHtml += `
      <tr>
        <td>OWNER STAY</td>
        <td>${reservation.checkIn || ""}</td>
        <td>${reservation.checkOut || ""}</td>
        <td>${formatMoney(currentOwner.cleaningFee)}</td>
      </tr>
    `;
  });
  tableHtml += `
        </tbody>
      </table>
    </div>
  `;
  container.innerHTML = tableHtml;
}

// --- FETCH & FILTER DATA
function loadOwnerReport() {
  if (!currentOwner || !currentOwner.guestyApiKey) {
    reservationsData = [];
    ownerStayData = [];
    renderSummaryBoxes();
    renderReservationsTable();
    renderOwnerStayTable();
    return;
  }
  const reportUrl = "https://report.guesty.com/api/shared-reservations-reports?timezone=America/New_York&skip=0&limit=1000";
  fetch(reportUrl, {
    headers: {
      accept: "*/*",
      authorization: currentOwner.guestyApiKey,
      "content-type": "application/json"
    }
  })
    .then(r => r.ok ? r.json() : Promise.reject(r))
    .then(payload => {
      const rows = Array.isArray(payload) ? payload : (payload.results || payload.data || []);
      const mappedRows = rows.map(mapGuestyReservation);

      ownerStayData = mappedRows.filter(res => res.ownerStay);
      reservationsData = mappedRows.filter(res =>
        !res.ownerStay &&
        String(res.status || '').toLowerCase() !== 'cancel' &&
        String(res.status || '').toLowerCase() !== 'cancelled' &&
        String(res.status || '').toLowerCase() !== 'canceled' &&
        toNumber(res.accommodationFare) > 0
      );
      renderSummaryBoxes();
      renderReservationsTable();
      renderOwnerStayTable();
    })
    .catch(() => {
      reservationsData = [];
      ownerStayData = [];
      renderSummaryBoxes();
      renderReservationsTable();
      renderOwnerStayTable();
    });
}
