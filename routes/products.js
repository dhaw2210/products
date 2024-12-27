import express from 'express'
import { ObjectId } from 'mongodb';
const router = express.Router()

export default (db) => {

    router.post("/add-products", async (req, res) => {
        try {
          const product = req.body;
          const result = await db.collection("products").insertMany(product);
          if (!result) {
            res.status(400).json({ message: "Product not created" });
          }
          res.json(result);
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Failed to add product" });
        }
      });
      router.get("/", async (req, res) => {
        try {
          const result = await db.collection("products").find().toArray();
          if (!result) {
            res.status(404).json({ message: "No products found in the database" });
          }
          res.status(200).json({ result });
        } catch (error) {
          console.log(error);
          res.status(404).json({ message: "No products found in the database" });
        }
      });
      router.put("/updateProduct/:title", async (req, res) => {
        try {
          const title = req.params.title;
          const product = req.body;
          const result = await db
            .collection("products")
            .updateOne({ title: title }, { $set: product });
          if (result.matchedCount === 0) {
            res.status(400).json({ message: "Product not updated" });
          }
          res.status(200).json({ message: "Product updated !" });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Failed to update product" });
        }
      });
      router.delete("/deleteProduct/:title", async (req, res) => {
        try {
          const { title } = req.params;
          const result = await db.collection("products").deleteOne({ title });
          if (result.deletedCount === 0) {
            res.status(400).json({ message: "Product not deleted" });
          }
          res.status(200).json({ message: "Product deleted !" });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Failed to delete product" });
        }
      });
      router.delete("/deleteProducts", async (req, res) => {
        try {
          const data = { title: { $regex: "" } };
          const result = await db.collection("products").deleteMany(data);
          if (result.deletedCount === 0) {
            res.status(400).json({ message: "Product not deleted" });
          }
          res.status(200).json({ message: "Product deleted !" });
        } catch (error) {
          console.log(error);
          res.status(500).json({ message: "Failed to delete product" });
        }
      });
    return router;
  };

