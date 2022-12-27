import { useState, useEffect } from "react";
import { IProject } from "../../../backend/src/models/Project";
import { IProjectProf } from "../../../backend/src/models/ProjectProfile";
import { getCollabs } from "../api/collab";
import { getProjects } from "../api/projects"
import { Role } from "../State/User";

export default function Collabs() {

    const [profiles, setProfiles] = useState<IProjectProf[]>([]);

    const initializer = () => { getCollabs().then(r => setProfiles(...profiles as [], r as IProjectProf[])) };
    useEffect(initializer, []);

    console.log(profiles);


    return (
        <>
            <h3>Open Collaborations</h3>
            <div className="proj-list">
                {Array.from(profiles).map((profile, index) => (
                    <div key={index}>
                        <div>{profile.id}</div>
                        <div>{profile.description}</div>
                        <div>{profile.proj_title}</div>
                    </div>
                ))}
            </div>
        </>
    )
}