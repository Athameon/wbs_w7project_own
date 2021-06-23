const express = require("express");
const fs = require("fs");
var cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const postRouter = require("./routes/postRouter");
app.use("/post", postRouter);
const authorRouter = require("./routes/authorRouter");
app.use("/author", authorRouter);
const wikiRouter = require("./routes/wikiRouter");
app.use("/wiki", wikiRouter);

app.all("*", (req, res) => {
  res.redirect("/");
});

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
