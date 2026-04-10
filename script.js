let currentOwner = null;
let currentOwnerEmail = "";
let isDraftView = false;
let draftMultiPropertyViewMode = "smart"; // "smart" | "extended"

const ownerPasswordInput = document.getElementById("ownerPassword");
const showPwdBtn = document.getElementById("showPwd");

if (ownerPasswordInput && showPwdBtn) {
  showPwdBtn.addEventListener("click", () => {
    const visible = ownerPasswordInput.type === "text";
    ownerPasswordInput.type = visible ? "password" : "text";
    showPwdBtn.classList.toggle("is-visible", !visible);
    showPwdBtn.setAttribute("aria-label", visible ? "Show password" : "Hide password");
    showPwdBtn.setAttribute("title", visible ? "Show password" : "Hide password");
  });
}

function signOut() {
  activeReportLoadId += 1;
  currentOwner = null;
  currentOwnerEmail = "";
  isDraftView = false;
  draftMultiPropertyViewMode = "smart";
  reservationsData = [];
  ownerStaysData = [];
  filterYear = String(new Date().getFullYear());
  filterMonth = "all";
  isLoadingReport = false;

  const adminPanel = document.getElementById("adminPanel");
  if (adminPanel) adminPanel.remove();

  const reportFiltersWrap = document.getElementById("reportFiltersWrap");
  if (reportFiltersWrap) reportFiltersWrap.remove();

  const propertyGroupsWrap = document.getElementById("propertyGroupsWrap");
  if (propertyGroupsWrap) propertyGroupsWrap.remove();

  const statementWorkspaceWrap = document.getElementById("statementWorkspaceWrap");
  if (statementWorkspaceWrap) statementWorkspaceWrap.remove();

  const ownerStaysTable = document.getElementById("ownerStaysTable");
  if (ownerStaysTable) ownerStaysTable.remove();

  const vrboManualTable = document.getElementById("vrboManualTable");
  if (vrboManualTable) vrboManualTable.remove();

  const adminDailyPage = document.getElementById("adminDailyPage");
  if (adminDailyPage) adminDailyPage.remove();

  const adminTopButtons = document.getElementById("adminTopButtons");
  if (adminTopButtons) adminTopButtons.remove();

  const draftViewModeToggle = document.getElementById("draftViewModeToggle");
  if (draftViewModeToggle) draftViewModeToggle.remove();

  const calendarPanel = document.getElementById("calendarPanel");
  if (calendarPanel) calendarPanel.style.display = "none";

  const showCalendarBtn = document.getElementById("showCalendarBtn");
  if (showCalendarBtn) showCalendarBtn.classList.remove("calendar-btn-active");

  const loginBox = document.getElementById("loginBox");
  const ownerPortal = document.getElementById("ownerPortal");
  if (ownerPortal) ownerPortal.style.display = "none";
  if (loginBox) loginBox.style.display = "";

  const loginStatus = document.getElementById("loginStatus");
  if (loginStatus) loginStatus.innerText = "";

  const emailInput = document.getElementById("ownerEmail");
  if (emailInput) emailInput.value = "";

  if (ownerPasswordInput) {
    ownerPasswordInput.value = "";
    ownerPasswordInput.type = "password";
  }

  if (showPwdBtn) {
    showPwdBtn.classList.remove("is-visible");
    showPwdBtn.setAttribute("aria-label", "Show password");
    showPwdBtn.setAttribute("title", "Show password");
  }
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", signOut);
}

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

  if (!OWNERS[email].viewMode) OWNERS[email].viewMode = "payout";

currentOwner = OWNERS[email];
currentOwnerEmail = email;
isDraftView = currentOwner.admin
  ? true
  : String(currentOwner.viewMode || "payout").toLowerCase() === "draft";
  draftMultiPropertyViewMode = "smart";
document.getElementById("loginBox").style.display = "none";
  document.getElementById("ownerPortal").style.display = "";
  loginStatus.innerText = "";

  configureHeaderLayoutByMode();

if (currentOwner && currentOwner.admin) {
  window.adminActiveTab = "daily";
} else {
  window.adminActiveTab = "income";
}
  
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
    cleaningFee: 325,
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
    ownerName: "GSD INVESTMENTS",
    propertyName: "2131 Sanibel Ct. Myrtle Beach SC 29577",
    postalCode: "29577",
    pmcPercent: 15,
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
  },
   "oceanvacationsmb@gmail.com": {
    password: "Ocean123++",
    ownerName: "Ocean Vacations",
    propertyName: "Team Portal",
    postalCode: "29577",
    pmcPercent: 0,
    guestyApiKey: "ada6fa4f86889add1196b0151fec4b77949586b9c1c7459c2bfd05cfab466f34d72197d1bd5beaeefb8ad2295dedb1b60d6c8de7a45985c85623ffdfb22b36a6",
    cleaningFee: 0,
    viewMode: "draft",
    admin: true
  },
   "Zvicaelia@yahoo.com": {
    password: "owner7818$$",
    ownerName: "Zvika",
    propertyName: "7401 North Ocean BLVD. Myrtle Beach SC 29572",
    postalCode: "29572",
    pmcPercent: 12,
    guestyApiKey: "483d4003f2fb16cea880d61c11af66b9150d0e2fe23c9c0e5b3c88baa8a16e13bfc4bd98885e15d34788342614128b8651d86356348303b640d9fba3fe7d9610",
    cleaningFee: 300,
    viewMode: "payout"
    },
};

applyOwnerOverridesFromStorage();

let reservationsData = [];
let ownerStaysData = [];
let calendarCurrentDate = new Date();
let calendarResizeBound = false;
let isLoadingReport = false;
let activeReportLoadId = 0;

let filterYear = String(new Date().getFullYear());
let filterMonth = "all";

const ADMIN_ELEVATOR_FIELD_ID = "69682ec2a604dc001460d3c5";
const PROPERTY_ORDER = [
  "GC - 1463",
  "GC - 601A",
  "GC - 601B",
  "GC - 827B",
  "GC - 1211A",
  "GCSSB - 113A-12S",
  "GCSSB - 113B-12S",
  "GCSSB - 113B-15S",
  "GCSSB - 115C 15N",
  "GCSSB - 113B-13N",
  "GCSSB - 204-2D",
  "MB - Tuscan A",
  "MB - Tuscan B",
  "MB - Tuscan C",
  "MB - 209/5112",
  "MB - 209/5113",
  "MB - 7500",
  "MB - 7401 #8",
  "MB - 4765",
  "MB - 4631/301",
  "MB - 4679/204",
  "MB - 1552",
  "MB - 2000",
  "MB - 2131",
  "MB - 469C",
  "NMB - 204-28N",
  "NMB - 204-27N",
  "NMB - 1004",
  "NMB - 214-2S",
  "NMB - 304B",
  "NMB - 400A",
  "NMB - 400B",
  "NMB - 508/1-33S",
  "NMB - 508/2-33S",
  "NMB - 703-2",
  "NMB - 705-2",
  "NMB - 709-2"
];

const PROPERTY_PMC_PERCENT_OVERRIDES = {
  "GCSSB - 204-2D": 10,
  "MB - 209/5112": 10,
  "MB - 209/5113": 10,
  "MB - 7500": 10,
  "MB - 7401 #8":12,
  "MB - 4765": 10,
  "MB - 1552": 15,
  "MB - 2000": 10,
  "MB - 2131": 15,
  "NMB - 508/1-33S": 15,
  "NMB - 508/2-33S": 15
};

const TASKS_STORAGE_KEY = "ocean_vacations_tasks";
const OWNER_OVERRIDES_STORAGE_KEY = "owner_settings_overrides";
const TASKS_API_CANDIDATES = [
  (typeof window !== "undefined" && window.TASKS_API_URL) ? String(window.TASKS_API_URL).trim() : ""
].filter(Boolean);
let isUpcomingCheckInsExpanded = false;
let tasksPersistenceMode = "local";
let tasksInitPromise = null;
let resolvedTasksApiBase = "";
let isUpcomingElevatorsExpanded = false;

function getOwnerReportCacheKey(ownerEmail, owner) {
  const emailKey = String(ownerEmail || "unknown").toLowerCase();
  const apiHash = String(owner?.guestyApiKey || "").slice(0, 16);
  return `owner_report_cache_${emailKey}_${apiHash}`;
}

function saveOwnerReportCache(ownerEmail, owner, mappedRows) {
  try {
    const cacheKey = getOwnerReportCacheKey(ownerEmail, owner);
    localStorage.setItem(cacheKey, JSON.stringify(mappedRows || []));
  } catch (_) {
    // Best-effort cache only.
  }
}

