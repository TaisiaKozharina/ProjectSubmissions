import { Router } from "express"
import { OkPacket, RowDataPacket } from "mysql2"
import { connection } from ".."
import { ITopic } from "../models/Topic"
const router:Router = Router();

export const findAllTopics = (callback: Function) => {
    const q = `SELECT * FROM projectsubmissiondb.Topic `
    connection.query(q, (err, result) => {
        if (err) {callback(err)}
    
        const rows = <RowDataPacket[]> result;
        const topics: ITopic[] = [];
    
        rows.forEach(row => {
          const topic:ITopic =  {
            id: row.topic_id,
            title: row.topic_title,
            parent_id: row.parent_id
          }
          topics.push(topic);
        });
        callback(null, topics);
      });
}

export const createTopic = (title: string, parent: number|null, callback: Function) => {
    const q = `INSERT INTO Topic(topic_title, parent_id) VALUES(?,?) `
    connection.query(q, [title, parent], (err, result) => {
        if (err) {callback(err)}
        const insertId = (<OkPacket> result).insertId;
        callback(null, insertId);
      });
}

export const deleteTopic = (id: number, callback: Function) => {
  console.log('Request is in controller');
  console.log(id);
  const q = `DELETE from Topic where topic_id=?`
  connection.query(q, [id], (err, result) => {
      if (err) {callback(err)}
      console.log(result);
      callback(null);
  });
}

export const getTopicName = (id: number, callback: Function) => {
  const q = `SELECT topic_title from projectsubmissiondb.Topic where topic_id=? `
  console.log("IN CONTROLLER. Param: ", id);
  connection.query(q, id, (err, result) => {
      if (err) {callback(err)}
      console.log(result);
      const row = (<RowDataPacket> result)[0];
      const title:String = row.topic_title
      callback(null, title);
  });
}


//TODO: Endpoint for deleting topic + all related topics (Need it al all?)