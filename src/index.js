import express from "express"
import mongoose from "mongoose"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
dotenv.config()

import routes from "./routes.js"

const app = express()
const port = process.env.PORT
const host = process.env.HOST

// To create a Cookie either we use:
//      res.setHeader('Set-Cookie', 'key=value');
// OR
//      res.cookie('key', 'value', { maxAge: (ExpiresIn in msec), secure: true (https only), httpOnly: true (can't access it from the js frontend)  });
//      After installing cookie-parser, and invoked it to the app by: app.use(cookieParser());
//      To access it we use:  req.cookies

// JWT Signing:
// Headers: Tells the server what type of signature is being used (meta)
// Payload: Used to identify the user (contains user ID)
// Signature: Makes the token secure (a stamp of authenticating)
// Hashing Steps: ((Header + Payload) + JWT_SECRET_KEY) + Signature

// Middleware: Invoke the methods to be used
app.use(express.json())
app.use(cookieParser())
app.set("view engine", "ejs")
app.set("views", "src/views")

// Connect Database
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => {
    app.listen(port, () => {
      console.log(
        `🔥 server is listening${
          process.env.NODE_ENV === "development"
            ? ` at port: http://${host}:${port}`
            : "."
        }`
      )

      routes(app)
    })
  })
  .catch((e) => console.log("Error in Connecting the database:\n" + e.message))
