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

// === OWNER CONFIGURATION ===
const OWNERS = {
  "1463@yahoo.com": {
    password: "1234",
    ownerName: "Nicole",
    propertyName: "1463 Basin Trail, Murrells Inlet, SC 29576",
    postalCode: "29576",
    pmcPercent: 12,
    guestyApiKey: "1a58fc1af3815f9023a08e09c590a05f3f3d1c73dbc3ab2e19985ecfe0003aa87acc7e264983e31d5b10a98cf4fd9b4789de3cb864daf2031e42aae6266c92f5",
    cleaningFee: 250
  },
  "11315@yahoo.com": {
    password: "1234",
    ownerName: "Matt",
    propertyName: "113B 15th Avenue South, Surfside Beach SC 29575",
    postalCode: "29575",
    pmcPercent: 12,
    guestyApiKey: "bbbab438244300805daaf5485d3b516cbeee616fba7e640fc3b80d0b648c01d13e3f70a2bde2abaf9deb3b661aabf1c17453fd4e6d799f380cfd059df66cf01e",
    cleaningFee: 350
  },
  "11313@yahoo.com": {
    password: "1234",
    ownerName: "Carl",
    propertyName: "113B 13th Ave North. Surfside Beach SC 29575",
    postalCode: "29575",
    pmcPercent: 12,
    guestyApiKey: "d6ab951850fef54399e2206f36f4e79fb1b425a8e5c891076036b11f50da8870613a226021487307c8c5f51eae997a08dd7e112d013ef683728ad1d9220ee0b7",
    cleaningFee: 350
  },
};

let reservationsData = [];
let ownerStaysData = [];

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

// === GENERIC GETTERS & HELPERS ===
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

