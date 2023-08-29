import express from "express"
import jwt from "jsonwebtoken"
import Author from "../models/author.js"
import {
  findDocs,
  findDoc,
  createDoc,
  updateDoc,
  deleteDocs,
  deleteDoc,
  handleErrors,
} from "./mongoFunctions.js"
import dotenv from "dotenv"
dotenv.config()

const router = express.Router()

// jwt.sign({ id: idValue }, JWT_SECRET_KEY, )
// expiresIn: 3 days * 24h * 60m * 60s; in sec
const threeDays = 3 * 24 * 60 * 60

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    // Option Object
    expiresIn: threeDays, // in seconds
  })

// GET
router.get("/", async (req, res) =>
  res.json(await findDocs(Author, {}, "articles"))
)
router.get("/:username", async (req, res) =>
  res.json(await findDoc(Author, { username: req.params.username }, "articles"))
)

// POST
router.post("/", async (req, res) => {
  const author = await createDoc(Author, req.body)
  res.json(author)
})

router.post("/login", async (req, res) => {
  const { username, password } = req.body
  try {
    const authorId = await Author.login(username, password)
    const token = createToken(authorId)
    res.cookie("jwt", token, { httpOnly: true, maxAge: threeDays * 1000 })

    res.json({ id: authorId })
  } catch (err) {
    res.json(handleErrors(err))
  }
})

// PUT
router.put("/:id", async (req, res) =>
  res.json(await updateDoc(Author, req.params.id, req.body))
)

// DELETE
router.delete("/:id", async (req, res) =>
  res.json(await deleteDoc(Author, { _id: req.params.id }))
)

router.delete("/", async (req, res) => res.json(await deleteDocs(Author, {})))

export default router
