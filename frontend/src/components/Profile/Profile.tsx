import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IProject } from "../../../../backend/src/models/Project";
import { ProjStatus } from "../../enums/ProjStatus";
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
    status: number,
    topic_id?: number,
    topic_title?: string
    leader_id?: number
}

function Project (proj: IProject){
    const user = useSelector((state)=>state) as UserState;   
    const [edit, setEdit] = useState(false);

    return(
        <>
        {edit===false &&
            <div className="proj-card">
            <div className="card-header">
                <h2>{proj.title}</h2>
                {user.id === proj.leader_id &&
                <small>You are the leader!</small>
                }
            </div>
            {/* {proj.createDate.toString()} */}
            <div className="card-item">
                <h4>Topic:</h4>
                <p>{proj.topic_title}</p>             
            </div>

            <div className="card-item">
                <h4>Aim:</h4>
                <p>{proj.aim}</p>
            </div>
            
            <div className="card-item">
                <h4>Description:</h4>
                <p>{proj.description}</p>
            </div>
            <div className="card-item">
                <h4>Funding motivation:</h4>
                <p>{proj.aim}</p>
            </div>
            <div className="card-footer">
                <div>
                    <h4>Status:</h4>
                    <p>{ProjStatus[proj.status]}</p>
                </div>
                <div>
                    <h4>Progress:</h4>
                    <p>{proj.progress} %</p>
                </div>
                <div>
                    <h4>$</h4>
                    <p>{proj.funding}</p>
                </div>
            </div>
            <div className="btn-panel">
                {proj.status == ProjStatus.DRAFT &&
                <>
                    <button onClick={()=>setEdit(true)}>Edit</button>
                    <button>Submit for review</button>
                </>
                    
                }
                {proj.status == ProjStatus.IN_DEVELOPMENT &&
                    <button>Edit progress</button>
                }

            </div>
        </div>
        }
        {edit===true &&
            <CreateProject proj={proj} visible={true}/>
        }
        </>
        
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
                //console.log((raw_projects[0] as IProject).topic_title);
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
                    <div className="proj-list">
                        {Array.from(projects).map((project, index)=>(
                            <Project key={index} {...project}></Project>
                        ))}
                    </div>
                    <button id="btn-form" onClick={()=>setShow(true)}>Create project</button>
                    <CreateProject proj={{} as IProject} visible={show}/>
                </div>
            )
        } 
        case(Role.ADMIN): {
            return(
                <div>
                    <h3>Admin functions: ... </h3>
                <button>
                    Explode the server muahaha 😈
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