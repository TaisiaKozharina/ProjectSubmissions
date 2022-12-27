import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IProject } from "../../../../backend/src/models/Project";
import { ProjStatus } from "../../enums/ProjStatus";
import { Role, UserState } from "../../State/User";
import profPic from "../../Static/Prof_Pic0.png";
import CreateProject from "./ProjectForm";
import TopicManagement from "./TopicManagement";
import './Profile.css';
import { createCollab } from "../../api/collab";
import { getProjects } from "../../api/projects";

// type Project = {
//     id?: number,
//     title?: string,
//     description?: string,
//     aim?: string,
//     funding?: number,
//     funding_motive?: string,
//     deadline?: Date,
//     status: number,
//     topic_id?: number,
//     topic_title?: string
//     leader_id?: number
// }

async function submitCollab(proj:IProject){
        createCollab(proj.id as number, (document.getElementById('collab-desc') as HTMLInputElement).value)
        document.getElementById('submit-success')!.style.display = "block";
        await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec wait
        closeClick();
        document.getElementById('submit-success')!.style.display = "none";
        document.getElementById('submit-success')!.style.display = "none";

}

function collabClick(){
    document.getElementById("collab")!.style.display = "block";
}
function closeClick(){
    document.getElementById("collab")!.style.display = "none";
}

function Project (proj: IProject){
    const user = useSelector((state)=>state) as UserState;   
    const [edit, setEdit] = useState(false);

    window.onclick = function(event) {
        if (event.target === document.getElementById("collab")) {
            document.getElementById("collab")!.style.display = "none";
        }
    }

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
                {(proj.status == ProjStatus.DRAFT && user.role == Role.USER)&&
                <>
                    <button onClick={()=>setEdit(true)}>Edit</button>
                    <button>Submit for review</button>
                </> 
                }

                {proj.status == ProjStatus.IN_DEVELOPMENT &&
                    <button>Edit progress</button>
                }

                {(proj.status != ProjStatus.FINISHED && user.role == Role.USER) &&
                    <button onClick={()=>collabClick()}>Need help</button>
                }

            </div>

            <div id="collab" className="collab-modal">
                <div className="modal-content">
                    <span className="close" onClick={()=>closeClick()}>&times;</span>

                    <label htmlFor="collab-desc">Who are you looking for?</label>
                    <br/>
                    <textarea id='collab-desc' name="collab-desc"/>
                    <br/>
                    <button onClick={()=>submitCollab(proj)}>Save</button>
                    <br/>
                    <h4 id='submit-success'> ✅ Project Profile successfully created! You can now see it in "Collaborations" tab!</h4>
                </div>
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

    const initializer = () => {getProjects(user.role === Role.USER? user.id : -1).then(r=>setProjects(...projects as [], r))};
    useEffect(initializer, []);

    switch(user.role){
        case(Role.USER): {
            return(
                <div>
                    <h3>Your projects: </h3>
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

                    <div>
                        <h3>All projects: </h3>
                        <div className="proj-list">
                            {Array.from(projects).map((project, index)=>(
                                <Project key={index} {...project}></Project>
                            ))}
                        </div>
                    </div>

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