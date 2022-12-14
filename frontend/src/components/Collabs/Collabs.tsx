import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IProject } from "../../../../backend/src/models/Project";
import { IProjectProf } from "../../../../backend/src/models/ProjectProfile";
import { applyForCollab, getCollabs } from "../../api/collab";
import { getProjects } from "../../api/projects"
import { getUsersForProj } from "../../api/users";
import { Role, UserState } from "../../State/User";
import './Collabs.css';

async function applyCollab(profID: number, userID: number){
    applyForCollab(profID as number, (document.getElementById('collab-message') as HTMLInputElement).value, userID)
    document.getElementById('submit-success')!.style.display = "block";
    await new Promise(resolve => setTimeout(resolve, 3000)); // 3 sec wait
    closeClick();
    document.getElementById('submit-success')!.style.display = "none";
    document.getElementById('submit-success')!.style.display = "none";
}

function collabClick(projid: number){
document.getElementById("collab")!.style.display = "block";
console.log(document.getElementById('proj-id'));
(document.getElementById('proj-id') as HTMLInputElement).value = projid.toString();
console.log((document.getElementById('proj-id') as HTMLInputElement).value);
}
function closeClick(){
document.getElementById("collab")!.style.display = "none";
}

function Collab(profile: IProjectProf){
    const user = useSelector((state)=>state) as UserState;
    const [members, setMembers] = useState<number[]>([]);
    const initializer = () => { getUsersForProj(profile.id).then(r => setMembers(...members as [], r as number[])) };
    useEffect(initializer, []);
    
    return(
        <>
        <div className="collab-card">
            <h3 className="collab-header">
                <small>Project:</small>
                <br/>
                {profile.proj_title}: {profile.proj_id}
            </h3>
            {/* <div>{profile.id}</div> */}
            <div>{profile.description}</div>
            {members.includes(user.id) &&
            <div className="collab-footer">
                ???You are the member
            </div>
            }
            {!members.includes(user.id) &&
            <div className="collab-footer">
                <button onClick={()=>collabClick(profile.proj_id)}>Apply!</button>
            </div>
            }
        </div>

        <div id="collab" className="collab-modal">
            <div className="modal-content">
                <span className="close" onClick={()=>closeClick()}>&times;</span>

                <label htmlFor="collab-desc">Tell the team how you could help</label>
                <br/>
                <textarea id='collab-message' name="collab-message"/>
                <br/>
                <input id="proj-id" type="number" style={{display:"none"}} value="-1" readOnly/>
                <button onClick={()=>applyCollab((document.getElementById('proj-id') as HTMLInputElement).value as unknown as number, user.id)}>Save</button>
                <br/>
                <h4 id='submit-success'> ??? Your request has been sent! Wait for the response! </h4>
            </div>
        </div>
        </>
    )
}

export default function CollabList() {
    const [profiles, setProfiles] = useState<IProjectProf[]>([]);
    const initializer = () => { getCollabs().then(r => setProfiles(...profiles as [], r as IProjectProf[])) };
    useEffect(initializer, []);
    console.log(profiles);
    return (
        <>
            <h4 className="section-header">Active Collaboration Profiles</h4>
            <div className="proj-list">
                {Array.from(profiles).map((profile, index) => (
                    <Collab key={index} {...profile}></Collab>
                ))}
            </div>
        </>
    )
}