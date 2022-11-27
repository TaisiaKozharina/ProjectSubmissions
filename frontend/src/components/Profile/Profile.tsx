import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
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

async function getProjects(criteria: string){
    try {
        const {data, status} = await axios.get<Project>('http://localhost:8080/allpers');
        console.log(JSON.stringify(data, null, 4));
        console.log('response status is: ', status);
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


const ProfileBody = (role: Role) =>{
    const [show, setShow] = useState(false);
    switch(role){
        case(Role.USER): {
            
            return(
                <div>
                    <h3>Your projects: </h3>
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
                <div className="header">
                    <h3>Welcome, {user.fname} {user.lname}</h3>
                </div>
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
                <div>
                    {ProfileBody(user.role)}
                </div>
            </div>


            
        </>
    )
}