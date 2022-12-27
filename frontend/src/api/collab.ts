import axios from "axios";
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
            let profiles = Array.from(response.data.profiles);
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