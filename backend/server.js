import appInsights from 'applicationinsights'
import path from 'path'
import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import morgan from 'morgan'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import connectDB from './config/db.js'

import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'

dotenv.config()

appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY).start()

connectDB()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/upload', uploadRoutes)

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
)

app.get('/api/config/sast', (req, res) =>
  res.send(process.env.REACT_APP_STRSASTK)
)

app.get('/api/config/accn', (req, res) =>
  res.send(process.env.REACT_APP_STRNAME)
)

const __dirname = path.resolve()
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

// used to certificate domain
// app.use(
//   '/.well-known/pki-validation/godaddy.html',
//   express.static(
//     path.join(__dirname, '/.well-known/pki-validation/godaddy.html')
//   )
// )

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  )
} else {
  app.get('/', (req, res) => {
    res.send('API is running....')
  })
}

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
)
