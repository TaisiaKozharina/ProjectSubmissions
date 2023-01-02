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
import * as projectModel from './controller/projectController';
import * as collabModel from './controller/collaborationsController';
import * as applicModel from './controller/applicationsController';
import { Role } from './models/Role';
import { ITopic } from './models/Topic';
import resolveTree from './service/TopicResolver';
import { IProject } from './models/Project';
import { ProjectDTO } from './models/ProjectDTO';
import { IProjectProf } from './models/ProjectProfile';
import { CollabRequest } from './models/CollabRequest';
import { IApplication } from './models/Application';
import { RequestStatus } from './models/RequestStatus';
import { ProjStatus } from './models/ProjStatus';
import { Stats } from './models/Stats';
//const router = express.Router();

const saltround = 10;

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
  teamModel.createTeam(req.body.name, req.body.leader_id, (err: Error, teamID: number) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    else{
      teamModel.projectTeamRecord(teamID, req.body.leader_id, (err: Error) => {
        if (err) {
          return res.status(500).json({ "message": err.message });
        }});
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

app.get("/getTopicName", async (req: Request, res: Response) => {
  const id: number = Number(req.query.topic_id);
  console.log(req.query.topic_id);
  topicModel.getTopicName(id, (err: Error, title: String) => {
    if (err) {
      return res.status(500).json({ "errorMessage": err.message });
    }
    res.status(200).json({ "title": title });
    console.log(title);
  });
});

app.post("/addproject", async (req: Request, res: Response) => {
    projectModel.createProject(req.body.project as IProject, req.body.team_id, (err: Error, projectID: number) => {
      if (err) {
        return res.status(500).json({ "message": err.message });
      }
      res.status(200).json({ "projectID": projectID });
      console.log("end of index.ts addproject!")
    })
});

app.post("/updateproject", async (req: Request, res: Response) => {
  console.log(req.body.project);
  projectModel.updateProject(req.body.project as IProject, (err: Error) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200);
    console.log("end of index.ts updateproject!")
  })
});

app.get("/allprojects", async (req: Request, res: Response) => {
    const forPers: number = Number(req.query.forPers);
    console.log('received forePers:'+forPers);
    if (forPers == -1){
      projectModel.findAllProjects((err: Error, projects: ProjectDTO[]) => {
        if (err) {
          return res.status(500).json({ "errorMessage": err.message });
        }
        
        res.status(200).json({ "projects": projects });
      });
    }
    else{
      projectModel.findProjectPers(forPers, (err: Error, projects: ProjectDTO[]) => {
        if (err) {
          return res.status(500).json({ "errorMessage": err.message });
        }
        
        res.status(200).json({ "projects": projects });
      });
    }
})

app.post("/addprojectprof", async (req: Request, res: Response) => {
  collabModel.createProjectProfile(req.body.projectID as number, req.body.description as string, (err: Error, profileID: number) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "profileID": profileID });
  })
});

app.get("/allprojectprof", async (req: Request, res: Response) => {
  collabModel.allProjectProfile((err: Error, profiles: IProjectProf[]) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "profiles": profiles });
    console.log(profiles);
  })
});

app.get("/getproject", async (req: Request, res: Response) => {
  //console.log("Index.ts: received param:", req.query.projectID )
  const projID: number = Number(req.query.projectID);
  projectModel.findProject(projID, (err: Error, project: IProject) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "project": project });
  })
});

app.get("/getmembersproject", async (req: Request, res: Response) => {
  const projID: number = Number(req.query.projectID);
  console.log(projID);
  projectModel.findMembersProject(projID, (err: Error, members: number[]) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "members": members });
  })
});

app.post("/addcollabrequest", async (req: Request, res: Response) => {
  const profID: number = Number(req.body.profID);
  const persID: number = Number(req.body.persID);
  const message: string = String(req.body.message);
  collabModel.createCollabRequest(profID, message, persID, (err: Error, crID: number) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "crID": crID });
  })
});


app.get("/getcollabrequests", async (req: Request, res: Response) => {

  const userID: number = Number(req.query.userID);
  collabModel.getCollabRequests(userID, (err: Error, collabs: CollabRequest[]) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "collabs": collabs });
  })
});

app.post("/changestatuscollab", async (req: Request, res: Response) => {
  const collabID: number = Number(req.body.collabID);
  const decision: number = Number(req.body.decision);
  const persID: number = Number(req.body.persID);
  const teamID: number = Number(req.body.teamID);

  collabModel.changeStatus(collabID, decision, (err: Error) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    else{
      if(decision == 1){
        teamModel.projectTeamRecord(teamID, persID, (err: Error)=>{
          if (err) {
            return res.status(500).json({ "message": err.message });
          }
        })
      }
    }
    res.status(200);
  })
});

app.post("/submitapplication", async (req: Request, res: Response) => {
  const projID: number = Number(req.body.projID);
  console.log("Index.ts recieved projID:",projID);
  applicModel.submitApplication(projID, (err: Error, applicID: number) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "applicID": applicID });
  })
});

app.get("/getapplications", async (req: Request, res: Response) => {

  applicModel.allApplications((err: Error, applications: IApplication[]) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "applications": applications });
  })
});

app.get("/getstats", async (req: Request, res: Response) => {
  topicModel.statistics((err: Error, stats: Stats[]) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    res.status(200).json({ "stats": stats });
  })
});

app.post("/changestatusapplic", async (req: Request, res: Response) => {
  const applID: number = Number(req.body.applID);
  const decision: number = Number(req.body.decision);
  const projID: number = Number(req.body.projID);

  applicModel.changeStatusApplication(applID, decision, (err: Error) => {
    if (err) {
      return res.status(500).json({ "message": err.message });
    }
    else{
      if(decision == RequestStatus.ACCEPTED){
        projectModel.changeStatusProject(projID, ProjStatus.IN_DEVELOPMENT, (err: Error)=>{
          if (err) {
            return res.status(500).json({ "message": err.message });
          }
        })
      }
    }
    res.status(200);
  })
});


app.get("/", (req: Request, res: Response) => {
  res.send({ message: "IT WORKS" })
});

const port: string | undefined = process.env.PORT;

const startServer = async () => {
  try {
    const mysql = require('mysql2/promise');
    await mysql.createConnection({ host: process.env.DBhost, user: process.env.DBuser, password: process.env.DBpassword, database: process.env.DBname });
    console.log("Connected to DB ✅");
    app.listen(port, () => console.log("Server listening on port ", port));
  }
  catch (err) {
    console.log("Failed to connect to the DB ❌");
    console.log(err);
  }
}

export const connection = mysql.createConnection({ host: process.env.DBhost, user: process.env.DBuser, password: process.env.DBpassword, database: process.env.DBname });

startServer();