function loadOwnerReportCache(ownerEmail, owner) {
  try {
    const cacheKey = getOwnerReportCacheKey(ownerEmail, owner);
    const raw = localStorage.getItem(cacheKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function getOrderedPropertyNames(names = []) {
  return [...names].sort((a, b) => {
    const ia = PROPERTY_ORDER.indexOf(a);
    const ib = PROPERTY_ORDER.indexOf(b);
    const va = ia === -1 ? PROPERTY_ORDER.length + String(a || "").charCodeAt(0) : ia;
    const vb = ib === -1 ? PROPERTY_ORDER.length + String(b || "").charCodeAt(0) : ib;
    if (va !== vb) return va - vb;
    return String(a || "").localeCompare(String(b || ""));
  });
}

function getPropertyCategory(propertyName) {
  const name = String(propertyName || "").trim().toUpperCase();
  if (name.startsWith("GC -") || name.startsWith("GCSSB -")) return "SOUTH";
  if (name.startsWith("MB -")) return "MYRTLE BEACH";
  if (name.startsWith("NMB -")) return "NORTH MYRTLE BEACH";
  return "OTHER";
}

function getGroupedPropertyNames(orderedNames = []) {
  const orderedCategories = ["SOUTH", "MYRTLE BEACH", "NORTH MYRTLE BEACH", "OTHER"];
  const groups = orderedCategories.map(category => ({
    category,
    names: orderedNames.filter(name => getPropertyCategory(name) === category)
  }));
  return groups.filter(group => group.names.length);
}

function getPmcPercentForListing(listingName, fallbackPercent = 12) {
  const key = String(listingName || "").trim();
  if (Object.prototype.hasOwnProperty.call(PROPERTY_PMC_PERCENT_OVERRIDES, key)) {
    return Number(PROPERTY_PMC_PERCENT_OVERRIDES[key]) || fallbackPercent;
  }
  return Number(fallbackPercent) || 12;
}

function loadTasksFromStorage() {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return normalizeTasks(parsed);
  } catch (_) {
    return [];
  }
}

function loadOwnerOverridesFromStorage() {
  try {
    const raw = localStorage.getItem(OWNER_OVERRIDES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (_) {
    return {};
  }
}

function applyOwnerOverridesFromStorage() {
  const overrides = loadOwnerOverridesFromStorage();
  Object.keys(overrides).forEach(email => {
    if (!OWNERS[email] || !overrides[email] || typeof overrides[email] !== "object") return;
    OWNERS[email] = { ...OWNERS[email], ...overrides[email] };
  });
}

function saveOwnerOverrideToStorage(email) {
  if (!email || !OWNERS[email]) return;
  const overrides = loadOwnerOverridesFromStorage();
  overrides[email] = {
    ownerName: String(OWNERS[email].ownerName || "").trim(),
    pmcPercent: Number(OWNERS[email].pmcPercent) || 0,
    cleaningFee: Number(OWNERS[email].cleaningFee) || 0,
    viewMode: String(OWNERS[email].viewMode || "payout")
  };
  try {
    localStorage.setItem(OWNER_OVERRIDES_STORAGE_KEY, JSON.stringify(overrides));
  } catch (_) {
    // Best-effort persistence only.
  }
}

let tasksData = loadTasksFromStorage();

function normalizeTask(task) {
  if (!task || typeof task !== "object") return null;
  const normalized = {
    id: String(task.id || ""),
    property: String(task.property || "").trim(),
    priority: ["urgent", "standard", "follow_up"].includes(String(task.priority)) ? String(task.priority) : "standard",
    description: String(task.description || "").trim(),
    status: String(task.status || "new") === "completed" ? "completed" : "new",
    createdAt: String(task.createdAt || new Date().toISOString()),
    completedAt: task.completedAt ? String(task.completedAt) : null
  };
  if (!normalized.id || !normalized.property || !normalized.description) return null;
  return normalized;
}

function normalizeTasks(tasks) {
  if (!Array.isArray(tasks)) return [];
  return tasks
    .map(normalizeTask)
    .filter(Boolean);
}

function saveTasksToStorage() {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasksData));
  } catch (_) {
  }
}

async function fetchTasksFromApi() {
  const candidates = resolvedTasksApiBase ? [resolvedTasksApiBase] : TASKS_API_CANDIDATES;
  for (const base of candidates) {
    try {
      const res = await fetch(base, { headers: { accept: "application/json" } });
      if (!res.ok) continue;
      const payload = await res.json();
      resolvedTasksApiBase = base;
      return normalizeTasks(payload?.tasks ?? payload);
    } catch (_) {
    }
  }
  throw new Error("tasks-api-unavailable");
}

async function ensureTasksInitialized() {
  if (!(currentOwner && currentOwner.admin)) return tasksData;
  if (tasksInitPromise) return tasksInitPromise;

  tasksInitPromise = (async () => {
    try {
      const apiTasks = await fetchTasksFromApi();
      tasksData = apiTasks;
      tasksPersistenceMode = "server";
      saveTasksToStorage();
    } catch (_) {
      tasksPersistenceMode = "local";
    }

    refreshTaskListModalView();
    rerenderDailyOperationsIfActive();
    return tasksData;
  })();

  return tasksInitPromise;
}

async function createTask(task) {
  const apiBase = resolvedTasksApiBase || TASKS_API_CANDIDATES[0];
  if (tasksPersistenceMode === "server") {
    try {
      await fetch(apiBase, {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(task)
      });
      tasksData = await fetchTasksFromApi();
      saveTasksToStorage();
      return;
    } catch (_) {
      tasksPersistenceMode = "local";
    }
  }

  tasksData = [task, ...tasksData];
  saveTasksToStorage();
}

async function updateTask(taskId, patch) {
  const apiBase = resolvedTasksApiBase || TASKS_API_CANDIDATES[0];
  if (tasksPersistenceMode === "server") {
    try {
      await fetch(`${apiBase}/${encodeURIComponent(taskId)}`, {
        method: "PATCH",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify(patch)
      });
      tasksData = await fetchTasksFromApi();
      saveTasksToStorage();
      return;
    } catch (_) {
      tasksPersistenceMode = "local";
    }
  }

  tasksData = tasksData.map(item => item.id === taskId ? { ...item, ...patch } : item);
  saveTasksToStorage();
}

async function removeTask(taskId) {
  const apiBase = resolvedTasksApiBase || TASKS_API_CANDIDATES[0];
  if (tasksPersistenceMode === "server") {
    try {
      await fetch(`${apiBase}/${encodeURIComponent(taskId)}`, {
        method: "DELETE",
        headers: { accept: "application/json" }
      });
      tasksData = await fetchTasksFromApi();
      saveTasksToStorage();
      return;
    } catch (_) {
      tasksPersistenceMode = "local";
    }
  }

  tasksData = tasksData.filter(item => item.id !== taskId);
  saveTasksToStorage();
}

function getAllPropertyNamesForTasks() {
  const fromData = reservationsData
    .map(r => String(r.listingNickname || "").trim())
    .filter(Boolean);
  return getOrderedPropertyNames(Array.from(new Set(PROPERTY_ORDER.concat(fromData))));
}

function getOpenTaskCount() {
  return tasksData.filter(task => task.status === "new").length;
}

function getSortedTasksForDisplay() {
  return [...tasksData].sort((a, b) => {
    if (a.status !== b.status) return a.status === "new" ? -1 : 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getPriorityLabel(priority) {
  if (priority === "urgent") return "Urgent";
  if (priority === "follow_up") return "Follow Up";
  return "Standard";
}

function getPriorityIcon(priority) {
  if (priority === "urgent") return "⚠";
  if (priority === "follow_up") return "◷";
  return "○";
}

function closeTaskModals() {
  ["taskAddModalOverlay", "taskListModalOverlay", "taskDetailModalOverlay"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

function refreshTaskListModalView() {
  const listWrap = document.getElementById("taskListItems");
  if (!listWrap) return;

  const sortedTasks = getSortedTasksForDisplay();
  if (!sortedTasks.length) {
    listWrap.innerHTML = `
      <div class="task-empty-state">
        <div class="task-empty-icon">📋</div>
        <div class="task-empty-text">No tasks yet</div>
      </div>
    `;
    return;
  }

  listWrap.innerHTML = sortedTasks.map(task => `
    <button type="button" class="task-row ${task.status === "completed" ? "task-row-completed" : ""}" data-task-id="${escapeHtml(task.id)}">
      <div class="task-row-top">
        <strong>${escapeHtml(task.property)}</strong>
        <span class="task-priority-badge task-priority-${escapeHtml(task.priority)}">${getPriorityIcon(task.priority)} ${getPriorityLabel(task.priority)}</span>
      </div>
      <div class="task-row-description">${escapeHtml(task.description)}</div>
    </button>
  `).join("");

  listWrap.querySelectorAll(".task-row").forEach(btn => {
    btn.onclick = () => {
      const taskId = btn.getAttribute("data-task-id");
      if (taskId) openTaskDetailModal(taskId);
    };
  });
}

function rerenderDailyOperationsIfActive() {
  if (currentOwner && currentOwner.admin && window.adminActiveTab === "daily") {
    renderReservationsTable();
  }
}

function openTaskListModal() {
  ensureTasksInitialized();
  const existing = document.getElementById("taskListModalOverlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "taskListModalOverlay";
  overlay.className = "ov-modal-overlay";
  overlay.innerHTML = `
    <div class="ov-modal-card" role="dialog" aria-modal="true" aria-label="All Tasks">
      <div class="ov-modal-head">
        <h3>🗂 All Tasks</h3>
        <button type="button" class="ov-modal-close-btn" id="closeTaskListModalBtn">✕ Close</button>
      </div>
      <div class="task-list-scroll" id="taskListItems"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  document.getElementById("closeTaskListModalBtn").onclick = () => overlay.remove();
  overlay.onclick = e => {
    if (e.target === overlay) overlay.remove();
  };

  refreshTaskListModalView();
}

function openTaskDetailModal(taskId) {
  const task = tasksData.find(item => item.id === taskId);
  if (!task) return;

  const existing = document.getElementById("taskDetailModalOverlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "taskDetailModalOverlay";
  overlay.className = "ov-modal-overlay";
  overlay.innerHTML = `
    <div class="ov-modal-card" role="dialog" aria-modal="true" aria-label="Task Detail">
      <div class="ov-modal-head">
        <h3>${escapeHtml(task.property)}</h3>
        <button type="button" class="ov-modal-close-btn" id="closeTaskDetailModalBtn">✕ Close</button>
      </div>
      <div class="task-detail-priority-wrap">
        <span class="task-priority-badge task-priority-${escapeHtml(task.priority)}">${getPriorityIcon(task.priority)} ${getPriorityLabel(task.priority)}</span>
      </div>
      <div class="task-description-box">${escapeHtml(task.description)}</div>
      <div class="task-detail-actions">
        <button type="button" class="task-btn task-btn-danger" id="taskDeleteBtn">🗑 Delete</button>
        <button type="button" class="task-btn task-btn-ghost" id="taskCloseBtn">✕ Close</button>
        <button type="button" class="task-btn task-btn-success" id="taskCompleteBtn" ${task.status === "completed" ? "disabled" : ""}>✓ Completed</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeDetail = () => overlay.remove();

  document.getElementById("closeTaskDetailModalBtn").onclick = closeDetail;
  document.getElementById("taskCloseBtn").onclick = closeDetail;
  overlay.onclick = e => {
    if (e.target === overlay) closeDetail();
  };

  document.getElementById("taskDeleteBtn").onclick = async () => {
    await removeTask(task.id);
    closeDetail();
    refreshTaskListModalView();
    rerenderDailyOperationsIfActive();
  };

  const completeBtn = document.getElementById("taskCompleteBtn");
  if (completeBtn && task.status !== "completed") {
    completeBtn.onclick = async () => {
      await updateTask(task.id, { status: "completed", completedAt: new Date().toISOString() });
      closeDetail();
      refreshTaskListModalView();
      rerenderDailyOperationsIfActive();
    };
  }
}

function openAddTaskModal() {
  const existing = document.getElementById("taskAddModalOverlay");
  if (existing) existing.remove();

  const properties = getAllPropertyNamesForTasks();
  let selectedPriority = "standard";

  const overlay = document.createElement("div");
  overlay.id = "taskAddModalOverlay";
  overlay.className = "ov-modal-overlay";
  overlay.innerHTML = `
    <div class="ov-modal-card" role="dialog" aria-modal="true" aria-label="New Task">
      <div class="ov-modal-head">
        <h3>📝 New Task</h3>
        <button type="button" class="ov-modal-close-btn" id="closeTaskAddModalBtn">✕ Close</button>
      </div>

      <div class="task-field-group">
        <label class="task-label" for="taskPropertySelect">Property</label>
        <select id="taskPropertySelect" class="task-input">
          <option value="">Select property</option>
          ${properties.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)}</option>`).join("")}
        </select>
      </div>

      <div class="task-field-group">
        <label class="task-label">Priority</label>
        <div class="task-priority-grid" id="taskPriorityGrid">
          <button type="button" class="task-priority-btn" data-priority="urgent"><span>⚠</span><span>Urgent</span></button>
          <button type="button" class="task-priority-btn task-priority-btn-active" data-priority="standard"><span>○</span><span>Standard</span></button>
          <button type="button" class="task-priority-btn" data-priority="follow_up"><span>◷</span><span>Follow Up</span></button>
        </div>
      </div>

      <div class="task-field-group">
        <label class="task-label" for="taskDescriptionInput">Description</label>
        <textarea id="taskDescriptionInput" class="task-input task-textarea" placeholder="Describe the task..."></textarea>
      </div>

      <div class="task-modal-actions">
        <button type="button" class="task-btn task-btn-ghost" id="taskCloseAddBtn">✕ Close</button>
        <button type="button" class="task-btn task-btn-primary" id="taskSaveBtn" disabled>💾 Save Task</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeModal = () => overlay.remove();
  const propertySelect = document.getElementById("taskPropertySelect");
  const descriptionInput = document.getElementById("taskDescriptionInput");
  const saveBtn = document.getElementById("taskSaveBtn");

  const updateSaveState = () => {
    const hasProperty = String(propertySelect.value || "").trim().length > 0;
    const hasDescription = String(descriptionInput.value || "").trim().length > 0;
    saveBtn.disabled = !(hasProperty && hasDescription);
  };

  document.getElementById("closeTaskAddModalBtn").onclick = closeModal;
  document.getElementById("taskCloseAddBtn").onclick = closeModal;
  overlay.onclick = e => {
    if (e.target === overlay) closeModal();
  };

  propertySelect.onchange = updateSaveState;
  descriptionInput.oninput = updateSaveState;

  document.querySelectorAll("#taskPriorityGrid .task-priority-btn").forEach(btn => {
    btn.onclick = () => {
      selectedPriority = btn.getAttribute("data-priority") || "standard";
      document.querySelectorAll("#taskPriorityGrid .task-priority-btn").forEach(item => item.classList.remove("task-priority-btn-active"));
      btn.classList.add("task-priority-btn-active");
    };
  });

  saveBtn.onclick = async () => {
    const property = String(propertySelect.value || "").trim();
    const description = String(descriptionInput.value || "").trim();
    if (!property || !description) return;

    const task = {
      id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : String(Date.now()),
      property,
      priority: selectedPriority,
      description,
      status: "new",
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    await createTask(task);
    closeModal();
    rerenderDailyOperationsIfActive();
    refreshTaskListModalView();
  };
}

function getYearMonthFromDate(dateStr) {
  if (!dateStr) return null;
  const s = String(dateStr).trim();

  // Handle YYYY-MM-DD without timezone shift
  const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) {
    return { year: m[1], month: m[2] };
  }

  const d = new Date(s);
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

function matchesReservationFilters(reservation) {
  // Keep each reservation in a single month bucket to avoid cross-month duplicates.
  const checkIn = String(reservation?.checkIn || "").trim();
  if (checkIn) return matchesFilters(checkIn);
  return matchesFilters(reservation?.checkOut);
}

function getFilteredReservations() {
  return reservationsData.filter(matchesReservationFilters);
}

function getFilteredOwnerStays() {
  return ownerStaysData.filter(s => matchesFilters(s.checkIn || s.checkInDate));
}

function shouldUseInlinePropertyCalendarsForOwner() {
  if (!currentOwner || currentOwner.admin || isDraftView) return false;
  const propertyNames = new Set(
    reservationsData
      .map(r => String(r.listingNickname || "").trim())
      .filter(Boolean)
  );
  return propertyNames.size > 1;
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
  if (isLoadingReport) return;

  const summaryBoxes = document.getElementById("summaryBoxes");
  const topCalendarBox = document.getElementById("topCalendarBox");
  if (!summaryBoxes && !topCalendarBox) return;

  const existingWrap = document.getElementById("reportFiltersWrap");
  if (currentOwner && currentOwner.admin && window.adminActiveTab !== "report") {
    if (existingWrap) existingWrap.remove();
    return;
  }

  

  let wrap = document.getElementById("reportFiltersWrap");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "reportFiltersWrap";
    wrap.className = "report-filters-wrap";
    wrap.style.display = "flex";
    wrap.style.justifyContent = "center";
    wrap.style.gap = "12px";
    wrap.style.margin = "12px 0 18px 0";
    wrap.style.flexWrap = "wrap";
    wrap.style.alignItems = "center";
  }

  const ownerPortal = document.getElementById("ownerPortal");
  const adminTopButtons = document.getElementById("adminTopButtons") || document.getElementById("draftViewModeToggle");
  const useInlinePropertyCalendars = shouldUseInlinePropertyCalendarsForOwner();

  if (currentOwner && currentOwner.admin && adminTopButtons && adminTopButtons.parentNode) {
    adminTopButtons.insertAdjacentElement("afterend", wrap);
  } else if (!useInlinePropertyCalendars && topCalendarBox) {
    topCalendarBox.appendChild(wrap);
  } else if (summaryBoxes && summaryBoxes.parentNode) {
    summaryBoxes.parentNode.insertBefore(wrap, summaryBoxes);
  } else if (ownerPortal) {
    ownerPortal.appendChild(wrap);
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
    <div class="filter-field-wrap">
      <label for="monthFilterSelect" class="filter-label">Month</label>
      <select id="monthFilterSelect" class="filter-select">
        ${monthOptions.map(m => `<option value="${m.v}">${m.t}</option>`).join("")}
      </select>
    </div>
    <div class="filter-field-wrap">
      <label for="yearFilterSelect" class="filter-label">Year</label>
      <select id="yearFilterSelect" class="filter-select">
        <option value="all">All Years</option>
        ${years.map(y => `<option value="${y}">${y}</option>`).join("")}
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
  if (isLoadingReport) return;
  configureHeaderLayoutByMode();
  renderSummaryBoxes();
  renderReservationsTable();
  renderFilterControls();
  setupCalendarButtons();
  refreshCalendarUI();
}

function setReportLoadingState(isLoading) {
  isLoadingReport = isLoading;

  const summaryBoxes = document.getElementById("summaryBoxes");
  const reservationsBody = document.getElementById("reservationsBody");
  const reservationsTitle = document.getElementById("reservationsTitle");
  const ownerPortal = document.getElementById("ownerPortal");

  let loadingBar = document.getElementById("reportLoadingBar");
  if (isLoading) {
    if (!loadingBar) {
      loadingBar = document.createElement("div");
      loadingBar.id = "reportLoadingBar";
      loadingBar.innerHTML = '<div class="report-loader-line"></div>';
      const target = summaryBoxes?.parentNode || ownerPortal;
      if (target) {
        target.insertBefore(loadingBar, summaryBoxes || target.firstChild);
      }
    }

    if (summaryBoxes) summaryBoxes.style.display = "none";
    if (reservationsBody && reservationsBody.closest("table")) {
      reservationsBody.closest("table").style.display = "none";
    }
    if (reservationsTitle) reservationsTitle.style.display = "none";
  } else {
    if (loadingBar) loadingBar.remove();
    if (summaryBoxes) summaryBoxes.style.display = "flex";
    if (reservationsBody && reservationsBody.closest("table")) {
      reservationsBody.closest("table").style.display = "table";
    }
    if (reservationsTitle && !(currentOwner && currentOwner.admin) && !isDraftView) reservationsTitle.style.display = "";
  }
}

// === EMAILJS CONFIGURATION ===
const EMAILJS_USER_ID = "ti3155";
const
 EMAILJS_SERVICE_ID = "service_06c56l2";
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

function hasDraftFinancialValue(reservation) {
  const gross = toNumber(reservation.grossPayout || reservation.totalPayout);
  const net = toNumber(reservation.draftNetAccommodation);
  const accommodation = toNumber(reservation.accommodationFare);
  return gross > 0 || net > 0 || accommodation > 0;
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
  const s = String(dateStr).trim();

  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const year = Number(isoMatch[1]);
    const month = Number(isoMatch[2]) - 1;
    const day = Number(isoMatch[3]);
    const d = new Date(year, month, day);
    return isNaN(d) ? null : d;
  }

  const usMatch = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (usMatch) {
    const month = Number(usMatch[1]) - 1;
    const day = Number(usMatch[2]);
    const year = Number(usMatch[3]);
    const d = new Date(year, month, day);
    return isNaN(d) ? null : d;
  }

  const fallback = new Date(s);
  if (isNaN(fallback)) return null;
  return new Date(fallback.getFullYear(), fallback.getMonth(), fallback.getDate());
}

function toDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = String(dateObj.getMonth() + 1).padStart(2, "0");
  const d = String(dateObj.getDate()).padStart(2, "0");
  return y + "-" + m + "-" + d;
}

function getCustomFieldValueById(reservation, fieldId) {
  const readFieldValue = (value) => {
    if (value == null) return "";
    if (typeof value === "object") {
      return String(value.children ?? value.value ?? value.label ?? value.name ?? "").trim();
    }
    return String(value).trim();
  };

  const lookupInContainer = (container) => {
    if (!container) return "";

    // Most common shape: object map keyed by field id.
    const byKey = container[fieldId];
    if (byKey != null) return readFieldValue(byKey);

    // Also support array shapes from Guesty where each item has an id and value.
    if (Array.isArray(container)) {
      const match = container.find(item => {
        const id = String(item?._id ?? item?.id ?? item?.fieldId ?? item?.field?._id ?? "").trim();
        return id === String(fieldId);
      });
      if (match) {
        return readFieldValue(
          match.value ??
          match.children ??
          match.answer ??
          match.text ??
          match.option ??
          match
        );
      }
    }

    return "";
  };

  const fromCustom = lookupInContainer(reservation?.customFields);
  if (fromCustom) return fromCustom;

  const fromRaw = lookupInContainer(reservation?.rawCustomFields);
  if (fromRaw) return fromRaw;

  return "";
}

function isCustomFieldYes(v) {
  const value = String(v || "").trim().toLowerCase();
  return ["yes", "y", "true", "1", "required", "elevator", "notice"].includes(value);
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

  if (expandBtn) {
    expandBtn.innerHTML = '<span aria-hidden="true">&#128197;</span>';
    expandBtn.title = "Open calendar";
    expandBtn.setAttribute("aria-label", "Toggle calendar");
  }

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
      expandBtn.classList.toggle("calendar-btn-active", opening);
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

function configureHeaderLayoutByMode() {
  const greetingContainer = document.getElementById("greetingContainer");
  const topCalendarBox = document.getElementById("topCalendarBox");
  const calendarPanel = document.getElementById("calendarPanel");
  const calendarSummary = document.getElementById("calendarToggleSummary");
  const showCalendarBtn = document.getElementById("showCalendarBtn");
  const reportFiltersWrap = document.getElementById("reportFiltersWrap");

  if (!greetingContainer) return;

  if (currentOwner && currentOwner.admin) {
    greetingContainer.style.display = "none";
    if (topCalendarBox) topCalendarBox.style.display = "none";
    if (calendarPanel) calendarPanel.style.display = "none";
    if (calendarSummary) calendarSummary.style.display = "none";
    if (reportFiltersWrap) reportFiltersWrap.style.margin = "8px 0 16px 0";
    return;
  }

  greetingContainer.style.display = "";
  const useInlinePropertyCalendars = shouldUseInlinePropertyCalendarsForOwner();

  if (useInlinePropertyCalendars) {
    if (topCalendarBox) topCalendarBox.style.display = "none";
    if (showCalendarBtn) showCalendarBtn.style.display = "none";
    if (calendarSummary) calendarSummary.style.display = "none";
    if (calendarPanel) calendarPanel.style.display = "none";
    if (reportFiltersWrap) reportFiltersWrap.style.margin = "8px 0 16px 0";
    return;
  }

  if (isDraftView) {
    if (topCalendarBox) topCalendarBox.style.display = "";
    if (showCalendarBtn) showCalendarBtn.style.display = "none";
    if (calendarSummary) calendarSummary.style.display = "none";
    if (calendarPanel) calendarPanel.style.display = "none";
    return;
  }

  if (topCalendarBox) topCalendarBox.style.display = "";
  if (showCalendarBtn) showCalendarBtn.style.display = "";
  if (calendarSummary) calendarSummary.style.display = "";
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
  if (greeting && currentOwner && !currentOwner.admin) {
    const propertyName = String(currentOwner.propertyName || "").toLowerCase();
    const displayOwnerName = propertyName.includes("2131 sanibel")
      ? "GSD INVESTMENTS"
      : currentOwner.ownerName;
    greeting.innerText = getTimeBasedGreeting() + " " + displayOwnerName;
  }
  if (propertyAddress && currentOwner && !currentOwner.admin) {
    propertyAddress.innerText = currentOwner.propertyName || "";
  }
  if (currentOwner && !currentOwner.admin) {
    renderWeather(currentOwner.postalCode);
  }
  configureHeaderLayoutByMode();
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
  const
 markup = pickNumber(r["money.invoiceItems.MAR"]?.value);

  const lengthOfStayDiscount = pickNumber(
    r["money.invoiceItems.LOS"]?.value,
    r["money.invoiceItems.lengthOfStayDiscount"]?.value,
    r.money?.invoiceItems?.LOS?.value,
    r.money?.invoiceItems?.lengthOfStayDiscount?.value,
    r.lengthOfStayDiscount
  );

  const standardAccommodationBase = baseAccommodation - markup + lengthOfStayDiscount;
let calculatedAccommodation = standardAccommodationBase;


  const sourceValue = pickText(
    r.source, r["source"], r["integration.source"], r.integration?.source, r.channel, r["channel"]
    );
    const CLEANING_CAPS_BY_PROPERTY = {
  "MB - Tuscan C": 500,
  "NMB - 204-27N": 450,
  "NMB - 204-28N": 500,
  "NMB - 703-2": 400,
  "NMB - 705-2": 400,
  "NMB - 709-2": 400,
  "NMB - 304B": 500,
  "NMB - 400A": 500,
  "NMB - 400B": 500,
  "MB - Tuscan A": 500,
  "MB - Tuscan B": 500,
  "GCSSB - 113A-12S": 500,
  "GCSSB - 113B-12S": 500,
  "NMB - 1004": 500,
  "GC - 1211A": 500,
  "GC - 601A": 400,
  "GC - 601B": 400,
  "GC - 827B": 500
};


  const totalPayoutValue = pickNumber(
  r["money.hostPayout"]?.value,
  r.money?.hostPayout?.value,
  r["preCancelationMoney.hostPayout"]?.value,
  r.preCancelationMoney?.hostPayout?.value,
  r["money.payout"]?.value,
  r.money?.payout?.value,
  r["money.totalPayout"]?.value,
  r.money?.totalPayout?.value,
  r.hostPayout,
  r.totalPayout,
  r.payout
);

  const numberOfNightsValueRaw = pickNumber(
  r["numberOfNights"]?.children, r.numberOfNights?.children, r["numberOfNights"]?.value, r.numberOfNights?.value, r.numberOfNights
);

const checkInValue = r["checkInDate"]?.value || pickDate(r.checkInDate, r.checkIn);
const checkOutValue = r["checkOutDate"]?.value || pickDate(r.checkOutDate, r.checkOut);

let computedNights = 0;
{
  const s = new Date(checkInValue);
  const e = new Date(checkOutValue);
  if (!isNaN(s) && !isNaN(e)) {
    computedNights = Math.max(0, Math.round((e - s) / (1000 * 60 * 60 * 24)));
  }
}

const numberOfNightsValue = numberOfNightsValueRaw > 0 ? numberOfNightsValueRaw : computedNights;

  const cleaningFareValue = pickNumber(
  r["money.fareCleaning"]?.value,
  r.money?.fareCleaning?.value,
  r["money.invoiceItems.CLEANING_FEE"]?.value,
  r["money.invoiceItems.CLEANING"]?.value,
  r["money.invoiceItems.CLF"]?.value,
  r.money?.invoiceItems?.CLEANING_FEE?.value,
  r.money?.invoiceItems?.CLEANING?.value,
  r.money?.invoiceItems?.CLF?.value,
  r.fareCleaning,
  r.cleaningFee
);
  

  const statusValue = String(pickText(r.status, r.reservationStatus, r["STATUS"], r["reservationStatus"]) || "").toLowerCase();
const isCancelledStatus = statusValue === "cancel" || statusValue === "cancelled" || statusValue === "canceled";
const hasPayout = totalPayoutValue > 0;
const effectiveCleaningFare = (isCancelledStatus && hasPayout) ? 0 : cleaningFareValue;
  const listingName = pickText(r["listing.nickname"], r.listingNickname, r.listing?.nickname, r.listing).trim();
const maxCleaningCap = CLEANING_CAPS_BY_PROPERTY[listingName] ?? 500;
const draftCleaningFare = Math.min(maxCleaningCap, Math.max(0, effectiveCleaningFare));

  const taxesCombined = pickNumber(
  r["money.fareTaxes"]?.value, r.money?.fareTaxes?.value, r.fareTaxes, r.taxes, r.tax
);

const detailedTaxesCombined =
  pickNumber(r["money.invoiceItems.CITY_TAX"]?.value, r.money?.invoiceItems?.CITY_TAX?.value) +
  pickNumber(r["money.invoiceItems.STATE_TAX"]?.value, r.money?.invoiceItems?.STATE_TAX?.value) +
  pickNumber(r["money.invoiceItems.COUNTY_TAX"]?.value, r.money?.invoiceItems?.COUNTY_TAX?.value) +
  pickNumber(r["money.invoiceItems.OCCUPANCY_TAX"]?.value, r.money?.invoiceItems?.OCCUPANCY_TAX?.value) +
  pickNumber(r["taxCounty"]?.value, r.taxCounty?.value, r.taxCounty) +
  pickNumber(r["taxOccupancy"]?.value, r.taxOccupancy?.value, r.taxOccupancy);

const allTaxesCombined = Math.max(0, taxesCombined, detailedTaxesCombined);

const airbnbResolutionCenter = pickNumber(
  r["money.invoiceItems.ARC"]?.value,
  r["money.invoiceItems.Arc"]?.value,
  r.money?.invoiceItems?.ARC?.value,
  r.money?.invoiceItems?.Arc?.value,
  r["money.invoiceItems.ARC"]?.amount,
  r["money.invoiceItems.Arc"]?.amount,
  r.airbnbResolutionCenter,
  r.resolutionCenter
);

const platformUpper = String(
  pickText(r["integration.platform"], r.platform, r.integration?.platform) || ""
).toUpperCase().trim();

const sourceUpper = String(sourceValue || "").toUpperCase().trim();

const isManualVrbo = sourceUpper.includes("MANUAL_VRBO") || sourceUpper.includes("VRBO_MANUAL");
const isManualDirect = sourceUpper.includes("MANUAL_DIRECT");
const isVrboDirect = sourceUpper.includes("VRBO_DIRECT") || sourceUpper.includes("DIRECT_VRBO");

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
const isDirect = sourceUpper.includes("DIRECT");
const isManual = sourceUpper === "MANUAL" || sourceUpper.includes("MANUAL");

const hostServiceFee = pickNumber(
  r["money.hostServiceFee"]?.value,
  r.money?.hostServiceFee?.value,
  r["money.hostServiceFee"],
  r.hostServiceFee
);

const feeCreditCard = pickNumber(
  r["feeCreditCard"]?.value,
  r.feeCreditCard?.value,
  r["money.invoiceItems.feeCreditCard"]?.value,
  r.money?.invoiceItems?.feeCreditCard?.value,
  r.feeCreditCard
);

const feeGuestService = pickNumber(
  r["feeGuestService"]?.value,
  r.feeGuestService?.value,
  r["money.invoiceItems.feeGuestService"]?.value,
  r.money?.invoiceItems?.feeGuestService?.value,
  r.feeGuestService
);

const isHostServiceFeeChannel = isVrboOrHomeAway || isWebsite || isDirect;
const isManualPercentChannel = isManual || isManualDirect;
const grossPayout = Math.max(0, totalPayoutValue);
const websiteCommissionFromGross = isWebsite
  ? Math.max(0, (grossPayout * 0.01) + 0.30)
  : 0;

// Draft formula channel commission only for VRBO/HOMEAWAY/DIRECT/WEBSITE.
// Explicitly exclude MANUAL_DIRECT, VRBO_DIRECT, and AIRBNB.
const isDraftChannelCommissionEligible =
  (isVrboOrHomeAway || isWebsite || isDirect) &&
  !isManualDirect &&
  !isVrboDirect &&
  !isAirbnb;

let channelCommissionForNet = 0;
if (isDraftChannelCommissionEligible) {
  if (isWebsite) {
    channelCommissionForNet = websiteCommissionFromGross;
  } else {
    channelCommissionForNet = Math.max(0, hostServiceFee);
  }
}

// Keep payout-mode deductions behavior unchanged from existing logic.
let channelCommissionForPayout = 0;
if (!(isAirbnb || isManualVrbo)) {
  if (isManualPercentChannel) {
    channelCommissionForPayout = Math.max(0, totalPayoutValue * 0.01);
  } else if (isWebsite) {
    channelCommissionForPayout = websiteCommissionFromGross;
  } else if (isHostServiceFeeChannel) {
    channelCommissionForPayout = Math.max(0, hostServiceFee);
  }
}

let creditCardFeeForPayout = 0;
creditCardFeeForPayout = Math.max(0, feeCreditCard);

const standardAccommodation =
  standardAccommodationBase;

calculatedAccommodation = standardAccommodation;

const draftNetAccommodation = Math.max(
  0,
  grossPayout -
    Math.max(0, draftCleaningFare) -
    Math.max(0, allTaxesCombined) +
    Math.max(0, lengthOfStayDiscount) -
    Math.max(0, channelCommissionForNet) -
    Math.max(0, feeCreditCard) -
    Math.max(0, airbnbResolutionCenter)
);

// Keep payout-mode accommodation behavior unchanged.
let allowedAccommodation = standardAccommodation;
let requiredDeductions = Math.max(0, effectiveCleaningFare) + Math.max(0, taxesCombined);
if (isHostServiceFeeChannel || isManualPercentChannel) {
  requiredDeductions += Math.max(0, channelCommissionForPayout);
}
requiredDeductions += Math.max(0, feeCreditCard);
const payoutHeadroom = totalPayoutValue - standardAccommodation;
const shouldUsePayoutFormula = payoutHeadroom < requiredDeductions;
if (shouldUsePayoutFormula) {
  allowedAccommodation = Math.max(
    0,
    grossPayout -
      Math.max(0, effectiveCleaningFare) -
      Math.max(0, taxesCombined) -
      Math.max(0, channelCommissionForPayout) -
      Math.max(0, feeCreditCard)
  );
}
calculatedAccommodation = Math.max(0, allowedAccommodation);

    return {
    status: pickText(r.status, r.reservationStatus, r["STATUS"], r["reservationStatus"]),
    listingNickname: pickText(r["listing.nickname"], r.listingNickname, r.listing?.nickname, r.listing),
    platform: (
  String(sourceValue || "").toUpperCase().includes("MANUAL_DIRECT") ||
  String(sourceValue || "").toUpperCase().includes("DIRECT_MANUAL")
)
  ? "Website (Old)"
  : (String(sourceValue || "").toUpperCase().includes("MANUAL")
      ? "Website"
      : pickText(r["integration.platform"], r.platform, r.integration?.platform, r.integration)),
source: sourceValue,
confirmationCode: (pickText(r["confirmationCode"], r.code, r.reservationCode) || "").toUpperCase(),
checkIn: checkInValue || "",
checkOut: checkOutValue || "",
numberOfNights: numberOfNightsValue,
totalPayout: totalPayoutValue,
cleaningFare: effectiveCleaningFare,
draftCleaningFare: draftCleaningFare,
accommodationFare: calculatedAccommodation,
    grossPayout,
    draftNetAccommodation,
    baseAccommodation,
    markup,
    lengthOfStayDiscount,
    vrboWebsiteFee: Math.max(0, channelCommissionForNet),
    creditCardFee: Math.max(0, creditCardFeeForPayout),
    guestName: pickText(r["guest.fullName"], r.guestName, r.guest?.fullName, r.guest, r["guest.name"]),
    taxesCombined,
    airbnbResolutionCenter,
    customFields: (function() {
      // Guesty shared reports may return custom fields as flat dot-notation keys
      // e.g. r["customFields.69682ec2a604dc001460d3c5"] instead of r.customFields[fieldId]
      const nested = pickDeep(r, "customFields", "custom_fields");
      const flat = {};
      for (const key of Object.keys(r)) {
        if (key.startsWith("customFields.")) {
          flat[key.slice("customFields.".length)] = r[key];
        }
      }
      if (Array.isArray(nested)) return nested;
      return Object.assign({}, flat, nested != null && typeof nested === "object" ? nested : {});
    })(),
    rawCustomFields: (function() {
      const nested = pickDeep(r, "rawCustomFields", "raw_custom_fields");
      const flat = {};
      for (const key of Object.keys(r)) {
        if (key.startsWith("rawCustomFields.")) {
          flat[key.slice("rawCustomFields.".length)] = r[key];
        }
      }
      if (Array.isArray(nested)) return nested;
      return Object.assign({}, flat, nested != null && typeof nested === "object" ? nested : {});
    })()
  };
}

function renderSummaryBoxes() {
  const summaryBoxes = document.getElementById("summaryBoxes");
  if (!summaryBoxes || !currentOwner) return;
  const isAdminReport = !!(currentOwner && currentOwner.admin && window.adminActiveTab === "report");
  const useDraftMode = isDraftView && !isAdminReport;
  renderFilterControls();
  if (currentOwner.admin && window.adminActiveTab !== "report") {
    summaryBoxes.innerHTML = "";
    summaryBoxes.style.display = "none";
    return;
  }

  summaryBoxes.style.display = "flex";
  const filteredReservations = useDraftMode
    ? reservationsData.filter(matchesReservationFilters)
    : getFilteredReservations();
  const filteredOwnerStays = getFilteredOwnerStays();

  let totalAccommodation = 0;
  let totalPMC = 0;
  let totalOwnerPayout = 0;
  let totalGrossPayout = 0;

  filteredReservations
  .filter(res => {
    const source = String(res.source || "").toUpperCase();
    return source !== "MANUAL_VRBO";
  })
  .forEach(reservation => {
    totalGrossPayout += toNumber(reservation.grossPayout || reservation.totalPayout);
    const accommodation = toNumber(reservation.accommodationFare);
    const pmcPercent = isAdminReport
      ? getPmcPercentForListing(reservation.listingNickname, 12)
      : currentOwner.pmcPercent;
    const pmc = accommodation * (pmcPercent / 100);
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
    (sum, res) => {
      const pmcPercent = isAdminReport
        ? getPmcPercentForListing(res.listingNickname, 12)
        : currentOwner.pmcPercent;
      return sum + (toNumber(res.accommodationFare) * (pmcPercent / 100));
    },
    0
  );

  const vrboGrossPayoutTotal = vrboManualRows.reduce(
    (sum, res) => sum + toNumber(res.grossPayout || res.totalPayout),
    0
  );

  totalAccommodation += vrboAccommodationTotal;
  totalPMC
 += vrboPmcTotal;
  totalOwnerPayout = totalAccommodation - totalPMC;
  totalGrossPayout += vrboGrossPayoutTotal;

  const bookedNightsCount = filteredReservations.reduce((sum, reservation) => {
    return sum + toNumber(reservation.numberOfNights);
  }, 0);

  const totalCleaning = filteredReservations.reduce((sum, reservation) => {
    return sum + toNumber(reservation.cleaningFare);
  }, 0);

  if (useDraftMode) {
    const draftRows = filteredReservations.filter(res => hasDraftFinancialValue(res));
    let grossPayoutTotal = 0;
    let netAccommodationTotal = 0;
    let cleaningFeeTotal = 0;
    let pmcTotal = 0;
    let bookedNightsDraft = 0;

    draftRows.forEach((res) => {
      grossPayoutTotal += toNumber(res.grossPayout || res.totalPayout);
      netAccommodationTotal += toNumber(res.draftNetAccommodation);
      cleaningFeeTotal += toNumber(res.draftCleaningFare ?? res.cleaningFare);
      pmcTotal += toNumber(res.draftNetAccommodation) * (currentOwner.pmcPercent / 100);
      bookedNightsDraft += toNumber(res.numberOfNights);
    });

    summaryBoxes.innerHTML = `
      <h2 style="text-align:center; width:100%; margin-bottom:12px;">SUMMARY</h2>
      <div class="summary-box">
        <div class="summary-label">GROSS PAYOUT</div>
        <div class="summary-value">${formatMoney(grossPayoutTotal)}</div>
      </div>
      <div class="summary-box">
        <div class="summary-label">CLEANING</div>
        <div class="summary-value">${formatMoney(cleaningFeeTotal)}</div>
      </div>
      <div class="summary-box">
        <div class="summary-label">NET ACCOMMODATION</div>
        <div class="summary-value">${formatMoney(netAccommodationTotal)}</div>
      </div>
      <div class="summary-box">
        <div class="summary-label">PMC</div>
        <div class="summary-value">${formatMoney(pmcTotal)}</div>
      </div>
      <div class="summary-box">
        <div class="summary-label">BOOKED NIGHTS</div>
        <div class="summary-value">${bookedNightsDraft}</div>
      </div>
    `;
    return;
  }

  summaryBoxes.innerHTML = isAdminReport
    ? `
      <h2 style="text-align:center; width:100%; margin-bottom:12px;">SUMMARY</h2>
      <div class="summary-box">
        <div class="summary-label">GROSS PAYOUT</div>
        <div class="summary-value">${formatMoney(totalGrossPayout)}</div>
      </div>
      <div class="summary-box">
        <div class="summary-label">NET ACCOMMODATION</div>
        <div class="summary-value">${formatMoney(totalAccommodation)}</div>
      </div>
      <div class="summary-box">
        <div class="summary-label">PMC</div>
        <div class="summary-value">${formatMoney(totalPMC)}</div>
      </div>
      <div class="summary-box">
        <div class="summary-label">CLEANING</div>
        <div class="summary-value">${formatMoney(totalCleaning)}</div>
      </div>
      <div class="summary-box">
        <div class="summary-label">BOOKED NIGHTS</div>
        <div class="summary-value">${bookedNightsCount}</div>
      </div>
    `
    : `
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
  const statementWorkspaceWrap = document.getElementById("statementWorkspaceWrap");
  if (statementWorkspaceWrap) statementWorkspaceWrap.remove();

  const tbody = document.getElementById("reservationsBody");
  const isAdminReport = !!(currentOwner && currentOwner.admin && window.adminActiveTab === "report");
  const useDraftMode = isDraftView && !isAdminReport;
  const reservationsTitle = document.getElementById("reservationsTitle");
  if (reservationsTitle) {
    reservationsTitle.style.display = (currentOwner && currentOwner.admin) || useDraftMode ? "none" : "";
  }
  const baseTable = tbody ? tbody.closest("table") : null;
  if (baseTable) baseTable.style.display = "table";
  const baseHeadRow = baseTable ? baseTable.querySelector("thead tr") : null;

  if (baseHeadRow) {
    // Code and Platform columns intentionally hidden per UI request (kept commented for quick restore).
    // <th style="text-align:center;">Code</th>
    // <th style="text-align:center;">Platform</th>
    baseHeadRow.innerHTML = useDraftMode
      ? `
          <th style="text-align:center;">Check-In</th>
          <th style="text-align:center;">Check-Out</th>
          <th style="text-align:center;">Nights</th>
          <th style="text-align:center;">Gross Payout</th>
          <th style="text-align:center;">Cleaning</th>
          <th style="text-align:center;">VRBO/Website Fee</th>
          <th style="text-align:center;">Net Accommodation</th>
          <th style="text-align:center;">PMC</th>
        `
      : `
          <th style="text-align:center;">Guest Name</th>
          <th style="text-align:center;">Check In</th>
          <th style="text-align:center;">Check Out</th>
          <th style="text-align:center;">Nights</th>
          <th style="text-align:center;">Accommodation</th>
          <th style="text-align:center;">PMC</th>
          <th style="text-align:center;">Owner Payout</th>
          <th style="text-align:center;">Expected Payout</th>
        `;
  }

if (tbody) {
  tbody.innerHTML = "";
}
const sortedReservations = [...getFilteredReservations()]
  .filter(res => {
    const source = String(res.source || "").toUpperCase();

    if (isDraftView) {
      return hasDraftFinancialValue(res); // draft/report should not hide valid rows when gross payout field is missing
    }

    return source !== "MANUAL_VRBO"; // payout unchanged
  })
  .sort((a, b) => {
    return toSortableDate(a.checkIn) - toSortableDate(b.checkIn);
  });
  
  if (tbody) {
  if (!sortedReservations.length) {
    const emptyCols = useDraftMode ? 8 : 8;
    tbody.innerHTML = `
      <tr>
        <td colspan="${emptyCols}" style="text-align:center;">No reservations found</td>
      </tr>
    `;
  } else {
    sortedReservations.forEach(reservation => {
 const grossPayout = toNumber(reservation.grossPayout || reservation.totalPayout);
const cleaning = isDraftView
  ? toNumber(reservation.draftCleaningFare ?? reservation.cleaningFare)
  : toNumber(reservation.cleaningFare);
const vrboWebsiteFee = toNumber(reservation.vrboWebsiteFee);
const accommodation = isDraftView
  ? toNumber(reservation.draftNetAccommodation)
  : toNumber(reservation.accommodationFare);
const pmc = accommodation * (currentOwner.pmcPercent / 100);
const ownerPayout = accommodation - pmc;
const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);
const nights = toNumber(reservation.numberOfNights);

      // Code and Platform cells intentionally hidden per UI request (kept commented for quick restore).
      // <td>${reservation.confirmationCode || ""} ...</td>
      // <td style="text-align:center;">${reservation.platform || ""}</td>

      tbody.innerHTML += `
        <tr>
          ${useDraftMode ? "" : `<td class="guest-name-cell" style="text-align:left;">${reservation.guestName || ""}${String(reservation.status || "").toLowerCase().includes("cancel") ? ' <span style="color:red; font-weight:700;">Cancelled with payout</span>' : ""}</td>`}
          <td style="text-align:center;">${formatDateDisplay(reservation.checkIn) || ""}</td>
          <td style="text-align:center;">${formatDateDisplay(reservation.checkOut) || ""}</td>
          <td style="text-align:center;">${nights}</td>
            ${
          useDraftMode
    ? `
      <td style="text-align:center;">${formatMoney(grossPayout)}</td>
      <td style="text-align:center;">${formatMoney(cleaning)}</td>
      <td style="text-align:center;">${formatMoney(vrboWebsiteFee)}</td>
      <td style="text-align:center;">${formatMoney(accommodation)}</td>
      <td style="text-align:center;">${formatMoney(pmc)}</td>
    `
    : `
      <td style="text-align:center;">${formatMoney(accommodation)}</td>
      <td style="text-align:center;">${formatMoney(pmc)}</td>
      <td style="text-align:center;">${formatMoney(ownerPayout)}</td>
      <td style="text-align:center;">${expectedPayoutDate}</td>
    `
}
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

let oldAdminDailyPage = document.getElementById("adminDailyPage");
if (oldAdminDailyPage && oldAdminDailyPage.parentNode) {
  oldAdminDailyPage.parentNode.removeChild(oldAdminDailyPage);
}

const renderAdminTopButtons = (activeTab) => {
  let oldAdminTopButtons = document.getElementById("adminTopButtons");
  if (oldAdminTopButtons && oldAdminTopButtons.parentNode) {
    oldAdminTopButtons.parentNode.removeChild(oldAdminTopButtons);
  }

  const adminTopButtons = document.createElement("div");
  adminTopButtons.id = "adminTopButtons";
  adminTopButtons.className = "mode-tabs";
  adminTopButtons.style.display = "flex";
  adminTopButtons.style.justifyContent = "center";
  adminTopButtons.style.gap = "10px";
  adminTopButtons.style.margin = "12px 0 18px 0";
  adminTopButtons.innerHTML = `
    <button id="adminDailyOperationBtnTop" class="mode-tab-btn ${activeTab === "daily" ? "mode-tab-btn-active" : ""}">Daily Operation</button>
    <button id="adminReportBtnTop" class="mode-tab-btn ${activeTab === "report" ? "mode-tab-btn-active" : ""}">Report</button>
    <button id="adminManageUsersBtnTop" class="mode-tab-btn">Users</button>
  `;

  const ownerPortal = document.getElementById("ownerPortal");
  const greetingAnchor = document.getElementById("greetingContainer");
  if (ownerPortal) {
    if (greetingAnchor && greetingAnchor.nextSibling) {
      ownerPortal.insertBefore(adminTopButtons, greetingAnchor.nextSibling);
    } else {
      ownerPortal.appendChild(adminTopButtons);
    }
  }

  const adminReportBtnTop = document.getElementById("adminReportBtnTop");
  if (adminReportBtnTop) {
    adminReportBtnTop.onclick = function() {
      window.adminActiveTab = "report";
      applyFiltersAndRender();
    };
  }

  const adminDailyOperationBtnTop = document.getElementById("adminDailyOperationBtnTop");
  if (adminDailyOperationBtnTop) {
    adminDailyOperationBtnTop.onclick = function() {
      window.adminActiveTab = "daily";
      applyFiltersAndRender();
    };
  }

  const adminManageUsersBtnTop = document.getElementById("adminManageUsersBtnTop");
  if (adminManageUsersBtnTop) {
    adminManageUsersBtnTop.onclick = function() {
      renderAdminPanel();
    };
  }
};

if (currentOwner && currentOwner.admin && window.adminActiveTab === "daily") {
  ensureTasksInitialized();
  const reservationsTitle = document.getElementById("reservationsTitle");
  if (reservationsTitle) reservationsTitle.style.display = "none";

  const summaryBoxes = document.getElementById("summaryBoxes");
  if (summaryBoxes) summaryBoxes.style.display = "none";
  const baseReportContainer = summaryBoxes ? summaryBoxes.closest(".container") : null;
  if (baseReportContainer) baseReportContainer.style.display = "none";

  const mainTable = tbody ? tbody.closest("table") : null;
  if (mainTable) mainTable.style.display = "none";
  renderAdminTopButtons("daily");
  
  const dailyPage = document.createElement("div");
  dailyPage.id = "adminDailyPage";
  dailyPage.style.margin = "20px auto";
  dailyPage.style.maxWidth = "1280px";
  dailyPage.style.padding = "20px";
  dailyPage.style.background = "#fff";
  dailyPage.style.border = "1px solid #e1e6ef";
  dailyPage.style.borderRadius = "12px";
  dailyPage.style.textAlign = "left";

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isCancelledStatus = (value) => {
    const s = String(value || "").toLowerCase().trim();
    return s === "cancel" || s === "cancelled" || s === "canceled";
  };

  const operationsRows = reservationsData.filter(r => {
    if (isCancelledStatus(r.status)) return false;
    const start = parseLocalDate(r.checkIn || "");
    const end = parseLocalDate(r.checkOut || "");
    return !!(start && end && end >= today);
  });

  const byDate = {};
  operationsRows.forEach(r => {
    const inDate = parseLocalDate(r.checkIn || "");
    const outDate = parseLocalDate(r.checkOut || "");
    if (inDate) {
      const inKey = toDateKey(inDate);
      if (!byDate[inKey]) byDate[inKey] = { checkIn: [], checkOut: [] };
      byDate[inKey].checkIn.push(r);
    }
    if (outDate) {
      const outKey = toDateKey(outDate);
      if (!byDate[outKey]) byDate[outKey] = { checkIn: [], checkOut: [] };
      byDate[outKey].checkOut.push(r);
    }
  });

  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 2);
  const isMobileDaily = window.innerWidth <= 768;
  const totalDays = isMobileDaily ? 365 : 365;

  const defaultWindowEnd = new Date(startDate);
  defaultWindowEnd.setDate(startDate.getDate() + totalDays - 1);

  const hasVisibleInDefaultWindow = operationsRows.some(r => {
    const s = parseLocalDate(r.checkIn || "");
    const e = parseLocalDate(r.checkOut || "");
    if (!s || !e) return false;
    return s <= defaultWindowEnd && e >= startDate;
  });

  const hasUpcomingStartInDefaultWindow = operationsRows.some(r => {
    const s = parseLocalDate(r.checkIn || "");
    if (!s) return false;
    return s >= today && s <= defaultWindowEnd;
  });

  if ((!hasVisibleInDefaultWindow || !hasUpcomingStartInDefaultWindow) && operationsRows.length) {
    const upcomingStarts = operationsRows
      .map(r => parseLocalDate(r.checkIn || ""))
      .filter(d => d && d >= today)
      .sort((a, b) => a - b);

    if (upcomingStarts.length) {
      startDate.setTime(upcomingStarts[0].getTime());
      startDate.setDate(startDate.getDate() - 2);
    }
  }

  const dayKeys = [];
  for (let i = 0; i < totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dayKeys.push(toDateKey(d));
  }

  const propertyGroupsOps = {};
  operationsRows.forEach(r => {
    const key = String(r.listingNickname || "Unknown Property").trim();
    if (!propertyGroupsOps[key]) propertyGroupsOps[key] = [];
    propertyGroupsOps[key].push(r);
  });

  const allFilteredRows = reservationsData.filter(r => !isCancelledStatus(r.status));
  const propertyNamesFromData = allFilteredRows
    .map(r => String(r.listingNickname || "").trim())
    .filter(Boolean);
  const orderedOpsProperties = getOrderedPropertyNames(Array.from(new Set(PROPERTY_ORDER.concat(propertyNamesFromData))));
  const groupedOpsProperties = getGroupedPropertyNames(orderedOpsProperties);

  const todayKey = toDateKey(today);
  const todayData = byDate[todayKey] || { checkIn: [], checkOut: [] };

  const renderOpsCell = (propertyRows, dayKey) => {
    const occupiedRows = propertyRows.filter(r => {
      const start = parseLocalDate(r.checkIn || "");
      const end = parseLocalDate(r.checkOut || "");
      if (!start || !end) return false;
      const day = parseLocalDate(dayKey);
      return day >= start && day < end;
    });

    const inCount = propertyRows.filter(r => String(r.checkIn || "").slice(0, 10) === dayKey).length;
    const outCount = propertyRows.filter(r => String(r.checkOut || "").slice(0, 10) === dayKey).length;

    const isSplitDay = inCount > 0 && outCount > 0;

    if (!occupiedRows.length && !inCount && !outCount) {
      return `<td class="ops-day-cell ${dayKey === todayKey ? "ops-today-col" : ""}"></td>`;
    }

    // Guard against marker-only days where no row is technically occupied in this date slice.
    if (!occupiedRows.length) {
      const markerHtml = (inCount || outCount)
        ? `<div class="ops-io-markers">${outCount ? `<span class="ops-out" title="CHECK-OUTS">${outCount}</span>` : ""}${inCount ? `<span class="ops-in" title="CHECK-INS">${inCount}</span>` : ""}</div>`
        : "";
      return `<td class="ops-day-cell ${dayKey === todayKey ? "ops-today-col" : ""} ${isSplitDay ? "ops-day-split" : ""}">${markerHtml}</td>`;
    }

    const first = occupiedRows[0];
    const startRows = occupiedRows.filter(r => String(r.checkIn || "").slice(0, 10) === dayKey);
    const primaryRow = startRows[0] || first;
    const isStart = occupiedRows.some(r => String(r.checkIn || "").slice(0, 10) === dayKey);
    const dayDate = parseLocalDate(dayKey);
    const isEnd = occupiedRows.some(r => {
      const out = parseLocalDate(String(r.checkOut || "").slice(0, 10));
      if (!out || !dayDate) return false;
      const prev = new Date(out);
      prev.setDate(prev.getDate() - 1);
      return toDateKey(prev) === dayKey;
    });

    const cls = ["ops-day-cell", "ops-occupied", dayKey === todayKey ? "ops-today-col" : "", isSplitDay ? "ops-day-split" : "", isStart ? "ops-start" : "", isEnd ? "ops-end" : ""].join(" ").trim();
    const markerHtml = (inCount || outCount)
      ? `<div class="ops-io-markers">${outCount ? `<span class="ops-out" title="CHECK-OUTS">${outCount}</span>` : ""}${inCount ? `<span class="ops-in" title="CHECK-INS">${inCount}</span>` : ""}</div>`
      : "";
    const guestName = String(primaryRow.guestName || "Guest");
    const hasElevator = isCustomFieldYes(getCustomFieldValueById(primaryRow, ADMIN_ELEVATOR_FIELD_ID));
    const startDate = parseLocalDate(String(primaryRow.checkIn || "").slice(0, 10));
    const endDate = parseLocalDate(String(primaryRow.checkOut || "").slice(0, 10));
    const nights = (startDate && endDate) ? Math.max(0, Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))) : 0;

    const label = isStart
      ? `${guestName}${startRows.length > 1 ? ` +${startRows.length - 1}` : ""}`
      : "";
    const durationText = (isStart && nights > 0) ? `${nights}N` : "";
    const elevatorAlertHtml = (isStart && hasElevator)
      ? `<span class="ops-pill-elevator-alert">NOTICE</span>`
      : "";

    const hoverText = occupiedRows.map(r => {
      const rStart = String(r.checkIn || "").slice(0, 10);
      const rEnd = String(r.checkOut || "").slice(0, 10);
      const startObj = parseLocalDate(rStart);
      const endObj = parseLocalDate(rEnd);
      const rowNights = (startObj && endObj) ? Math.max(0, Math.round((endObj - startObj) / (1000 * 60 * 60 * 24))) : 0;
      return `${String(r.guestName || "Guest")} | ${formatDateDisplay(rStart)} - ${formatDateDisplay(rEnd)} | ${rowNights}N`;
    }).join("\n").replace(/\"/g, "&quot;");

    return `<td class="${cls}" title="${hoverText}"><div class="ops-pill ${isStart ? "ops-pill-start" : ""} ${isEnd ? "ops-pill-end" : ""}">${label}${durationText ? `<span class="ops-pill-duration">${durationText}</span>` : ""}${elevatorAlertHtml}</div>${markerHtml}</td>`;
  };

  const dateHeaderHtml = dayKeys.map((key, idx) => {
    const d = parseLocalDate(key);
    const todayClass = key === todayKey ? "ops-today" : "";
    const showMonth = idx === 0 || d.getDate() === 1;
    const monthLabel = showMonth ? d.toLocaleDateString("en-US", { month: "short" }) : "";
    return `<th class="ops-date-head ${todayClass}" data-date="${key}"><div>${monthLabel}</div><div>${String(d.getDate()).padStart(2, "0")}</div></th>`;
  }).join("");

  const openTaskCount = getOpenTaskCount();
  const upcomingWindowEnd = new Date(today);
  upcomingWindowEnd.setDate(upcomingWindowEnd.getDate() + 14);

  const upcomingCheckIns = operationsRows
    .filter(row => {
      const inDate = parseLocalDate(row.checkIn || "");
      return inDate && inDate >= today && inDate <= upcomingWindowEnd;
    })
    .sort((a, b) => toSortableDate(a.checkIn) - toSortableDate(b.checkIn));

  const upcomingElevators = operationsRows
    .filter(row => {
      const inDate = parseLocalDate(row.checkIn || "");
      const hasElevator = isCustomFieldYes(getCustomFieldValueById(row, ADMIN_ELEVATOR_FIELD_ID));
      return hasElevator && inDate && inDate >= today;
    })
    .sort((a, b) => toSortableDate(a.checkIn) - toSortableDate(b.checkIn));

  const rowsHtml = groupedOpsProperties.length
    ? groupedOpsProperties.map(group => {
        const categoryRow = `
          <tr>
            <th class="ops-category-head" colspan="${dayKeys.length + 1}">${group.category}</th>
          </tr>
        `;
        const propertyRows = group.names.map(propertyName => {
          const rowsForProperty = propertyGroupsOps[propertyName] || [];
          return `
            <tr>
              <th class="ops-property-col">${propertyName}</th>
              ${dayKeys.map(dayKey => renderOpsCell(rowsForProperty, dayKey)).join("")}
            </tr>
          `;
        }).join("");
        return categoryRow + propertyRows;
      }).join("")
    : `<tr><th class="ops-property-col">No properties</th><td class="ops-day-cell" colspan="${dayKeys.length}">No upcoming operations.</td></tr>`;

  const upcomingRowsHtml = upcomingCheckIns.length
    ? upcomingCheckIns.map(row => {
        const inDateObj = parseLocalDate(row.checkIn || "");
        const dateKey = inDateObj ? toDateKey(inDateObj) : "";
        const daysAway = inDateObj ? Math.ceil((inDateObj - today) / (1000 * 60 * 60 * 24)) : 99;
        const urgencyClass = daysAway <= 3 ? "upcoming-dot-soon" : "upcoming-dot-safe";
        return `
          <button type="button" class="upcoming-item" data-date="${dateKey}">
            <span class="upcoming-dot ${urgencyClass}"></span>
            <span class="upcoming-item-text"><strong>${escapeHtml(row.listingNickname || "Property")}</strong> — ${escapeHtml(formatDateDisplay(row.checkIn))}</span>
          </button>
        `;
      }).join("")
    : `<div class="upcoming-empty">No upcoming check-ins in the next 14 days.</div>`;

  const upcomingElevatorRowsHtml = upcomingElevators.length
    ? upcomingElevators.map(row => {
        const inDateObj = parseLocalDate(row.checkIn || "");
        const dateKey = inDateObj ? toDateKey(inDateObj) : "";
        const daysAway = inDateObj ? Math.ceil((inDateObj - today) / (1000 * 60 * 60 * 24)) : 99;
        const urgencyClass = daysAway <= 3 ? "upcoming-dot-soon" : "upcoming-dot-safe";
        return `
          <button type="button" class="upcoming-item" data-date="${dateKey}">
            <span class="upcoming-dot ${urgencyClass}"></span>
            <span class="upcoming-item-text"><strong>${escapeHtml(row.listingNickname || "Property")}</strong> — ${escapeHtml(formatDateDisplay(row.checkIn))}</span>
          </button>
        `;
      }).join("")
    : `<div class="upcoming-empty">No upcoming elevator arrivals in the next 14 days.</div>`;

  dailyPage.innerHTML = `
    <h2 style="margin:0 0 14px 0; text-align:center;">DAILY OPERATION</h2>
    <div class="daily-top-grid">
      <div class="summary-box daily-metric-card" style="margin:0;">
        <div class="summary-label">TODAY CHECK-INS</div>
        <div class="summary-value">${todayData.checkIn.length}</div>
      </div>
      <div class="summary-box daily-metric-card" style="margin:0;">
        <div class="summary-label">TODAY CHECK-OUTS</div>
        <div class="summary-value">${todayData.checkOut.length}</div>
      </div>
      <div class="summary-box tasks-panel-card" style="margin:0;">
        <div class="tasks-panel-head">
          <div class="tasks-head-title">📋 Tasks</div>
          <span class="tasks-count-badge ${openTaskCount > 0 ? "tasks-count-badge-pulse" : ""}">${openTaskCount}</span>
        </div>
        <div class="tasks-panel-actions">
          <button type="button" class="task-btn task-btn-outline" id="viewTasksBtn">🗂 View Tasks</button>
          <button type="button" class="task-btn task-btn-primary" id="addTaskBtn">＋ Add Task</button>
        </div>
      </div>
    </div>

    <div class="upcoming-panels-grid">
      <div class="upcoming-panel ${isUpcomingCheckInsExpanded ? "upcoming-panel-open" : ""}">
        <button type="button" class="upcoming-panel-header" id="upcomingPanelToggleBtn" aria-expanded="${isUpcomingCheckInsExpanded ? "true" : "false"}">
          <span class="upcoming-head-left">🏢 Upcoming Check-Ins</span>
          <span class="upcoming-head-count">${upcomingCheckIns.length} upcoming</span>
          <span class="upcoming-chevron ${isUpcomingCheckInsExpanded ? "upcoming-chevron-open" : ""}">⌄</span>
        </button>
        <div class="upcoming-panel-body ${isUpcomingCheckInsExpanded ? "upcoming-panel-body-open" : ""}" id="upcomingPanelBody">
          ${upcomingRowsHtml}
        </div>
      </div>
      <div class="upcoming-panel ${isUpcomingElevatorsExpanded ? "upcoming-panel-open" : ""}">
        <button type="button" class="upcoming-panel-header" id="upcomingElevatorToggleBtn" aria-expanded="${isUpcomingElevatorsExpanded ? "true" : "false"}">
          <span class="upcoming-head-left">🛗 Upcoming Elevators</span>
          <span class="upcoming-head-count">${upcomingElevators.length} upcoming</span>
          <span class="upcoming-chevron ${isUpcomingElevatorsExpanded ? "upcoming-chevron-open" : ""}">⌄</span>
        </button>
        <div class="upcoming-panel-body ${isUpcomingElevatorsExpanded ? "upcoming-panel-body-open" : ""}" id="upcomingElevatorBody">
          ${upcomingElevatorRowsHtml}
        </div>
      </div>
    </div>
    <div style="display:flex; justify-content:center; margin:0 0 10px 0;">
      <button type="button" class="task-btn task-btn-outline" id="opsTodayBtn">TODAY</button>
    </div>
    <div class="admin-ops-scroll" id="adminOpsScrollWrap">
      <table class="admin-ops-table">
        <thead>
          <tr>
            <th class="ops-property-col ops-property-head">Property</th>
            ${dateHeaderHtml}
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>
    <div style="font-size:12px; color:#54657c; margin-top:8px;">Drag or scroll left/right to inspect all days. Today is highlighted.</div>
  `;

  if (ownerPortal) ownerPortal.appendChild(dailyPage);

  const viewTasksBtn = document.getElementById("viewTasksBtn");
  const addTaskBtn = document.getElementById("addTaskBtn");
  if (viewTasksBtn) viewTasksBtn.onclick = () => openTaskListModal();
  if (addTaskBtn) addTaskBtn.onclick = () => openAddTaskModal();

  const opsScroll = document.getElementById("adminOpsScrollWrap");
  if (opsScroll) {
    const todayIdx = dayKeys.indexOf(todayKey);
    if (todayIdx >= 0) {
      const leftStickyWidth = isMobileDaily ? 154 : 230;
      const cellWidth = isMobileDaily ? 64 : 92;
      opsScroll.scrollLeft = Math.max(0, leftStickyWidth + (todayIdx * cellWidth) - 160);
    }
  }

  const toggleUpcomingBtn = document.getElementById("upcomingPanelToggleBtn");
  if (toggleUpcomingBtn) {
    toggleUpcomingBtn.onclick = () => {
      isUpcomingCheckInsExpanded = !isUpcomingCheckInsExpanded;
      rerenderDailyOperationsIfActive();
    };
  }

  const toggleUpcomingElevatorBtn = document.getElementById("upcomingElevatorToggleBtn");
  if (toggleUpcomingElevatorBtn) {
    toggleUpcomingElevatorBtn.onclick = () => {
      isUpcomingElevatorsExpanded = !isUpcomingElevatorsExpanded;
      rerenderDailyOperationsIfActive();
    };
  }

  const opsTodayBtn = document.getElementById("opsTodayBtn");
  if (opsTodayBtn) {
    opsTodayBtn.onclick = () => {
      if (!opsScroll) return;
      const dayIndex = dayKeys.indexOf(todayKey);
      if (dayIndex < 0) return;

      const leftStickyWidth = isMobileDaily ? 154 : 230;
      const cellWidth = isMobileDaily ? 64 : 92;
      opsScroll.scrollLeft = Math.max(0, leftStickyWidth + (dayIndex * cellWidth) - 160);

      const headerCell = document.querySelector(`.ops-date-head[data-date="${todayKey}"]`);
      if (headerCell) {
        headerCell.classList.add("ops-date-focus");
        setTimeout(() => headerCell.classList.remove("ops-date-focus"), 900);
      }
    };
  }

  document.querySelectorAll(".upcoming-item").forEach(itemBtn => {
    itemBtn.onclick = () => {
      if (!opsScroll) return;
      const targetDate = String(itemBtn.getAttribute("data-date") || "");
      const dayIndex = dayKeys.indexOf(targetDate);
      if (dayIndex < 0) return;

      const leftStickyWidth = isMobileDaily ? 154 : 230;
      const cellWidth = isMobileDaily ? 64 : 92;
      opsScroll.scrollLeft = Math.max(0, leftStickyWidth + (dayIndex * cellWidth) - 160);

      const headerCell = document.querySelector(`.ops-date-head[data-date="${targetDate}"]`);
      if (headerCell) {
        headerCell.classList.add("ops-date-focus");
        setTimeout(() => headerCell.classList.remove("ops-date-focus"), 900);
      }
    };
  });
 
  const toggleWrap = document.getElementById("draftViewModeToggle");
  if (toggleWrap) toggleWrap.style.display = "none";
  return;
}

if (currentOwner && currentOwner.admin) {
  const summaryBoxes = document.getElementById("summaryBoxes");
  const baseReportContainer = summaryBoxes ? summaryBoxes.closest(".container") : null;
  if (baseReportContainer) baseReportContainer.style.display = "";
}
  
  const propertyGroups = {};
  sortedReservations.forEach(reservation => {
    const propertyKey = (reservation.listingNickname || "Unknown Property").trim();
    if (!propertyGroups[propertyKey]) propertyGroups[propertyKey] = [];
    propertyGroups[propertyKey].push(reservation);
  });

  const propertyNames = Object.keys(propertyGroups);

  if (isAdminReport) {
    renderAdminTopButtons("report");

    const mainTable = tbody ? tbody.closest("table") : null;
    if (mainTable) mainTable.style.display = "none";

    const tableWraps = document.getElementsByClassName("table-wrap");
    let container = null;
    if (tableWraps.length > 0) {
      container = tableWraps[0].parentNode;
    } else {
      container = document.body;
    }

    const propertyWrap = document.createElement("div");
    propertyWrap.id = "propertyGroupsWrap";
    const orderedPropertyNames = getOrderedPropertyNames(Object.keys(propertyGroups));
    const groupedPropertyNames = getGroupedPropertyNames(orderedPropertyNames);

    propertyWrap.innerHTML = `
      <h3 class="section-title" style="text-align:center; margin-top:20px;">Totals Per Property</h3>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th style="text-align:left;">PROPERTY</th>
              <th style="text-align:center;">NET ACCOMMODATION</th>
              <th style="text-align:center;">PMC</th>
              <th style="text-align:center;">GROSS PAYOUT</th>
              <th style="text-align:center;">BOOKED NIGHTS</th>
              <th style="text-align:center;">STAYS</th>
            </tr>
          </thead>
          <tbody>
            ${groupedPropertyNames.length ? groupedPropertyNames.map(group => {
              const categoryRow = `
                <tr>
                  <td colspan="6" class="property-category-row">${group.category}</td>
                </tr>
              `;
              const propertyRows = group.names.map(propertyName => {
              const rows = propertyGroups[propertyName] || [];
              let accommodationTotal = 0;
              let grossPayoutTotal = 0;
              let pmcTotal = 0;
              const bookedMap = {};

              rows.forEach(res => {
                grossPayoutTotal += toNumber(res.grossPayout || res.totalPayout);
                const accommodation = toNumber(res.accommodationFare);
                const pmcPercent = getPmcPercentForListing(res.listingNickname, 12);
                const pmc = accommodation * (pmcPercent / 100);
                accommodationTotal += accommodation;
                pmcTotal += pmc;

                const start = parseLocalDate(res.checkIn);
                const end = parseLocalDate(res.checkOut);
                if (start && end) {
                  const cur = new Date(start);
                  while (cur < end) {
                    bookedMap[toDateKey(cur)] = true;
                    cur.setDate(cur.getDate() + 1);
                  }
                }
              });

              return `
                <tr>
                  <td style="text-align:left;">${propertyName}</td>
                  <td style="text-align:center;">${formatMoney(accommodationTotal)}</td>
                  <td style="text-align:center;">${formatMoney(pmcTotal)}</td>
                  <td style="text-align:center;">${formatMoney(grossPayoutTotal)}</td>
                  <td style="text-align:center;">${Object.keys(bookedMap).length}</td>
                  <td style="text-align:center;">${rows.length}</td>
                </tr>
              `;
            }).join("");
              return categoryRow + propertyRows;
            }).join("") : `<tr><td colspan="6" style="text-align:center;">No reservations found for selected filters.</td></tr>`}
          </tbody>
        </table>
      </div>
    `;

    container.appendChild(propertyWrap);
    return;
  }

  if (propertyNames.length > 1) {
    const isDraftMulti = useDraftMode && propertyNames.length > 1;

let oldDraftViewToggle = document.getElementById("draftViewModeToggle");
if (oldDraftViewToggle && oldDraftViewToggle.parentNode) {
  oldDraftViewToggle.parentNode.removeChild(oldDraftViewToggle);
}

let oldAdminTopButtons = document.getElementById("adminTopButtons");
if (oldAdminTopButtons && oldAdminTopButtons.parentNode) {
  oldAdminTopButtons.parentNode.removeChild(oldAdminTopButtons);
}

if (isDraftMulti) {
  const toggleWrap = document.createElement("div");
  const isAdminMode = !!(currentOwner && currentOwner.admin);
  toggleWrap.id = isAdminMode ? "adminTopButtons" : "draftViewModeToggle";
  toggleWrap.className = "mode-tabs";
  toggleWrap.style.display = "flex";
  toggleWrap.style.justifyContent = "center";
  toggleWrap.style.gap = "10px";
  toggleWrap.style.margin = "12px 0 18px 0";

  toggleWrap.innerHTML = currentOwner && currentOwner.admin
  ? `
      <button id="adminDailyOperationBtn" class="mode-tab-btn">Daily Operation</button>
      <button id="adminIncomeBtn" class="mode-tab-btn mode-tab-btn-active">Report</button>
      <button id="adminManageUsersBtn" class="mode-tab-btn">Users</button>
    `
  : `
      <button id="draftSmartViewBtn" class="mode-tab-btn ${draftMultiPropertyViewMode === "smart" ? "mode-tab-btn-active" : ""}">Smart View</button>
      <button id="draftExtendedViewBtn" class="mode-tab-btn ${draftMultiPropertyViewMode === "extended" ? "mode-tab-btn-active" : ""}">Extended View</button>
    `;

  const summaryBoxes = document.getElementById("summaryBoxes");
  if (isAdminMode) {
    const ownerPortal = document.getElementById("ownerPortal");
    const greetingAnchor = document.getElementById("greetingContainer");
    if (ownerPortal) {
      if (greetingAnchor && greetingAnchor.nextSibling) {
        ownerPortal.insertBefore(toggleWrap, greetingAnchor.nextSibling);
      } else {
        ownerPortal.appendChild(toggleWrap);
      }
    }
  } else if (summaryBoxes && summaryBoxes.parentNode) {
    summaryBoxes.parentNode.insertBefore(toggleWrap, summaryBoxes);
  }

  const smartBtn = document.getElementById("draftSmartViewBtn");
  const extendedBtn = document.getElementById("draftExtendedViewBtn");
  const adminIncomeBtn = document.getElementById("adminIncomeBtn");
  const adminManageUsersBtn = document.getElementById("adminManageUsersBtn");
  const adminDailyOperationBtn = document.getElementById("adminDailyOperationBtn");

  if (adminIncomeBtn) {
  adminIncomeBtn.onclick = function() {
    window.adminActiveTab = "report";
    applyFiltersAndRender();
  };
}

if (adminManageUsersBtn) {
  adminManageUsersBtn.onclick = function() {
    renderAdminPanel();
  };
}

if (adminDailyOperationBtn) {
  adminDailyOperationBtn.onclick = function() {
    window.adminActiveTab = "daily";
    applyFiltersAndRender();
  };
}

  if (smartBtn) {
    smartBtn.onclick = function() {
      draftMultiPropertyViewMode = "smart";
      applyFiltersAndRender();
    };
  }

  if (extendedBtn) {
    extendedBtn.onclick = function() {
      draftMultiPropertyViewMode = "extended";
      applyFiltersAndRender();
    };
  }
}

const mainTable = tbody ? tbody.closest("table") : null;
if (mainTable && mainTable.parentNode) {
  mainTable.style.display = "none";
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

const orderedPropertyNames = getOrderedPropertyNames(Object.keys(propertyGroups));
const groupedPropertyNames = getGroupedPropertyNames(orderedPropertyNames);

  if (useDraftMode && draftMultiPropertyViewMode === "smart") {
  propertyWrap.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="text-align:left; font-weight:bold;"><strong>PROPERTY</strong></th>
            <th style="text-align:center; font-weight:bold;"><strong>GROSS PAYOUT</strong></th>
            <th style="text-align:center; font-weight:bold;"><strong>CLEANING</strong></th>
            <th style="text-align:center; font-weight:bold;"><strong>VRBO/WEBSITE FEE</strong></th>
            <th style="text-align:center; font-weight:bold;"><strong>NET ACCOMMODATION</strong></th>
            <th style="text-align:center; font-weight:bold;"><strong>PMC</strong></th>
          </tr>
        </thead>
        <tbody>
          ${groupedPropertyNames.map(group => {
            const categoryRow = `
              <tr>
                <td colspan="5" class="property-category-row">${group.category}</td>
              </tr>
            `;
            const propertyRows = group.names.map(propertyName => {
              const rows = propertyGroups[propertyName]
              .filter(matchesReservationFilters)
              .sort((a, b) => toSortableDate(a.checkIn) - toSortableDate(b.checkIn));

            let grossTotal = 0;
            let cleaningTotal = 0;
            let feeTotal = 0;
            let netTotal = 0;
            let pmcTotal = 0;

            rows.forEach(res => {
              const gross = toNumber(res.grossPayout || res.totalPayout);
              const cleaning = toNumber(res.draftCleaningFare);
              const fee = toNumber(res.vrboWebsiteFee);
              const net = toNumber(res.draftNetAccommodation);
              grossTotal += gross;
              cleaningTotal += cleaning;
              feeTotal += fee;
              netTotal += net;
              pmcTotal += net * (currentOwner.pmcPercent / 100);
            });

            return `
              <tr>
                <td style="text-align:left;">${propertyName}</td>
                <td style="text-align:center;">${formatMoney(grossTotal)}</td>
                <td style="text-align:center;">${formatMoney(cleaningTotal)}</td>
                <td style="text-align:center;">${formatMoney(feeTotal)}</td>
                <td style="text-align:center;">${formatMoney(netTotal)}</td>
                <td style="text-align:center;">${formatMoney(pmcTotal)}</td>
              </tr>
            `;
            }).join("");
            return categoryRow + propertyRows;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;

  container.appendChild(propertyWrap);
  return;
}

    let lastCategory = "";
    orderedPropertyNames.forEach(propertyName => {
      const category = getPropertyCategory(propertyName);
      if (category !== lastCategory) {
        propertyWrap.innerHTML += `<h3 class="section-title property-category-title" style="text-align:center; margin:26px 0 8px 0;">${category}</h3>`;
        lastCategory = category;
      }

      const rows = propertyGroups[propertyName]
  .filter(matchesReservationFilters)
  .sort((a, b) => {
    return toSortableDate(a.checkIn) - toSortableDate(b.checkIn);
  });

      let propertyGrossPayout = 0;
      let propertyCleaning = 0;
      let propertyAccommodation = 0;
      let propertyPmc = 0;
      let propertyOwnerPayout = 0;

rows.forEach(reservation => {
  const gross = toNumber(reservation.grossPayout || reservation.totalPayout);
  const cleaning = useDraftMode
  ? toNumber(reservation.draftCleaningFare ?? reservation.cleaningFare)
  : toNumber(reservation.cleaningFare);
  const accommodation = useDraftMode
    ? toNumber(reservation.draftNetAccommodation)
    : toNumber(reservation.accommodationFare);
  const pmc = accommodation * (currentOwner.pmcPercent / 100);
  const ownerPayout = accommodation - pmc;

  propertyGrossPayout += gross;
  propertyCleaning += cleaning;
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

      const propertyStaysCount = rows.reduce((count, reservation) => {
  const status = String(reservation.status || "").toLowerCase().trim();
  const isCancelled = status === "cancel" || status === "cancelled" || status === "canceled";
  return isCancelled ? count : count + 1;
}, 0);
      

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
       <div style="margin-top:40px; padding-top:20px; border-top:1px solid #d9e6f2;">
          <h3 class="section-title" style="text-align:center; margin-bottom:12px;">${propertyName}</h3>
<div style="display:flex; justify-content:center; gap:18px; flex-wrap:wrap; margin-bottom:14px;">
  ${
    useDraftMode
      ? `
        <div class="summary-box">
          <div class="summary-label">GROSS PAYOUT</div>
          <div class="summary-value">${formatMoney(propertyGrossPayout)}</div>
        </div>
        <div class="summary-box">
          <div class="summary-label">CLEANING</div>
          <div class="summary-value">${formatMoney(propertyCleaning)}</div>
        </div>
        <div class="summary-box">
          <div class="summary-label">NET ACCOMMODATION</div>
          <div class="summary-value">${formatMoney(propertyAccommodation)}</div>
        </div>
        <div class="summary-box">
          <div class="summary-label">PMC</div>
          <div class="summary-value">${formatMoney(propertyPmc)}</div>
        </div>
        <div class="summary-box">
          <div class="summary-label">BOOKED NIGHTS</div>
          <div class="summary-value">${propertyBookedNights}</div>
        </div>
        <div class="summary-box">
          <div class="summary-label">STAYS</div>
          <div class="summary-value">${propertyStaysCount}</div>
        </div>
      `
      : `
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
        <div class="summary-box">
          <div class="summary-label">STAYS</div>
          <div class="summary-value">${propertyStaysCount}</div>
        </div>
      `
  }
</div>

          ${useDraftMode && draftMultiPropertyViewMode !== "extended" ? "" : `
<div class="property-calendar-toggle-wrap">
  <button id="${openBtnId}" class="property-calendar-toggle-btn" aria-label="Open calendar" title="Open calendar">
    &#128197;
  </button>
</div>
`}

${useDraftMode && draftMultiPropertyViewMode === "extended" ? `<div class="property-open-res-wrap"><button class="toggle-reservations-btn" data-target="prop-table-${propIdSafe}">Open Reservations</button></div>` : ""}
<div id="prop-table-${propIdSafe}" style="display:${useDraftMode ? (draftMultiPropertyViewMode === "extended" ? "none" : "none") : "block"};">

          <div class="table-wrap">
            <table>
              <thead>
               ${
  useDraftMode
    ? `
      <tr>
        <th style="text-align:center;">Check-In</th>
        <th style="text-align:center;">Check-Out</th>
        <th style="text-align:center;">Nights</th>
        <th style="text-align:center;">GROSS PAYOUT</th>
        <th style="text-align:center;">CLEANING</th>
        <th style="text-align:center;">VRBO/Website Fee</th>
        <th style="text-align:center;">NET ACCOMMODATION</th>
        <th style="text-align:center;">PMC</th>
      </tr>
    `
    : `
      <tr>
        <th style="text-align:center;">Guest Name</th>
        <th style="text-align:center;">Check In</th>
        <th style="text-align:center;">Check Out</th>
        <th style="text-align:center;">Nights</th>
        <th style="text-align:center;">Accommodation</th>
        <th style="text-align:center;">PMC</th>
        <th style="text-align:center;">Owner Payout</th>
        <th style="text-align:center;">Expected Payout</th>
      </tr>
    `
}
              </thead>
              <tbody>
                ${rows.map(reservation => {
                  const grossPayout = toNumber(reservation.grossPayout || reservation.totalPayout);
const cleaning = useDraftMode
  ? toNumber(reservation.draftCleaningFare ?? reservation.cleaningFare)
  : toNumber(reservation.cleaningFare);
const vrboWebsiteFee = toNumber(reservation.vrboWebsiteFee);
const accommodation = useDraftMode
  ? toNumber(reservation.draftNetAccommodation)
  : toNumber(reservation.accommodationFare);
const pmc = accommodation * (currentOwner.pmcPercent / 100);
const ownerPayout = accommodation - pmc;
const expectedPayoutDate = getExpectedPayoutDate(reservation.checkOut);
const nights = toNumber(reservation.numberOfNights);

                  // Code and Platform cells intentionally hidden per UI request (kept commented for quick restore).
                  // <td>${reservation.confirmationCode || ""} ...</td>
                  // <td style="text-align:center;">${reservation.platform || ""}</td>

                  return `
                    <tr>
                      ${useDraftMode ? "" : `<td class="guest-name-cell" style="text-align:left;">${reservation.guestName || ""}${String(reservation.status
 || "").toLowerCase().includes("cancel") ? ' <span style="color:red; font-weight:700;">Cancelled with payout</span>' : ""}</td>`}
                      <td style="text-align:center;">${formatDateDisplay(reservation.checkIn) || ""}</td>
                      <td style="text-align:center;">${formatDateDisplay(reservation.checkOut) || ""}</td>
                      <td style="text-align:center;">${nights}</td>
                      ${
  useDraftMode
    ? `
      <td style="text-align:center;">${formatMoney(grossPayout)}</td>
      <td style="text-align:center;">${formatMoney(cleaning)}</td>
      <td style="text-align:center;">${formatMoney(vrboWebsiteFee)}</td>
      <td style="text-align:center;">${formatMoney(accommodation)}</td>
      <td style="text-align:center;">${formatMoney(pmc)}</td>
    `
    : `
      <td style="text-align:center;">${formatMoney(accommodation)}</td>
      <td style="text-align:center;">${formatMoney(pmc)}</td>
      <td style="text-align:center;">${formatMoney(ownerPayout)}</td>
      <td style="text-align:center;">${expectedPayoutDate}</td>
    `
}
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          </div>
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

document.querySelectorAll(".toggle-reservations-btn").forEach((btn) => {
  btn.onclick = () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    const isOpen = target.style.display !== "none";
    target.style.display = isOpen ? "none" : "block";
    btn.textContent = isOpen ? "Open Reservations" : "Close Reservations";
  };
});
    
    orderedPropertyNames.forEach(propertyName => {
      const rows = propertyGroups[propertyName]
  .filter(matchesReservationFilters)
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
    <h3 class="section-title" style="margin-top:40px; text-align:center;">OWNER STAYS</h3>
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
if (!useDraftMode) {
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
  const reportLoadId = ++activeReportLoadId;
  const ownerAtLoadStart = currentOwner;
  const ownerEmailAtLoadStart = currentOwnerEmail;
  const apiKeyAtLoadStart = currentOwner ? currentOwner.guestyApiKey : "";
  const isDraftModeForLoad = ownerAtLoadStart && ownerAtLoadStart.admin
    ? true
    : String(ownerAtLoadStart?.viewMode || "payout").toLowerCase() === "draft";

  const assignMappedRows = (mappedRows) => {
    ownerStaysData = mappedRows.filter(res =>
      String(res.guestName || res.guest_name || "").toUpperCase().includes("OWNER STAY") &&
      String(res.status || "").toLowerCase() !== "cancel" &&
      String(res.status || "").toLowerCase() !== "cancelled" &&
      String(res.status || "").toLowerCase() !== "canceled"
    );

    reservationsData = mappedRows.filter(res => {
      const isOwnerStay = String(res.guestName || res.guest_name || "").toUpperCase().includes("OWNER STAY");

      if (isDraftModeForLoad) return !isOwnerStay;

      const status = String(res.status || "").toLowerCase().trim();
      const payout = toNumber(res.grossPayout || res.totalPayout);
      const isCancelled =
        status === "cancel" ||
        status === "cancelled" ||
        status === "canceled";

      return !isOwnerStay && (!isCancelled || (isCancelled && payout > 0));
    });
  };

  setReportLoadingState(true);
  setupCalendarButtons();
  refreshCalendarUI();

  if (!currentOwner || (!currentOwner.guestyApiKey && !currentOwner.admin)) {
    console.error("No owner or API key configured");
    reservationsData = [];
   renderDashboardHeader();
   setReportLoadingState(false);
   renderFilterControls();
   applyFiltersAndRender();
    return;
  }

  const reportBaseUrl = "https://report.guesty.com/api/shared-reservations-reports?timezone=America/New_York";
const PAGE_LIMIT = 1000;

function fetchReservationsPage(skip, attempt = 0) {
  const reportUrl = `${reportBaseUrl}&skip=${skip}&limit=${PAGE_LIMIT}`;
  return fetch(reportUrl, {
    headers: {
      accept: "*/*",
      authorization: apiKeyAtLoadStart,
      "content-type": "application/json"
    }
  })
    .then(r => {
      if (!r.ok) {
        const shouldRetry = (r.status === 429 || r.status >= 500) && attempt < 1;
        if (shouldRetry) {
          return new Promise(resolve => setTimeout(resolve, 700)).then(() => fetchReservationsPage(skip, attempt + 1));
        }
        throw new Error("Guesty fetch failed: " + r.status);
      }
      return r.json();
    })
    .catch(err => {
      if (attempt < 1) {
        return new Promise(resolve => setTimeout(resolve, 700)).then(() => fetchReservationsPage(skip, attempt + 1));
      }
      throw err;
    })
    .then(payload => Array.isArray(payload) ? payload : (payload.results || payload.data || []));
}

function fetchAllReservations(skip = 0, acc = []) {
  return fetchReservationsPage(skip).then(pageRows => {
    const merged = acc.concat(pageRows);
    if (pageRows.length < PAGE_LIMIT) return merged;
    return fetchAllReservations(skip + PAGE_LIMIT, merged);
  });
}

fetchAllReservations()
  .then(rows => {
    if (reportLoadId !== activeReportLoadId || currentOwner !== ownerAtLoadStart) return;

    const mappedRows = rows.map(mapGuestyReservation);

    assignMappedRows(mappedRows);
    saveOwnerReportCache(ownerEmailAtLoadStart, ownerAtLoadStart, mappedRows);

      renderDashboardHeader();
      setReportLoadingState(false);
      renderFilterControls();
      applyFiltersAndRender();
    })
    .catch(err => {
      if (reportLoadId !== activeReportLoadId || currentOwner !== ownerAtLoadStart) return;

      console.error("Error loading report:", err);
      const cachedRows = loadOwnerReportCache(ownerEmailAtLoadStart, ownerAtLoadStart);
      if (cachedRows.length) {
        assignMappedRows(cachedRows);
      } else {
        reservationsData = [];
        ownerStaysData = [];
      }
      renderDashboardHeader();
      setReportLoadingState(false);
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
  adminDiv = document.createElement("div");
adminDiv.id = "adminPanel";
adminDiv.style.position = "fixed";
adminDiv.style.top = "50%";
adminDiv.style.left = "50%";
adminDiv.style.transform = "translate(-50%, -50%)";
adminDiv.style.zIndex = "9999";
adminDiv.style.background = "#fff";
adminDiv.style.width = "min(900px, 92vw)";
adminDiv.style.maxHeight = "85vh";
adminDiv.style.overflowY = "auto";
adminDiv.style.boxShadow = "0 10px 30px rgba(0,0,0,0.18)";
adminDiv.style.marginTop = "16px";
adminDiv.style.padding = "12px";
adminDiv.style.border = "1px solid #e1e6ef";
adminDiv.style.borderRadius = "8px";
adminDiv.style.marginTop = "16px";
adminDiv.style.padding = "12px";
adminDiv.style.border = "1px solid #e1e6ef";
adminDiv.style.borderRadius = "8px";

  adminDiv.innerHTML =
    "<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;'><h3 style='margin:0;'>Manage Users</h3><button id='closeAdminPanel' style='padding:6px 10px; border:1px solid #d0d7e2; background:#fff; border-radius:8px; cursor:pointer;'>Close</button></div>" +
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
    saveOwnerOverrideToStorage(email);
    alert("Owner settings saved");
  };

  document.getElementById("adminOwnerCancel").onclick = () => {
    document.getElementById("adminOwnerForm").style.display = "none";
  };

  document.getElementById("closeAdminPanel").onclick = () => {
  const panel = document.getElementById("adminPanel");
  if (panel) panel.remove();
};
  }

function renderAdminPanel() {
  const portal = document.getElementById("ownerPortal");
  if (!portal) return;
  let adminDiv = document.getElementById("adminPanel");
  if (adminDiv) adminDiv.remove();

  adminDiv = document.createElement("div");
  adminDiv.id = "adminPanel";
  adminDiv.style.position = "fixed";
  adminDiv.style.top = "50%";
  adminDiv.style.left = "50%";
  adminDiv.style.transform = "translate(-50%, -50%)";
  adminDiv.style.zIndex = "9999";
  adminDiv.style.background = "#fff";
  adminDiv.style.width = "min(900px, 92vw)";
  adminDiv.style.maxHeight = "85vh";
  adminDiv.style.overflowY = "auto";
  adminDiv.style.boxShadow = "0 10px 30px rgba(0,0,0,0.18)";
  adminDiv.style.marginTop = "16px";
  adminDiv.style.padding = "12px";
  adminDiv.style.border = "1px solid #e1e6ef";
  adminDiv.style.borderRadius = "8px";

  adminDiv.innerHTML =
    "<div style='display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;'><h3 style='margin:0;'>Manage Users</h3><button id='closeAdminPanel' style='padding:6px 10px; border:1px solid #d0d7e2; background:#fff; border-radius:8px; cursor:pointer;'>Close</button></div>" +
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

  document.body.appendChild(adminDiv);

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
    saveOwnerOverrideToStorage(email);
    alert("Owner settings saved");
  };

  document.getElementById("adminOwnerCancel").onclick = () => {
    document.getElementById("adminOwnerForm").style.display = "none";
  };
  document.getElementById("closeAdminPanel").onclick = () => {
  const panel = document.getElementById("adminPanel");
  if (panel) panel.remove();
};
}


// === CONTACT MODAL AND EMAILJS HANDLERS ===
// ... keep your remaining existing code below this line unchanged
