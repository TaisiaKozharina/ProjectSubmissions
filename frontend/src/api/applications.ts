import axios from "axios";
import { IApplication } from "../../../backend/src/models/Application";
import { RequestStatus } from "../enums/RequestStatus";

export async function submitApplication(projID: number){
    console.log("In api: received projID:"+projID);
    try {
        await axios.post('http://localhost:8080/submitapplication',
        {
            projID: projID,
        }).then((response)=>{
            console.log('response status is: ', response.status);
            console.log(response.data.applicID);
        })

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
        } else {
        console.log('unexpected error: ', error);
        }
    }
}

export async function getApplications(): Promise<IApplication[]> {
    let applics = {} as IApplication[];
    try {
        await axios.get('http://localhost:8080/getapplications')
        .then((response)=>{
            console.log('response status is: ', response.status);
            applics = Array.from(response.data.applications) as IApplication[];
        })

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
          } else {
            console.log('unexpected error: ', error);
          }
    } finally {
        return applics;
    }
}

export async function decisionApplication(applID: number, projID: number, decision: RequestStatus) {
    try {
        await axios.post('http://localhost:8080/changestatusapplic',
        {
            applID:applID,
            projID:projID,
            decision: decision
        })
        .then((response)=>{
            console.log('response status is: ', response.status);
        })
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
          } else {
            console.log('unexpected error: ', error);
          }
    }
}