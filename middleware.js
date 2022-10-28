import jwt from "jsonwebtoken";
import Author from "./models/author.js";

// Check at each request for a certain pages if the user is logged in
const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, "Lamiaa Abdelmonaem Ibrahim Gabriel", (err, decodedToken) => {
      if (err) res.redirect("/login");
      else next();
    });
  } else res.redirect("/login");
};


// Check at each request if the user is logged in
const checkCurrentAuthor = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    const result = await jwt.verify(token, "Lamiaa Abdelmonaem Ibrahim Gabriel", async (err, decodedToken) => {
      if(err) return { errors: err.message }
      return decodedToken
    });
    if (result.errors) res.locals.author = null;
    else {
      let author = await Author.findById(result.id);
      res.locals.author = author?.name || null;
    }
  } else res.locals.author = null;
  next();

};

export { requireAuth, checkCurrentAuthor };