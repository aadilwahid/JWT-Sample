require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());

const posts = [
  {
    username: "mike",
    title: "Hello Mike",
  },
  {
    username: "kyle",
    title: "Hello kyle",
  },
];

app.get("/posts", authenticateToken, (req, res) => {
  // Only return those post which the logged In user is authorize to get.
  res.json(posts.filter((post) => post.username === req.user.name));
});

// Middle ware
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(3000);
