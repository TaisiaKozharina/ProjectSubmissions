import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { IProject } from "../../../../backend/src/models/Project";
import { ProjStatus } from "../../enums/ProjStatus";
import { CollabRequest } from "../../../../backend/src/models/CollabRequest";
import { IApplication } from "../../../../backend/src/models/Application";
import { Role, UserState } from "../../State/User";
import profPic from "../../Static/Prof_Pic0.png";
import CreateProject from "./ProjectForm";
import TopicManagement from "./TopicManagement";
import './Profile.css';
import { changeStatusCollab, createCollab, getCollabsForProject } from "../../api/collab";
import { getProjects } from "../../api/projects";
import { RequestStatus } from "../../enums/RequestStatus";
import { decisionApplication, getApplications, submitApplication } from "../../api/applications";
import { Stats } from "../../../../backend/src/models/Stats";
import { getStats } from "../../api/topics";

async function requestCollab(proj: IProject) {
    createCollab(proj.id as number, (document.getElementById('collab-desc') as HTMLInputElement).value)
    document.getElementById('submit-success')!.style.display = "block";
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec wait
    closeClick();
    document.getElementById('submit-success')!.style.display = "none";
    document.getElementById('submit-success')!.style.display = "none";

}

function collabClick() {
    document.getElementById("collab")!.style.display = "block";
}
function closeClick() {
    document.getElementById("collab")!.style.display = "none";
}

function Project(proj: IProject) {
    const user = useSelector((state) => state) as UserState;
    const [edit, setEdit] = useState(false);
    console.log(edit);

    window.onclick = function (event) {
        if (event.target === document.getElementById("collab")) {
            document.getElementById("collab")!.style.display = "none";
        }
    }

    return (
        <>
            {edit === false &&
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
                        {(proj.status == ProjStatus.DRAFT && user.role == Role.USER && (!proj.applic_id || proj.applic_id==-1)) &&
                            <>
                                <button onClick={() => setEdit(true)}>Edit</button>
                                <button onClick={()=>submitApplication(proj.id as number)}>Submit for review</button>
                            </>
                        }
                        {(proj.applic_id && proj.applic_id>=0) &&
                            <div>Application submitted. <br/>Current status: <b>{RequestStatus[proj.applic_status]}</b></div>
                        }

                        {(proj.status != ProjStatus.FINISHED && user.role == Role.USER) &&
                            <button onClick={() => collabClick()}>Need help</button>
                        }

                    </div>

                    <div id="collab" className="collab-modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => closeClick()}>&times;</span>

                            <label htmlFor="collab-desc">Who are you looking for?</label>
                            <br />
                            <textarea id='collab-desc' name="collab-desc" />
                            <br />
                            <button onClick={() => requestCollab(proj)}>Save</button>
                            <br />
                            <h4 id='submit-success'> ✅ Project Profile successfully created! You can now see it in "Collaborations" tab!</h4>
                        </div>
                    </div>
                </div>
            }
            {edit === true &&
                <CreateProject setEdit={setEdit} proj={proj} visible={true} />
            }
        </>

    )
}

function Request(req: CollabRequest) {
    return (
        <div className="request-card">
            <div className="request-header">
                <h3>{req.proj_title}</h3>
            </div>
            <div className="card-item">
                <h4>Submitted by:</h4>
                {req.pers_name}
            </div>
            <div className="card-item">
                <h4>Message:</h4>
                {req.message}
            </div>
            <div className="req-footer">
                <button className="accept-btn" onClick={()=>changeStatusCollab(req.id, 1, req.pers_id, req.team_id)}>Accept</button>
                <button className="reject-btn" onClick={()=>changeStatusCollab(req.id, 2)}>Reject</button>
            </div>
        </div>

    )
}

function Application(appl:IApplication){
    return(
        <div className="appl-card">
            <div className="appl-row">
                <div className="appl-item">
                    <h4>Submitted at:</h4>
                    <p>{appl.a_createDate.toString()}</p>
                </div>
                <div className="appl-item">
                    <h4>Status:</h4>
                    <p>{RequestStatus[appl.a_status]}</p>
                </div>
            </div>

            <div className="appl-row">
                <div className="appl-item">
                    <h4>Project title:</h4>
                    <p>{appl.p_title}</p>
                </div>
                <div className="appl-item">
                    <h4>Project topic:</h4>
                    <p>{appl.topic_title}</p>
                </div>
            </div>

            <div className="appl-row-1">
                <div className="appl-item">
                    <h4>Description:</h4>
                    <p>{appl.p_description}</p>
                </div>
            </div>

            <div className="appl-row-1">
                <div className="appl-item">
                    <h4>Aim:</h4>
                    <p>{appl.p_aim}</p>
                </div>
            </div>

            <div className="appl-row-3">
                <div className="appl-item">
                    <h4>Team size:</h4>
                    <p>{appl.members} person(s)</p>
                </div>
                <div className="appl-item">
                    <h4>Leader:</h4>
                    <p>{appl.leader_name}</p>
                </div>
                <div className="appl-item">
                    <h4>Current progress:</h4>
                    <p>{appl.p_progress}%</p>
                </div>
            </div>

            <div className="appl-row">
                <div className="appl-item">
                    <h4>Requested funding:</h4>
                    <p>{appl.p_funding} €</p>
                </div>
                <div className="appl-item">
                    <h4>Funding motivation:</h4>
                    <p>{appl.p_funding_motive}</p>
                </div>
            </div>

            <div className="appl-row">
                {appl.a_status == RequestStatus.RECEIVED &&
                <>
                 <button className="accept-btn" onClick={()=>decisionApplication(appl.a_id, appl.p_id, 1)}>Accept</button>
                 <button className="reject-btn" onClick={()=>decisionApplication(appl.a_id, appl.p_id, 2)}>Reject</button>
                </>
                }               
            </div>

        </div>
    )
}

