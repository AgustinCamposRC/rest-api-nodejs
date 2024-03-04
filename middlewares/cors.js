import cors from 'cors'

const ACCEPTED_ORIGINS = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://movies.com',
    'http://gust.dev',
]

export const corsMiddleware = ({acceptedOrigins = ACCEPTED_ORIGINS} = {}) => cors({
    origin: (origin, callback) => {
        if(acceptedOrigins.includes(origin)){
            return callback(null,true)
        }

        if(!origin) {
            return callback(null,true)
        }
    }
})