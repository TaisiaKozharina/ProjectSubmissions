import { Router } from "express"
import { OkPacket, RowDataPacket } from "mysql2"
import { connection } from ".."
import { Stats } from "../models/Stats";
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

export const statistics = (callback: Function) => {
  const q = `select t.topic_title, count(p.proj_title) as proj_count, avg(p.proj_funding) as avg_fund, `+
  `sum(case when p.proj_status = 0 then 1 else 0 end) as count_draft, `+
  `sum(case when p.proj_status = 1 then 1 else 0 end) as count_indev, `+
  `sum(case when p.proj_status = 2 then 1 else 0 end) as count_fin `+
  `from projectsubmissiondb.topic t `+
  `left join projectsubmissiondb.project p on p.topic_id=t.topic_id `+
  `group by t.topic_id `

  connection.query(q, (err, result) => {
      if (err) {callback(err)}
      const rows = <RowDataPacket[]> result;
      const stats: Stats[] = [];
  
      rows.forEach(row => {
        const stat:Stats =  {
          topic_title: row.topic_title,
          proj_count: row.proj_count,
          avg_fund: row.avg_fund,
          count_draft: row.count_draft,
          count_indev: row.count_indev,
          count_fin: row.count_fin
        }
        stats.push(stat);
      });
      callback(null, stats);
    });
}


//TODO: Endpoint for deleting topic + all related topics (Need it al all?)