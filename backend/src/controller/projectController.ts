import { Router } from "express"
import { OkPacket, RowDataPacket } from "mysql2"
import { connection } from ".."
import { IProject } from "../models/Project";
const router:Router = Router();

export const createProject = (project: IProject, teamID:number, callback: Function) => {
  console.log("IN CONTROLLER");
  console.log(project);
  console.log("Team id: "+teamID);
    const q = "INSERT INTO projectsubmissiondb.Project (proj_title, proj_description, proj_aim, proj_funding, proj_funding_motivation, topic_id, team_id) VALUES(?,?,?,?,?,?,?)"
    connection.query(
      q,
      [ project.title, 
        project.description, 
        project.aim, 
        project.funding, 
        project.funding_motive, 
        project.topic_id,
        teamID],
      (err, result) => {
        if (err) {callback(err)};
        const insertId = (<OkPacket> result).insertId;
        callback(null, insertId);
      }
    );
};

export const findAllProject = (callback: Function) => {
    const q = `SELECT * FROM projectsubmissiondb.Project `
    connection.query(q, (err, result) => {
        if (err) {callback(err)}
    
        const rows = <RowDataPacket[]> result;
        const projects: IProject[] = [];
    
        rows.forEach(row => {
          const project:IProject =  {
            id: row.proj_title,
            title: row.proj_title,
            description: row.proj_description,
            aim: row.proj_aim,
            funding: row.proj_funding,
            funding_motive: row.proj_funding_motivation,
            status: row.proj_status,
            topic_id: row.topic_id,
            team_id: row.team_id
          }
          projects.push(project);
        });
        callback(null, projects);
      });
}

export const findProject = (projectId: number, callback: Function) => {
    const q = `SELECT * FROM projectsubmissiondb.Project WHERE proj_id=? `
    connection.query(q, projectId, (err, result) => {
      if (err) {callback(err)}
      
      const row = (<RowDataPacket> result)[0];
      const project: IProject =  {
        id: row.proj_title,
        title: row.proj_title,
        description: row.proj_description,
        aim: row.proj_aim,
        funding: row.proj_funding,
        funding_motive: row.proj_funding_motivation,
        status: row.proj_status,
        topic_id: row.topic_id,
        team_id: row.team_id
      }
      callback(null, project);
    });
}

export const findProjectBySmth = (smth: string, callback: Function) => {
  const q = `SELECT * FROM projectsubmissiondb.Project WHERE field=? `
  connection.query(q, smth, (err, result) => {
    if (err) {callback(err)}
    
    const row = (<RowDataPacket> result)[0];    
    callback(null, smth);
  });
}
