// ========== Demo Owners and Data ==========
const OWNERS = {
  "owner@example.com": { password: "test123", ownerName: "Susan", propertyName: "Waveside Retreat" },
  // Add more...
};

// Fallback/reservations data structure example (REPLACE WITH YOUR FETCH OR API)
let reservationsData = [
  // {
  //   code: "ABC123",
  //   platform: "Airbnb",
  //   checkIn: "2024-07-01",
  //   checkOut: "2024-07-05",
  //   accommodation: "Waveside Retreat",
  //   pmc: "Jane",
  //   ownerPayout: 1200,
  //   expectedPayout: 1500,
  //   isOwner: false,
  //   cleaningFee: 120
  // }
];
let ownerStayData = [];
let currentOwner = null;

// ========== LOGIN HANDLER ==========
document.addEventListener("DOMContentLoaded", function () {
  const loginBox = document.getElementById("loginBox");
  const portal = document.getElementById("ownerPortal");
  const loginBtn = document.getElementById("loginBtn");
  const showPwd = document.getElementById("showPwd");
  const ownerPwd = document.getElementById("ownerPassword");

  // Show login box at start
  if (loginBox) loginBox.style.display = 'flex';
  if (portal) portal.style.display = 'none';

  // Show/hide password functionality
  if (showPwd && ownerPwd) {
    showPwd.onclick = function () {
      ownerPwd.type = ownerPwd.type === 'password' ? 'text' : 'password';
      showPwd.style.color = ownerPwd.type === 'text' ? '#3282b8' : '#aaa';
    };
  }

  loginBtn.onclick = function () {
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
    if (loginBox) loginBox.style.display = 'none';
    if (portal) portal.style.display = '';

    // Simulate load (replace this call with your actual data loading)
    loadOwnerReport();
  };
});

// ========== LOAD & RENDER MAIN PORTAL ==========
function loadOwnerReport() {
  // Simulate data loading; use your fetch/XHR here!
  // Example: fetch('your-api').then(r => r.json()).then(payload => { ... });

  // Here we use the global reservationsData for demonstration.
  // --- Split data into reservations vs. owner stays:
  ownerStayData = reservationsData.filter(r => r.isOwner);
  const normalReservations = reservationsData.filter(r => !r.isOwner);

  renderGreetingAndAddress();
  renderSummaryBoxes(normalReservations);
  renderReservationsTable(normalReservations);
  renderOwnerStayTable(ownerStayData);
  renderOwnerCleaningFeeSummary(ownerStayData);
  renderMonthPieChart(); // optional (has no effect if Chart.js/HTML not present)
}

// ========== GREETING ==========
function renderGreetingAndAddress() {
  const greeting = document.getElementById('greeting');
  const propertyAddress = document.getElementById('propertyAddress');
  let greet = "Welcome";
  if (!currentOwner) {
    greet = "Welcome";
  } else if (currentOwner.ownerName) {
    greet = `Good evening`;
  }
  if (greeting) greeting.innerText = `${greet}, ${currentOwner ? currentOwner.ownerName : ''}`;
  if (propertyAddress) propertyAddress.innerText = currentOwner ? currentOwner.propertyName : '';
}

// ========== SUMMARY BOXES ==========
function renderSummaryBoxes(normalReservations) {
  const box = document.getElementById('summaryBoxes');
  if (!box) return;
  // Example: total reservations, total payout etc.
  const total = normalReservations.length;
  const revenue = normalReservations.reduce((a, r) => a + (Number(r.ownerPayout) || 0), 0);

  box.innerHTML = `
    <div class="summary-box">
      <div class="summary-label">Total Reservations</div>
      <div class="summary-value">${total}</div>
    </div>
    <div class="summary-box">
      <div class="summary-label">Owner Payout</div>
      <div class="summary-value">$${revenue.toLocaleString()}</div>
    </div>
  `;
}

// ========== MAIN RESERVATIONS TABLE ==========
function renderReservationsTable(normalReservations) {
  const body = document.getElementById('reservationsBody');
  if (!body) return;
  if (!normalReservations.length) {
    body.innerHTML = `<tr><td colspan="8" style="text-align:center;">No reservations found.</td></tr>`;
    return;
  }
  body.innerHTML = normalReservations.map(r => `
    <tr>
      <td>${r.code || ""}</td>
      <td>${r.platform || ""}</td>
      <td>${r.checkIn || ""}</td>
      <td>${r.checkOut || ""}</td>
      <td>${r.accommodation || ""}</td>
      <td>${r.pmc || ""}</td>
      <td>${r.ownerPayout ? "$" + Number(r.ownerPayout).toLocaleString() : ""}</td>
      <td>${r.expectedPayout ? "$" + Number(r.expectedPayout).toLocaleString() : ""}</td>
    </tr>
  `).join("");
}

