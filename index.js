import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import YahooFantasy from "yahoo-fantasy"; // Yahoo Specific

// Explicitly specify the path to the .env file
dotenv.config({ path: "../../.env" });
console.log("ENV_FILE:", process.env.ENV_FILE);

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080", // Frontend origin
    credentials: true, // Allow cookies
  })
);

app.use(express.json()); // Parse JSON request bodies

// Initialize YahooFantasy client and attach it to the app
app.yf = new YahooFantasy(
  process.env.YAHOO_CONSUMER_KEY, // From .env
  process.env.YAHOO_CONSUMER_SECRET, // From .env
  (token) => {
    // Token callback: Save the token securely (e.g., database)
    console.log("Token received:", token);
  },
  process.env.YAHOO_REDIRECT_URL // From .env
);

// Route to start Yahoo OAuth
app.get("/auth/yahoo", (req, res) => {
  app.yf.auth(res); // Redirect to Yahoo for authentication
});

// Route to handle Yahoo OAuth callback
app.get("/auth/yahoo/callback", (req, res) => {
  app.yf.authCallback(req, (err) => {
    if (err) {
      console.error("Authentication callback error:", err);
      return res.redirect("/error");
    }

    // Successful authentication
    return res.redirect("/");
  });
});

// Node.JS Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Node.js service running on http://localhost:${PORT}`);
});
