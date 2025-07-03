// const express = require("express");
// const axios = require("axios");
// const router = express.Router();
// const fetch = require("node-fetch");
// require("dotenv").config();

// const NEWS_API_KEY = process.env.NEWS_API_KEY;

// router.get("/news", async (req, res) => {
//   const { q } = req.query;
//   const fromDate = new Date();
//   fromDate.setDate(fromDate.getDate() - 7);
//   try {
//     const response = await fetch(
//       `https://newsapi.org/v2/everything?q=${q}&apiKey=${APIkey}&from=${fromDate.toISOString()}&pageSize=50`
//     );
//     const data = await response.json();
//     res.json(data);
//   } catch (error) {
//     console.error("NewsAPI error:", error);
//     res.status(500).json({ error: "Failed to fetch news" });
//   }
// });

// module.exports = router;
