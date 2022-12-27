import axios from "axios";
import { IProject } from "../../../backend/src/models/Project";
import { Role, UserState } from "../State/User";

export async function createProject(update: boolean, leader: number, project:IProject) {
    console.log(update);
    
    const url2 = update? 'http://localhost:8080/updateproject':'http://localhost:8080/addproject';

    try {
        if(!update){
            await axios.post('http://localhost:8080/addteam',
            {
               name:project.title, //default name, if person adds other team members, they can change it then
               leader_id:leader //user.id
            }).then(async (response)=>{
                console.log(JSON.stringify(response.data, null, 4));
                console.log('response status is: ', response.status);
                let newteamID = response.data.teamID
                await axios.post(url2,
                {
                   project:project,
                   team_id:newteamID
                }).then((response)=>{
                    console.log(JSON.stringify(response.data, null, 4));
                    console.log('response status is: ', response.status);
                });
            });
        }
        else{
            await axios.post(url2,
                {
                   project:project,
                }).then((response)=>{
                    console.log(JSON.stringify(response.data, null, 4));
                    console.log('response status is: ', response.status);
                });
        }
        
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

export async function getProjects(pers_id: number): Promise<IProject[]> {
    //let pers_id = user.role === Role.USER? user.id : -1;
    let raw_projects = {} as IProject[];
    try {
        await axios.get('http://localhost:8080/allprojects',
        {
            params:{
                forPers: pers_id
            }
        }).then((response)=>{
            console.log('response status is: ', response.status);
            raw_projects = Array.from(response.data.projects) as IProject[];
        })

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
          } else {
            console.log('unexpected error: ', error);
          }
    } finally {
        return raw_projects
    }
}

export async function getProjectByID(proj_id: number): Promise<IProject> {
    console.log("Frontend enpoint for getting project. Passed id = ", proj_id)
    let raw_project = {} as IProject;
    try {
        await axios.get('http://localhost:8080/getproject',
        {
            params:{
                projectID: proj_id
            }
        }).then((response)=>{
            console.log('response status is: ', response.status);
            raw_project = response.data.project as IProject;
        })

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
          } else {
            console.log('unexpected error: ', error);
          }
    } finally {
        return raw_project
    }
}