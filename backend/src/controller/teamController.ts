import { Router } from "express"
import { OkPacket, RowDataPacket } from "mysql2"
import { connection } from ".."
import { IPerson } from "../models/Person";
const router:Router = Router();

export const createTeam = (name: string, leaderID: number, callback: Function) => {
    const q = "INSERT INTO projectsubmissiondb.team (team_name, leader_id) VALUES(?,?)"
    connection.query(
      q, [name, leaderID],
      (err, result) => {
        if (err) {callback(err)};
        const insertId = (<OkPacket> result).insertId;
        callback(null, insertId);
      }
    );
};

export const projectTeamRecord = (teamID: number, persID: number, callback: Function) => {
  const q = "INSERT INTO projectsubmissiondb.projectteam (team_id, pers_id) VALUES(?,?)"
  connection.query(
    q, [teamID, persID],
    (err, result) => {
      if (err) {callback(err)};
      callback(null);
    }
  );
};