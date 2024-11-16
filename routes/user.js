require('dotenv').config();

const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require("../models/user");

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        encryptedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            email: email,
            password: encryptedPassword
        });

        const token = jwt.sign(
            { id: user._id },
            process.env.TOKEN_SECRET, {
            expiresIn: "480h",
        });
        user.token = token;
        return res.status(200).send({
            token: token,
            body: user
        });
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).send("User not found");
        }
        console.log(user.password);
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { id: user._id },
                process.env.TOKEN_SECRET,
                { expiresIn: "480h" }
            );

            user.token = token;
            return res.status(200).send({
                body: {
                    token: token,
                    ...user
                },
            });
        }
        return res.status(400).send("The username or password is incorrect");
    }
    catch (err) {
        console.log(err);
        return res.status(500).send({ message: "Internal Server Error" });
    }
});

module.exports = router;