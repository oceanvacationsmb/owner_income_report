// === YOUR LOGIN & OWNER SETTINGS LOGIC (unchanged) ===
let currentOwner = null;

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

let reservationsData = [];

// === EMAILJS CONFIG/OTHER HELPERS ===
// ... (no changes here, omitted for brevity; your code remains, do not edit) ...

// === DASHBOARD + WEATHER ===
// ... (no changes; your functions remain as you wrote them) ...

// === MODAL FORM, GETTERS, GENERIC HELPERS ===
// ... (no changes; your functions remain as you wrote them) ...

// === SUMMARY, TABLE, DROPDOWNS ===
function renderSummaryBoxes() {
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
  summaryBoxes.style.textAlign = "center";
  summaryBoxes.style.display = "flex";
  summaryBoxes.style.justifyContent = "center";
}


function renderReservationsTable() {
  const tbody = document.getElementById("reservationsBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!normalReservations.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center;">No reservations found</td>
      </tr>
    `;
    return;
  }
  normalReservations.forEach(reservation => {
    const accommodation = toNumber(reservation.accommodationFare);
    const pmc = accommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = accommodation - pmc;
    const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);

    const codeToShow = reservation.ownerStay ? reservation.ownerStay : reservation.confirmationCode;

    tbody.innerHTML += `
      <tr>
        <td>${codeToShow}</td>
        <td>${reservation.platform || ""}</td>
        <td>${reservation.checkIn || ""}</td>
        <td>${reservation.checkOut || ""}</td>
        <td>${reservation.ownerStay ? "" : formatMoney(accommodation)}</td>
        <td>${formatMoney(pmc)}</td>
        <td>${formatMoney(ownerPayout)}</td>
        <td>${expectedPayoutDate}</td>
      </tr>
    `;
  });
}

// === ADDED: OWNER STAY TABLE & CLEANING FEE SUMMARY ===
function renderOwnerStaysTable() {
  const tbody = document.getElementById("ownerStaysBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  if (!ownerStays.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;">No owner stays found</td>
      </tr>
    `;
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

function renderOwnerCleaningFeeSummary() {
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

// === LOAD AND FILTER RESERVATIONS (now splits) ===
let normalReservations = [];
let ownerStays = [];

function loadOwnerReport() {
  if (!currentOwner || !currentOwner.guestyApiKey) {
    console.error("No owner or API key configured");
    reservationsData = [];
    normalReservations = [];
    ownerStays = [];
    renderDashboardHeader();
    renderSummaryBoxes();
    renderReservationsTable();
    renderOwnerCleaningFeeSummary();
    renderOwnerStaysTable();
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
    .then(r => {
      if (!r.ok) throw new Error("Guesty fetch failed: " + r.status);
      return r.json();
    })
    .then(payload => {
      const rows = Array.isArray(payload) ? payload : (payload.results || payload.data || []);
      const mappedRows = rows.map(mapGuestyReservation);

      // === SPLIT LOGIC: owner stays vs normal
      normalReservations = mappedRows.filter(res => {
        const status = String(res.status || '').toLowerCase();
        // Owner stay if: "owner stay" in ownerStay, all else is normal
        return !res.ownerStay && (status !== 'cancel' && status !== 'cancelled' && status !== 'canceled' && toNumber(res.accommodationFare) > 0);
      });
      ownerStays = mappedRows.filter(res => res.ownerStay);

      reservationsData = mappedRows;
      renderDashboardHeader();
      renderSummaryBoxes();
      renderReservationsTable();
      renderOwnerCleaningFeeSummary();
      renderOwnerStaysTable();
    })
    .catch(err => {
      console.error("Error loading report:", err);
      reservationsData = [];
      normalReservations = [];
      ownerStays = [];
      renderDashboardHeader();
      renderSummaryBoxes();
      renderReservationsTable();
      renderOwnerCleaningFeeSummary();
      renderOwnerStaysTable();
    });
}

// === CONTACT MODAL, EMAILJS, ETC ===
// ... (no changes, paste your existing code below unchanged) ...
