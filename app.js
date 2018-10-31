const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(__dirname + '/public/stimulus.html'));

app.post('/uploadData', (req, res) => {
  console.log(req.body);
  res.status(200).send({'yay': 'you did it'});
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
