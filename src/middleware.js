import jwt from "jsonwebtoken"
import Author from "./models/author.js"
import dotenv from "dotenv"
dotenv.config()

// Check at each request for a certain pages if the user is logged in
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decodedToken) => {
      if (err) res.redirect("/login")
      else next()
    })
  } else res.redirect("/login")
}

// Check at each request if the user is logged in
const checkCurrentAuthor = async (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    const result = await jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      async (err, decodedToken) => {
        if (err) return { errors: err.message }
        return decodedToken
      }
    )
    if (result.errors) res.locals.author = null
    else {
      const author = await Author.findById(result.id)
      res.locals.author = author?.name || null
    }
  } else res.locals.author = null
  next()
}

function notFound(req, res, next) {
  res.status(404)
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
  next(error)
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  })
}

export { notFound, errorHandler, requireAuth, checkCurrentAuthor }
