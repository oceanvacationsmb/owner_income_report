
let currentOwner = null;
document.getElementById("loginBtn").onclick = function() {
  const email = (document.getElementById("ownerEmail").value || "").trim().toLowerCase();
  const pw = (document.getElementById("ownerPassword").value || "");
  const loginStatus = document.getElementById("loginStatus");

  // Admin login
  if (email === "admin" && pw === "05960596") {
    currentOwner = { admin: true, ownerName: "Administrator" };
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("ownerPortal").style.display = "";
    loginStatus.innerText = "";
    renderAdminPanel();
    return;
  }

  if (!OWNERS[email]) {
    loginStatus.innerText = "Email not found.";
    return;
  }

  if (OWNERS[email].password !== pw) {
    loginStatus.innerText = "Password incorrect.";
    return;
  }

  if (!OWNERS[email].viewMode) OWNERS[email].viewMode = "payout";

  currentOwner = OWNERS[email];
  document.getElementById("loginBox").style.display = "none";
  document.getElementById("ownerPortal").style.display = "";
  loginStatus.innerText = "";

  loadOwnerReport();
};

// === OWNER CONFIGURATION ===
const OWNERS = {
  "nwood112@gmail.com": {
    password: "owner4251$$",
    ownerName: "Nicole",
    propertyName: "1463 Basin Trail, Murrells Inlet, SC 29576",
    postalCode: "29576",
    pmcPercent: 12,
    guestyApiKey: "1a58fc1af3815f9023a08e09c590a05f3f3d1c73dbc3ab2e19985ecfe0003aa87acc7e264983e31d5b10a98cf4fd9b4789de3cb864daf2031e42aae6266c92f5",
    cleaningFee: 250,
    viewMode: "payout"
  },
  "mbiddington@aol.com": {
    password: "owner7511$$",
    ownerName: "Matthew",
    propertyName: "113B 15th Avenue South, Surfside Beach SC 29575",
    postalCode: "29575",
    pmcPercent: 12,
    guestyApiKey: "bbbab438244300805daaf5485d3b516cbeee616fba7e640fc3b80d0b648c01d13e3f70a2bde2abaf9deb3b661aabf1c17453fd4e6d799f380cfd059df66cf01e",
    cleaningFee: 350,
    viewMode: "payout"
  },
  "chrpfd@verizon.net": {
    password: "owner7491$$",
    ownerName: "Carl",
    propertyName: "113B 13th Ave North. Surfside Beach SC 29575",
    postalCode: "29575",
    pmcPercent: 12,
    guestyApiKey: "d6ab951850fef54399e2206f36f4e79fb1b425a8e5c891076036b11f50da8870613a226021487307c8c5f51eae997a08dd7e112d013ef683728ad1d9220ee0b7",
    cleaningFee: 350,
    viewMode: "payout"
  },
  "adahabani@gmail.com": {
    password: "owner2667$$",
    ownerName: "Assaf",
    propertyName: "469C White River Drive, Myrtle Beach SC 29577",
    postalCode: "29577",
    pmcPercent: 12,
    guestyApiKey: "cf0997316ba50ce76dc77eb8f00b10dd266167ccbe9462d205edea9215afb74a0038d0e73a05af9f858c3f626d54c1cf5f2e6e3b14107d533ce4af7994465781",
    cleaningFee: 150,
    viewMode: "payout"
  },
  "beachsmyles@gmail.com": {
    password: "owner2838$$",
    ownerName: "Chris",
    propertyName: "115C 15th Ave North. Surfside Beach SC 29575",
    postalCode: "29575",
    pmcPercent: 12,
    guestyApiKey: "0542d3c012e0c4bb62fe31f35ba940d1e7ee42da5c24e73cedc34d7fd794e256804ae48b3386d18beb91471e751355ca50ebef2512b865d769ea84debeba8ec7",
    cleaningFee: 350,
    viewMode: "payout"
  },
  "maron.eran@gmail.com": {
    password: "owner3507$$",
    ownerName: "Eran",
    propertyName: "",
    postalCode: "29575",
    pmcPercent: 12,
    guestyApiKey: "8a32863cba1cd5066ef2c40ddd064ccb591c4111d70c650b75bcff6f6bab955c7504394415775586795e2f7408cb61b12277841485f5dc0b65b22b32a31ce7c3",
    cleaningFee: 0,
    viewMode: "draft"
  },
  "liatedri18@gmail.com": {
    password: "owner6357$$",
    ownerName: "Liat",
    propertyName: "GHO REVOCABLE TRUST",
    postalCode: "29575",
    pmcPercent: 10,
    guestyApiKey: "05b79c86c4688c3409154f48ac9fde1fc59cc31c03126566cc8bfc55813fa89e01619ee48fd16a30476eb01ef6cb77ad9dbeca35b7ca188678462e8278c65022",
    cleaningFee: 0,
    viewMode: "payout"
  },
  "office@rodriguezlc.com": {
    password: "owner5574$$",
    ownerName: "Liat",
    propertyName: "2131 Sanibel Ct. Myrtle Beach SC 29577",
    postalCode: "29577",
    pmcPercent: 12,
    guestyApiKey: "e30ca84498f8e9ef64c9ff7ed2f0b40312a0e1df2a2e07044a86518a1233cd332d79595d24282bab03cf63c1d96b5237ba9ca14d35fd450c952b5f36f03eb5a1",
    cleaningFee: 300,
    viewMode: "payout"
  },
  "zilkerinvestments@gmail.com": {
    password: "owner7920$$",
    ownerName: "Tal Zilker - GTI Group LLC",
    propertyName: "214 2nd Ave S. North Myrtle Beach SC 29582",
    postalCode: "29582",
    pmcPercent: 12,
    guestyApiKey: "796af50d38fbbedbcec1df5bdd790355a574f67e21a823ba64f9a26cda86cc4d6d7c71552d7c02889a32557ed6185d44de44820881f74e128d66dacd57a70017",
    cleaningFee: 300,
    viewMode: "payout"
  },
  "kobiswisa26@gmail.com": {
    password: "owner9646$$",
    ownerName: "Kobi",
    propertyName: "508 3rd Avenue S. North Myrtle Beach SC 29582 unit 1-2",
    postalCode: "29582",
    pmcPercent: 15,
    guestyApiKey: "386c28f3e370968e7efe7e756ef8315d2eb420606a662909377be671d9e966c0271af42d1a8a61d5621646d6d5a2f59bc8e621743bd7fc4c5994d695b4c870e8",
    cleaningFee: 250,
    viewMode: "payout"
  },
  "tristate1391@gmail.com": {
    password: "owner6474$$",
    ownerName: "Suzan",
    propertyName: "1552 Elizabeth Ln. Myrtle Beach SC 29577",
    postalCode: "29577",
    pmcPercent: 15,
    guestyApiKey: "9512389c04f387d631c31f5eb901ae89d56d646ebe156166da68e78502c1c64d6a8bab54753942cc5be2ab33ce8523e5902e9ddfd24285efb4786c2de32225d6",
    cleaningFee: 200,
    viewMode: "payout"
  },
  "pleasechange@email.com": {
    password: "owner8589$$",
    ownerName: "Moran",
    propertyName: "4679 Wild Iris Drive Myrtle Beach SC 29577",
    postalCode: "29577",
    pmcPercent: 12,
    guestyApiKey: "22265c7b0f6a3a9ec499fe6571adaccc43bda8300ac343b0964ed4b0594856f376ef2593f8519135bf9d31be6c887e9fb68dd10cbfc8c0efe47ce2c91f626213",
    cleaningFee: 200,
    viewMode: "payout"
  }
};

