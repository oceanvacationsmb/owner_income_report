const OWNERS = {
  "ti3155@yahoo.com": {
    password: "1234",
    ownerName: "ZACK TEST",
    propertyName: "1463 Wild Iris Dr.",
    pmcPercent: 12,
    salesCommissionPercent: 0,
    guestyReportUrl: "https://report.guesty.com/apps/reservations?apiKey=1a58fc1af3815f9023a08e09c590a05f3f3d1c73dbc3ab2e19985ecfe0003aa87acc7e264983e31d5b10a98cf4fd9b4789de3cb864daf2031e42aae6266c92f5"
  },

  "owner2@email.com": {
    password: "5678",
    ownerName: "Mary Jones",
    propertyName: "Beach House",
    pmcPercent: 15,
    salesCommissionPercent: 0,
    guestyReportUrl: "PASTE_GUESTY_REPORT_URL_HERE"
  }
};

let currentOwner = null;
let csvData = [];

function toNumber(v) {
  return Number(String(v || 0).replace(/[$,]/g, "").trim()) || 0;
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

      csvData = result.data;
      renderOwnerDashboard();
    })
    .catch(err => {
      console.error(err);
      alert("Could not load report");
    });
}

function renderOwnerDashboard() {
  let totalAccommodation = 0;
  let totalPayout = 0;

  csvData.forEach(r => {
    totalAccommodation += toNumber(r["ACCOMMODATION FARE"]);
   totalPayout += toNumber(r["TOTAL PAYOUT"]);
  });

  const pmcFee = totalAccommodation * (currentOwner.pmcPercent / 100);
  const ownerNet = totalAccommodation - pmcFee;

  document.getElementById("summary").innerHTML = `
    <div><strong>Owner:</strong> ${currentOwner.ownerName}</div>
    <div><strong>Property:</strong> ${currentOwner.propertyName}</div>
    <div><strong>Total Accommodation:</strong> $${totalAccommodation.toFixed(2)}</div>
    <div><strong>PMC (${currentOwner.pmcPercent}%):</strong> $${pmcFee.toFixed(2)}</div>
    <div><strong>Estimated Owner Net:</strong> $${ownerNet.toFixed(2)}</div>
  `;

  renderReservationsTable();
}

function renderReservationsTable() {
  const tbody = document.getElementById("reservationsBody");
  tbody.innerHTML = "";

  csvData.forEach(r => {
    const code = r["CODE"] || "";
    const platform = r["PLATFORM"] || "";
    const checkIn = r["CHECK-IN DATE"] || "";
    const checkOut = r["CHECK-OUT DATE"] || "";

    const accommodationFare = toNumber(r["ACCOMMODATION FARE"]);
    const markup = toNumber(r["MARKUP"]);
    const netAccommodation = accommodationFare - markup;
    const pmc = netAccommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = netAccommodation - pmc;
    const expectedPayoutDate = getExpectedPayoutDate(checkOut);

    tbody.innerHTML += `
      <tr>
        <td>${code}</td>
        <td>${platform}</td>
        <td>${checkIn}</td>
        <td>${checkOut}</td>
        <td>${formatMoney(netAccommodation)}</td>
        <td>${formatMoney(pmc)}</td>
        <td>${formatMoney(ownerPayout)}</td>
        <td>${expectedPayoutDate}</td>
      </tr>
    `;
  });
}
