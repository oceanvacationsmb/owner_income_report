let currentOwner = null;
let reservationsData = [];
let ownerStayData = [];

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

// === GENERIC GETTERS & HELPERS ===
function pickText(...args) {
  for (const v of args) {
    if (v == null) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v).trim();
    if (Array.isArray(v)) return v.map(pickText).filter(Boolean).join(", ");
    if (typeof v === "object") {
      const candidates = [v.value, v.children, v.label, v.name, v.text, v.code, v.title, v.displayName, v.nickname, v.id, v._id];
      for (const item of candidates) {
        if (item != null && typeof item !== "object") return String(item).trim();
      }
      for (const key in v) {
        if (v[key] != null && typeof v[key] !== "object") return String(v[key]).trim();
      }
    }
  }
  return "";
}
function pickNumber(...args) {
  for (const v of args) {
    if (v == null) continue;
    if (typeof v === "number") return v;
    if (typeof v === "string") {
      const n = Number(String(v).replace(/[$,]/g, "").trim());
      if (!isNaN(n)) return n;
    }
    if (Array.isArray(v) && v.length) {
      const n = pickNumber(v[0]);
      if (!isNaN(n)) return n;
    }
    if (typeof v === "object") {
      const candidates = [v.value, v.amount, v.children, v.total, v.sum];
      for (const item of candidates) {
        if (item != null) {
          const n = pickNumber(item);
          if (!isNaN(n)) return n;
        }
      }
    }
  }
  return 0;
}
function toNumber(v) { 
  return Number(String(v || 0).replace(/[$,]/g, "").trim()) || 0; 
}

function formatMoney(v) { 
  return Number(v || 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' }); 
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function getExpectedPayoutDate(checkOutDate) {
  const d = new Date(checkOutDate);
  if (isNaN(d)) return "";
  const payoutDate = new Date(d.getFullYear(), d.getMonth() + 1, 5);
  return payoutDate.toLocaleDateString("en-US");
}

// === MAPPING ===
function mapGuestyReservation(r) {
  const baseAccommodation = pickNumber(r["money.fareAccommodation"]?.value);
  const markup = pickNumber(r["money.invoiceItems.MAR"]?.value);
  const lengthOfStayDiscount = 0;
  const calculatedAccommodation = baseAccommodation - markup + lengthOfStayDiscount;

  return {
    status: pickText(r.status, r.reservationStatus, r["STATUS"], r["reservationStatus"]),
    platform: pickText(r["integration.platform"], r.platform, r.integration?.platform, r.integration),
    confirmationCode: (pickText(r["confirmationCode"], r.code, r.reservationCode) || "").toUpperCase(),
    checkIn: r["checkInDate"]?.value || "",
    checkOut: r["checkOutDate"]?.value || "",
    ownerStay:
      r["guest.fullName"] &&
      r["guest.fullName"].children &&
      r["guest.fullName"].children.toUpperCase().includes("OWNER STAY")
        ? "OWNER STAY"
        : "",
    totalPayout: pickNumber(r["money.hostPayout"]?.value, r.hostPayout, r.totalPayout),
    accommodationFare: calculatedAccommodation,
    baseAccommodation,
    markup,
    lengthOfStayDiscount
  };
}

// === GREETING & ADDRESS RENDER ===
function renderGreetingAndAddress() {
  const greeting = document.getElementById("greeting");
  const propertyAddress = document.getElementById("propertyAddress");
  if (!currentOwner) return;
  const hour = new Date().getHours();
  let greet = "Welcome";
  if (hour < 12) greet = "Good morning";
  else if (hour < 18) greet = "Good afternoon";
  else greet = "Good evening";
  if (greeting) greeting.innerText = `${greet}, ${currentOwner.ownerName}`;
  if (propertyAddress) propertyAddress.innerText = currentOwner.propertyName;
}

// === LOGIN HANDLER ===
document.addEventListener("DOMContentLoaded", function() {
  // Modern login (assume HTML/CSS includes .login-container, #loginBtn, etc)
  const loginBox = document.getElementById("loginBox");
  const portal = document.getElementById("ownerPortal");
  const loginBtn = document.getElementById("loginBtn");
  const showPwd = document.getElementById("showPwd");
  const ownerPwd = document.getElementById("ownerPassword");

  loginBox.style.display = 'flex';
  portal.style.display = 'none';

  // Show/hide password
  if (showPwd && ownerPwd) {
    showPwd.onclick = function() {
      ownerPwd.type = ownerPwd.type === 'password' ? 'text' : 'password';
      showPwd.style.color = ownerPwd.type === 'text' ? '#3282b8' : '#aaa';
    };
  }

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
    renderGreetingAndAddress();
    loadOwnerReport();
  };
});

// === SUMMARY BOXES ===
function renderSummaryBoxes() {
  const summaryBoxes = document.getElementById("summaryBoxes");
  if (!summaryBoxes) return;
  let totalAccommodation = 0, totalPMC = 0, totalOwnerPayout = 0;

  reservationsData.forEach(reservation => {
    const accommodation = toNumber(reservation.accommodationFare);
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

// === MAIN TABLE ===
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
    const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);
    const codeToShow = reservation.ownerStay ? reservation.ownerStay : reservation.confirmationCode;
    tbody.innerHTML += `
      <tr>
        <td>${codeToShow}</td>
        <td>${reservation.platform || ""}</td>
        <td>${formatDateDisplay(reservation.checkIn)}</td>
        <td>${formatDateDisplay(reservation.checkOut)}</td>
        <td>${reservation.ownerStay ? "" : formatMoney(accommodation)}</td>
        <td>${reservation.ownerStay ? "" : formatMoney(pmc)}</td>
        <td>${reservation.ownerStay ? "" : formatMoney(ownerPayout)}</td>
        <td>${expectedPayoutDate}</td>
      </tr>
    `;
  });
}

// === OWNER STAY TABLE ===
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
        <td>${formatDateDisplay(reservation.checkIn)}</td>
        <td>${formatDateDisplay(reservation.checkOut)}</td>
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

// === FETCHING & FILTERING DATA ===
function loadOwnerReport() {
  if (!currentOwner || !currentOwner.guestyApiKey) {
    reservationsData = [];
    ownerStayData = [];
    renderGreetingAndAddress();
    renderSummaryBoxes();
    renderReservationsTable();
    renderOwnerStayTable();
    renderMonthPieChart();
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
      renderGreetingAndAddress();
      renderSummaryBoxes();
      renderReservationsTable();
      renderOwnerStayTable();
      renderMonthPieChart();
      })
    .catch(() => {
      reservationsData = [];
      ownerStayData = [];
      renderGreetingAndAddress();
      renderSummaryBoxes();
      renderReservationsTable();
      renderOwnerStayTable();
    });
}