let reservationsData = [];
let ownerStaysData = [];
let calendarCurrentDate = new Date();
let calendarResizeBound = false;

let filterYear = String(new Date().getFullYear());
let filterMonth = "all";

function getYearMonthFromDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return null;
  return {
    year: String(d.getFullYear()),
    month: String(d.getMonth() + 1).padStart(2, "0")
  };
}

function matchesFilters(dateStr) {
  const ym = getYearMonthFromDate(dateStr);
  if (!ym) return false;
  if (filterYear !== "all" && ym.year !== filterYear) return false;
  if (filterMonth !== "all" && ym.month !== filterMonth) return false;
  return true;
}

function getFilteredReservations() {
  return reservationsData.filter(r => matchesFilters(r.checkIn));
}

function getFilteredOwnerStays() {
  return ownerStaysData.filter(s => matchesFilters(s.checkIn || s.checkInDate));
}

function getUniqueYearsFromData() {
  const years = new Set();
  reservationsData.forEach(r => {
    const ym = getYearMonthFromDate(r.checkIn);
    if (ym) years.add(ym.year);
  });
  ownerStaysData.forEach(s => {
    const ym = getYearMonthFromDate(s.checkIn || s.checkInDate);
    if (ym) years.add(ym.year);
  });
  years.add(String(new Date().getFullYear()));
  return Array.from(years).sort((a, b) => Number(a) - Number(b));
}

function renderFilterControls() {
  const summaryBoxes = document.getElementById("summaryBoxes");
  if (!summaryBoxes) return;

  

  let wrap = document.getElementById("reportFiltersWrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "reportFiltersWrap";
    wrap.style.display = "flex";
    wrap.style.justifyContent = "center";
    wrap.style.gap = "12px";
    wrap.style.margin = "12px 0 18px 0";
    wrap.style.flexWrap = "wrap";
    summaryBoxes.parentNode.insertBefore(wrap, summaryBoxes);
  }

  const years = getUniqueYearsFromData();
  const monthOptions = [
    { v: "all", t: "All Months" },
    { v: "01", t: "January" },
    { v: "02", t: "February" },
    { v: "03", t: "March" },
    { v: "04", t: "April" },
    { v: "05", t: "May" },
    { v: "06", t: "June" },
    { v: "07", t: "July" },
    { v: "08", t: "August" },
    { v: "09", t: "September" },
    { v: "10", t: "October" },
    { v: "11", t: "November" },
    { v: "12", t: "December" }
  ];

  wrap.innerHTML = `
    <div style="display:flex; gap:8px; align-items:center;">
      <label for="yearFilterSelect" style="font-weight:700;">Year</label>
      <select id="yearFilterSelect" style="padding:6px 8px; border-radius:8px;">
        <option value="all">All Years</option>
        ${years.map(y => `<option value="${y}">${y}</option>`).join("")}
      </select>
    </div>
    <div style="display:flex; gap:8px; align-items:center;">
      <label for="monthFilterSelect" style="font-weight:700;">Month</label>
      <select id="monthFilterSelect" style="padding:6px 8px; border-radius:8px;">
        ${monthOptions.map(m => `<option value="${m.v}">${m.t}</option>`).join("")}
      </select>
    </div>
  `;

  const yearSelect = document.getElementById("yearFilterSelect");
  const monthSelect = document.getElementById("monthFilterSelect");

  yearSelect.value = filterYear;
  monthSelect.value = filterMonth;

  yearSelect.onchange = () => {
    filterYear = yearSelect.value;
    applyFiltersAndRender();
  };

  monthSelect.onchange = () => {
    filterMonth = monthSelect.value;
    applyFiltersAndRender();
  };
}

function applyFiltersAndRender() {
  renderSummaryBoxes();
  renderReservationsTable();
  setupCalendarButtons();
  refreshCalendarUI();
}

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

