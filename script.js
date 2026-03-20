const OWNERS = {
  "ti3155@yahoo.com": {
    password: "1234",
    ownerName: "ZACK TEST",
    propertyName: "1463 Wild Iris Dr.",
    pmcPercent: 20,
    guestyReportUrl: "https://report.guesty.com/apps/reservations?apiKey=1a58fc1af3815f9023a08e09c590a05f3f3d1c73dbc3ab2e19985ecfe0003aa87acc7e264983e31d5b10a98cf4fd9b4789de3cb864daf2031e42aae6266c92f5"
  }
};

let currentOwner = OWNERS["ti3155@yahoo.com"]; // Auto-login
let reservationsData = [];

function toNumber(v) {
  return Number(String(v || 0).replace(/[$,]/g, "").trim()) || 0;
}

function formatMoney(v) {
  return `$${Number(v || 0).toFixed(2)}`;
}

function loadOwnerReport() {
  if (!currentOwner || !currentOwner.guestyReportUrl) return;

  console.log("Loading report from:", currentOwner.guestyReportUrl);

  fetch(currentOwner.guestyReportUrl)
    .then(r => {
      console.log("Response status:", r.status);
      return r.text();
    })
    .then(html => {
      console.log("HTML length:", html.length);
      console.log("First 500 chars:", html.substring(0, 500));
      parseGuestyTable(html);
      renderOwnerDashboard();
    })
    .catch(err => {
      console.error("Error loading report:", err);
      alert("Could not load report: " + err.message);
    });
}

function parseGuestyTable(html) {
  // Create a temporary container to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  
  // Find all table rows
  const rows = doc.querySelectorAll('table tbody tr');
  console.log("Found rows:", rows.length);
  reservationsData = [];

  rows.forEach((row, index) => {
    const cells = row.querySelectorAll('td');
    console.log(`Row ${index} cells:`, cells.length);
    
    if (cells.length > 0) {
      const reservation = {
        listingNickname: cells[0]?.textContent.trim() || "",
        platform: cells[1]?.textContent.trim() || "",
        confirmationCode: cells[2]?.textContent.trim() || "",
        checkIn: cells[3]?.textContent.trim() || "",
        checkOut: cells[4]?.textContent.trim() || "",
        totalPayout: toNumber(cells[5]?.textContent),
        accommodationFare: toNumber(cells[6]?.textContent),
      };
      
      console.log("Parsed reservation:", reservation);
      reservationsData.push(reservation);
    }
  });

  console.log("Total parsed reservations:", reservationsData.length);
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

  reservationsData.forEach(reservation => {
    const accommodation = reservation.accommodationFare;
    const pmc = accommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = accommodation - pmc;

    totalAccommodation += accommodation;
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

  reservationsData.forEach(reservation => {
    const accommodation = reservation.accommodationFare;
    const pmc = accommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = accommodation - pmc;
    const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);

    tbody.innerHTML += `
      <tr>
        <td>${reservation.confirmationCode}</td>
        <td>${reservation.platform}</td>
        <td>${formatDateDisplay(reservation.checkIn)}</td>
        <td>${formatDateDisplay(reservation.checkOut)}</td>
        <td>${formatMoney(accommodation)}</td>
        <td>${formatMoney(pmc)}</td>
        <td>${formatMoney(ownerPayout)}</td>
        <td>${expectedPayoutDate}</td>
      </tr>
    `;
  });
}

// Auto-load on page load
document.addEventListener('DOMContentLoaded', () => {
  const loginBox = document.getElementById("loginBox");
  const ownerPortal = document.getElementById("ownerPortal");
  
  if (loginBox) loginBox.style.display = "none";
  if (ownerPortal) ownerPortal.style.display = "block";
  
  document.getElementById("portalTitle").textContent = `${currentOwner.ownerName} Statement`;
  loadOwnerReport();
});
