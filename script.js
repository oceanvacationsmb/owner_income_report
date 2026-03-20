let currentOwner = null;
let reservationsData = [];

document.getElementById("loginBtn").onclick = function() {
  const email = (document.getElementById("ownerEmail").value || "").trim().toLowerCase();
  const pw = (document.getElementById("ownerPassword").value || "");
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
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("ownerPortal").style.display = "";
  loginStatus.innerText = "";

  loadOwnerReport();
};

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
  }
  // ...other owners...
};

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
function formatMoney(v) { return `$${Number(v || 0).toFixed(2)}`; }
function toNumber(v) { return Number(String(v || 0).replace(/[$,]/g, "").trim()) || 0; }
function getExpectedPayoutDate(checkOutDate) {
  const d = new Date(checkOutDate);
  if (isNaN(d)) return "";
  const payoutDate = new Date(d.getFullYear(), d.getMonth() + 1, 5);
  return payoutDate.toLocaleDateString("en-US");
}
function mapGuestyReservation(r) {
  // Map the data as your original code
  return {
    status: r.status,
    listingNickname: r["listing.nickname"], // or adjust as needed
    platform: r.platform,
    confirmationCode: r.confirmationCode,
    checkIn: r["checkInDate"]?.value || "",
    checkOut: r["checkOutDate"]?.value || "",
    ownerStay: r["guest.fullName"] && r["guest.fullName"].children && r["guest.fullName"].children.toUpperCase().includes("OWNER STAY") ? "OWNER STAY" : "",
    accommodationFare: Number(r["money.fareAccommodation"]?.value) || 0
  };
}

function renderDashboardHeader() {
  const greeting = document.getElementById("greeting");
  const propertyAddress = document.getElementById("propertyAddress");
  if (greeting) greeting.innerText = `${getTimeBasedGreeting()} ${currentOwner.ownerName}`;
  if (propertyAddress) propertyAddress.innerText = currentOwner.propertyName;
}

// NEW: SPLIT OWNER STAYS
function splitOwnerStays(reservations) {
  const ownerStays = reservations.filter(r => r.ownerStay);
  const normalReservations = reservations.filter(r => !r.ownerStay);
  return { ownerStays, normalReservations };
}

function renderSummaryBoxes(normalReservations) {
  const summaryBoxes = document.getElementById("summaryBoxes");
  if (!summaryBoxes) return;
  let totalAccommodation = 0, totalPMC = 0, totalOwnerPayout = 0;
  normalReservations.forEach(reservation => {
    const accommodation = toNumber(reservation.accommodationFare);
    const pmc = accommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = accommodation - pmc;
    totalAccommodation += accommodation;
    totalPMC += pmc;
    totalOwnerPayout += ownerPayout;
  });
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
  `;
}

function renderReservationsTable(normalReservations) {
  const tbody = document.getElementById("reservationsBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!normalReservations.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;">No reservations found</td></tr>`;
    return;
  }
  normalReservations.forEach(reservation => {
    const accommodation = toNumber(reservation.accommodationFare);
    const pmc = accommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = accommodation - pmc;
    const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);
    tbody.innerHTML += `
      <tr>
        <td>${reservation.confirmationCode || ""}</td>
        <td>${reservation.platform || ""}</td>
        <td>${reservation.checkIn || ""}</td>
        <td>${reservation.checkOut || ""}</td>
        <td>${formatMoney(accommodation)}</td>
        <td>${formatMoney(pmc)}</td>
        <td>${formatMoney(ownerPayout)}</td>
        <td>${expectedPayoutDate}</td>
      </tr>
    `;
  });
}

// --- OWNER STAYS TABLE ---
function renderOwnerStaysTable(ownerStays) {
  const tbody = document.getElementById("ownerStaysBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!ownerStays.length) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;">No owner stays found</td></tr>`;
    return;
  }
  ownerStays.forEach(stay => {
    tbody.innerHTML += `
      <tr>
        <td>${stay.checkIn || ""}</td>
        <td>${stay.checkOut || ""}</td>
        <td>${stay.listingNickname || ""}</td>
        <td>${formatMoney(currentOwner.cleaningFee)}</td>
      </tr>
    `;
  });
}

// --- OWNER STAYS CLEANING FEE SUMMARY ---
function renderOwnerCleaningFeeSummary(ownerStays) {
  const box = document.getElementById("ownerCleaningFeeSummary");
  if (!box) return;
  const totalCleaningFee = ownerStays.length * (currentOwner.cleaningFee || 0);
  box.innerHTML = `
    <div class="summary-box">
      <div class="summary-label">Owner Stay Cleaning Fees</div>
      <div class="summary-value">${formatMoney(totalCleaningFee)}</div>
    </div>
  `;
}

function loadOwnerReport() {
  if (!currentOwner || !currentOwner.guestyApiKey) {
    reservationsData = [];
    renderDashboardHeader();
    renderSummaryBoxes([]);
    renderReservationsTable([]);
    renderOwnerCleaningFeeSummary([]);
    renderOwnerStaysTable([]);
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
    .then(r => r.json())
    .then(payload => {
      const rows = Array.isArray(payload) ? payload : (payload.results || payload.data || []);
      const mappedRows = rows.map(mapGuestyReservation);
      reservationsData = mappedRows.filter(res => {
        const status = String(res.status || '').toLowerCase();
        return (status !== 'cancel' && status !== 'cancelled' && status !== 'canceled' && toNumber(res.accommodationFare) >= 0);
      });
      const { ownerStays, normalReservations } = splitOwnerStays(reservationsData);
      renderDashboardHeader();
      renderSummaryBoxes(normalReservations);
      renderReservationsTable(normalReservations);
      renderOwnerCleaningFeeSummary(ownerStays);
      renderOwnerStaysTable(ownerStays);
    })
    .catch(err => {
      reservationsData = [];
      renderDashboardHeader();
      renderSummaryBoxes([]);
      renderReservationsTable([]);
      renderOwnerCleaningFeeSummary([]);
      renderOwnerStaysTable([]);
    });
}
