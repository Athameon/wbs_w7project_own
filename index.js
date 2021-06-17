const express = require('express');
const fs = require('fs');

const app = express();
// app.use(express.json());

app.get("/", (req, res) => {
  fs.readFile('./data.json', 'utf-8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    res.send(data);
  })
});

app.all("*", (req, res) => {
  res.redirect("/");
});

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});