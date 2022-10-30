import express, { Application, Request, Response} from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import "dotenv/config";


const app:Application = express();
app.use(cors());
app.use(express.json()); //json parsing, strigifying

//import routes

//declare route paths
app.get("/", (req:Request, res:Response) => {
    res.send({message:"IT WORKS"})
})

console.log("Yay it works");


const port:string|undefined = process.env.PORT;

const startServer = async () => {
    try{
        const mysql = require('mysql2/promise');
        //await mysql.createConnection(process.env.DBConnection);
        await mysql.createConnection({host: process.env.DBhost, user:process.env.DBuser , password: process.env.DBpassword, database: process.env.DBname});
        console.log("Connected to DB ✅");
        //If connected to DB, start listening to port
        app.listen(port, () => console.log("Server listening on port ", port));
    }
    catch(err){
        console.log("Failed to connect to the DB ❌");
        console.log(err);
    }
}

startServer();