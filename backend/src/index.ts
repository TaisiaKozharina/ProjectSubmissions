import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import bcrypt from "bcrypt";
import * as bodyParser from "body-parser";
import "dotenv/config";
import { IPerson } from './models/Person';
import * as personModel from './controller/personController';
import * as teamModel from './controller/teamController';
import * as topicModel from './controller/topicController';
import { Role } from './models/Role';
import { ITopic } from './models/Topic';
import resolveTree from './service/TopicResolver';
//const router = express.Router();

const saltround = 10;
interface PersonDto {
  fname: string,
  lname: string,
  dob: string,
  country: string,
  address: string,
  email: string,
  phone: string,
  password: string,
}

const app: Application = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.json()); //json parsing, strigifying

app.get("/allpers", async (req: Request, res: Response) => {
  personModel.findAllPersons((err: Error, persons: IPerson[]) => {
    if (err) {
      return res.status(500).json({ "errorMessage": err.message });
    }

    res.status(200).json({ "persons": persons });
  });
});

app.get("/pers/:id", async (req: Request, res: Response) => {
  const persID: number = Number(req.params.id);
  personModel.findPerson(persID, (err: Error, person: IPerson) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "data": person });
  })
});

app.get("/getpass", async (req: Request, res: Response) => {
  const persEmail: string = String(req.query.email);
  const persPass: string = String(req.query.pass);
  console.log('Received param: '+ persEmail);
  personModel.findPassByEmail(persEmail, (err: Error, data: any, ) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    //res.status(200).json({ "pass": pass });
    else{
      bcrypt.compare(persPass, data.pass, function (err, match) {
        if(err) res.status(500).json({ "message": err.message });
        else if (match){
          //console.log('Passwords match!');
          delete data['pass'];
          console.log(data);
          res.status(200).json({ "success": true, 'person': data });
        }
        else if (!match){
          //console.log('Passwords do not match!');
          delete data['pass'];
          res.status(200).json({ "success": false, "person": data });
        }
      })

    }
  })
  
});

app.post("/addpers", async (req: Request, res: Response) => {

  console.log(req.body);
  bcrypt.hash(req.body.pass, saltround, (error: any, hash: string) => {
    if (error) console.log(error);
    else {
      console.log("Hash: " + hash);
      const person: IPerson = {
        fname: req.body.fname,
        lname: req.body.lname,
        dob: new Date(req.body.dob),
        country: req.body.country,
        address: req.body.address,
        email: req.body.email,
        phone: req.body.phone,
        password: hash,
        role: Role.USER
      }

      console.log(person);
      personModel.createPerson(person, (err: Error, persID: number) => {
        if (err) {
          return res.status(500).json({ "message": err.message });
        }
        res.status(200).json({ "persID": persID });
      })
    }
  });
});

app.post("/addtopic", async (req: Request, res: Response) => {
  topicModel.createTopic(req.body.title, req.body.parent as number, (err: Error, topicID: number) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "topicID": topicID });
  })
});

app.post("/deletetopic", async (req: Request, res: Response) => {
  console.log('Request is on bakend');
  console.log(req.body.id);
  topicModel.deleteTopic(req.body.id as number, (err: Error) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200);
  })
})

app.post("/addteam", async (req: Request, res: Response) => {
  teamModel.createTeam(req.body.name, (err: Error, teamID: number) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "teamID": teamID });
  })
});

app.get("/alltopics", async (req: Request, res: Response) => {
  topicModel.findAllTopics((err: Error, topics: ITopic[]) => {
    if (err) {
      return res.status(500).json({ "errorMessage": err.message });
    }

    let baseTopics = topics.filter(x=> x.parent_id===null);
    baseTopics.forEach(baseTop=>{
      baseTop.class = 'base';
      resolveTree(topics, baseTop);
    });
    res.status(200).json({ "topics": baseTopics });
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "IT WORKS" })
});

const port: string | undefined = process.env.PORT;

const startServer = async () => {
  try {
    const mysql = require('mysql2/promise');
    //await mysql.createConnection(process.env.DBConnection);
    await mysql.createConnection({ host: process.env.DBhost, user: process.env.DBuser, password: process.env.DBpassword, database: process.env.DBname });
    console.log("Connected to DB ✅");
    //If connected to DB, start listening to port
    app.listen(port, () => console.log("Server listening on port ", port));
  }
  catch (err) {
    console.log("Failed to connect to the DB ❌");
    console.log(err);
  }
}

export const connection = mysql.createConnection({ host: process.env.DBhost, user: process.env.DBuser, password: process.env.DBpassword, database: process.env.DBname });

startServer();