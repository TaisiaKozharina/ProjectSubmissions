import { Router } from "express"
import { OkPacket, RowDataPacket } from "mysql2"
import { connection } from ".."
import { IProjectProf } from "../models/ProjectProfile";
const router: Router = Router();

export const createProjectProfile = (projectID: number, description: string, callback: Function) => {
    console.log(projectID);
    console.log(description);
    const q = "INSERT INTO projectsubmissiondb.ProjectProfile (pprof_description, proj_id) VALUES(?,?)"
    connection.query(
        q,
        [description,
            projectID
        ],
        (err, result) => {
            if (err) { callback(err) };
            const insertId = (<OkPacket>result).insertId;
            callback(null, insertId);
        }
    );
};

export const allProjectProfile = (callback: Function) => {

    const q = `SELECT pp.pprof_id, pp.pprof_description, pp.proj_id, ` +
        `pr.proj_title, pr.proj_progress, t.leader_id ` +
        `FROM projectsubmissiondb.ProjectProfile pp ` +
        `LEFT JOIN projectsubmissiondb.Project pr on pr.proj_id=pp.proj_id ` +
        `LEFT JOIN projectsubmissiondb.Team t on t.team_id=pr.team_id `
    connection.query(q, (err, result) => {
        let temp_profiles = {} as IProjectProf[];
        const profiles: IProjectProf[] = [];
        if (err) { callback(err) }
        const rows = <RowDataPacket[]>result;
        rows.forEach(row => {
            let profile = {} as IProjectProf;
            const q2 = 
                `SELECT distinct pt.pers_id as pers ` +
                `FROM projectsubmissiondb.projectteam pt ` +
                `left join projectsubmissiondb.team t on pt.team_id = t.team_id ` +
                `left join projectsubmissiondb.project p on p.team_id = t.team_id ` +
                `where p.proj_id = ? `;
            connection.query(
                q2, [row.proj_id], (err, result2) => {
                    const memberz: number[] = [];
                    if (err) { callback(err) };
                    const rows2 = <RowDataPacket[]>result2;
                    rows2.forEach(row2 => {memberz.push(row2.pers as number)});
                    profile = {
                        id: row.pprof_id,
                        description: row.pprof_description,
                        proj_id: row.proj_id,
                        proj_title: row.proj_title,
                        proj_progress: row.proj_progress,
                        leader_id: row.leader_id,
                        members: memberz
                    }
                    console.log(profile);
                    profiles.push(profile);
                    console.log(profiles);
                }
            );
            
        });
        callback(null, profiles);
        console.log("PROFILES: ",profiles);
    });
};