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
    const author = obj.items.find(element => element.name.toLowerCase() === req.params.name.toLowerCase());
    if (!author) {
      res.status(400).send("Could not find the author: " + req.params.name);
    }
    fs.readFile(__dirname + '/../data/posts.json', 'utf-8', (error, data) => {
      if (error) {
        return res.status(500).send('Error: Failed to read the data file.');
      }
      const postsOfAuthor = JSON.parse(data).items.filter(item => item.author === author.id);
      res.send(
        {
          author: author,
          posts: postsOfAuthor
        });
    })
  })
});

authorRouter.put("/", (req, res) => {
  console.log(req.body);
  fs.readFile(__dirname + '/../data/authors.json', 'utf-8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const authors = JSON.parse(data);
    const authorIndex = authors.items.findIndex(author => author.id === req.body.id);
    if (authorIndex.length === -1) {
      return res.status(404).send("Could not find the author");
    }
    const author = authors.items[authorIndex];
    author.name = req.body.name;
    author.about = req.body.aboutText;
    author.image = req.body.image;

    fs.writeFile(__dirname + '/../data/authors.json', JSON.stringify(authors), (err) => {
      if (err) 
        return res.status(500).send("Failed to store the author in the json file.");
    });
    res.send(author)
  })
});

module.exports = authorRouter;