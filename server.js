require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();

const origins = (process.env.CLIENT_ORIGINS || "").split(",").map(v => v.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin || origins.length === 0 || origins.includes(origin)) return callback(null, true);
    return callback(new Error("This browser origin is not allowed by CORS."));
  }
}));
app.use(express.json());

app.get("/", (req, res) => {
  const base = `${req.protocol}://${req.get("host")}`;
  const student = process.env.STUDENT_NUMBER || "ADD YOUR STUDENT NUMBER";
  res.type("html").send(`<!doctype html><html lang="en"><head><meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1"><title>IT Support Desk API Guide</title>
  <style>body{font-family:Arial;max-width:900px;margin:35px auto;padding:0 18px;line-height:1.6;color:#172033}h1,h2{color:#174a7e}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccd5e0;padding:9px;text-align:left}th{background:#eaf1f8}pre{background:#f1f4f8;padding:14px;overflow:auto}</style></head><body>
  <h1>IT Support Desk API</h1><p><b>Project:</b> IT Support Desk</p><p><b>Student number:</b> ${student}</p>
  <p>This API records and manages computer support requests for Network, Software and Hardware problems.</p>
  <p><b>Live API base URL:</b> <a href="${base}">${base}</a></p><p><a href="/health">Health check</a> | <a href="/api/records">View all records</a></p>
  <h2>Required routes</h2><table><tr><th>Method</th><th>Route</th><th>Purpose</th></tr>
  <tr><td>GET</td><td>/</td><td>API guide</td></tr><tr><td>GET</td><td>/health</td><td>Server and database health</td></tr>
  <tr><td>GET</td><td>/api/records</td><td>Read all records</td></tr><tr><td>GET</td><td>/api/records/:id</td><td>Read one record</td></tr>
  <tr><td>POST</td><td>/api/records</td><td>Create a record</td></tr><tr><td>PUT</td><td>/api/records/:id</td><td>Update a record</td></tr>
  <tr><td>DELETE</td><td>/api/records/:id</td><td>Delete a record</td></tr></table>
  <h2>Fields and rules</h2><p>title: 3–80 characters; category: 2–40; description: 5–300; status: Pending, In progress or Completed. The database generates id. Do not send id in POST or PUT.</p>
  <h2>Example POST or PUT JSON body</h2><pre>{
  "title": "Cannot connect to Wi-Fi",
  "category": "Network",
  "description": "The laptop cannot connect to the campus wireless network.",
  "status": "Pending"
}</pre>
  <h2>Response codes</h2><p>200: successful read, update or delete. 201: created. 400: invalid input, invalid id or malformed JSON. 404: missing record or route. 500: unexpected error. 503: database unavailable.</p>
  <p>Use Postman or another API client for POST, PUT and DELETE. Select raw JSON and Content-Type application/json. An idle hosted service may need time to start.</p>
  </body></html>`);
});

app.get("/health", async (req, res) => {
  try { await pool.query("SELECT 1"); res.status(200).json({ status: "ok", message: "Server and database are responding." }); }
  catch (error) { console.error("Health check:", error.message); res.status(503).json({ status: "error", message: "The database is unavailable." }); }
});
app.use("/api/records", require("./routes/records"));
app.use((req, res) => res.status(404).json({ message: "Route not found." }));
app.use((error, req, res, next) => {
  console.error(error);
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) return res.status(400).json({ message: "Malformed JSON request body." });
  if (error.message === "This browser origin is not allowed by CORS.") return res.status(403).json({ message: error.message });
  res.status(500).json({ message: "An unexpected server error occurred." });
});
const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`IT Support Desk API listening on port ${port}`));
