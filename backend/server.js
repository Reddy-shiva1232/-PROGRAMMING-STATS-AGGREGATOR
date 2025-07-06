import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import axios from "axios";
import * as cheerio from "cheerio";
import puppeteer from "puppeteer";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/leetcode", async (req, res) => {
  try {
    const { query, variables } = req.body;

    const response = await fetch("https://leetcode.com/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching LeetCode data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.get("/codechef/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const response = await axios.get(`https://www.codechef.com/users/${username}`);
    const $ = cheerio.load(response.data);
    
    const rating = $('.rating-number').text().trim();
    const problemsSolved = $('.problems-solved').find('h5').text().trim();
    const stars = $('.rating').text().trim();
    
    res.json({
      rating,
      problemsSolved,
      stars,
      username
    });
  } catch (error) {
    console.error("Error fetching CodeChef data:", error);
    res.status(500).json({ error: "Failed to fetch CodeChef data" });
  }
});

app.get("/codeforces/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    await page.goto(`https://codeforces.com/profile/${username}`);
    
    const data = await page.evaluate(() => {
      const rating = document.querySelector('.info li:nth-child(1) span')?.textContent.trim();
      const maxRating = document.querySelector('.info li:nth-child(2) span')?.textContent.trim();
      const problemsSolved = document.querySelector('._UserActivityFrame_counterValue')?.textContent.trim();
      
      return {
        rating,
        maxRating,
        problemsSolved,
        username
      };
    });
    
    await browser.close();
    res.json(data);
  } catch (error) {
    console.error("Error fetching Codeforces data:", error);
    res.status(500).json({ error: "Failed to fetch Codeforces data" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
