import express from "express";
import { getAllUsers } from "../modules/user/controller.js";
import { login, signUp } from "../modules/auth/auth.controller.js";
import { createMaterial, delMaterial, getMaterial, getMaterialById, updateMaterial } from "../modules/material/controller.js";
import { createConstructor, deleteConstructor, getConstructor, updateConstructor } from "../modules/consturctor/controller.js";
import {   auth, loginValidationRequest, signUpValidationRequest } from '../middlewares/validation/index.js'
const route = express.Router();

route.post('/signup', [signUpValidationRequest] , signUp );
route.get('/get', getAllUsers);
route.post('/login', [loginValidationRequest], login)

route.post('/material'  ,[auth] , createMaterial)
route.get('/getmaterials', [auth], getMaterial)
route.get('/byId/:id', [auth], getMaterialById)    
route.put('/update/:id', [auth], updateMaterial)
route.delete('/del/:id', [auth], delMaterial)

route.post('/cons', [auth], createConstructor)
route.get('/getcons', [auth], getConstructor)
route.put('/updatecons/:id', [auth], updateConstructor)
route.delete('/delcons/:id', [auth], deleteConstructor)

export default route; 
