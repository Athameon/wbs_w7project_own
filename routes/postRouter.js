const express = require("express");
const fs = require('fs');
const postRouter = express.Router();
postRouter.use(express.json());

postRouter.get("/", (req, res) => {
  console.log("POST GET request");
  fs.readFile(__dirname + '/../data/posts.json', 'utf-8', (error, postData) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error: Failed to read the posts data file.');
    }
    const postObjects = JSON.parse(postData);

    fs.readFile(__dirname + '/../data/authors.json', 'utf-8', (error, authorData) => {
      if (error) {
        console.log(error);
        return res.status(500).send('Error: Failed to read the authors data file.');
      }
      postObjects.items.forEach(element => {
        element.fields.author = JSON.parse(authorData).items.find(authorElement => authorElement.id === element.fields.author);
      })
      res.send(postObjects);
    })
  })
});

postRouter.get("/:id", (req, res) => {
  fs.readFile(__dirname + '/../data/posts.json', 'utf-8', (error, postData) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const postObject = JSON.parse(postData).items.find(post => post.id === req.params.id);

    if (!postObject) {
      return res.status(404).send("Could not find the post with the id: " + req.params.id);
    }

    fs.readFile(__dirname + '/../data/authors.json', 'utf-8', (error, authorData) => {
      if (error) {
        return res.status(500).send('Error: Failed to read the data file.');
      }
      postObject.fields.author = JSON.parse(authorData).items.find(authorElement => authorElement.id === postObject.fields.author);

      res.send(postObject);
    })
  })
});

module.exports = postRouter;