import express from "express";
import health from "./routes/health.js";
import wallet from "./routes/wallet.js";
import { fakeAuth } from "./middleware/fakeAuth.js";

const app = express();

app.use(express.json());

// fake auth applied to ALL routes
app.use(fakeAuth);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// test route to verify fake auth
app.get("/me", (req, res) => {
  res.json(req.user);
});


app.use('/health', health);
app.use('/wallet', wallet);

export default app;