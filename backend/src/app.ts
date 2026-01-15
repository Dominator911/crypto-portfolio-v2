import express from "express";
import health from "./routes/health";

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.use('/health', health);

export default app;