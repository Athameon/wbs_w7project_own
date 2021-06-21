const express = require("express");
const fs = require('fs');
const wikiRouter = express.Router();
wikiRouter.use(express.json());

wikiRouter.get("/", (req, res) => {
  fs.readFile(__dirname + '/../data/wikis.json', 'utf-8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const obj = JSON.parse(data);
    res.send(obj);
  })
});

wikiRouter.get("/:id", (req, res) => {
  fs.readFile(__dirname + '/../data/wikis.json', 'utf-8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const obj = JSON.parse(data);
    res.send(obj.items.find(element => element.fields.id === req.params.id));
  })
});

module.exports = wikiRouter;