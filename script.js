// === OWNER CONFIGURATION ===
const OWNERS = {
  "ti3155@yahoo.com": {
    password: "1234",
    ownerName: "ZACK TEST",
    propertyName: "1463 Basin Trail, Murrells Inlet, SC 29576",
    postalCode: "29576",
    pmcPercent: 12,
    guestyApiKey: "1a58fc1af3815f9023a08e09c590a05f3f3d1c73dbc3ab2e19985ecfe0003aa87acc7e264983e31d5b10a98cf4fd9b4789de3cb864daf2031e42aae6266c92f5",
    cleaningFee: 250
  }
};

let currentOwner = OWNERS["ti3155@yahoo.com"];
let reservationsData = [];

// === EMAILJS CONFIGURATION ===
const EMAILJS_USER_ID = "ti3155";
const EMAILJS_SERVICE_ID = "service_06c56l2";
const EMAILJS_TEMPLATE_ID = "template_91j57r4";

// === INIT EMAILJS (safe check) ===
(function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init(EMAILJS_USER_ID);
  }
})();

// === HELPER: Deep Property Getter ===
function pickDeep(obj, ...paths) {
  for (const path of paths) {
    if (!obj) continue;
    const parts = path.split(".");
    let value = obj;
    for (const part of parts) {
      value = value?.[part];
      if (value === undefined) break;
    }
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

// === GENERIC GETTERS ===
function pickText(...args) {
  for (const v of args) {
    if (v == null) continue;
    if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v).trim();
    if (Array.isArray(v)) return v.map(pickText).filter(Boolean).join(", ");
    if (typeof v === "object") {
      const candidates = [
        v.value, v.children, v.label, v.name, v.text, v.code, v.title, v.displayName, v.nickname, v.id, v._id
      ];
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

function pickDate(...args) {
  for (const v of args) {
    if (v == null) continue;
    if (typeof v === "string" || typeof v === "number") return String(v).trim();
    if (Array.isArray(v) && v.length) return pickDate(v[0]);
    if (typeof v === "object") {
      const candidates = [v.value, v.date, v.iso, v.children, v.startDate, v.endDate];
      for (const item of candidates) {
        if (item != null && typeof item !== "object") return String(item).trim();
      }
    }
  }
  return "";
}

// === WEATHER DISPLAY ===
function renderWeather(zip) {
  const apiKey = "301c3846b1ed5b804976f73bd010175a";
  const weatherBox = document.getElementById("weatherBox");
  if (!zip || !weatherBox) return;
  weatherBox.innerHTML = '<div class="weather-loading">Loading weather...</div>';

  fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip},US&appid=${apiKey}&units=imperial`)
    .then(res => res.json())
    .then(data => {
      if (!data.list || !data.city) throw new Error("Weather unavailable");

      const daily = {};
      data.list.forEach(item => {
        const day = item.dt_txt.split(" ")[0];
        const hour = item.dt_txt.split(" ")[1];
        if (!daily[day] && (hour === "12:00:00" || hour === "15:00:00" || hour === "09:00:00")) {
          daily[day] = item;
        }
      });

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const forecast = Object.keys(daily)
        .filter(day => {
          const d = new Date(day);
          d.setHours(0, 0, 0, 0);
          return d >= today;
        })
        .slice(0, 5)
        .map(day => daily[day]);

      let html = '<div class="weather-forecast">';
      forecast.forEach(day => {
        const dateObj = new Date(day.dt_txt);
        html += `
          <div class="forecast-day">
            <div>${dateObj.toLocaleDateString("en-US", { weekday: "short" })}</div>
            <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" alt="">
            <div><b>${Math.round(day.main.temp)}°F</b></div>
            <div style="font-size:.95em;">${day.weather[0].main}</div>
          </div>
        `;
      });
      html += "</div>";
      weatherBox.innerHTML = html;
    })
    .catch(() => {
      weatherBox.innerHTML = `<div class="weather-box">Weather unavailable</div>`;
    });
}

// === SUMMARY VALUE FORMATTING ===
function formatMoney(v) { return `$${Number(v || 0).toFixed(2)}`; }
function toNumber(v) { return Number(String(v || 0).replace(/[$,]/g, "").trim()) || 0; }

// === MIN DATES ON MODAL FORM ===
function setDateFieldsMin() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;
  const checkIn = document.getElementById("checkInDate");
  const checkOut = document.getElementById("checkOutDate");
  if (checkIn) checkIn.setAttribute("min", minDate);
  if (checkOut) checkOut.setAttribute("min", minDate);
}

// === PAGE HEADER RENDER ===
function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function renderDashboardHeader() {
  const greeting = document.getElementById("greeting");
  const propertyAddress = document.getElementById("propertyAddress");
  if (greeting) greeting.innerText = `${getTimeBasedGreeting()} ${currentOwner.ownerName}`;
  if (propertyAddress) propertyAddress.innerText = currentOwner.propertyName;
  renderWeather(currentOwner.postalCode);
}

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

// === RESERVATIONS TABLE ===
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
    tbody.innerHTML += `
      <tr>
        <td>${reservation.confirmationCode || ""}</td>
        <td>${reservation.platform || ""}</td>
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

// === UTILITIES ===
function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr;
  return date.toLocaleDateString("en-US");
}
function getExpectedPayoutDate(checkOutDate) {
  const d = new Date(checkOutDate);
  if (isNaN(d)) return "";
  const payoutDate = new Date(d.getFullYear(), d.getMonth() + 1, 5);
  return payoutDate.toLocaleDateString("en-US");
}
function getCleaningFee() {
  return currentOwner.cleaningFee ? Number(currentOwner.cleaningFee) : 0;
}
function fillReservationDropdown() {
  const select = document.getElementById("reservationSelect");
  if (!select) return;
  select.innerHTML = "";
  reservationsData.forEach((res, i) => {
    select.innerHTML += `<option value="${i}">${res.confirmationCode || ""} (${res.platform || ""}, ${res.checkIn || ""} - ${res.checkOut || ""})</option>`;
  });
}

// === GUESTY RESERVATION MAPPING LOGIC WITH ACCOMMODATION FORMULA & STATUS ===
function mapGuestyReservation(r) {
  // baseAccommodation
  const baseAccommodation = pickNumber(
    r["ACCOMMODATION FARE"], r["fareAccommodation"], r["money.fareAccommodation"],
    r.accommodationFare, r.fareAccommodation, pickDeep(r, "money.fareAccommodation.value")
  );
  // markup
  const markup = pickNumber(
    r.markupAmount, r.markup, r["MARKUP"], r["money.markup"],
    pickDeep(r, "money.markup.value"), pickDeep(r, "markup.value")
  );
  // lengthOfStayDiscount
  const lengthOfStayDiscount = pickNumber(
    r.lengthOfStayDiscount, r.lengthOfStayDiscountAmount, r["LENGTH OF STAY DISCOUNT"],
    r["money.lengthOfStayDiscount"], pickDeep(r, "money.lengthOfStayDiscount.value"),
    pickDeep(r, "lengthOfStayDiscount.value")
  );
  // accommodation net calculation
  const calculatedAccommodation = baseAccommodation - markup - lengthOfStayDiscount;

  return {
    status: pickText(
      r.status, r.reservationStatus, r["STATUS"], r["reservationStatus"]
    ),
    listingNickname: pickText(
      r["LISTING'S NICKNAME"], r["listing.nickname"], r.listingNickname, r.listing?.nickname, r.listing
    ),
    platform: pickText(
      r["PLATFORM"], r["integration.platform"], r.platform, r.integration?.platform, r.integration
    ),
    confirmationCode: pickText(
      r["CONFIRMATION CODE"], r.confirmationCode, r.code, r.reservationCode
    ),
    checkIn: pickDate(
      r["CHECK-IN DATE"], r.checkInDate, r.checkIn, r.startDate
    ),
    checkOut: pickDate(
      r["CHECK-OUT DATE"], r.checkOutDate, r.checkOut, r.endDate
    ),
    totalPayout: pickNumber(
      r["TOTAL PAYOUT"], r["money.hostPayout"], r.hostPayout, r.totalPayout
    ),
    accommodationFare: calculatedAccommodation,
    // Optionally, keep for debugging:
    baseAccommodation,
    markup,
    lengthOfStayDiscount
  };
}

// === FILTER & LOAD RESERVATIONS ===
function loadOwnerReport() {
  if (!currentOwner || !currentOwner.guestyApiKey) {
    console.error("No owner or API key configured");
    reservationsData = [];
    renderDashboardHeader();
    renderSummaryBoxes();
    renderReservationsTable();
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
      reservationsData = rows
        .map(mapGuestyReservation)
        .filter(res => {
          const status = String(res.status || '').toLowerCase();
          return status !== 'cancel' && status !== 'cancelled' && status !== 'canceled';
        });
      renderDashboardHeader();
      renderSummaryBoxes();
      renderReservationsTable();
    })
    .catch(err => {
      console.error("Error loading report:", err);
      reservationsData = [];
      renderDashboardHeader();
      renderSummaryBoxes();
      renderReservationsTable();
    });
}

// === CONTACT MODAL & EMAILJS ETC (no change needed) ===
// ... your modal + emailjs code goes here (unchanged) ...

// === LOAD ON DOM READY ===
document.addEventListener("DOMContentLoaded", () => {
  loadOwnerReport();
  // ...modal etc init as before...
});
