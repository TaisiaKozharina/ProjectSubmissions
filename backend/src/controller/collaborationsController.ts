import { Router } from "express"
import { OkPacket, RowDataPacket } from "mysql2"
import { connection } from ".."
import { CollabRequest } from "../models/CollabRequest";
import { IProjectProf } from "../models/ProjectProfile";
import { ProjStatus } from "../models/ProjStatus";
const router: Router = Router();

export const createProjectProfile = (projectID: number, description: string, callback: Function) => {
    const q = "INSERT INTO projectsubmissiondb.ProjectProfile (pprof_description, proj_id) VALUES(?,?)"
    connection.query(q, [description, projectID], (err, result) => {
        if (err) { callback(err) };
        const insertId = (<OkPacket>result).insertId;
        callback(null, insertId);
    }
    );
};

export const allProjectProfile = (callback: Function) => {
    const q1 = `SELECT pp.pprof_id, pp.pprof_description, pp.proj_id, ` +
        `pr.proj_title, pr.proj_progress, t.leader_id, count(pt.pers_id) as membs ` +
        `FROM projectsubmissiondb.ProjectProfile pp ` +
        `LEFT JOIN projectsubmissiondb.Project pr on pr.proj_id=pp.proj_id ` +
        `LEFT JOIN projectsubmissiondb.Team t on t.team_id=pr.team_id ` +
        `LEFT JOIN projectsubmissiondb.ProjectTeam pt on pt.team_id=t.team_id `;
    const q2 =
        `SELECT distinct pt.pers_id as pers ` +
        `FROM projectsubmissiondb.projectteam pt ` +
        `left join projectsubmissiondb.team t on pt.team_id = t.team_id ` +
        `left join projectsubmissiondb.project p on p.team_id = t.team_id ` +
        `where p.proj_id = ? `;

    connection.query(q1, (err, result) => {
        const profiles: IProjectProf[] = [];

        if (err) { callback(err) }

        const profs = <RowDataPacket[]>result;

        profs.forEach(prof => {
            const profile: IProjectProf = {
                id: prof.pprof_id,
                description: prof.pprof_description,
                proj_id: prof.proj_id,
                proj_title: prof.proj_title,
                proj_progress: prof.proj_progress,
                leader_id: prof.leader_id,
                members: prof.membs
            }
            profiles.push(profile);
        });
        callback(null, profiles);
    });
};

export const createCollabRequest = (profileID: number, message: string, persID: number, callback: Function) => {
    const q = `INSERT INTO projectsubmissiondb.collabrequest (cr_date, cr_message, cr_status, pprof_id, pers_id) ` +
        `values (cast(now() AS Date), ?, ?, ?, ?)`
    connection.query(q, [message, ProjStatus.DRAFT, profileID, persID], (err, result) => {
        if (err) { callback(err) };
        const insertId = (<OkPacket>result).insertId;
        callback(null, insertId);
    }
    );
};

export const getCollabRequests = (persID: number, callback: Function) => {
    const q1 = `SELECT distinct cr.cr_id, cr.cr_date, cr.cr_message, cr.cr_status, cr.pprof_id, `+
                `cr.pers_id, p.proj_title, pers_fname, pers_lname, t.team_id `+
                `FROM projectsubmissiondb.collabrequest cr `+
                `left join projectsubmissiondb.projectprofile pp on pp.pprof_id = cr.pprof_id `+
                `left join projectsubmissiondb.project p on p.proj_id = pp.proj_id `+
                `left join projectsubmissiondb.team t on p.team_id = t.team_id `+
                `left join projectsubmissiondb.person pers on pers.pers_id = cr.pers_id `;
    const q2 =  `where t.leader_id=? and cr.cr_status=0 `;
    const q = persID<0? q1:(q1+q2); //if for project - then add condition

    connection.query(q, [persID], (err, result) => {
        if (err) { callback(err) };
        const rows = <RowDataPacket[]> result;
        const collabs: CollabRequest[] = [];
        rows.forEach(row => {
            const collab:CollabRequest =  {
                id: row.cr_id,
                createDate: row.cr_date,
                message: row.cr_message,
                prof_id: row.pprof_id,
                proj_title: row.proj_title,
                status: row.cr_status,
                pers_id: row.pers_id,
                pers_name: row.pers_fname+' '+row.pers_lname,
                team_id:row.team_id
            }
            collabs.push(collab);
        });
        callback(null, collabs);
    });
};

export const changeStatus = (collabID: number, decision: number, callback: Function) => {
    const q = `update projectsubmissiondb.collabrequest `+
    `set cr_status=? where cr_id=?`
    connection.query(q, [decision, collabID], (err) => {
        if (err) { callback(err) };
        callback(null);
    }
    );
};