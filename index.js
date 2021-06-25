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

app.get("/search/:key", (req, res) => {
  const { key } = req.params;
  console.log("key: ", key);
  let searchResult = [];

  let authors = null;
  fs.readFile("./data/authors.json", "utf-8", (error, data) => {
    if (error) {
      console.log(error);
      res.status(500).send("Failed to read the author data: " + error);
    }
    authors = JSON.parse(data).items;
    searchResult = authors.filter((author) => {
      console.log(author.name);
      if (author.name.includes(key)) {
        console.log("Found author");
      } else {
        console.log("Author not found.");
      }
      return author.name.toLowerCase() === key.toLowerCase();
    });

    fs.readFile("./data/posts.json", "utf-8", (error, data) => {
      if (error) {
        console.log(error);
        res.status(500).send("Failed to read the post data: " + error);
      }
      const posts = JSON.parse(data).items;
      const filteredPosts = posts.filter(
        (post) =>
          post.title.includes(key) ||
          (post.shortText && post.shortText.includes(key))
      );
      filteredPosts.forEach((post) => {
        const author = authors.find((author) => author.id === post.author);
        post.author = author;
      });
      searchResult = [...searchResult, ...filteredPosts];

      fs.readFile("./data/wikis.json", "utf-8", (error, data) => {
        if (error) {
          console.log(error);
          res.status(500).send("Failed to read the wiki data: " + error);
        }
        const wikis = JSON.parse(data).items;
        const filteredWikis = wikis.filter(
          (wiki) => wiki.title.includes(key) || wiki.coin.includes(key)
        );
        searchResult = [...searchResult, ...filteredWikis];

        res.send(searchResult);
      });
    });
  });
});

app.all("*", (req, res) => {
  res.redirect("/");
});

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
