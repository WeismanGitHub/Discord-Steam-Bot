import express, { Application, Request, Response } from 'express'

const app: Application = express();

app.get('/', (req: Request, res: Response) => {
    res.status(200).send('hello world')
})

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`listening on port ${port}...`))