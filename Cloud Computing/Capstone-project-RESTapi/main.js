import express from 'express'
import dbConnection from './config/dbConnection.js'
import routes from './routes/routes.js'
import cors from 'cors'
import getRouter from './routes/export.js'
import historyRoutes from './routes/history.js'
import uploadRoutes from './routes/notifUpload.js'

const app = express()
const port = process.env.PORT || 3306
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//run first
app.get('/', (req, res) => {
  res.send('Hello world')
})

// If the database is connected successfully, then run the server
dbConnection
    .getConnection()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.log(`Failed to connect to the database: ${err.message}`);
    }).finally(() => {
      app.use('/fileCv', getRouter)
      app.use('/api', routes);
      app.use('/api/history', historyRoutes);
      app.use('/api/upload', uploadRoutes);
      app.use((err, req, res, next) => {
        err.statusCode = err.statusCode || 500;
        err.message = err.message || 'Internal Server Error';
        res.status(err.statusCode).json({
          message: err.message,
        });
      });
    })
