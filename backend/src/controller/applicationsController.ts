import { Router } from "express"
import { OkPacket, RowDataPacket } from "mysql2"
import { connection } from ".."
import { IApplication } from "../models/Application";
import { RequestStatus } from "../models/RequestStatus";
const router: Router = Router();

export const submitApplication = (projectID: number, callback: Function) => {
    const q = "INSERT INTO projectsubmissiondb.application (app_submission_date, app_status, proj_id) VALUES(cast(now() AS Date),?,?)"
    connection.query(q, [RequestStatus.RECEIVED, projectID], (err, result) => {
        if (err) { callback(err) };
        const insertId = (<OkPacket>result).insertId;
        callback(null, insertId);
    }
    );
};

export const allApplications = (callback: Function) => {
    const q = `SELECT app_id, app_submission_date, app_status, p.*, t.topic_title, `+
    `count(distinct pt.pers_id) as members, pr.pers_fname, pr.pers_lname `+
    `FROM projectsubmissiondb.application a `+
    `left join projectsubmissiondb.project p on a.proj_id=p.proj_id `+
    `left join projectsubmissiondb.topic t on p.topic_id = t.topic_id `+
    `left join projectsubmissiondb.team tm on tm.team_id = p.team_id `+
    `left join projectsubmissiondb.projectteam pt on tm.team_id = pt.team_id `+
    `left join projectsubmissiondb.person pr on pr.pers_id = tm.leader_id `+
    `group by a.app_id `

    connection.query(q, (err, result) => {
        if (err) { callback(err) };
        const rows = <RowDataPacket[]> result;
        const applications: IApplication[] = [];
        rows.forEach(row => {
        const applic:IApplication =  {
            a_id: row.app_id,
            a_createDate: row.app_submission_date,
            a_status: row.app_status,
            p_id: row.proj_id,
            p_title: row.proj_title,
            p_description: row.proj_description,
            p_aim: row.proj_aim,
            p_funding: row.proj_funding,
            p_funding_motive: row.proj_funding_motivation,
            p_progress: row.proj_progress,
            p_createDate: row.proj_createDate,
            topic_title: row.topic_title,
            members: row.members,
            leader_name: row.pers_fname+' '+row.pers_lname
        }
        applications.push(applic);
        });
        callback(null, applications);
    });
};

export const changeStatusApplication = (appID: number, decision: number, callback: Function) => {
    const q = `UPDATE projectsubmissiondb.application `+
    `SET app_status=? WHERE app_id=?`
    connection.query(q, [decision, appID], (err, result) => {
        if (err) { callback(err) };
        callback(null);
    }
    );
};