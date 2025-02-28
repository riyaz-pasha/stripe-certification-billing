// Environment variables
import "./env.js";
import { resolve } from "path";
import { existsSync } from "fs";

// Express
import express, { json } from "express";
const app = express();

// Serve static files
app.use(express.static(process.env.STATIC_DIR));

// Mount webhookRouter before other middleware, it needs raw requests
import webhookRouter from "./routes/webhook.js";
app.use(webhookRouter);

// Encode/decode JSON bodies
app.use(json());

// Cross-origin resource sharing config
import cors from "cors";
app.use(
  cors({
    origin: `${process.env.HOSTNAME}:${process.env.PORT}`,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    allowCredentials: true,
  })
);

import offeringsRouter from "./routes/offerings.js";
import usersRouter from "./routes/users.js";
app.use(usersRouter);
app.use(offeringsRouter);

// Static Routes
app.get("/", (_, res) => {
  try {
    const path = resolve(`${process.env.STATIC_DIR}/index.html`);
    if (!existsSync(path)) throw Error();
    res.sendFile(path);
  } catch (error) {
    console.log(`Error loading static files: ${error.name}`);
    const path = resolve("./public/static-file-error.html");
    res.sendFile(path);
  }
});

app.get("/login", (_, res) => {
  try {
    const path = resolve(`${process.env.STATIC_DIR}/LoginPage.html`);
    if (!existsSync(path)) throw Error();
    res.sendFile(path);
  } catch (error) {
    console.log(`Error loading static files: ${error.name}`);
    const path = resolve("./public/static-file-error.html");
    res.sendFile(path);
  }
});

app.get("/dashboard", (_, res) => {
  try {
    const path = resolve(`${process.env.STATIC_DIR}/HomePage.html`);
    if (!existsSync(path)) throw Error();
    res.sendFile(path);
  } catch (error) {
    console.log(`Error loading static files: ${error.name}`);
    const path = resolve("./public/static-file-error.html");
    res.sendFile(path);
  }
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((error, _, response, _next) => {
  if (error.name === "UnauthorizedError") {
    response.status(401).json({ error: { message: "Invalid token" } });
  } else {
    console.error("Error: ", error.message);
    response.status(500).json({ error: { message: error.message } });
  }
});

// Listen for requests
import onStartup from "./services/startup.js";
app.listen(4242, async () => {
  console.log("Node server listening on 4242, calling onStartup()...");
  await onStartup();
});
