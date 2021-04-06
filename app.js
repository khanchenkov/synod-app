// imports
const express = require('express')
const path = require('path')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

// constants
const app = express()
const PORT = process.env.PORT ?? 3000
const mongoPassword = process.env.MONGO_PASSWORD
const uri = `mongodb+srv://khanchenkov:${mongoPassword}@cluster0.egzpt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

// middlewares
app.use(express.static(path.resolve(__dirname, 'client', 'dist')))
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'))
})

async function start() {
  try {
    await client.connect()

    const bible = client.db("bible").collection("testaments")
    const bibledb = await bible.findOne()

    app.get('/api/bible', async (req, res) => {
      await res.status(200).json(bibledb)
    })

    app.listen(PORT, () => console.log(`Server has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Error', e.message)
    process.exit(1)
  } finally {
    await client.close();
  }
}

start()