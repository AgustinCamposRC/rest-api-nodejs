import {validateMovie, validatePartialMovie} from "../schemas/movies.js"

export class MovieController {
    constructor({MovieModel}){
        this.MovieModel = MovieModel
    }

    getAll = async (req,res) => {
        const { genre } = req.query
        const movies = await this.MovieModel.getAll({genre})
        res.json(movies)
    }


    getById = async (req,res) => { // path-to-regexp
        const {id} = req.params
        const movie = await this.MovieModel.getById({id})
        if(movie) return res.json(movie)
        res.status(404).json({message:"Movie not found"})
    }

    create = async (req,res) => {
        const result = validateMovie(req.body)
        if(result.error){
            return res.status(400).json({message: JSON.parse(result.error.message)})
        }
        const newMovie = await this.MovieModel.create({input:result.data})
        console.log(newMovie)
        res.status(201).json(newMovie)
    }

    update = async (req,res) => {
        const result = validatePartialMovie(req.body)
        if(result.error){
            return res.status(400).json({message: JSON.parse(result.error.message)})
        }
        const {id} = req.params
        const  updateMovie = await this.MovieModel.update({id, input: result.data})
        if(!result){
            return res.status(404).json({message:'Movie Not Found'})
        }
        
        return res.json(updateMovie)
    }

    delete = async (req,res) => {
        const {id} = req.params
        const result = await this.MovieModel.delete({id})
    
        if(!result){
            return res.status(404).json({message:"Movie Not Found"})
        }
        return res.json({message:"Movie Deleted!"})
    }
}