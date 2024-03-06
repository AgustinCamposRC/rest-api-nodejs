import mysql from 'mysql2/promise'

const config = {
    host:'localhost',
    user:'root',
    password:'2692002Acc##',
    database:'moviesDb',
    port:3306
}

const connection = await mysql.createConnection(config)

export class MovieModel {
    static async getAll({genre}){

        if(genre){
            const genreLowerCase = genre.toLowerCase()
            console.log(genreLowerCase)
            const [genres] = await connection.query("SELECT id,name FROM genre WHERE LOWER(name) = ?",[genreLowerCase])
            
            if(genres.length===0) return []
            
            const [{id}] = genres
            const [movies] = await connection.query("SELECT title,year,director, duration, poster, rate, BIN_TO_UUID(m.id) as id, g.name as genre FROM movie m\
            INNER JOIN movie_genres mg ON mg.movie_id=m.id\
            INNER JOIN genre g ON g.id=mg.genre_id\
            WHERE g.id=?",[id])

            return movies
        }


       const [movies] = await connection.query(
        `SELECT title,year,director, duration, poster, rate, BIN_TO_UUID(m.id) as id, GROUP_CONCAT(genre.name SEPARATOR ', ') AS generos FROM movie m
        INNER JOIN movie_genres ON m.id = movie_genres.movie_id
        INNER JOIN genre ON movie_genres.genre_id = genre.id
        GROUP BY m.id;`)

       return movies
    }

    static async getById ({id}){
        const [movies] = await connection.query(
            `SELECT title,year,director, duration, poster, rate, BIN_TO_UUID(m.id) id, GROUP_CONCAT(genre.name SEPARATOR ', ') AS generos FROM movie m
            INNER JOIN movie_genres ON m.id = movie_genres.movie_id
            INNER JOIN genre ON movie_genres.genre_id = genre.id
            WHERE m.id = UUID_TO_BIN(?)
            GROUP BY m.id;`,[id]
           )
        if(movies.length === 0) return null
        return movies[0]
    }

    static async create({input}){
        const {
            genre: genreInput, // genre is an array
            title,
            year,
            duration,
            director,
            rate,
            poster
          } = input
      
        const [genresIDs] = await connection.query('SELECT id FROM genre WHERE name in (?);',[genreInput])
        const [uuidResult] = await connection.query('SELECT UUID() uuid;')
        const [{ uuid }] = uuidResult
      
        try {
          await connection.query(`INSERT INTO movie (id, title, year, director, duration, poster, rate) VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
            [title, year, director, duration, poster, rate])

          genresIDs.forEach(async element => {
            connection.query( `INSERT INTO movie_genres (movie_id,genre_id)VALUES (UUID_TO_BIN(?), ?);`,[uuid,element.id])
        })
        } catch (e) {
          throw new Error('Error creating movie')
        }

        const [movies] = await connection.query(
          `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id, GROUP_CONCAT(genre.name SEPARATOR ', ') AS generos FROM movie m
          INNER JOIN movie_genres ON m.id = movie_genres.movie_id
          INNER JOIN genre ON movie_genres.genre_id = genre.id
          WHERE m.id = UUID_TO_BIN(?)
          GROUP BY m.id;`,
          [uuid]
        )
        
        return movies[0]
    }

    static async delete ({id}){
        try{
            await connection.query(`DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);`,[id])
            await connection.query(`DELETE FROM movie WHERE id = UUID_TO_BIN(?);`,[id])
        } catch (e) {
            throw new Error('Error creating movie')
        }
        return true
    }

    static async update({id, input}){
        const data = {...input}
        const  { genre } = data
        if(data.genre){
            delete data['genre']
        }

        try {
            await connection.query('UPDATE movie SET ? WHERE id=UUID_TO_BIN(?)',[data,id])
            if(genre){
              await connection.query(`DELETE FROM movie_genres WHERE movie_id = UUID_TO_BIN(?);`,[id])
              const [genresIDs] = await connection.query('SELECT id FROM genre WHERE name in (?);',[genre])
              genresIDs.forEach(async element => {
                await connection.query(`INSERT INTO movie_genres (movie_id,genre_id)VALUES (UUID_TO_BIN(?), ?);`,[id,element.id])
              })
            }
        } catch (e) {
          console.log(e)
            throw new Error('Error creating movie')
        }
        
        const [movies] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id, GROUP_CONCAT(genre.name SEPARATOR ', ') AS generos FROM movie m
            INNER JOIN movie_genres ON m.id = movie_genres.movie_id
            INNER JOIN genre ON movie_genres.genre_id = genre.id
            WHERE m.id = UUID_TO_BIN(?)
            GROUP BY m.id;`,
            [id]
        )
        return movies[0]
    }

}