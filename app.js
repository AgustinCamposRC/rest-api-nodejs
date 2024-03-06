import express from 'express'
import {corsMiddleware} from './middlewares/cors.js'
import {createMovieRouter} from './routes/movie.js'
import 'dotenv/config'

export const createApp = ({movieModel}) => {
    const app = express()
    const PORT = process.env.PORT ?? 3000
    app.disable('x-powered-by')

    app.use(express.json())
    app.use(corsMiddleware())

    // Todos los recursos que sean MOVIES se identifica con /movies
    app.use('/movies', createMovieRouter({movieModel}))

    app.options('/movies/:id', (req, res)=> {
        res.header("Access-Control-Allow-Origin",'*')
        res.header("Access-Control-Allow-Methods",'GET, POST, PUT, PATCH, DELETE')
        res.sendStatus(200)
    })

    app.listen(PORT, ()=>console.log(`Running Server on Port: ${PORT}`))
    
}