function pickDeep(obj, ...paths) {
  for (const path of paths) {
    if (!obj) continue;
    const parts = path.split(".");
    let value = obj;
    for (const part
 of parts) {
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
  return "$" + Number(v || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function toNumber(v) {
  return Number(String(v || 0).replace(/[$,]/g, "").trim()) || 0;
}

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    const parts = dateStr.split("-");
    const yyyy = parts[0];
    const mm = parts[1];
    const dd = parts[2];
    return mm + "/" + dd + "/" + yyyy;
  }
  return dateStr;
}

function toSortableDate(dateStr) {
  const d = new Date(dateStr);
  return isNaN(d) ? 0 : d.getTime();
}

function getExpectedPayoutDate(checkOutDate) {
  const d = new Date(checkOutDate);
  if (isNaN(d)) return "";
  const payoutDate = new Date(d.getFullYear(), d.getMonth() + 1, 5);
  const mm = String(payoutDate.getMonth() + 1).padStart(2, "0");
  const dd = String(payoutDate.getDate()).padStart(2, "0");
  const yyyy = payoutDate.getFullYear();
  return mm + "/" + dd + "/" + yyyy;
}

function getCleaningFee() {
  return currentOwner && currentOwner.cleaningFee ? Number(currentOwner.cleaningFee) : 0;
}

function parseLocalDate(dateStr) {
  if (!dateStr) return null;
  const parts = String(dateStr).split("-");
  if (parts.length !== 3) return null;
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  const d = new Date(year, month, day);
  return isNaN(d) ? null : d;
}

function toDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function getAllCalendarBlocks() {
  const filteredReservations = getFilteredReservations();
  const filteredOwnerStays = getFilteredOwnerStays();

  const reservationBlocks = filteredReservations.map(reservation => {
    const platformText = String(reservation.platform || "").trim();
    const sourceText = String(reservation.source || platformText || "").toUpperCase();
    const isVrbo = sourceText.includes("VRBO") || sourceText.includes("MANUAL_VRBO");
    const platformLabel = isVrbo
      ? "VRBO"
      : String(platformText || reservation.source || "BOOKED").trim().toUpperCase();

    return {
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      type: isVrbo ? "vrbo" : "reservation",
      platformLabel
    };
  });

  const ownerBlocks = filteredOwnerStays.map(stay => ({
    checkIn: stay.checkIn || stay.checkInDate,
    checkOut: stay.checkOut || stay.checkOutDate,
    type: "owner",
    platformLabel: "OWNER"
  }));

  return reservationBlocks.concat(ownerBlocks);
}

function getReservedDateMap() {
  const reservedMap = {};

  getAllCalendarBlocks().forEach(block => {
    const start = parseLocalDate(block.checkIn);
    const end = parseLocalDate(block.checkOut);
    if (!start || !end) return;

    const current = new Date(start);
    while (current < end) {
      const key = toDateKey(current);
      if (!reservedMap[key]) {
        reservedMap[key] = { reservation: false, vrbo: false, owner: false, platforms: {} };
      }
      reservedMap[key][block.type] = true;
      if (block.platformLabel) {
        reservedMap[key].platforms[block.platformLabel] = true;
      }
      current.setDate(current.getDate() + 1);
    }
  });

  return reservedMap;
}

function buildReservedMapFromRows(resRows = [], ownerRows = []) {
  const reservedMap = {};
  const allBlocks = [];

  resRows.forEach(res => {
    const platformText = String(res.platform || "").trim();
    const sourceText = String(res.source || platformText || "").toUpperCase();
    const isVrbo = sourceText.includes("VRBO") || sourceText.includes("MANUAL_VRBO");
    const platformLabel = isVrbo ? "VRBO" : String(platformText || res.source || "BOOKED").trim().toUpperCase();
    allBlocks.push({ checkIn: res.checkIn, checkOut: res.checkOut, type: isVrbo ? "vrbo" : "reservation", platformLabel });
  });

  ownerRows.forEach(stay => {
    allBlocks.push({ checkIn: stay.checkIn || stay.checkInDate, checkOut: stay.checkOut || stay.checkOutDate, type: "owner", platformLabel: "OWNER" });
  });

  allBlocks.forEach(block => {
    const start = parseLocalDate(block.checkIn);
    const end = parseLocalDate(block.checkOut);
    if (!start || !end) return;
    const current = new Date(start);
    while (current < end) {
      const key = toDateKey(current);
      if (!reservedMap[key]) {
        reservedMap[key] = { reservation: false, vrbo: false, owner: false, platforms: {} };
      }
      reservedMap[key][block.type] = true;
      if (block.platformLabel) reservedMap[key].platforms[block.platformLabel] = true;
      current.setDate(current.getDate() + 1);
    }
  });

  return reservedMap;
}

function getTotalBookedNights() {
  const bookedMap = {};

    getFilteredReservations().forEach(reservation => {
    const start = parseLocalDate(reservation.checkIn);
    const end = parseLocalDate(reservation.checkOut);
    if (!start || !end) return;

    const current = new Date(start);
    while (current < end) {
      bookedMap[toDateKey(current)] = true;
      current.setDate(current.getDate() + 1);
    }
  });

  return Object.keys(bookedMap).length;
}

function getTotalOwnerStayNights() {
  const ownerMap = {};

  ownerStaysData.forEach(stay => {
    const start = parseLocalDate(stay.checkIn || stay.checkInDate);
    const end = parseLocalDate(stay.checkOut || stay.checkOutDate);
    if (!start || !end) return;

    const current = new Date(start);
    while (current < end) {
      ownerMap[toDateKey(current)] = true;
      current.setDate(current.getDate() + 1);
    }
  });

  return Object.keys(ownerMap).length;
}

function renderNightTotals(targetEl, reservedRows = null, ownerRows = null) {
  if (!targetEl) return;
  if (reservedRows === null) {
    targetEl.innerHTML =
      "<div>Total Booked Nights: " + getTotalBookedNights() + "</div>" +
      '<div style="margin-top:4px;">Total Owner Stay Nights: ' + getTotalOwnerStayNights() + "</div>";
  } else {
    const bookedMap = {};
    reservedRows.forEach(res => {
      const start = parseLocalDate(res.checkIn);
      const end = parseLocalDate(res.checkOut);
      if (!start || !end) return;
      const current = new Date(start);
      while (current < end) {
        bookedMap[toDateKey(current)] = true;
        current.setDate(current.getDate() + 1);
      }
    });
    const ownerMap = {};
    ownerRows.forEach(stay => {
      const start = parseLocalDate(stay.checkIn || stay.checkInDate);
      const end = parseLocalDate(stay.checkOut || stay.checkOutDate);
      if (!start || !end) return;
      const current = new Date(start);
      while (current < end) {
        ownerMap[toDateKey(current)] = true;
        current.setDate(current.getDate() + 1);
      }
    });
    targetEl.innerHTML =
      "<div>Total Booked Nights: " + Object.keys(bookedMap).length + "</div>" +
      '<div style="margin-top:4px;">Total Owner Stay Nights: ' + Object.keys(ownerMap).length + "</div>";
  }
}

function getCellStyleForDate(dayInfo) {
  if (!dayInfo) {
    return { background: "#fff", border: "1px solid #d9e6f2", badge: "" };
  }

  if (dayInfo.owner) {
    return { background: "#ffe7d1", border: "2px solid #9a4d0a", badge: "OWNER" };
  }

  if (dayInfo.vrbo) {
    return { background: "#ddf7ee", border: "2px solid #0d8a63", badge: "VRBO" };
  }

  return {
    background: "#dcecff",
    border: "2px solid #2f78b7",
    badge: getPlatformLabelForDay(dayInfo)
  };
}

function getPlatformLabelForDay(dayInfo) {
  if (!dayInfo) return "";
  const platformLabels = Object.keys(dayInfo.platforms || {}).filter(label => label !== "OWNER");
  const nonVrboLabels = platformLabels.filter(label => label !== "VRBO");

  if (dayInfo.owner) return "OWNER";

  if (dayInfo.vrbo && !dayInfo.reservation) return "VRBO";
  if (nonVrboLabels.length === 1 && !dayInfo.vrbo) return nonVrboLabels[0];
  if (nonVrboLabels.length === 1 && dayInfo.vrbo) return nonVrboLabels[0];
  if (platformLabels.length === 1) return platformLabels[0];
  if (platformLabels.length > 1) return "MULTI";
  if (dayInfo.vrbo) return "VRBO";
  return "BOOKED";
}

function getCompactBadgeText(badgeText) {
  if (!badgeText) return "";
  const upper = String(badgeText).toUpperCase();
  if (upper === "OWNER") return "O";
  if (upper === "VRBO") return "V";
  if (upper === "MULTI") return "M";
  return upper.substring(0, 1);
}

function renderCalendarWithMap(gridEl, monthLabelEl, nightsEl, currentMonthDate, isLarge, reservedMap) {
  if (!gridEl || !monthLabelEl || !nightsEl) return;

  const isCompact = !isLarge && window.innerWidth <= 600;
  const dayHeaderFontSize = isLarge ? "14px" : (isCompact ? "10px" : "11px");
  const dayShort = isCompact ? 2 : 3;
  const smallCellMinHeight = isCompact ? "40px" : "50px";
  const smallDayFont = isCompact ? "11px" : "12px";
  const smallBadgeFont = isCompact ? "8px" : "9px";

  monthLabelEl.innerText = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });

  renderNightTotals(nightsEl);
  gridEl.innerHTML = "";

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach(day => {
    gridEl.innerHTML +=
      '<div style="text-align:center; font-weight:700; padding:2px 0; font-size:' + dayHeaderFontSize + '; overflow:hidden;">' +
      (isLarge ? day : day.substring(0, dayShort)) +
      "</div>";
  });

  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();
  const totalDays = lastDay.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  for (let i = 0; i < startOffset; i++) {
    const dayNum = prevMonthLastDay - startOffset + i + 1;
    gridEl.innerHTML +=
      '<div style="min-height:' + (isLarge ? "90px" : smallCellMinHeight) + ';background:#fff;border-radius:8px;padding:4px;border:1px solid #d9e6f2;opacity:0.55;">' +
      '<div style="font-weight:700; font-size:' + (isLarge ? "16px" : smallDayFont) + ';">' + dayNum + "</div></div>";
  }

  for (let day = 1; day <= totalDays; day++) {
    const currentDate = new Date(year, month, day);
    const dateKey = toDateKey(currentDate);
    const dayInfo = reservedMap[dateKey];
    const cellStyle = getCellStyleForDate(dayInfo);
    const badgeText = dayInfo ? (isCompact ? getCompactBadgeText(cellStyle.badge) : cellStyle.badge) : "";

    gridEl.innerHTML +=
      '<div style="min-height:' + (isLarge ? "90px" : smallCellMinHeight) + ";background:" + cellStyle.background + ";border-radius:10px;padding:4px;border:" + cellStyle.border + ';">' +
      '<div style="font-weight:700; font-size:' + (isLarge ? "16px" : "10px") + ';">' + day + "</div>" +
      (dayInfo ? '<div style="margin-top:6px; font-size:' + (isLarge ? "12px" : smallBadgeFont) + '; font-weight:700; color:#1f3552;">' + badgeText + "</div>" : "") +
      "</div>";
  }

  const totalCellsUsed = startOffset + totalDays;
  const endFill = (7 - (totalCellsUsed % 7)) % 7;

  for (let i = 1; i <= endFill; i++) {
    gridEl.innerHTML +=
      '<div style="min-height:' + (isLarge ? "90px" : smallCellMinHeight) + ';background:#fff;border-radius:8px;padding:4px;border:1px solid #d9e6f2;opacity:0.55;">' +
      '<div style="font-weight:700; font-size:' + (isLarge ? "16px" : smallDayFont) + ';">' + i + "</div></div>";
  }
}

