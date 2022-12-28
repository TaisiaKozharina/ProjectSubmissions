import axios from "axios";
import { CollabRequest } from "../../../backend/src/models/CollabRequest";
import { IProject } from "../../../backend/src/models/Project";
//ProjectSubmissions\backend\src\models\ProjectProfile.ts
import { IProjectProf } from "../../../backend/src/models/ProjectProfile";
import { getProjectByID } from "./projects";


export async function createCollab(projID: number, description: string){
    try {
        await axios.post('http://localhost:8080/addprojectprof',
        {
            projectID: projID,
            description: description
        }).then((response)=>{
            //console.log(JSON.stringify(response.data, null, 4));
            console.log('response status is: ', response.status);
            console.log(response.data.profileID);
        })

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            //return error.message;
          } else {
            console.log('unexpected error: ', error);
            //return 'An unexpected error occurred';
          }
    }
}

export async function getCollabs():Promise<IProjectProf[]> {
    let profiles = {} as IProjectProf[];
    try {
        await axios.get('http://localhost:8080/allprojectprof')
        .then((response)=>{
            console.log('response status is: ', response.status);
            //console.log(response.data)
            profiles = Array.from(response.data.profiles);
            console.log(profiles);
        })

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
          } else {
            console.log('unexpected error: ', error);
          }
    } finally {
        return profiles
    }
}

export async function applyForCollab(profID: number, message: string, persID: number){
    try {
        await axios.post('http://localhost:8080/addcollabrequest',
        {
            profID: profID,
            persID: persID,
            message: message
        }).then((response)=>{
            console.log('response status is: ', response.status);
            console.log(response.data.crID);
        })

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
          } else {
            console.log('unexpected error: ', error);
          }
    }
};

export async function getCollabsForProject(userID: number):Promise<CollabRequest[]> {
    let collabs:any = [];
    try {
        await axios.get('http://localhost:8080/getcollabrequests', 
        {
            params:{
                userID: userID
            }
        })
        .then((response)=>{
            console.log('response status is: ', response.status);
            collabs = Array.from(response.data.collabs);
            console.log(collabs);
            
        })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
          } else {
            console.log('unexpected error: ', error);
          }
    } finally {
        return collabs
    }
}

export async function changeStatusCollab(collabID: number, decision: number){
    try {
        await axios.post('http://localhost:8080/changestatuscollab',
        {
            collabID: collabID,
            decision: decision
        }).then((response)=>{
            console.log('response status is: ', response.status);
        })

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
          } else {
            console.log('unexpected error: ', error);
          }
    }
};