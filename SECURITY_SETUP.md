# Secure Login Setup (Quick)

## 1) Install backend deps

```bash
npm install
```

## 2) Create private owner secrets file

```bash
cp owners.private.example.json owners.private.json
```

Edit `owners.private.json` with real owner emails, passwords, and Guesty API keys.

Important: `owners.private.json` is gitignored and must never be committed.

## 3) Start secure API

```bash
npm start
```

This runs at `http://localhost:3001`.

## 4) Run frontend as usual

Keep the frontend on its normal host/page. Login now goes through backend endpoints:
- `POST /api/login`
- `GET /api/reservations`

## Notes

- This removes passwords/API keys from `script.js`.
- For production, deploy the backend on a private server and point `API_BASE` to that URL.
- Use strong passwords and HTTPS in production.
