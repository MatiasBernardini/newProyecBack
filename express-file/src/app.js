import express from "express";
import ProductManager from "./index.js";

const app = express ();
const manager = new ProductManager ();

console.log (manager, "Esto es maneger")

app.get ("/saludo", (req, res)=>{
    res.send ("Hola Mundo");
})

app.listen (8080, ()=>{
    console.log ("Server leido en el puerto 8080")
})