const ProfileBody = (user: UserState) => {
    const [show, setShow] = useState(false);
    const [projects, setProjects] = useState<IProject[]>([]);
    const [requests, setRequests] = useState<CollabRequest[]>([]);
    const [applications, setApplications] = useState<IApplication[]>([]);
    const [stats, setStats] = useState<Stats[]>([]);

    const initializerProj = () => { getProjects(user.role === Role.USER ? user.id : -1).then(r => setProjects(...projects as [], r)) };
    const initializerCollab = () => { getCollabsForProject(user.id).then(r => setRequests(...requests as [], r)) };
    const initializerApplic = () => { getApplications().then(r => setApplications(...applications as [], r)) };
    const initializerStats = () => { getStats().then(r => setStats(...stats as [], r)) };


    useEffect(initializerProj, []);
    useEffect(initializerCollab, []);
    useEffect(initializerApplic, []);
    useEffect(initializerStats, []);


    switch (user.role) {
        case (Role.USER): {
            return (
                <div>
                    <h4 className="section-header">Your projects</h4>
                    <div className="proj-list">
                        {Array.from(projects).map((project, index) => (
                            <Project key={index} {...project}></Project>
                        ))}
                    </div>
                    <br /><br /><br />
                    <h4 className="section-header">Requests for collaboration</h4>
                    <div className="proj-list">
                        {Array.from(requests).map((request, index) => (
                            <Request key={index} {...request}/>
                        ))}
                    </div>
                    <button id="btn-form" onClick={() => setShow(true)}>Create project</button>
                    <CreateProject proj={{} as IProject} visible={show} />
                </div>
            )
        }
        case (Role.ADMIN): {
            return (
                <div>
                    <h3>Admin functions: ... </h3>

                    <div>
                    <h4 className="section-header">All applications</h4>
                        <div className="proj-list">
                            {Array.from(applications).map((appl, index) => (
                                <div key={index}>
                                    {appl.a_id}
                                </div>
                            ))}
                        </div>
                    </div>

                    <button>
                        Explode the server muahaha 😈
                    </button>
                </div>
            )
        }
        case (Role.CEO): {
            return (
                <div>
                    <h4 className="section-header">Topic Management</h4>
                    <TopicManagement></TopicManagement>
                    <div>
                        <h4 className="section-header">Statisctics</h4>
                        <table className="stats-table">
                            <thead>
                                <tr>
                                    <td colSpan={3}>Topic</td>
                                    <td colSpan={1}>Count of projects</td>
                                    <td colSpan={2}>Average funding request</td>
                                    <td colSpan={2}>Status "DRAFT"</td>
                                    <td colSpan={2}>Status "IN DEVELOPMENT"</td>
                                    <td colSpan={2}>Status "FINISHED"</td>
                                </tr>
                            </thead>
                            <tbody>
                            {Array.from(stats).map((appl, index) => (
                                <tr key={index}>
                                    <td colSpan={3}>{appl.topic_title}</td>
                                    <td colSpan={1}>{appl.proj_count}</td>
                                    <td colSpan={2}>{appl.avg_fund? appl.avg_fund.toString().slice(0,-4) :0}</td>
                                    <td colSpan={2}>{appl.count_draft}</td>
                                    <td colSpan={2}>{appl.count_indev}</td>
                                    <td colSpan={2}>{appl.count_fin}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <h4 className="section-header">Applications</h4>
                        <div className="proj-list">
                            {Array.from(applications).map((appl, index) => (
                                <Application key={index} {...appl}/>
                            ))}
                        </div>
                    </div>
                </div>
            )
        }
        default: {
            return (<div>Couldn't detect role 💀</div>)
        }
    }
}
export default function Profile() {
    const user = useSelector((state) => state) as UserState;
    return (
        <>
            <div className="profile">
                <div className="prof-header">
                    <div>
                        <h4 className="section-header"><i>Welcome, {user.fname} {user.lname}</i></h4>
                    </div>
                    <div className="pers-info">
                        <div><img src={profPic} alt="Profile" /></div>
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