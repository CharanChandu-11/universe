const exp=require('express');
const userApp=exp.Router();
const User=require('../models/userModel');
const expressAsyncHandler=require("express-async-handler")

userApp.use(exp.json())
userApp.get('/users',expressAsyncHandler(async(req,res)=>{
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch users" });
    }
}));
userApp.post('/users',expressAsyncHandler(async(req,res)=>{
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
    }
}));
userApp.get('/users/:id',expressAsyncHandler(async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch user" });
    }
}));
