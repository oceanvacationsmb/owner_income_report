const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3001;
const OWNERS_FILE = process.env.OWNERS_FILE || path.join(__dirname, "owners.private.json");
const TASKS_FILE = process.env.TASKS_FILE || path.join(__dirname, "tasks.private.json");

const sessions = new Map();

app.use(cors({ origin: true }));
app.use(express.json());

function readOwners() {
  if (!fs.existsSync(OWNERS_FILE)) {
    throw new Error("owners.private.json is missing. Copy owners.private.example.json and fill real values.");
  }

  const raw = fs.readFileSync(OWNERS_FILE, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object") {
    throw new Error("owners.private.json must be a JSON object keyed by email.");
  }
  return parsed;
}

function getPublicOwner(owner, email) {
  return {
    email,
    ownerName: owner.ownerName,
    propertyName: owner.propertyName,
    postalCode: owner.postalCode,
    pmcPercent: owner.pmcPercent,
    cleaningFee: owner.cleaningFee
  };
}

function normalizeTask(task) {
  if (!task || typeof task !== "object") return null;
  const normalized = {
    id: String(task.id || "").trim(),
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

function readTasks() {
  if (!fs.existsSync(TASKS_FILE)) return [];
  try {
    const raw = fs.readFileSync(TASKS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizeTask).filter(Boolean);
  } catch (_) {
    return [];
  }
}

function writeTasks(tasks) {
  fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

function authRequired(req, res, next) {
  const authHeader = String(req.headers.authorization || "");
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token || !sessions.has(token)) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  req.session = sessions.get(token);
  next();
}

app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const inputPassword = String(password || "");

    const owners = readOwners();
    const owner = owners[normalizedEmail];

    if (!owner) {
      res.status(401).json({ message: "Email not found." });
      return;
    }

    if (String(owner.password || "") !== inputPassword) {
      res.status(401).json({ message: "Password incorrect." });
      return;
    }

    const token = crypto.randomBytes(24).toString("hex");
    sessions.set(token, { email: normalizedEmail });

    res.json({
      token,
      owner: getPublicOwner(owner, normalizedEmail)
    });
  } catch (err) {
    console.error("/api/login error", err);
    res.status(500).json({ message: "Login service error." });
  }
});

app.get("/api/reservations", authRequired, async (req, res) => {
  try {
    const owners = readOwners();
    const requestedEmail = String(req.query.email || "").trim().toLowerCase();

    if (!requestedEmail || requestedEmail !== req.session.email) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    const owner = owners[requestedEmail];
    if (!owner || !owner.guestyApiKey) {
      res.status(400).json({ message: "Owner API key is not configured." });
      return;
    }

    const reportUrl = "https://report.guesty.com/api/shared-reservations-reports?timezone=America/New_York&skip=0&limit=1000";
    const response = await fetch(reportUrl, {
      headers: {
        accept: "*/*",
        authorization: owner.guestyApiKey,
        "content-type": "application/json"
      }
    });

    if (!response.ok) {
      const text = await response.text();
      res.status(502).json({ message: `Guesty request failed (${response.status})`, details: text.slice(0, 500) });
      return;
    }

    const payload = await response.json();
    res.json(payload);
  } catch (err) {
    console.error("/api/reservations error", err);
    res.status(500).json({ message: "Reservations service error." });
  }
});

app.get("/api/tasks", (req, res) => {
  try {
    const tasks = readTasks();
    res.json({ tasks });
  } catch (err) {
    console.error("/api/tasks GET error", err);
    res.status(500).json({ message: "Tasks service error." });
  }
});

app.post("/api/tasks", (req, res) => {
  try {
    const incoming = normalizeTask(req.body || {});
    if (!incoming) {
      res.status(400).json({ message: "Invalid task payload." });
      return;
    }

    const tasks = readTasks();
    tasks.unshift(incoming);
    writeTasks(tasks);
    res.status(201).json({ task: incoming });
  } catch (err) {
    console.error("/api/tasks POST error", err);
    res.status(500).json({ message: "Tasks service error." });
  }
});

app.patch("/api/tasks/:id", (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) {
      res.status(400).json({ message: "Task id is required." });
      return;
    }

    const tasks = readTasks();
    const idx = tasks.findIndex(task => task.id === id);
    if (idx === -1) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    const patch = req.body || {};
    const merged = {
      ...tasks[idx],
      status: patch.status === "completed" ? "completed" : tasks[idx].status,
      completedAt: patch.status === "completed"
        ? String(patch.completedAt || new Date().toISOString())
        : tasks[idx].completedAt
    };

    const normalized = normalizeTask(merged);
    if (!normalized) {
      res.status(400).json({ message: "Invalid update payload." });
      return;
    }

    tasks[idx] = normalized;
    writeTasks(tasks);
    res.json({ task: normalized });
  } catch (err) {
    console.error("/api/tasks PATCH error", err);
    res.status(500).json({ message: "Tasks service error." });
  }
});

app.delete("/api/tasks/:id", (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    if (!id) {
      res.status(400).json({ message: "Task id is required." });
      return;
    }

    const tasks = readTasks();
    const next = tasks.filter(task => task.id !== id);
    if (next.length === tasks.length) {
      res.status(404).json({ message: "Task not found." });
      return;
    }

    writeTasks(next);
    res.status(204).end();
  } catch (err) {
    console.error("/api/tasks DELETE error", err);
    res.status(500).json({ message: "Tasks service error." });
  }
});

app.listen(PORT, () => {
  console.log(`Secure API listening on http://localhost:${PORT}`);
});
