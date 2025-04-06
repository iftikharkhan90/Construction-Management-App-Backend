import express from "express";
import { getAllUsers } from "../modules/user/controller.js";
import { login, signUp } from "../modules/auth/auth.controller.js";
import { createMaterial, delMaterial, getMaterial, getMaterialById, updateMaterial } from "../modules/material/controller.js";
import { createConstructor, deleteConstructor, getConstructor, updateConstructor } from "../modules/consturctor/controller.js";
import {   auth, loginValidationRequest, signUpValidationRequest } from '../middlewares/validation/index.js'
import { getTotalExpensives } from "../modules/total/total.js";
const route = express.Router();

route.post('/signup', [signUpValidationRequest] , signUp );
route.get('/get', getAllUsers);
route.post('/login', [loginValidationRequest], login)

route.post('/material'  , createMaterial)
route.get('/getmaterials' , getMaterial)
route.get('/byId/:id' , getMaterialById)    
route.put('/update/:id' , updateMaterial)
route.delete('/del/:id' , delMaterial)

route.post('/cons', createConstructor)
route.get('/getcons', getConstructor)
route.put('/updatecons/:id' , updateConstructor)
route.delete('/delcons/:id' , deleteConstructor)

route.get('/total' , getTotalExpensives)

export default route; 
