import express, { Application, Request, Response} from 'express';
import cosr from 'cors';
import "dotenv/config";

const app:Application = express();
app.use(express.json()); //json parsing, strigifying


//import routes



//declare route paths
app.get("/", (req:Request, res:Response) => {
    res.send({message:"IT WORKS"})
})

console.log("Yay it works");


const port:string|undefined = process.env.PORT;
const start = async () => {
    try{
        app.listen(port, () => console.log("Server listening on port ", port));
    }
    catch(err){
        console.log("Error!");
        console.log(err);
    }
}

start();