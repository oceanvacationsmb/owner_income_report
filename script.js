const OWNERS = {
  "owner1@email.com": {
    password: "1234",
    ownerName: "John Smith",
    propertyName: "Ocean View Condo",
    pmcPercent: 20,
    salesCommissionPercent: 0,
    guestyReportUrl: "PASTE_GUESTY_REPORT_URL_HERE"
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
  let totalCleaning = 0;
  let totalPayout = 0;

  csvData.forEach(r => {
    totalAccommodation += toNumber(r["ACCOMMODATION FARE"]);
    totalCleaning += toNumber(r["CLEANING FARE"]);
    totalPayout += toNumber(r["TOTAL PAYOUT"]);
  });

  const pmcFee = totalAccommodation * (currentOwner.pmcPercent / 100);
  const ownerNet = totalAccommodation - pmcFee;

  document.getElementById("summary").innerHTML = `
    <div><strong>Owner:</strong> ${currentOwner.ownerName}</div>
    <div><strong>Property:</strong> ${currentOwner.propertyName}</div>
    <div><strong>Total Accommodation:</strong> $${totalAccommodation.toFixed(2)}</div>
    <div><strong>Total Cleaning:</strong> $${totalCleaning.toFixed(2)}</div>
    <div><strong>Total Payout:</strong> $${totalPayout.toFixed(2)}</div>
    <div><strong>PMC (${currentOwner.pmcPercent}%):</strong> $${pmcFee.toFixed(2)}</div>
    <div><strong>Estimated Owner Net:</strong> $${ownerNet.toFixed(2)}</div>
  `;

  renderReservationsTable();
}

function renderReservationsTable() {
  const tbody = document.getElementById("reservationsBody");

  tbody.innerHTML = csvData.map(r => {
    const code = r["CODE"] || "";
    const checkIn = r["CHECK-IN DATE"] || "";
    const checkOut = r["CHECK-OUT DATE"] || "";
    const platform = r["PLATFORM"] || "";
    const accommodation = toNumber(r["ACCOMMODATION FARE"]).toFixed(2);
    const cleaning = toNumber(r["CLEANING FARE"]).toFixed(2);
    const payout = toNumber(r["TOTAL PAYOUT"]).toFixed(2);

    return `
      <tr>
        <td>${code}</td>
        <td>${checkIn}</td>
        <td>${checkOut}</td>
        <td>${platform}</td>
        <td>$${accommodation}</td>
        <td>$${cleaning}</td>
        <td>$${payout}</td>
      </tr>
    `;
  }).join("");
}
