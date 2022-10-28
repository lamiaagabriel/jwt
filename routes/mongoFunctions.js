export const handleErrors = (err) => {
  let res = {};

  if (err.message.includes("author validation failed")) {
    // User Errors
    Object.values(err.errors).map(
      ({ properties }) => (res[properties.path] = properties.message)
    );
  }
  if (err.code === 11000)
    res = { [Object.keys(err.keyPattern)]: " Already Used" };

  if (err.message == "Incorrect password")
    res = { password: err.message };
  if (err.message == "No such a username. Register first.")
    res = { username: err.message };

  if (!Object.keys(res).length) res = { customError: err.message };
  return { errors: res };
};

// GET
export async function findDocs(collection, docs, populate = "") {
  try {
    const result = await collection.find(docs).populate(populate);
    return { docs: result };
  } catch (err) {
    return handleErrors(err);
  }
}
export async function findDoc(collection, doc) {
  try {
    const result = await collection.findOne(doc);
    return { doc: result };
  } catch (err) {
    return handleErrors(err);
  }
}
// POST
export async function createDoc(collection, doc) {
  try {
    const result = await collection.create(doc);
    return { id: result._id };
  } catch (err) {
    return handleErrors(err);
  }
}

export async function updateDoc(collection, id, doc) {
  try {
    const result = await collection.findByIdAndUpdate(id, doc, {
      upsert: true,
      new: true,
    });
    return {
      message: result.modifiedCount
        ? `${result.modifiedCount} Doc(s) Updated Successfully`
        : `${result.upsertedCount} Doc(s) Upserted Successfully`,
    };
  } catch (err) {
    return handleErrors(err);
  }
}

// DELETE
export async function deleteDocs(collection, docs) {
  try {
    const result = await collection.deleteMany(docs);
    return {
      message: `${result.deletedCount} Doc(s) has/have been deleted successfully`,
    };
  } catch (err) {
    return handleErrors(err);
  }
}
export async function deleteDoc(collection, doc) {
  try {
    const result = await collection.findByIdAndDelete(doc);

    return {
      message: result === null ? "Already Deleted" : "Deleted Successfully",
    };
  } catch (err) {
    return handleErrors(err);
  }
}