function renderCalendar(gridId, labelId, nightsId, currentMonthDate, isLarge) {
  const grid = document.getElementById(gridId);
  const monthLabel = document.getElementById(labelId);
  const nightsLabel = document.getElementById(nightsId);
  if (!grid || !monthLabel || !nightsLabel) return;
  const reservedMap = getReservedDateMap();
  renderCalendarWithMap(grid, monthLabel, nightsLabel, currentMonthDate, isLarge, reservedMap);
}

function setupCalendarButtons() {
  const prevBtn = document.getElementById("calendarPrevBtn");
  const nextBtn = document.getElementById("calendarNextBtn");
  const expandBtn = document.getElementById("showCalendarBtn");
  const panel = document.getElementById("calendarPanel");
  const summary = document.getElementById("calendarToggleSummary");

  if (prevBtn && !prevBtn.dataset.bound) {
    prevBtn.dataset.bound = "1";
    prevBtn.onclick = function () {
      calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() - 1);
      renderCalendar("calendarGrid", "calendarMonthLabel", "calendarBookedNights", calendarCurrentDate, false);
    };
  }

  if (nextBtn && !nextBtn.dataset.bound) {
    nextBtn.dataset.bound = "1";
    nextBtn.onclick = function () {
      calendarCurrentDate.setMonth(calendarCurrentDate.getMonth() + 1);
      renderCalendar("calendarGrid", "calendarMonthLabel", "calendarBookedNights", calendarCurrentDate, false);
    };
  }

  if (expandBtn && !expandBtn.dataset.bound) {
    expandBtn.dataset.bound = "1";
    expandBtn.onclick = function () {
      if (!panel) return;
      const opening = panel.style.display === "none" || !panel.style.display;
      panel.style.display = opening ? "block" : "none";
      expandBtn.innerText = opening ? "Hide Calendar" : "Show Calendar";
      if (opening) {
        renderCalendar("calendarGrid", "calendarMonthLabel", "calendarBookedNights", calendarCurrentDate, false);
      }
    };
  }

  if (summary) {
    renderNightTotals(summary);
  }

  if (!calendarResizeBound) {
    calendarResizeBound = true;
    window.addEventListener("resize", () => {
      refreshCalendarUI();
    });
  }
}

function refreshCalendarUI() {
  const panel = document.getElementById("calendarPanel");
  const summary = document.getElementById("calendarToggleSummary");
  const nightsLabel = document.getElementById("calendarBookedNights");

  if (summary) renderNightTotals(summary);

  if (panel && panel.style.display !== "none") {
    renderCalendar("calendarGrid", "calendarMonthLabel", "calendarBookedNights", calendarCurrentDate, false);
  } else if (nightsLabel) {
    renderNightTotals(nightsLabel);
  }
}

function getTimeBasedGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function renderDashboardHeader() {
  const greeting = document.getElementById("greeting");
  const propertyAddress = document.getElementById("propertyAddress");
  if (greeting && currentOwner && !currentOwner.admin) greeting.innerText = getTimeBasedGreeting() + " " + currentOwner.ownerName;
  if (propertyAddress && currentOwner && !currentOwner.admin) propertyAddress.innerText = currentOwner.propertyName || "";
  if (currentOwner && !currentOwner.admin) renderWeather(currentOwner.postalCode);
}

function renderWeather(zip) {
  const apiKey = "301c3846b1ed5b804976f73bd010175a";
  const weatherBox = document.getElementById("weatherBox");
  if (!zip || !weatherBox) return;

  weatherBox.innerHTML = '<div class="weather-loading">Loading weather...</div>';

  fetch("https://api.openweathermap.org/data/2.5/forecast?zip=" + zip + ",US&appid=" + apiKey + "&units=imperial")
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
        html +=
          '<div class="forecast-day">' +
          "<div>" + dateObj.toLocaleDateString("en-US", { weekday: "short" }) + "</div>" +
          '<img src="https://openweathermap.org/img/wn/' + day.weather[0].icon + '.png" alt="">' +
          "<div><b>" + Math.round(day.main.temp) + "°F</b></div>" +
          '<div style="font-size:.95em;">' + day.weather[0].main + "</div>" +
          "</div>";
      });
      html += "</div>";
      weatherBox.innerHTML = html;
    })
    .catch(() => {
      weatherBox.innerHTML = '<div class="weather-box">Weather unavailable</div>';
    });
}

