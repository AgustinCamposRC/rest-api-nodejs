import {Router} from 'express'
import {MovieController} from '../controllers/movies.js'

export const createMovieRouter = ({movieModel}) => {
    const movieRouter = Router()

    const movieController = new MovieController({movieModel})

    // GET Methods:
    movieRouter.get('/', movieController.getAll)
    movieRouter.get('/:id', movieController.getById)

    // POST Methods:
    movieRouter.post("/", movieController.create)

    // PATCH Methods:
    movieRouter.patch('/:id', movieController.update)

    // DELETE Methods:
    movieRouter.delete('/:id', movieController.delete)

    return movieRouter
}