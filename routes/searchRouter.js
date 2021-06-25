const express = require("express");
const fs = require("fs");
const searchRouter = express.Router();
searchRouter.use(express.json());

app.get("/:key", (req, res) => {
  const { key } = req.params;
  console.log("key: ", key);
  let searchResult = [];

  let authors = null;
  fs.readFile(__dirname + "/../data/authors.json", "utf-8", (error, data) => {
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

    fs.readFile(__dirname + "/../data/posts.json", "utf-8", (error, data) => {
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

      fs.readFile(__dirname + "/../data/wikis.json", "utf-8", (error, data) => {
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

module.exports = searchRouter;