function setDateFieldsMin() {
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const minDate = yyyy + "-" + mm + "-" + dd;
  const checkIn = document.getElementById("checkInDate");
  const checkOut = document.getElementById("checkOutDate");
  if (checkIn) checkIn.setAttribute("min", minDate);
  if (checkOut) checkOut.setAttribute("min", minDate);
}

function mapGuestyReservation(r) {
  const baseAccommodation = pickNumber(r["money.fareAccommodation"]?.value);
  const markup = pickNumber(r["money.invoiceItems.MAR"]?.value);

  const lengthOfStayDiscount = pickNumber(
    r["money.invoiceItems.LOS"]?.value,
    r["money.invoiceItems.lengthOfStayDiscount"]?.value,
    r.money?.invoiceItems?.LOS?.value,
    r.money?.invoiceItems?.lengthOfStayDiscount?.value,
    r.lengthOfStayDiscount
  );

  const standardAccommodation = baseAccommodation - markup + lengthOfStayDiscount;
let calculatedAccommodation = standardAccommodation;


  const sourceValue = pickText(
    r.source, r["source"], r["integration.source"], r.integration?.source, r.channel, r["channel"]
  );

  const totalPayoutValue = pickNumber(
    r["money.hostPayout"]?.value, r.hostPayout, r.totalPayout
  );

  const numberOfNightsValue = pickNumber(
    r["numberOfNights"]?.children, r.numberOfNights?.children, r["numberOfNights"]?.value, r.numberOfNights?.value, r.numberOfNights
  );

  const cleaningFareValue = pickNumber(
    r["money.fareCleaning"]?.value, r.money?.fareCleaning?.value, r.fareCleaning, r.cleaningFee
  );

  const taxesCombined = pickNumber(
    r["money.fareTaxes"]?.value, r.money?.fareTaxes?.value, r.fareTaxes, r.taxes, r.tax
  );

  const airbnbResolutionCenter = pickNumber(
    r["money.invoiceItems.ARC"]?.value, r["money.invoiceItems.ARC"]?.amount, r.airbnbResolutionCenter, r.resolutionCenter
  );

const platformUpper = String(
  pickText(r["integration.platform"], r.platform, r.integration?.platform) || ""
).toUpperCase().trim();

const sourceUpper = String(sourceValue || "").toUpperCase().trim();

const isManualVrbo = sourceUpper.includes("MANUAL_VRBO") || sourceUpper.includes("VRBO_MANUAL");
const isManualDirect = sourceUpper.includes("MANUAL_DIRECT");

const isAirbnb =
  platformUpper.includes("AIRBNB") ||
  sourceUpper.includes("AIRBNB2") ||
  sourceUpper.includes("AIRBNB");

const isVrboOrHomeAway =
  (platformUpper.includes("VRBO") ||
    platformUpper.includes("HOMEAWAY") ||
    sourceUpper.includes("VRBO") ||
    sourceUpper.includes("HOMEAWAY")) &&
  !isManualVrbo;

const isWebsite = sourceUpper.includes("WEBSITE");
const isDirect = sourceUpper.includes("DIRECT") && !isManualDirect;
const isManual =
  (sourceUpper === "MANUAL" || sourceUpper.includes("MANUAL")) &&
  !isManualVrbo &&
  !isManualDirect;

const isSpecialSource = isVrboOrHomeAway || isWebsite || isDirect || isManual;

// Channel/booking commission (NOT Airbnb ARC)
const channelCommission = pickNumber(
  r["money.invoiceItems.BKF"]?.value,
  r["money.invoiceItems.BOOKING_FEE"]?.value,
  r["money.invoiceItems.channelCommission"]?.value,
  r.money?.invoiceItems?.BKF?.value,
  r.bookingFee,
  r.channelCommission,
  r["money.channelCommission"]?.value
);

// Optional explicit card processing fee from report
const explicitCardProcessingFee = pickNumber(
  r["money.invoiceItems.CCF"]?.value,
  r["money.invoiceItems.CC"]?.value,
  r["money.invoiceItems.creditCardProcessingFee"]?.value,
  r.money?.invoiceItems?.CCF?.value,
  r.creditCardProcessingFee
);

// Check if the payout covers standardAccommodation + all applicable fees.
// If not, the accommodation is squeezed — derive it from what payout has left after fees.
let allowedAccommodation = standardAccommodation;

if (isAirbnb) {
  // Payout should cover: accommodation + cleaning
  const requiredPayout = standardAccommodation + Math.max(0, cleaningFareValue);
  if (totalPayoutValue < requiredPayout) {
    allowedAccommodation = totalPayoutValue - Math.max(0, cleaningFareValue);
  }
} else if (isVrboOrHomeAway) {
  // Payout should cover: accommodation + cleaning + taxes + channel commission
  const requiredPayout =
    standardAccommodation +
    Math.max(0, cleaningFareValue) +
    Math.max(0, taxesCombined) +
    Math.max(0, channelCommission);
  if (totalPayoutValue < requiredPayout) {
    allowedAccommodation =
      totalPayoutValue -
      Math.max(0, cleaningFareValue) -
      Math.max(0, taxesCombined) -
      Math.max(0, channelCommission);
  }
} else if (isWebsite || isDirect || isManual) {
  // Payout should cover: accommodation + cleaning + taxes + channel commission + 1% platform + 4% card
  const cardFeeToUse =
    explicitCardProcessingFee > 0
      ? explicitCardProcessingFee
      : (totalPayoutValue * 0.04);
  const requiredPayout =
    standardAccommodation +
    Math.max(0, cleaningFareValue) +
    Math.max(0, taxesCombined) +
    Math.max(0, channelCommission) +
    Math.max(0, totalPayoutValue * 0.01) +
    Math.max(0, cardFeeToUse);
  if (totalPayoutValue < requiredPayout) {
    allowedAccommodation =
      totalPayoutValue -
      Math.max(0, cleaningFareValue) -
      Math.max(0, taxesCombined) -
      Math.max(0, channelCommission) -
      Math.max(0, totalPayoutValue * 0.01) -
      Math.max(0, cardFeeToUse);
  }
}

calculatedAccommodation = Math.max(0, allowedAccommodation);

  return {
    status: pickText(r.status, r.reservationStatus, r["STATUS"], r["reservationStatus"]),
    listingNickname: pickText(r["listing.nickname"], r.listingNickname, r.listing?.nickname, r.listing),
    platform: pickText(r["integration.platform"], r.platform, r.integration?.platform, r.integration),
    source: sourceValue,
    confirmationCode: (pickText(r["confirmationCode"], r.code, r.reservationCode) || "").toUpperCase(),
    checkIn: r["checkInDate"]?.value || "",
    checkOut: r["checkOutDate"]?.value || "",
    numberOfNights: numberOfNightsValue,
    totalPayout: totalPayoutValue,
    cleaningFare: cleaningFareValue,
    accommodationFare: calculatedAccommodation,
    baseAccommodation,
    markup,
    lengthOfStayDiscount,
    guestName: pickText(r["guest.fullName"], r.guestName, r.guest?.fullName, r.guest, r["guest.name"]),
    taxesCombined,
    airbnbResolutionCenter
  };
}

