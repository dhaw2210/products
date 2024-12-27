import express from 'express'
import validator from "validator";
import bcrypt from "bcrypt";
const router = express.Router()

export default (db) => {

    router.post("/add-user", async (req, res) => {
        try {
          const {
            firstName,
            lastName,
            email,
            password,
            phone,
            adress,
            city,
            country,
            isValid,
          } = req.body;
      
          if (!firstName || !lastName || !email || !password) {
            return res.status(500).json({ message: "All Fields are Required" });
          }
      
          if (!validator.isEmail(email)) {
            return res.status(500).json({ message: "Invalid Email" });
          }
      
          if (!validator.isLength(password, { min: 6 })) {
            return res.status(500).json({ message: "Invalid Password" });
          }
      
          const user = await db.collection("users").findOne({ email });
          if (user) {
            return res.status(500).json({ message: "Email Already Exist" });
          }
      
          const hashedPassword = await bcrypt.hash(password, 10);
          let data = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phone,
            adress,
            city,
            country,
            isValid,
          };
          const result = await db.collection("users").insertOne(data);
          if (!result) {
            return res.status(500).json({ message: "Cannot insert user" });
          }
          return res
            .status(201)
            .json({ Message: "User Created successfully ", result });
        } catch (err) {
          console.log(err);
          return res.status(500).json({ message: `Error while Adding User ${err}` });
        }
      });
      router.post("/login", async (req, res) => {
        try {
          const { email, password } = req.body;
          if (!email || !password) {
            res.status(400).send("please fill all the fields");
          }
          if (!validator.isEmail(email)) {
            res.status(400).send("invalid email");
          }
          const user = await db.collection("users").findOne({ email });
          if (!user) {
            return res.status(404).send("user not found pls signup");
          }
          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) {
            return res.status(401).send("invalid password or email");
          }
          return res
            .status(200)
            .json({ message: "user logged in succesfully", user });
        } catch (error) {
          console.log(error);
          return res.status(500).send("cannot login user");
        }
      });
    
    return router;
  };
