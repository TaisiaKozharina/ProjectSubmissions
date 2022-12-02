import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { IProject } from "../../../../backend/src/models/Project";
import { Role, UserState } from "../../State/User";
import profPic from "../../Static/Prof_Pic0.png";
import CreateProject from "../ProjectForm";
import TopicManagement from "../TopicManagement";
import './Profile.css';

type Project = {
    id?: number,
    title?: string,
    description?: string,
    aim?: string,
    funding?: number,
    funding_motive?: string,
    deadline?: Date,
    status?: number,
    topic_id?: number
}

function Project (proj: IProject){
    return(
        <div>
            <table>
                <tbody>
                <tr>
                    <td>Title</td>
                    <td>{proj.title}</td>
                </tr>
                <tr>
                    <td>Aim</td>
                    <td>{proj.aim}</td>
                </tr>
                <tr>
                    <td>Description</td>
                    <td>{proj.description}</td>
                </tr>
                <tr>
                    <td>Funding</td>
                    <td>{proj.funding}</td>
                </tr>
                <tr>
                    <td>Funding motive</td>
                    <td>{proj.funding_motive}</td>
                </tr>
                <tr>
                    <td>Team id</td>
                    <td>{proj.team_id}</td>
                </tr>
                <tr>
                    <td>Status</td>
                    <td>{proj.status}</td>
                </tr>
                {/* <tr>
                    <td>Progress</td>
                    <td>{proj.progress}</td>
                </tr> */}
                {/* <tr>
                    <td>Create at</td>
                    <td>{new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(proj.createDate)}</td>
                </tr> */}
                </tbody>
            </table>
        </div>
    )
}




const ProfileBody = (user: UserState) =>{
    const [show, setShow] = useState(false);
    const [projects, setProjects] = useState<IProject[]>([]);

    async function getProjects(persID: number){
        try {
            await axios.get('http://localhost:8080/allprojects',
            {
                params:{
                    forPers: user.id
                }
                
            }).then((response)=>{
                //console.log(JSON.stringify(response.data, null, 4));
                console.log('response status is: ', response.status);
                let raw_projects = Array.from(response.data.projects) as IProject[];
                console.log(raw_projects);
                setProjects(...projects as [], raw_projects);
            })
    
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                return error.message;
              } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
              }
        }
    }

    switch(user.role){
        case(Role.USER): {
            return(
                <div>
                    <h3>Your projects: </h3>
                    <button onClick={()=>getProjects(user.id as number)}>Load your project</button>
                    {Array.from(projects).map((project, index)=>(
                        <Project key={index} {...project}></Project>
                ))}
                    <button id="btn-form" onClick={()=>setShow(true)}>Create project</button>
                    <CreateProject visible={show}/>
                </div>
            )
        } 
        case(Role.ADMIN): {
            return(
                <div>
                    <h3>Admin functions: ... </h3>
                <button>
                    Explode the server muahaha
                </button>
                </div>
            )
        } 
        case(Role.CEO):{
            return(
                <div>
                    <TopicManagement></TopicManagement>
                </div>
            )
        }
        default: {
            return( <div>Couldn't detect role 💀</div>)
        }
    }
}
export default function Profile() {
    const user = useSelector((state)=>state) as UserState;
    return(
        <>
            <div className="profile">
                <div className="prof-header">
                    <h3>Welcome, {user.fname} {user.lname}</h3>
                    <div className="pers-info">
                        <div><img src={profPic} alt="Profile"/></div>
                        <div>
                            <h5>Personal Information</h5>
                            <p>Full name: {user.lname} {user.fname}</p>
                            <p>Email: {user.email}</p>
                            <p>ID: {user.id}</p>
                            <p>Team: in development</p>
                        </div>
                    </div>
                </div>
                
                <div className="prof-body">
                    {ProfileBody(user)}
                </div>
            </div>


            
        </>
    )
}