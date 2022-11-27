import { Router } from "express"
import { OkPacket, RowDataPacket } from "mysql2"
import { connection } from ".."
const router:Router = Router();

export const createTeam = (name: string, callback: Function) => {
    const q = "INSERT INTO projectsubmissiondb.team (team_name) VALUES(?)"
    connection.query(
      q, [name],
      (err, result) => {
        if (err) {callback(err)};
        const insertId = (<OkPacket> result).insertId;
        callback(null, insertId);
      }
    );
};