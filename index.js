require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDatabase= []
let idCounter= 1
app.post('/api/shorturl', (req, res) => {
  const {originalUrl}= req.body

  const hostname= urlParser.parse(originalUrl).hostname
 
  dns.lookup(hostname, (err, address) => {
    if(err) {
      return res.json({error: 'invalid url'})
    }

    urlDatabase.push({original_url: originalUrl, short_url: idCounter})
    idCounter++

    req.json({
    original_url: url,
    short_url: shortUrl
  })
  })  
})

app.get('/api/shorturl/:short_url', (req, res) => {
 const shortUrl=  Number(req.params.short_url)
 
 const url= urlDatabase.find(u => u.short_url === shortUrl)

 if(url) {
  res.redirect(url.original_url)
 } else{
  return res.json({error: 'invalid url'})
 }


})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
