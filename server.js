import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware: Invoke the methods to be used
app.use(express.json());
app.use(cookieParser());

// View Engine
app.set("view engine", "ejs");

// Connect Database
mongoose
  .connect("mongodb+srv://jwt-node:jwt-node@jwt-node.xqu9plh.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    app.listen(PORT, () =>
      console.log(
        "Database is Connected Successfully\nServer is listening on PORT: " +
          PORT
      )
    );
  })
  .catch((e) => console.log("Error in Connecting the database:\n" + e.message));

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



// Routes
import authorRouter from "./routes/author.js";
import { requireAuth, checkCurrentAuthor } from "./middleware.js";

// Routes
app.get("*", checkCurrentAuthor);

app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));
app.get("/smoothies", requireAuth, (req, res) => res.render("smoothies"));
app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
});

app.use("/author", authorRouter);