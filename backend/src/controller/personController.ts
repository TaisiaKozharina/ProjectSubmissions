import { Router } from "express"
import { OkPacket, RowDataPacket } from "mysql2"
import { connection } from ".."
import { IPerson } from "../models/Person"
const router:Router = Router();

export const createPerson = (person: IPerson, callback: Function) => {
    const q = "INSERT INTO Person (pers_fname, pers_lname, pers_dob, pers_country, pers_address, pers_email, pers_phone, pers_password) VALUES(?,?,?,?,?,?,?,?)"
    connection.query(
      q,
      [person.fname, person.lname, person.dob, person.country, person.address, person.email, person.phone, person.password],
      (err, result) => {
        if (err) {callback(err)};
        const insertId = (<OkPacket> result).insertId;
        callback(null, insertId);
      }
    );
};

export const findAllPersons = (callback: Function) => {
    const q = `SELECT * FROM projectsubmissiondb.Person `
    connection.query(q, (err, result) => {
        if (err) {callback(err)}
    
        const rows = <RowDataPacket[]> result;
        const persons: IPerson[] = [];
    
        rows.forEach(row => {
          const person:IPerson =  {
            id: row.pers_id,
            fname: row.pers_fname,
            lname: row.pers_lname, 
            dob: row.pers_dob,
            country: row.pers_country, 
            address: row.pers_address, 
            email: row.pers_email, 
            phone: row.pers_phone, 
            password: row.pers_password
          }
          persons.push(person);
        });
        callback(null, persons);
      });
}

export const findPerson = (personId: number, callback: Function) => {

    const q = `SELECT * FROM projectsubmissiondb.Person WHERE pers_id=? `
    connection.query(q, personId, (err, result) => {
      if (err) {callback(err)}
      
      const row = (<RowDataPacket> result)[0];
      const person: IPerson =  {
        id: row.pers_id,
        fname: row.pers_fname,
        lname: row.pers_lname, 
        dob: row.pers_dob,
        country: row.pers_country, 
        address: row.pers_address, 
        email: row.pers_email, 
        phone: row.pers_phone, 
        password: row.pers_password
      }
      callback(null, person);
    });
}

export const findPassByEmail = (personEmail: string, callback: Function) => {
  const q = `SELECT pers_id, pers_password, pers_fname, pers_lname, role_id  FROM projectsubmissiondb.Person WHERE pers_email=? `
  connection.query(q, personEmail, (err, result) => {
    if (err) {callback(err)}
    
    const row = (<RowDataPacket> result)[0];
    let data = {
      id: '',
      pass: '',
      email: '',
      fname: '',
      lname: '',
      role: ''
      
    }
    if (row){
      data = {
        id: row.pers_id,
        pass: row.pers_password,
        email: personEmail,
        fname: row.pers_fname,
        lname: row.pers_lname,
        role: row.role_id
      }

    }
    
    callback(null, data);
  });
}
