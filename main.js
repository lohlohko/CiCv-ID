const express = require('express')
const app = express()
const cors = require('cors')
const getRouter = require('./routes/export')

app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/fileCv', getRouter)

const port = process.env.PORT || 8080

app.get('/', (req, res) => {
  res.send('Hello world')
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})