function renderSummaryBoxes() {
  const summaryBoxes = document.getElementById("summaryBoxes");
  if (!summaryBoxes || !currentOwner || currentOwner.admin) return;
  renderFilterControls();  // ← ADD THIS LINE HERE
  const filteredReservations = getFilteredReservations();
  const filteredOwnerStays = getFilteredOwnerStays();

  let totalAccommodation = 0;
  let totalPMC = 0;
  let totalOwnerPayout = 0;

  filteredReservations
  .filter(res => {
    const source = String(res.source || "").toUpperCase();
    return source !== "MANUAL_VRBO";
  })
  .forEach(reservation => {
    const accommodation = toNumber(reservation.accommodationFare);
    const pmc = accommodation * (currentOwner.pmcPercent / 100);
    const ownerPayout = accommodation - pmc;
    totalAccommodation += accommodation;
    totalPMC += pmc;
    totalOwnerPayout += ownerPayout;
  });

  const vrboManualRows = filteredReservations.filter(
    res => String(res.source || "").toUpperCase() === "MANUAL_VRBO"
  );

  const vrboAccommodationTotal = vrboManualRows.reduce(
    (sum, res) => sum + toNumber(res.accommodationFare),
    0
  );

  const vrboPmcTotal = vrboManualRows.reduce(
    (sum, res) => sum + (toNumber(res.accommodationFare) * (currentOwner.pmcPercent / 100)),
    0
  );

  totalAccommodation += vrboAccommodationTotal;
  totalPMC += vrboPmcTotal;
  totalOwnerPayout = totalAccommodation - totalPMC;

 const bookedNightsCount = filteredReservations.reduce((sum, reservation) => {
  return sum + toNumber(reservation.numberOfNights);
}, 0);

  summaryBoxes.innerHTML = `
    <h2 style="text-align:center; width:100%; margin-bottom:12px;">SUMMARY</h2>
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
    <div class="summary-box">
      <div class="summary-label">Booked Nights</div>
      <div class="summary-value">${bookedNightsCount}</div>
    </div>
  `;

  summaryBoxes.style.textAlign = "center";
  summaryBoxes.style.display = "flex";
  summaryBoxes.style.justifyContent = "center";
}

