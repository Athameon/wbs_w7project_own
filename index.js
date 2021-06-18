const express = require('express');
const fs = require('fs');
var cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors())

app.get("/", (req, res) => {
  fs.readFile('./data.json', 'utf-8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const obj = JSON.parse(data);
    console.log(obj);
    res.send(obj);
  })
});

app.get("/post", (req, res) => {
  fs.readFile('./data/posts.json', 'utf-8', (error, postData) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const postObjects = JSON.parse(postData);

    fs.readFile('./data/authors.json', 'utf-8', (error, authorData) => {
      if (error) {
        return res.status(500).send('Error: Failed to read the data file.');
      }
      postObjects.items.forEach(element => {
        element.fields.author = JSON.parse(authorData).items.find(authorElement => authorElement.id === element.fields.author);
      })
      res.send(postObjects);
    })
  })
});

app.get("/post/:id", (req, res) => {
  fs.readFile('./data/posts.json', 'utf-8', (error, postData) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const postObject = JSON.parse(postData).items.find(post => post.id === req.params.id);

    if (!postObject) {
      return res.status(404).send("Could not find the post with the id: " + req.params.id);
    }

    fs.readFile('./data/authors.json', 'utf-8', (error, authorData) => {
      if (error) {
        return res.status(500).send('Error: Failed to read the data file.');
      }
      postObject.fields.author = JSON.parse(authorData).items.find(authorElement => authorElement.id === postObject.fields.author);

      res.send(postObject);
    })
  })
});

app.get("/author", (req, res) => {
  fs.readFile('./data/authors.json', 'utf-8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const obj = JSON.parse(data);
    res.send(obj);
  })
});

app.get("/author/:name", (req, res) => {
  fs.readFile('./data/authors.json', 'utf-8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const obj = JSON.parse(data);
    console.log('data: ', data);
    const author = obj.items.find(element => element.name.toLowerCase() === req.params.name.toLowerCase());
    if (!author) {
      res.status(400).send("Could not find the author: " + req.params.name);
    }
    fs.readFile('./data/posts.json', 'utf-8', (error, data) => {
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

app.get("/wiki", (req, res) => {
  fs.readFile('./data/wikis.json', 'utf-8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const obj = JSON.parse(data);
    res.send(obj);
  })
});

app.get("/wiki/:id", (req, res) => {
  fs.readFile('./data/wikis.json', 'utf-8', (error, data) => {
    if (error) {
      return res.status(500).send('Error: Failed to read the data file.');
    }
    const obj = JSON.parse(data);
    res.send(obj.items.find(element => element.fields.id === req.params.id));
  })
});

app.all("*", (req, res) => {
  res.redirect("/");
});

const port = process.env.PORT || 3030;

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});