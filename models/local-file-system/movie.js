import {readJson} from '../../utils.js'
import crypto from "node:crypto"

const movies = readJson('./movies.json')

export class MovieModel {
    static async getAll({genre}){
        if(genre){
            return movies.filter(
                movie => movie.genre.some(g => g.toLowerCase()===genre.toLowerCase())
            )
        }
        return movies
    }

    static async getById({id}) {
        const movie = movies.find(movie => movie.id == id)
        return movie
    }

    static async create({input}) {
        const newMovie = {
            id:crypto.randomUUID(),
            ...input
        }
     
        movies.push(movies)
        return newMovie
    }

    static async delete({id}){
        const indexMovie = movies.findIndex(movie => movie.id === id)
        if(indexMovie===-1) return false
        movies.splice(indexMovie,1)
        return true
    }

    static async update({id, input}) {
        const movieIndex = movies.findIndex(element => element.id === id)
        if(movieIndex===-1) return false
        movies[movieIndex] = {
            ...movies[movieIndex],
            ...result.data,
        }
        return movies[movieIndex]
    }

}