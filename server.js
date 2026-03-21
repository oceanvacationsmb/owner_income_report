const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3001;
const OWNERS_FILE = process.env.OWNERS_FILE || path.join(__dirname, "owners.private.json");

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

app.listen(PORT, () => {
  console.log(`Secure API listening on http://localhost:${PORT}`);
});