// ========== OWNER STAY TABLE ==========
function renderOwnerStayTable(ownerStays) {
  const body = document.getElementById('ownerStaysBody');
  if (!body) return;
  if (!ownerStays.length) {
    body.innerHTML = `<tr><td colspan="4" style="text-align:center;">No owner stays found.</td></tr>`;
    return;
  }
  body.innerHTML = ownerStays.map(r => `
    <tr>
      <td>${r.checkIn || ""}</td>
      <td>${r.checkOut || ""}</td>
      <td>${r.accommodation || ""}</td>
      <td>${r.cleaningFee ? "$" + Number(r.cleaningFee).toLocaleString() : ""}</td>
    </tr>
  `).join("");
}

// ========== OWNER CLEANING FEE SUMMARY ==========
function renderOwnerCleaningFeeSummary(ownerStays) {
  const box = document.getElementById('ownerCleaningFeeSummary');
  if (!box) return;
  if (!ownerStays.length) {
    box.innerHTML = `<div class="summary-box">
      <div class="summary-label">Owner Stay Cleaning Fees</div>
      <div class="summary-value">$0</div>
    </div>`;
    return;
  }
  const totalFee = ownerStays.reduce((a,r) => a + (Number(r.cleaningFee) || 0), 0);
  box.innerHTML = `
    <div class="summary-box">
      <div class="summary-label">Owner Stay Cleaning Fees</div>
      <div class="summary-value">$${totalFee.toLocaleString()}</div>
    </div>
  `;
}

// ========== PIE CHART (optional) ==========
function renderMonthPieChart() {
  if (!window.Chart) return;
  const ctx = document.getElementById('monthPieChart');
  if (!ctx) return;
  // Pie chart for reservations by month (all reservations)
  let monthCounts = {};
  reservationsData.forEach(reservation => {
    if (!reservation.checkIn) return;
    const date = new Date(reservation.checkIn);
    if (isNaN(date)) return;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    monthCounts[key] = (monthCounts[key] || 0) + 1;
  });

  const sortedKeys = Object.keys(monthCounts).sort();
  const labels = sortedKeys.map(yyyymm => {
    const [year, month] = yyyymm.split("-");
    return `${new Date(year, month-1).toLocaleString('en-US', { month: 'short' })} ${year}`;
  });
  const data = sortedKeys.map(m => monthCounts[m]);

  if (window.monthPieChartInstance) window.monthPieChartInstance.destroy();
  window.monthPieChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels.length ? labels : ['No Data'],
      datasets: [{
        data: data.length ? data : [1],
        backgroundColor: [
          '#3282b8', '#bbe1fa', '#56cc9d', '#ffb347', '#ff7473', '#9b59b6',
          '#45b6fe', '#f67280', '#edd2cb', '#6c7a89', '#f8b195', '#f7cac9'
        ],
      }]
    },
    options: {
      plugins: {
        legend: { display: true, position: 'bottom' },
        title: { display: true, text: 'Reservations by Month', font: { size: 16 } }
      }
    }
  });
}

// ========== DEMO DATA LOAD (REMOVE for production) ==========
document.addEventListener("DOMContentLoaded", function () {
  // Only for demo -- replace with your fetch/API call!
  reservationsData = [
    { code: "R101", platform: "Airbnb", checkIn: "2024-08-01", checkOut: "2024-08-05", accommodation: "Waveside", pmc: "Jane", ownerPayout: 1200, expectedPayout: 1400, isOwner: false, cleaningFee: 120 },
    { code: "OWNSTAY1", platform: "", checkIn: "2024-09-08", checkOut: "2024-09-11", accommodation: "Waveside", pmc: "", ownerPayout: 0, expectedPayout: 0, isOwner: true, cleaningFee: 90 },
    { code: "R102", platform: "VRBO", checkIn: "2024-09-12", checkOut: "2024-09-15", accommodation: "Waveside", pmc: "Sara", ownerPayout: 900, expectedPayout: 900, isOwner: false, cleaningFee: 105 },
    { code: "OWNSTAY2", platform: "", checkIn: "2024-10-01", checkOut: "2024-10-07", accommodation: "Waveside", pmc: "", ownerPayout: 0, expectedPayout: 0, isOwner: true, cleaningFee: 80 },
  ];
});
