import authorRouter from "./routes/author.js"
import * as middleware from "./middleware.js"

export default function (app) {
  app.get("*", middleware.checkCurrentAuthor)

  app.get("/", (req, res) => res.render("home"))
  app.get("/login", (req, res) => res.render("login"))
  app.get("/register", (req, res) => res.render("register"))
  app.get("/smoothies", middleware.requireAuth, (req, res) =>
    res.render("smoothies")
  )
  app.get("/logout", (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 })
    res.redirect("/")
  })
  app.use("/author", authorRouter)

  app.use(middleware.notFound)
  app.use(middleware.errorHandler)
}
