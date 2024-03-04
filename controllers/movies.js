import {MovieModel} from '../models/local-file-system/movie.js'

export class MovieController {
    static async getAll (req,res) {
        const { genre } = req.query
        const movies = await MovieModel.getAll({genre})
        res.json(movies)
    }


    static async getById(req,res) { // path-to-regexp
        const {id} = req.params
        const movie = await MovieModel.getById({id})
        if(movie) return res.json(movie)
        res.status(404).json({message:"Movie not found"})
    }

    static async create(req,res) {
        const result = validateMovie(req.body)
        if(result.error){
            return res.status(400).json({message: JSON.parse(result.error.message)})
        }
        const newMovie = await MovieModel.create({input:result.data})
        res.sendStatus(200).json(newMovie)
    }

    static async update (req,res) {
        const result = validatePartialMovie(req.body)
        if(result.error){
            return res.status(400).json({message: JSON.parse(result.error.message)})
        }
        const {id} = req.params
        const  updateMovie = await MovieModel.update({id, input: result.data})
        if(!result){
            return res.status(404).json({message:'Movie Not Found'})
        }
        
        return res.json(updateMovie)
    }

    static async delete (req,res) {
        const {id} = req.params
        const result = await MovieModel.delete({id})
    
        if(!result){
            return res.status(404).json({message:"Movie Not Found"})
        }
        return res.json({message:"Movie Deleted!"})
    }
}