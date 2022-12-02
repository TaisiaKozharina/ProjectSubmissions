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
            team_id: row.team_id,
            createDate: row.proj_createDate,
            progress: row.proj_progress
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
        team_id: row.team_id,
        createDate: row.proj_createDate,
        progress: row.proj_progress
      }
      callback(null, project);
    });
}

export const findProjectPers = (persID: number, callback: Function) => {
  const q = `SELECT distinct p.proj_id as proj_id, p.proj_title as proj_title, p.proj_description as proj_description, `+
            `p.proj_aim as proj_aim, p.proj_funding as proj_funding, p.proj_funding_motivation as motivation, `+
            `p.proj_status as status, p.proj_progress as progress, p.proj_createDate as created, p.team_id as team_id, `+
            `t.team_name as team_name, t.leader_id as team_leader `+
            `FROM projectsubmissiondb.Project p  `+
            `left join projectsubmissiondb.Team t on p.team_id=t.team_id `+
            `left join projectsubmissiondb.ProjectTeam pt on pt.team_id=t.team_id `+
            `left join projectsubmissiondb.person pers on pers.pers_id=pt.pers_id `+
            `where pt.pers_id=? `
  connection.query(q, [persID], (err, result) => {
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
        funding_motive: row.motivation,
        status: row.status,
        progress: row.progress,
        topic_id: row.topic_id,
        team_id: row.team_id,
        team_name: row.team_name,
        leader_id: row.team_leader,
        createDate: row.created
      }
      projects.push(project);
    });
      callback(null, projects);
    });
}
