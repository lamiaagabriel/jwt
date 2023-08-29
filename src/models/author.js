import mongoose from "mongoose"
import pkg from "validator"
import bcrypt from "bcrypt"

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: [true, "insert your full name"],
    },
    email: {
      type: String,
      require: [true, "insert your email"],
      unique: true,
      lowercase: true,
      validate: [pkg.isEmail, "insert a valid email"],
    },
    username: {
      type: String,
      require: [true, "insert your username"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      require: [true, "insert your password"],
      minLength: [6, "password must be more than 6 characters"],
    },
  },
  { timestamps: true }
)
// Mongoose Middleware Hooks (post, pre):
// post hook (doc, next): doc after it was created, next to go to the next step in mongoose
// pre hook (next): this represents the doc (before save: after created), next always should be called
// should be called to go to the next step in the middle of any mongoose hook or middleware
// function: should NOT be an arrow function in pre hook, didn't work for me

// Before saving any author, Fire the following pre hook:
authorSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt()
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Static method to login an Author
authorSchema.statics.login = async function (username, password) {
  const author = await this.findOne({ username })
  if (author) {
    const result = await bcrypt.compare(password, author.password)
    if (result) return author._id

    throw Error("Incorrect password")
  }

  throw Error("No such a username. Register first.")
}
const Author = mongoose.model("author", authorSchema)
export default Author