function formatMoney(v) {
  return `$${Number(v || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function toNumber(v) {
  return Number(String(v || 0).replace(/[$,]/g, "").trim()) || 0;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const [yyyy, mm, dd] = dateStr.split("-");
    return `${mm}/${dd}/${yyyy}`;
  }
  return dateStr;
}

function getExpectedPayoutDate(checkOutDate) {
  const d = new Date(checkOutDate);
  if (isNaN(d)) return "";
  const payoutDate = new Date(d.getFullYear(), d.getMonth() + 1, 5);
  const mm = String(payoutDate.getMonth() + 1).padStart(2, "0");
  const dd = String(payoutDate.getDate()).padStart(2, "0");
  const yyyy = payoutDate.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
}

function getCleaningFee() {
  function getNightCount(checkIn, checkOut) {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (isNaN(start) || isNaN(end)) return 0;
  const diffMs = end - start;
  return Math.round(diffMs / (1000 * 60 * 60 * 24));
}
  return currentOwner.cleaningFee ? Number(currentOwner.cleaningFee) : 0;
}

// === DASHBOARD + WEATHER ===
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

// === MODAL FORM ===
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

function mapGuestyReservation(r) {
  const baseAccommodation = pickNumber(r["money.fareAccommodation"]?.value);

  const markup = pickNumber(
    r["money.invoiceItems.MAR"]?.value
  );

  const lengthOfStayDiscount = 0;

  const calculatedAccommodation = baseAccommodation - markup + lengthOfStayDiscount;

  const sourceValue = pickText(
    r.source,
    r["source"],
    r["integration.source"],
    r.integration?.source,
    r.channel,
    r["channel"]
  );

  const totalPayoutValue = pickNumber(
    r["money.hostPayout"]?.value,
    r.hostPayout,
    r.totalPayout
  );

  const cleaningFareValue = pickNumber(
    r["money.fareCleaning"]?.value,
    r.money?.fareCleaning?.value,
    r.fareCleaning,
    r.cleaningFee
  );

  return {
    status: pickText(r.status, r.reservationStatus, r["STATUS"], r["reservationStatus"]),
    listingNickname: pickText(r["listing.nickname"], r.listingNickname, r.listing?.nickname, r.listing),
    platform: pickText(r["integration.platform"], r.platform, r.integration?.platform, r.integration),
    source: sourceValue,
    confirmationCode: (pickText(r["confirmationCode"], r.code, r.reservationCode) || "").toUpperCase(),
    checkIn: r["checkInDate"]?.value || "",
    checkOut: r["checkOutDate"]?.value || "",
    totalPayout: totalPayoutValue,
    cleaningFare: cleaningFareValue,
    accommodationFare: calculatedAccommodation,
    baseAccommodation,
    markup,
    lengthOfStayDiscount,
    guestName: pickText(r["guest.fullName"], r.guestName, r.guest?.fullName, r.guest, r["guest.name"])
  };
}

// === SUMMARY, TABLE, DROPDOWNS ===
function renderSummaryBoxes() {
  const summaryBoxes = document.getElementById("summaryBoxes");
  if (!summaryBoxes) return;

  let totalAccommodation = 0;
  let totalPMC = 0;
  let totalOwnerPayout = 0;

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

  const ownerCleaningFee = ownerStaysData.length * getCleaningFee();
  summaryBoxes.innerHTML += `
    <div class="summary-box" style="background:#e6f2ff;">
      <div class="summary-label">Owner Cleaning Fee</div>
      <div class="summary-value">${formatMoney(ownerCleaningFee)}</div>
    </div>
  `;

  summaryBoxes.style.textAlign = "center";
  summaryBoxes.style.display = "flex";
  summaryBoxes.style.justifyContent = "center";
}

/**
 * --- MAIN: Render reservations table and separate owner stays table right under it ---
 */
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
  } else {
    reservationsData.forEach(reservation => {
      const accommodation = toNumber(reservation.accommodationFare);
      const pmc = accommodation * (currentOwner.pmcPercent / 100);
      const ownerPayout = accommodation - pmc;
      const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);
      const nights = getNightCount(reservation.checkIn, reservation.checkOut);

      tbody.innerHTML += `
  <tr>
    <td>${reservation.confirmationCode || ""}</td>
    <td style="text-align:center;">${reservation.platform || ""}</td>
    <td style="text-align:center;">${formatDateDisplay(reservation.checkIn) || ""}</td>
    <td style="text-align:center;">${formatDateDisplay(reservation.checkOut) || ""}</td>
    <td style="text-align:center;">${nights}</td>
    <td style="text-align:center;">${formatMoney(accommodation)}</td>
    <td style="text-align:center;">${formatMoney(pmc)}</td>
    <td style="text-align:center;">${formatMoney(ownerPayout)}</td>
    <td style="text-align:center;">${expectedPayoutDate}</td>
  </tr>
`;
    });
  }

  let oldOwnerTable = document.getElementById("ownerStaysTable");
  if (oldOwnerTable && oldOwnerTable.parentNode) {
    oldOwnerTable.parentNode.removeChild(oldOwnerTable);
  }

  let oldVrboManualTable = document.getElementById("vrboManualTable");
  if (oldVrboManualTable && oldVrboManualTable.parentNode) {
    oldVrboManualTable.parentNode.removeChild(oldVrboManualTable);
  }

  if (ownerStaysData.length) {
    const tableWraps = document.getElementsByClassName("table-wrap");
    let container = null;

    if (tableWraps.length > 0) {
      container = tableWraps[0].parentNode;
    } else {
      container = document.body;
    }

    const ownerTable = document.createElement("div");
    ownerTable.id = "ownerStaysTable";
    ownerTable.innerHTML = `
      <h3 class="section-title" style="margin-top:40px; text-align:center;">Upcoming Owner Stays</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="text-align:center;">Check-In</th>
              <th style="text-align:center;">Check-Out</th>
              <th style="text-align:center;">Cleaning Fee</th>
            </tr>
          </thead>
          <tbody>
            ${ownerStaysData.map(res => `
              <tr>
                <td style="text-align:center;">${formatDateDisplay(res.checkIn || res.checkInDate || "")}</td>
                <td style="text-align:center;">${formatDateDisplay(res.checkOut || res.checkOutDate || "")}</td>
                <td style="text-align:center;">${formatMoney(getCleaningFee())}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `;

    if (tableWraps.length > 0 && tableWraps[0].parentNode) {
      if (tableWraps[0].nextSibling) {
        container.insertBefore(ownerTable, tableWraps[0].nextSibling);
      } else {
        container.appendChild(ownerTable);
      }
    } else {
      container.appendChild(ownerTable);
    }
  }

  const vrboManualRows = reservationsData.filter(res => {
    const source = String(res.source || "").toUpperCase();
    const payout = toNumber(res.totalPayout);
    return source === "MANUAL_VRBO" && payout > 0;
  });

  if (vrboManualRows.length) {
    const tableWraps = document.getElementsByClassName("table-wrap");
    let container = null;

    if (tableWraps.length > 0) {
      container = tableWraps[0].parentNode;
    } else {
      container = document.body;
    }

    const vrboManualTable = document.createElement("div");
    vrboManualTable.id = "vrboManualTable";
    vrboManualTable.innerHTML = `
  <div style="margin-top:40px; text-align:center;">
  <h3 class="section-title" style="margin:0;">Booking Channel Paid To Owner Bank Account</h3>
  <div style="font-size:14px; margin-top:6px;">(channel will process 3-5 business days after check-in)</div>
</div>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th style="text-align:center;">Platform</th>
          <th style="text-align:center;">Check-In</th>
          <th style="text-align:center;">Check-Out</th>
          <th style="text-align:center;">Nights</th>
          <th style="text-align:center;">Owner Paid by VRBO</th>
          <th style="text-align:center;">Accommodation</th>
          <th style="text-align:center;">Cleaning Fee</th>
          <th style="text-align:center;">PMC</th>
          <th style="text-align:center;">Due to Management</th>
        </tr>
      </thead>
      <tbody>
        ${vrboManualRows.map(reservation => {
          const accommodation = toNumber(reservation.accommodationFare);
          const cleaningFee = toNumber(reservation.cleaningFare);
          const pmc = accommodation * (currentOwner.pmcPercent / 100);
          const dueToManagement = cleaningFee + pmc;
          const ownerPaidByVrbo = toNumber(reservation.totalPayout);

          return `
            <tr>
              <td style="text-align:center;">VRBO</td>
              <td style="text-align:center;">${formatDateDisplay(reservation.checkIn) || ""}</td>
              <td style="text-align:center;">${formatDateDisplay(reservation.checkOut) || ""}</td>
              <td style="text-align:center;">${formatMoney(ownerPaidByVrbo)}</td>
              <td style="text-align:center;">${formatMoney(accommodation)}</td>
              <td style="text-align:center;">${formatMoney(cleaningFee)}</td>
              <td style="text-align:center;">${formatMoney(pmc)}</td>
              <td style="text-align:center;">${formatMoney(dueToManagement)}</td>
            </tr>
          `;
        }).join("")}
      </tbody>
    </table>
  </div>
`;

    container.appendChild(vrboManualTable);
  }
}

function fillReservationDropdown() {
  const select = document.getElementById("reservationSelect");
  if (!select) return;
  select.innerHTML = "";
  reservationsData.forEach((res, i) => {
    select.innerHTML += `<option value="${i}">${res.confirmationCode || ""} (${res.platform || ""}, ${res.checkIn || ""} - ${res.checkOut || ""})</option>`;
  });
}

// === LOAD AND FILTER RESERVATIONS ===
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
      const mappedRows = rows.map(mapGuestyReservation);

      ownerStaysData = mappedRows.filter(res =>
        String(res.guestName || res.guest_name || "").toUpperCase().includes("OWNER STAY") &&
        String(res.status || "").toLowerCase() !== "cancel" &&
        String(res.status || "").toLowerCase() !== "cancelled" &&
        String(res.status || "").toLowerCase() !== "canceled"
      );

      reservationsData = mappedRows.filter(res => {
        const status = String(res.status || "").toLowerCase();
        const isOwnerStay = String(res.guestName || res.guest_name || "").toUpperCase().includes("OWNER STAY");
        return !isOwnerStay &&
          status !== "cancel" &&
          status !== "cancelled" &&
          status !== "canceled" &&
          toNumber(res.accommodationFare) > 0;
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

// === CONTACT MODAL AND EMAILJS HANDLERS ===
// ... keep the rest of your unchanged code here