function renderReservationsTable() {
  const tbody = document.getElementById("reservationsBody");
if (tbody) {
  tbody.innerHTML = "";
}
const sortedReservations = [...getFilteredReservations()]
  .filter(res => {
    const source = String(res.source || "").toUpperCase();
    return source !== "MANUAL_VRBO";
  })
  .sort((a, b) => {
    return toSortableDate(a.checkIn) - toSortableDate(b.checkIn);
  });
  
  if (tbody) {
  if (!sortedReservations.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align:center;">No reservations found</td>
      </tr>
    `;
  } else {
    sortedReservations.forEach(reservation => {
      const accommodation = toNumber(reservation.accommodationFare);
      const pmc = accommodation * (currentOwner.pmcPercent / 100);
      const ownerPayout = accommodation - pmc;
      const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);
      const nights = toNumber(reservation.numberOfNights);

      tbody.innerHTML += `
        <tr>
          <td>${reservation.confirmationCode || ""} ${String(reservation.status || "").toLowerCase().includes("cancel") ? '<span style="color:red; font-weight:700;">Cancelled with payout</span>' : ""}</td>
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
}

  let oldOwnerTable = document.getElementById("ownerStaysTable");
  if (oldOwnerTable && oldOwnerTable.parentNode) {
    oldOwnerTable.parentNode.removeChild(oldOwnerTable);
  }

  let oldVrboManualTable = document.getElementById("vrboManualTable");
  if (oldVrboManualTable && oldVrboManualTable.parentNode) {
    oldVrboManualTable.parentNode.removeChild(oldVrboManualTable);
  }

  let oldPropertyGroups = document.getElementById("propertyGroupsWrap");
  if (oldPropertyGroups && oldPropertyGroups.parentNode) {
    oldPropertyGroups.parentNode.removeChild(oldPropertyGroups);
  }

  const propertyGroups = {};
  sortedReservations.forEach(reservation => {
    const propertyKey = (reservation.listingNickname || "Unknown Property").trim();
    if (!propertyGroups[propertyKey]) propertyGroups[propertyKey] = [];
    propertyGroups[propertyKey].push(reservation);
  });

  const propertyNames = Object.keys(propertyGroups);

  if (propertyNames.length > 1) {
    const mainTable = tbody ? tbody.closest("table") : null;
    if (mainTable && mainTable.parentNode) {
      mainTable.parentNode.removeChild(mainTable);
    }

    const calendarPanel = document.getElementById("calendarPanel");
    if (calendarPanel && calendarPanel.parentNode) {
      calendarPanel.parentNode.removeChild(calendarPanel);
    } else if (calendarPanel) {
      calendarPanel.style.display = "none";
    }
    
const showCalendarBtn = document.getElementById("showCalendarBtn");
if (showCalendarBtn && showCalendarBtn.parentNode) {
  showCalendarBtn.parentNode.removeChild(showCalendarBtn);
} else if (showCalendarBtn) {
  showCalendarBtn.style.display = "none";
}

  const calendarToggleSummary = document.getElementById("calendarToggleSummary");
  if (calendarToggleSummary && calendarToggleSummary.parentNode) {
    calendarToggleSummary.parentNode.removeChild(calendarToggleSummary);
  } else if (calendarToggleSummary) {
    calendarToggleSummary.style.display = "none";
  }
    
    const tableWraps = document.getElementsByClassName("table-wrap");
    let container = null;

    if (tableWraps.length > 0) {
      container = tableWraps[0].parentNode;
    } else {
      container = document.body;
    }

    const propertyWrap = document.createElement("div");
    propertyWrap.id = "propertyGroupsWrap";

    propertyNames.forEach(propertyName => {
      const rows = propertyGroups[propertyName]
  .filter(r => matchesFilters(r.checkIn))
  .sort((a, b) => {
    return toSortableDate(a.checkIn) - toSortableDate(b.checkIn);
  });

      let propertyAccommodation = 0;
      let propertyPmc = 0;
      let propertyOwnerPayout = 0;

      rows.forEach(reservation => {
        const accommodation = toNumber(reservation.accommodationFare);
        const pmc = accommodation * (currentOwner.pmcPercent / 100);
        const ownerPayout = accommodation - pmc;
        propertyAccommodation += accommodation;
        propertyPmc += pmc;
        propertyOwnerPayout += ownerPayout;
      });

      const propertyBookedNights = (() => {
        const bookedMap = {};
        rows.forEach(reservation => {
          const start = parseLocalDate(reservation.checkIn);
          const end = parseLocalDate(reservation.checkOut);
          if (!start || !end) return;
          const current = new Date(start);
          while (current < end) {
            bookedMap[toDateKey(current)] = true;
            current.setDate(current.getDate() + 1);
          }
        });
        return Object.keys(bookedMap).length;
      })();

      const propIdSafe = propertyName.replace(/\W+/g, "_").substring(0, 40);
      const overlayId = `calendarOverlay_${propIdSafe}`;
      const openBtnId = `openCalendarBtn_${propIdSafe}`;

      const closeBtnId = `closeCalendarBtn_${propIdSafe}`;
      const prevBtnId = `overlayPrevBtn_${propIdSafe}`;
      const nextBtnId = `overlayNextBtn_${propIdSafe}`;
      const calendarGridId = `calendarGrid_${propIdSafe}`;
      const calendarLabelId = `calendarMonthLabel_${propIdSafe}`;
      const calendarNightsId = `calendarBookedNights_${propIdSafe}`;

      propertyWrap.innerHTML += `
        <div style="margin-top:40px;">
          <h3 class="section-title" style="text-align:center; margin-bottom:12px;">${propertyName}</h3>

          <h3 style="text-align:center; width:100%; margin:0 0 12px 0;">SUMMARY PER PROPERTY</h3>
<div style="display:flex; justify-content:center; gap:18px; flex-wrap:wrap; margin-bottom:14px;">
  <div class="summary-box">
    <div class="summary-label">Accommodation</div>
              <div class="summary-value">${formatMoney(propertyAccommodation)}</div>
            </div>
            <div class="summary-box">
              <div class="summary-label">PMC</div>
              <div class="summary-value">${formatMoney(propertyPmc)}</div>
            </div>
            <div class="summary-box">
              <div class="summary-label">Owner Payout</div>
              <div class="summary-value">${formatMoney(propertyOwnerPayout)}</div>
            </div>
            <div class="summary-box">
              <div class="summary-label">Booked Nights</div>
              <div class="summary-value">${propertyBookedNights}</div>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; margin-bottom:10px;">
            <button id="${openBtnId}" style="padding:8px 14px; border-radius:8px; border:1px solid #2f78b7; background:#2f78b7; color:#fff; font-weight:700; cursor:pointer;">
              Show Calendar
            </button>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th style="text-align:center;">Code</th>
                  <th style="text-align:center;">Platform</th>
                  <th style="text-align:center;">Check In</th>
                  <th style="text-align:center;">Check Out</th>
                  <th style="text-align:center;">Nights</th>
                  <th style="text-align:center;">Accommodation</th>
                  <th style="text-align:center;">PMC</th>
                  <th style="text-align:center;">Owner Payout</th>
                  <th style="text-align:center;">Expected Payout</th>
                </tr>
              </thead>
              <tbody>
                ${rows.map(reservation => {
                  const accommodation = toNumber(reservation.accommodationFare);
                  const pmc = accommodation * (currentOwner.pmcPercent / 100);
                  const ownerPayout = accommodation - pmc;
                  const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);
                  const nights = toNumber(reservation.numberOfNights);

                  return `
                    <tr>
                      <td>${reservation.confirmationCode || ""} ${String(reservation.status || "").toLowerCase().includes("cancel") ? '<span style="color:red; font-weight:700;">Cancelled with payout</span>' : ""}</td>
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
                }).join("")}
              </tbody>
            </table>
          </div>

          <div id="${overlayId}" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.45);">
            <div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); width:min(980px,95vw); max-height:90vh; overflow:auto; background:#fff; border-radius:12px; padding:14px;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                <h3 style="margin:0;">${propertyName} Calendar</h3>
                <button id="${closeBtnId}" style="padding:6px 10px; border-radius:8px; border:1px solid #ccc; background:#fff; cursor:pointer;">Close</button>
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; gap:8px; flex-wrap:wrap;">
                <div style="display:flex; gap:8px; align-items:center;">
                  <button id="${prevBtnId}" style="padding:6px 10px; border-radius:8px; border:1px solid #ccc; background:#fff; cursor:pointer;">◀</button>
                  <div id="${calendarLabelId}" style="font-weight:700;"></div>
                  <button id="${nextBtnId}" style="padding:6px 10px; border-radius:8px; border:1px solid #ccc; background:#fff; cursor:pointer;">▶</button>
                </div>
                <div id="${calendarNightsId}" style="font-size:13px;"></div>
              </div>

              <div id="${calendarGridId}" style="display:grid; grid-template-columns:repeat(7, 1fr); gap:6px;"></div>
            </div>
          </div>
        </div>
      `;
    });

    container.appendChild(propertyWrap);

    propertyNames.forEach(propertyName => {
      const rows = propertyGroups[propertyName]
  .filter(r => matchesFilters(r.checkIn))
  .sort((a, b) => {
    return toSortableDate(a.checkIn) - toSortableDate(b.checkIn);
  });
      const propIdSafe = propertyName.replace(/\W+/g, "_").substring(0, 40);

      const overlayId = `calendarOverlay_${propIdSafe}`;
      const openBtnId = `openCalendarBtn_${propIdSafe}`;
      const closeBtnId = `closeCalendarBtn_${propIdSafe}`;
      const prevBtnId = `overlayPrevBtn_${propIdSafe}`;
      const nextBtnId = `overlayNextBtn_${propIdSafe}`;
      const calendarGridId = `calendarGrid_${propIdSafe}`;
      const calendarLabelId = `calendarMonthLabel_${propIdSafe}`;
      const calendarNightsId = `calendarBookedNights_${propIdSafe}`;

      const overlay = document.getElementById(overlayId);
      const openBtn = document.getElementById(openBtnId);
      const closeBtn = document.getElementById(closeBtnId);
      const prevBtn = document.getElementById(prevBtnId);
      const nextBtn = document.getElementById(nextBtnId);
      const gridEl = document.getElementById(calendarGridId);
      const labelEl = document.getElementById(calendarLabelId);
      const nightsEl = document.getElementById(calendarNightsId);

      const reservedMap = buildReservedMapFromRows(rows, []);
      let overlayMonthDate = new Date(calendarCurrentDate);

      const renderOverlay = () => {
        renderCalendarWithMap(gridEl, labelEl, nightsEl, overlayMonthDate, true, reservedMap);
        renderNightTotals(nightsEl, rows, []);
      };

      if (openBtn) {
        openBtn.onclick = () => {
          overlay.style.display = "block";
          renderOverlay();
        };
      }

      if (closeBtn) {
        closeBtn.onclick = () => {
          overlay.style.display = "none";
        };
      }

      if (overlay) {
        overlay.onclick = e => {
          if (e.target === overlay) {
            overlay.style.display = "none";
          }
        };
      }

      if (prevBtn) {
        prevBtn.onclick = () => {
          overlayMonthDate.setMonth(overlayMonthDate.getMonth() - 1);
          renderOverlay();
        };
      }

      if (nextBtn) {
        nextBtn.onclick = () => {
          overlayMonthDate.setMonth(overlayMonthDate.getMonth() + 1);
          renderOverlay();
        };
      }
    });
  }

 if (getFilteredOwnerStays().length) {
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
            <th style="text-align:center;">Nights</th>
            <th style="text-align:center;">Cleaning Fee</th>
          </tr>
        </thead>
        <tbody>
          ${getFilteredOwnerStays()
            .sort((a, b) => toSortableDate(a.checkIn || a.checkInDate) - toSortableDate(b.checkIn || b.checkInDate))
            .map(res => `
            <tr>
              <td style="text-align:center;">${formatDateDisplay(res.checkIn || res.checkInDate || "")}</td>
              <td style="text-align:center;">${formatDateDisplay(res.checkOut || res.checkOutDate || "")}</td>
              <td style="text-align:center;">${toNumber(res.numberOfNights)}</td>
              <td style="text-align:center;">${formatMoney(getCleaningFee())}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;

  container.appendChild(ownerTable);
}

  const vrboManualRows = getFilteredReservations().filter(res => {
  const source = String(res.source || "").toUpperCase();
  const payout = toNumber(res.totalPayout);
  return source === "MANUAL_VRBO" && payout > 0;
});

  if (vrboManualRows.length)
 {
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
              const nights = toNumber(reservation.numberOfNights);

              return `
                <tr>
                  <td style="text-align:center;">VRBO</td>
                  <td style="text-align:center;">${formatDateDisplay(reservation.checkIn) || ""}</td>
                  <td style="text-align:center;">${formatDateDisplay(reservation.checkOut) || ""}</td>
                  <td style="text-align:center;">${nights}</td>
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
    select.innerHTML += '<option value="' + i + '">' + (res.confirmationCode || "") + " (" + (res.platform || "") + ", " + (res.checkIn || "") + " - " + (res.checkOut || "") + ")</option>";
  });
}

function loadOwnerReport() {
  setupCalendarButtons();
  refreshCalendarUI();

  if (!currentOwner || (!currentOwner.guestyApiKey && !currentOwner.admin)) {
    console.error("No owner or API key configured");
    reservationsData = [];
   renderDashboardHeader();
   renderFilterControls();
   applyFiltersAndRender();
    return;
  }

  if (currentOwner.admin) {
    renderDashboardHeader();
    renderFilterControls();
    applyFiltersAndRender();
    renderAdminPanel();
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
  const accommodation = toNumber(res.accommodationFare);
  // Include: not owner stay, AND (active OR (cancelled AND has accommodation))
  return !isOwnerStay && (status !== "cancel" && status !== "cancelled" && status !== "canceled" || (status === "cancelled" || status === "cancel" || status === "canceled") && accommodation > 0);
});

      renderDashboardHeader();
      renderFilterControls();
      applyFiltersAndRender();
    })
    .catch(err => {
      console.error("Error loading report:", err);
      reservationsData = [];
      renderDashboardHeader();
      renderFilterControls();
      applyFiltersAndRender();
    });
}

function renderAdminPanel() {
  const portal = document.getElementById("ownerPortal");
  if (!portal) return;
  let adminDiv = document.getElementById("adminPanel");
  if (adminDiv) adminDiv.remove();

  adminDiv = document.createElement("div");
  adminDiv.id = "adminPanel";
  adminDiv.style.marginTop = "16px";
  adminDiv.style.padding = "12px";
  adminDiv.style.border = "1px solid #e1e6ef";
  adminDiv.style.borderRadius = "8px";

  adminDiv.innerHTML =
    "<h3 style='margin:0 0 8px 0;'>Admin: Edit Owner Settings</h3>" +
    "<div style='display:flex; gap:12px; align-items:center; margin-bottom:8px;'>" +
    "<select id='adminOwnerSelect' style='min-width:220px;'>" +
    Object.keys(OWNERS).map(email => "<option value='" + email + "'>" + OWNERS[email].ownerName + " — " + email + "</option>").join("") +
    "</select>" +
    "<button id='adminLoadOwner'>Load</button>" +
    "</div>" +
    "<div id='adminOwnerForm' style='display:none;'>" +
    "<div style='display:flex; gap:8px; margin-bottom:8px;'>" +
    "<div style='flex:1;'><label>Owner Email</label><input id='adminOwnerEmail' style='width:100%' disabled /></div>" +
    "<div style='flex:1;'><label>Owner Name</label><input id='adminOwnerName' style='width:100%' /></div>" +
    "</div>" +
    "<div style='display:flex; gap:8px; margin-bottom:8px;'>" +
    "<div style='flex:1;'><label>PMC %</label><input id='adminOwnerPmc' type='number' style='width:100%' /></div>" +
    "<div style='flex:1;'><label>Cleaning Fee</label><input id='adminOwnerCleaning' type='number' style='width:100%' /></div>" +
    "</div>" +
    "<div style='display:flex; gap:8px; margin-bottom:8px;'><div><label>View Mode</label><select id='adminOwnerViewMode'><option value='payout'>Payout</option><option value='draft'>Draft</option></select></div></div>" +
    "<div style='display:flex; gap:8px;'><button id='adminOwnerSave'>Save</button><button id='adminOwnerCancel'>Cancel</button></div>" +
    "</div>";

  portal.insertBefore(adminDiv, portal.firstChild);

  document.getElementById("adminLoadOwner").onclick = () => {
    const email = document.getElementById("adminOwnerSelect").value;
    const owner = OWNERS[email];
    if (!owner) return alert("Owner not found");
    document.getElementById("adminOwnerForm").style.display = "";
    document.getElementById("adminOwnerEmail").value = email;
    document.getElementById("adminOwnerName").value = owner.ownerName || "";
    document.getElementById("adminOwnerPmc").value = owner.pmcPercent || "";
    document.getElementById("adminOwnerCleaning").value = owner.cleaningFee || "";
    document.getElementById("adminOwnerViewMode").value = owner.viewMode || "payout";
  };

  document.getElementById("adminOwnerSave").onclick = () => {
    const email = document.getElementById("adminOwnerEmail").value;
    if (!OWNERS[email]) return alert("Owner not found");
    OWNERS[email].ownerName = document.getElementById("adminOwnerName").value;
    OWNERS[email].pmcPercent = Number(document.getElementById("adminOwnerPmc").value) || OWNERS[email].pmcPercent;
    OWNERS[email].cleaningFee = Number(document.getElementById("adminOwnerCleaning").value) || OWNERS[email].cleaningFee;
    OWNERS[email].viewMode = document.getElementById("adminOwnerViewMode").value || "payout";
    alert("Owner settings saved");
  };

  document.getElementById("adminOwnerCancel").onclick = () => {
    document.getElementById("adminOwnerForm").style.display = "none";
  };
}

// === CONTACT MODAL AND EMAILJS HANDLERS ===
// ... keep your remaining existing code below this line unchanged
