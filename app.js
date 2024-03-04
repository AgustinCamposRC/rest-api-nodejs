import express from 'express'
import movies from './movies.json' assert {
    type: 'json',
};
import crypto from "node:crypto"
import {validateMovie, validatePartialMovie} from './schemas/movies.js'

const app = express()
const PORT = process.env.PORT ?? 3000

app.disable('x-powered-by')

app.use(express.json())

app.get('/',(req,res)=>{
    res.json({message: 'Hola Mundo'})
})

// Todos los recursos que sean MOVIES se identifica con /movies
app.get('/movies',(req,res)=>{
    res.header("Access-Control-Allow-Origin",'*')
    const {genre} = req.query
    if(genre){
        const filtereMovies = movies.filter(
            movie => movie.genre.some(g => g.toLowerCase() === genre.toLowerCase())
        )
    }
    res.json(movies)
})


app.get('/movies/:id',(req,res)=>{ // path-to-regexp
    const {id} = req.params
    const movie = movies.find(movie => movie.id === id)
    if(movie) return res.json(movie)
    res.status(404).json({message:"Movie not found"})
})

// Posts Methods:

app.post("/movies", (req,res)=>{

    const result = validateMovie(req.body)
    if(result.error){
        return res.status(400).json({message: JSON.parse(result.error.message)})
    }

    const newMovie = {
        id:crypto.randomUUID(),
        ...result.data
    }
 
    movies.push(movies)
    res.status(201).json(newMovie)
})

// Patch Methods:

app.patch('/movies/:id',(req,res)=>{

    const result = validatePartialMovie(req.body)
    if(result.error){
        return res.status(400).json({message: JSON.parse(result.error.message)})
    }
    const {id} = req.params
    const movieIndex = movies.findIndex(element => element.id === id)
    if(movieIndex===-1){
        return res.status(404).json({message:'Movie Not Found'})
    }
    console.log(movies[movieIndex])
    console.log(result.data)
    const updateMovie = {
        ...movies[movieIndex],
        ...result.data,
    }
    movies[movieIndex] = updateMovie
    return res.json(updateMovie)
})


// Delete Methods:
app.delete('/movies/:id', (req,res) => {
    res.header("Access-Control-Allow-Origin",'*')
    const {id} = req.params
    const indexMovie = movies.findIndex(movie => movie.id === id)

    if(indexMovie===-1){
        return res.status(404).json({message:"Movie Not Found"})
    }
    movies.splice(indexMovie,1)
    return res.json({message:"Movie Deleted!"})
})


app.options('/movies/:id', (req, res)=> {
    res.header("Access-Control-Allow-Origin",'*')
    res.header("Access-Control-Allow-Methods",'GET, POST, PUT, PATCH, DELETE')
    res.sendStatus(200)
})


app.listen(PORT, ()=>console.log(`Running on: http://localhost:${PORT}/....`))