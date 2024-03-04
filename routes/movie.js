import {Router} from 'express'
import {MovieController} from '../controllers/movies.js'

export const movieRouter = Router()

// GET Methods:

movieRouter.get('/', MovieController.getAll)
movieRouter.get('/:id', MovieController.getById)

// POST Methods:
movieRouter.post("/", MovieController.create)

// PATCH Methods:
movieRouter.patch('/:id', MovieController.update)

// DELETE Methods:
movieRouter.delete('/:id', MovieController.delete)


