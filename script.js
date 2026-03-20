const OWNERS = {
  "ti3155@yahoo.com": {
    password: "1234",
    ownerName: "ZACK TEST",
    propertyName: "1463 Basin Trail, Murrells Inlet, SC 29576",
    postalCode: "29576",
    pmcPercent: 12,
    guestyReportUrl: "https://report.guesty.com/apps/reservations?apiKey=1a58fc1af3815f9023a08e09c590a05f3f3d1c73dbc3ab2e19985ecfe0003aa87acc7e264983e31d5b10a98cf4fd9b4789de3cb864daf2031e42aae6266c92f5",
    cleaningFee: 250
  }
};

let currentOwner = OWNERS["ti3155@yahoo.com"];
let reservationsData = [];

// ====== FILLED IN WITH YOUR EMAILJS INFO ======
const EMAILJS_USER_ID = "RVbPQAAmTWI11KaIk";
const EMAILJS_SERVICE_ID = "service_06c56l2";
const EMAILJS_TEMPLATE_ID = "template_91j57r4";
// ==============================================
(function(){
  emailjs.init(EMAILJS_USER_ID);
})();

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

// --------- WEATHER 5-DAY FORECAST ---------
// This will use free OWM 5-day/3-hour forecast and pick "midday" (12:00) for each day
function renderWeather(zip) {
  const apiKey = "301c3846b1ed5b804976f73bd010175a"; // <<-- your OWM key!
  const weatherBox = document.getElementById("weatherBox");
  if (!zip || !weatherBox) {
    console.log('No zip or no weatherBox found');
    return;
  }
  weatherBox.innerHTML = '<div class="weather-loading">Loading weather...</div>';

  fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip},US&appid=${apiKey}&units=imperial`)
    .then(res => res.json())
    .then(data => {
      if (!data.list || !data.city) throw new Error("Weather unavailable");
      let daily = {};
      data.list.forEach(item => {
        const day = item.dt_txt.split(' ')[0];
        const hour = item.dt_txt.split(' ')[1];
        if (!daily[day] && (hour === "12:00:00" || hour === "15:00:00" || hour === "09:00:00")) {
          daily[day] = item;
        }
      });
      const today = new Date();
      let forecast = Object.keys(daily)
        .filter(day => new Date(day) > today)
        .slice(0, 5)
        .map(day => daily[day]);
      let html = '<div class="weather-forecast">';
      forecast.forEach(day => {
        const dateObj = new Date(day.dt_txt);
        html += `
          <div class="forecast-day">
            <div>${dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="">
            <div><b>${Math.round(day.main.temp)}°F</b></div>
            <div style="font-size: .95em;">${day.weather[0].main}</div>
          </div>
        `;
      });
      html += '</div>';
      weatherBox.innerHTML = html;
    })
    .catch((err) => {
      weatherBox.innerHTML = `<div class="weather-box">Weather unavailable</div>`;
      console.log('Weather Fetch Error:', err);
    });
}

// --------- SUMMARY BOXES ---------
function formatMoney(v) {
  return `$${Number(v || 0).toFixed(2)}`;
}
function toNumber(v) {
  return Number(String(v || 0).replace(/[$,]/g, "").trim()) || 0;
}

// --------- DATE FIELDS: Only allow selection from tomorrow forward ---------
function setDateFieldsMin() {
  const now = new Date();
  now.setDate(now.getDate() + 1); // tomorrow
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const minDate = `${yyyy}-${mm}-${dd}`;
  const checkIn = document.getElementById('checkInDate');
  const checkOut = document.getElementById('checkOutDate');
  if (checkIn) checkIn.setAttribute('min', minDate);
  if (checkOut) checkOut.setAttribute('min', minDate);
}

function renderDashboardHeader() {
  document.getElementById("greeting").innerText = `${getTimeBasedGreeting()} ${currentOwner.ownerName}`;
  document.getElementById("propertyAddress").innerText = currentOwner.propertyName;
  renderWeather(currentOwner.postalCode);
}

function renderSummaryBoxes() {
  let totalAccommodation = 0, totalPMC = 0, totalOwnerPayout = 0;
  reservationsData.forEach(reservation => {
    const accommodation = reservation.accommodationFare;
    const pmc = accommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = accommodation - pmc;
    totalAccommodation += accommodation;
    totalPMC += pmc;
    totalOwnerPayout += ownerPayout;
  });

  document.getElementById("summaryBoxes").innerHTML = `
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

document.addEventListener('DOMContentLoaded', () => {
  loadOwnerReport();

  // Header logic
  document.getElementById('openRequestBox').onclick = () => {
    document.getElementById('requestModal').style.display = 'block';
    document.getElementById('ownerReqStatus').innerText = '';
    fillReservationDropdown();
    setDateFieldsMin();
  };

  // Modal handlers
  document.getElementById('closeModal').onclick = () => {
    document.getElementById('requestModal').style.display = 'none';
  };
  window.onclick = function(e) {
    if (e.target == document.getElementById('requestModal')) {
      document.getElementById('requestModal').style.display = "none";
    }
  };

  document.getElementById('subject').addEventListener('change', function () {
    const showDates = this.value === 'Request Owner Stay';
    document.getElementById('dateFields').style.display = showDates ? '' : 'none';
    document.getElementById('reservationField').style.display = this.value === 'Inquiry about Reservation' ? '' : 'none';
    document.getElementById('cleaningAgreement').innerHTML = showDates
      ? `<div><b>Cleaning Fee:</b> $${getCleaningFee().toFixed(2)}<br><label><input type="checkbox" required name="agreeClean" id="agreeClean"> I agree to pay cleaning fee</label></div>`
      : '';
    if (showDates) setDateFieldsMin();
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

// ------- INITIAL DATA LOAD -------
function loadOwnerReport() {
  if (!currentOwner || !currentOwner.guestyReportUrl) {
    console.error("No owner or URL configured");
    return;
  }

  fetch(currentOwner.guestyReportUrl)
    .then(r => r.text())
    .then(html => {
      parseGuestyTable(html);
      renderDashboardHeader();
      renderSummaryBoxes();
      renderReservationsTable();
    })
    .catch(err => {
      console.error("❌ Error loading report:", err);
      reservationsData = [];
      renderDashboardHeader();
      renderSummaryBoxes();
      renderReservationsTable();
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
