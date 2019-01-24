const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const fs = require('fs');
const dir = './out';
let positionDataCount = 0;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

fs.readdir(dir, (err, files) => {
  if(files && files.length) {
    positionDataCount = files.length;
  }
});

app.get('/', (req, res) => res.sendFile(__dirname + '/public/stimulus.html'));

app.get('/numerosity', (req, res) => res.sendFile(__dirname + '/public/numerosity.html'));

app.post('/uploadData', (req, res) => {
  fs.writeFile('./out/p' + ++positionDataCount, JSON.stringify(req.body), (err) => {
      if (err) throw err;
      console.log('Positions added');
      res.status(200).send(req.body);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
