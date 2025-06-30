require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns= require('dns')
const urlParser= require('url')
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({extended: false}))
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
  const {url}= req.body

   if (!/^https?:\/\//.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  const hostname= urlParser.parse(url).hostname
 
  dns.lookup(hostname, (err, address) => {
    if(err) {
      return res.json({error: 'invalid url'})
    }

    urlDatabase.push({original_url: url, short_url: idCounter})
    console.log(urlDatabase)
   
    res.json({
    original_url: url,
    short_url: idCounter
  })
   idCounter++
  })  
})

app.get('/api/shorturl/:short_url', (req, res) => {
 const shortUrl=  Number(req.params.short_url)
 
 const entry= urlDatabase.find(u => u.short_url === shortUrl)

 if(entry) {
  res.redirect(entry.original_url)
 } else{
  return res.json({error: 'invalid url'})
 }


})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
