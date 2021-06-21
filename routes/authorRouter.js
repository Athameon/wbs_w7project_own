const express = require("express");
const fs = require('fs');
const authorRouter = express.Router();
authorRouter.use(express.json());

authorRouter.get("/", (req, res) => {
  fs.readFile(__dirname + '/../data/authors.json', 'utf-8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const obj = JSON.parse(data);
    res.send(obj);
  })
});

authorRouter.get("/:name", (req, res) => {
  fs.readFile(__dirname + '/../data/authors.json', 'utf-8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const obj = JSON.parse(data);
    console.log('data: ', data);
    const author = obj.items.find(element => element.name.toLowerCase() === req.params.name.toLowerCase());
    if (!author) {
      res.status(400).send("Could not find the author: " + req.params.name);
    }
    fs.readFile(__dirname + '/../data/posts.json', 'utf-8', (error, data) => {
      if (error) {
        return res.status(500).send('Error: Failed to read the data file.');
      }
      const postsOfAuthor = JSON.parse(data).items.filter(item => item.fields.author === author.id);
      res.send(
        {
          author: author,
          posts: postsOfAuthor
        });
    })
  })
});

module.exports = authorRouter;