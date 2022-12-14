import { Router } from "express"
import { OkPacket, RowDataPacket } from "mysql2"
import { connection } from ".."
import { IProject } from "../models/Project";
const router:Router = Router();

export const createProject = (project: IProject, teamID:number, callback: Function) => {
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

export const updateProject = (project: IProject, callback: Function) => {
    const q = `UPDATE projectsubmissiondb.Project SET proj_title=?, proj_description=?, proj_aim=?, `+
    `proj_funding=?, proj_funding_motivation=?, proj_progress=? `+
    `WHERE proj_id=?`
    connection.query(
      q,
      [ project.title, 
        project.description, 
        project.aim, 
        project.funding, 
        project.funding_motive, 
        project.progress,
        project.id
      ],
      (err, result) => {
        if (err) {callback(err); console.log(err)};
        callback(null);
      }
    );
    
};

export const findAllProjects = (callback: Function) => {
  const q = `SELECT distinct p.proj_id as proj_id, p.proj_title as proj_title, p.proj_description as proj_description, `+
            `p.proj_aim as proj_aim, p.proj_funding as proj_funding, p.proj_funding_motivation as motivation, `+
            `p.proj_status as status, p.proj_progress as progress, p.proj_createDate as created, p.team_id as team_id, `+
            `t.team_name as team_name, t.leader_id as team_leader, tp.topic_title, app_id, app_status `+
            `FROM projectsubmissiondb.Project p  `+
            `left join projectsubmissiondb.Team t on p.team_id=t.team_id `+
            `left join projectsubmissiondb.ProjectTeam pt on pt.team_id=t.team_id `+
            `left join projectsubmissiondb.person pers on pers.pers_id=pt.pers_id `+
            `left join projectsubmissiondb.Topic tp on p.topic_id=tp.topic_id `+
            `left join projectsubmissiondb.application a on a.proj_id = p.proj_id `
  connection.query(q, (err, result) => {
    if (err) {callback(err)}
    
    const rows = <RowDataPacket[]> result;
    const projects: IProject[] = [];
    rows.forEach(row => {
      const project:IProject =  {
        id: row.proj_id,
        title: row.proj_title,
        description: row.proj_description,
        aim: row.proj_aim,
        funding: row.proj_funding,
        funding_motive: row.motivation,
        status: row.status,
        progress: row.progress,
        topic_id: row.topic_id,
        topic_title: row.topic_title,
        team_id: row.team_id,
        team_name: row.team_name,
        leader_id: row.team_leader,
        createDate: row.created,
        applic_id:row.app_id,
        applic_status:row.app_status
      }
      projects.push(project);
    });
      callback(null, projects);
    });
}

export const findProject = (projectId: number, callback: Function) => {
  const q = 
    `SELECT p.proj_id, p.proj_title, p.proj_description, p.proj_aim, p.proj_funding, p.proj_funding_motivation, p.proj_status, `+
    `p.topic_id, p.team_id, p.proj_progress, p.proj_createDate, t.leader_id, tp.topic_title, app_id, app_status `+
    `from projectsubmissiondb.Project p `+
    `LEFT JOIN projectsubmissiondb.Team t on p.team_id=t.team_id `+
    `left join projectsubmissiondb.Topic tp on p.topic_id=tp.topic_id `+
    `left join projectsubmissiondb.application a on a.proj_id = p.proj_id `+
    `WHERE proj_id=? `
    connection.query(q, projectId, (err, result) => {
      if (err) {callback(err)}
      
      const row = (<RowDataPacket> result)[0];
      const project: IProject =  {
        id: row.proj_id,
        title: row.proj_title,
        description: row.proj_description,
        aim: row.proj_aim,
        funding: row.proj_funding,
        funding_motive: row.motivation,
        status: row.status,
        progress: row.progress,
        topic_id: row.topic_id,
        topic_title: row.topic_title,
        team_id: row.team_id,
        team_name: row.team_name,
        leader_id: row.team_leader,
        createDate: row.created,
        applic_id: row.app_id,
        applic_status: row.app_status
      }
      callback(null, project);
    });
}

export const findProjectPers = (persID: number, callback: Function) => {
  const q = `SELECT distinct p.proj_id as proj_id, p.proj_title as proj_title, p.proj_description as proj_description, `+
            `p.proj_aim as proj_aim, p.proj_funding as proj_funding, p.proj_funding_motivation as motivation, `+
            `p.proj_status as status, p.proj_progress as progress, p.proj_createDate as created, p.team_id as team_id, `+
            `t.team_name as team_name, t.leader_id as team_leader, tp.topic_title, app_id, app_status `+
            `FROM projectsubmissiondb.Project p  `+
            `left join projectsubmissiondb.Team t on p.team_id=t.team_id `+
            `left join projectsubmissiondb.ProjectTeam pt on pt.team_id=t.team_id `+
            `left join projectsubmissiondb.person pers on pers.pers_id=pt.pers_id `+
            `left join projectsubmissiondb.Topic tp on p.topic_id=tp.topic_id `+
            `left join projectsubmissiondb.application a on a.proj_id = p.proj_id `+
            `where pt.pers_id=? `
  connection.query(q, [persID], (err, result) => {
    if (err) {callback(err)}
    
    const rows = <RowDataPacket[]> result;
    const projects: IProject[] = [];
    rows.forEach(row => {
      const project:IProject =  {
        id: row.proj_id,
        title: row.proj_title,
        description: row.proj_description,
        aim: row.proj_aim,
        funding: row.proj_funding,
        funding_motive: row.motivation,
        status: row.status,
        progress: row.progress,
        topic_id: row.topic_id,
        topic_title: row.topic_title,
        team_id: row.team_id,
        team_name: row.team_name,
        leader_id: row.team_leader,
        createDate: row.created,
        applic_id: row.app_id,
        applic_status: row.app_status
      }
      projects.push(project);
    });
      callback(null, projects);
    });
};


export const findMembersProject = (projectId: number, callback: Function) => {
const q = `select distinct pt.pers_id `+
  `from projectsubmissiondb.projectteam pt `+
  `left join projectsubmissiondb.team t on t.team_id = pt.team_id `+
  `left join projectsubmissiondb.project p on p.team_id = t.team_id `+
  `where p.proj_id=? `
  connection.query(q, projectId, (err, result) => {
    if (err) {callback(err)}
    ;
    const rows = <RowDataPacket[]> result;
    const members: number[] = [];
    rows.forEach(r=>{
      members.push(r.pers_id as number);
    })
    callback(null, members);
  });
};

export const changeStatusProject = (projectId: number, status:number, callback: Function) => {
  const q = `UPDATE projectsubmissiondb.project SET proj_status=? WHERE proj_id=? `;
    connection.query(q, [status, projectId], (err, result) => {
      if (err) {callback(err)};
      callback(null);
    });
  }


