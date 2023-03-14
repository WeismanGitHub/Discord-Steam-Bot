import express from 'express'

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('hello world')
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`listening on port ${port}...`))