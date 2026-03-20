const OWNERS = {
  "ti3155@yahoo.com": {
    password: "1234",
    ownerName: "ZACK TEST",
    propertyName: "1463 Wild Iris Dr.",
    postalCode: "29576",
    pmcPercent: 20,
    guestyReportUrl: "https://report.guesty.com/apps/reservations?apiKey=1a58fc1af3815f9023a08e09c590a05f3f3d1c73dbc3ab2e19985ecfe0003aa87acc7e264983e31d5b10a98cf4fd9b4789de3cb864daf2031e42aae6266c92f5",
    cleaningFee: 250
  }
};

let currentOwner = OWNERS["ti3155@yahoo.com"];
let reservationsData = [];

// ====== REPLACE THESE IDS WITH YOUR EMAILJS ACCOUNT'S IDS ======
// Find these in EmailJS > Integration (user ID), Services, Templates
const EMAILJS_USER_ID = "ti3155";
const EMAILJS_SERVICE_ID = "service_06c56l2";
const EMAILJS_TEMPLATE_ID = "template_91j57r4";
// ===============================================================
(function(){
  emailjs.init(EMAILJS_USER_ID);
})();

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// ------- WEATHER (with debug logging) -------
function renderWeather(zip) {
  const apiKey = "301c3846b1ed5b804976f73bd010175a"; // ← your OpenWeatherMap API key
  const weatherBox = document.getElementById("weatherBox");
  if (!zip || !weatherBox) {
    console.log('No zip or no weatherBox found');
    return;
  }
  weatherBox.innerHTML = '<div class="weather-loading">Loading weather...</div>';
  fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},US&appid=${apiKey}&units=imperial`)
    .then(res => res.json())
    .then(data => {
      console.log('Weather API Response:', data);
      if (data.cod !== 200) throw new Error(data.message || "Weather unavailable");
      weatherBox.innerHTML = `
        <div class="weather-box">
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="">
          <span><b>${Math.round(data.main.temp)}°F</b>, ${data.weather[0].main}</span>
        </div>
      `;
    })
    .catch((err) => {
      console.log('Weather Fetch Error:', err);
      weatherBox.innerHTML = `<div class="weather-box">Weather unavailable</div>`;
    });
}

// ------- OWNER DASHBOARD -------
function formatMoney(v) {
  return `$${Number(v || 0).toFixed(2)}`;
}
function toNumber(v) {
  return Number(String(v || 0).replace(/[$,]/g, "").trim()) || 0;
}
function renderOwnerDashboard() {
  let totalAccommodation = 0, totalPMC = 0, totalOwnerPayout = 0;
  reservationsData.forEach(reservation => {
    const accommodation = reservation.accommodationFare;
    const pmc = accommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = accommodation - pmc;
    totalAccommodation += accommodation;
    totalPMC += pmc;
    totalOwnerPayout += ownerPayout;
  });

  document.getElementById("summary").innerHTML = `
    <div class="owner-header-flex">
      <div class="left">
        <h2>${getTimeBasedGreeting()} ${currentOwner.ownerName}</h2>
        <div class="property-address">${currentOwner.propertyName}</div>
      </div>
      <div class="top-right-tools">
        <div id="weatherBox"></div>
        <button id="openRequestBox" class="request-btn">Contact Management / Request</button>
      </div>
    </div>
    <div class="summary-boxes">
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
    </div>
  `;
  renderWeather(currentOwner.postalCode);
  renderReservationsTable();

  // Re-attach button event (since it's rebuilt each time)
  document.getElementById('openRequestBox').onclick = () => {
    document.getElementById('requestModal').style.display = 'block';
    document.getElementById('ownerReqStatus').innerText = '';
    fillReservationDropdown();
  };
}

// ------- RESERVATION TABLE -------
function renderReservationsTable() {
  const tbody = document.getElementById("reservationsBody");
  tbody.innerHTML = "";
  reservationsData.forEach((reservation, idx) => {
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

// ------- UTILITIES -------
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

// ------- CONTACT MODAL/EMAILJS HANDLING -------
function getCleaningFee() {
  return currentOwner.cleaningFee ? Number(currentOwner.cleaningFee) : 0;
}
function fillReservationDropdown() {
  const select = document.getElementById("reservationSelect");
  select.innerHTML = '';
  reservationsData.forEach((res, i) => {
    select.innerHTML += `<option value="${i}">${res.confirmationCode} (${res.platform}, ${res.checkIn} - ${res.checkOut})</option>`;
  });
}

// Setup modal logic and EmailJS handler
document.addEventListener('DOMContentLoaded', () => {
  loadOwnerReport();

  // Modal handlers
  document.getElementById('closeModal').onclick = () => {
    document.getElementById('requestModal').style.display = 'none';
  };
  window.onclick = function(e) {
    if (e.target == document.getElementById('requestModal')) {
      document.getElementById('requestModal').style.display = "none";
    }
  };

  // Subject logic
  document.getElementById('subject').addEventListener('change', function() {
    const showDates = this.value === 'Request Owner Stay';
    const showRes = this.value === 'Inquiry about Reservation';
    document.getElementById('dateFields').style.display = showDates ? '' : 'none';
    document.getElementById('reservationField').style.display = showRes ? '' : 'none';

    // Cleaning Fee agreement for Owner Stay
    document.getElementById('cleaningAgreement').innerHTML = showDates
      ? `<div><b>Cleaning Fee:</b> $${getCleaningFee().toFixed(2)}<br><label><input type="checkbox" required name="agreeClean" id="agreeClean"> I agree to pay cleaning fee</label></div>`
      : '';
  });

  // Form submit handler
  document.getElementById('ownerRequestForm').onsubmit = function(e) {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    let message = `Owner: ${currentOwner.ownerName}\nProperty: ${currentOwner.propertyName}\nSubject: ${subject}`;
    let valid = true;
    if(subject === "Request Owner Stay") {
      const inDate = document.getElementById('checkInDate').value;
      const outDate = document.getElementById('checkOutDate').value;
      if(!inDate || !outDate) valid = false;
      if(!document.getElementById('agreeClean').checked) valid = false;
      message += `\nRequested Stay: ${inDate} - ${outDate}\nCleaning Fee: $${getCleaningFee().toFixed(2)} (Agreed: Yes)`;
    }
    if(subject === "Inquiry about Reservation") {
      const idx = document.getElementById('reservationSelect').value;
      const res = reservationsData[idx];
      message += `\nInquiry Reservation: ${res.confirmationCode}, ${res.platform}, ${res.checkIn} - ${res.checkOut}`;
    }
    const info = document.getElementById('extraInfo').value;
    message += `\nInfo/Notes: ${info}`;
    if(!subject || !valid) { document.getElementById('ownerReqStatus').innerText = "Please fill all required fields."; return; }
    // ---- Send email via EmailJS ----
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      from_name: currentOwner.ownerName,
      from_email: "portal@oceanvacations.com",
      message: message,
      to_email: "oceanvacationsmb@gmail.com"
    }).then(() => {
      document.getElementById('ownerReqStatus').innerText = "Request sent successfully!";
      this.reset();
    }, () => {
      document.getElementById('ownerReqStatus').innerText = "Failed to send. Please try again.";
    });
  };
});

// ------- GUESTY REPORT LOAD -------
function loadOwnerReport() {
  if (!currentOwner || !currentOwner.guestyReportUrl) {
    console.error("No owner or URL configured");
    return;
  }

  fetch(currentOwner.guestyReportUrl)
    .then(r => r.text())
    .then(html => {
      parseGuestyTable(html);
      renderOwnerDashboard();
    })
    .catch(err => {
      console.error("❌ Error loading report:", err);
      reservationsData = [];
      renderOwnerDashboard();
    });
}
function parseGuestyTable(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const rows = doc.querySelectorAll('table tbody tr');
  reservationsData = [];

  rows.forEach(row => {
    const cells = row.querySelectorAll('td');
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
      reservationsData.push(reservation);
    }
  });
}
