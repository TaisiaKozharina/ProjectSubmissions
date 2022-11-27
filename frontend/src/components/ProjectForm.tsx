import axios from "axios";
import { useEffect, useState } from "react";
import {IProject} from "../../../backend/src/models/Project";
import {IPerson} from "../../../backend/src/models/Person";
//import { Accordion } from 'semantic-ui-react'
import { ITopic } from "../../../backend/src/models/Topic";

// interface MenuProp {
//     topic: ITopic
// }

// function TopicMenu(prop:MenuProp){
//     return(
//         <>
//         {prop.topic.children &&
//             <ul>
//             {prop.topic.children.map((topic, index)=>(
//                 <li key={index}>
//                     <p>{topic.title}</p>
//                     <TopicMenu topic={topic}></TopicMenu>
//                 </li>
//             ))}
//             </ul>
//         }
//         <p>{prop.topic.title}</p>
//     </>
//     )
// }

export default function CreateProject(props: any) {
    const [persons, setPersons] = useState<IPerson[]>([]);
    const [project, setProject] = useState({} as IProject);
    const [team, setTeam] = useState<IPerson[]>([]);

    async function getUsers() {
        try {
            await axios.get('http://localhost:8080/allpers')
            .then((response)=>{
                let filterUsers = Array.from(response.data.persons) as IPerson[];
                filterUsers = filterUsers.filter(user => user.role===1);
                console.log(filterUsers);
                setPersons(...persons as [], filterUsers);
            });
        } 
        catch (error) {
            if (axios.isAxiosError(error)) {
                console.log('error message: ', error.message);
                return error.message;
              } else {
                console.log('unexpected error: ', error);
                return 'An unexpected error occurred';
              }
        }
    }

    async function createProject() {
        try {
            let team_name = (document.getElementById("team-name") as HTMLInputElement).value
            console.log(team_name)
            const {data, status} = await axios.post('http://localhost:8080/addteam',
            {
                name:team_name
            });
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
    
    const handleInputChange = (e:React.FormEvent<HTMLInputElement>, prop:string) => {
        setProject({
          ...project,
          [prop]: (e.target as HTMLInputElement).value
        })
    }

    const handleTeam = (e:React.FormEvent<HTMLInputElement>, person:IPerson) =>{
        let target = e.target as HTMLInputElement;
        if(target.checked){
            //add to team
            setTeam([...team, person]);
        }
        else{
            //remove from team
            setTeam(team.filter(member=>member.id!==person.id));
        }
    }


    return(
        <>
        <div style={{ visibility: props.visible? 'visible': 'hidden'}}>
            <h3>Creting new project</h3>

            <label>Choose topic:</label>
            <input type='text' onChange={(e) => handleInputChange(e, 'topic_id')} />
            <br />
            
            <label>Formulate project aim:</label>
            <input type='text' onChange={(e) => handleInputChange(e, 'aim')} />
            <br />

            <label>Describe project:</label>
            <input type='text' onChange={(e) => handleInputChange(e, 'description')} />
            <br />


            <label>Give your project a title:</label>
            <input type='text' onChange={(e) => handleInputChange(e, 'title')} />
            <br />

            <label>What amount of funding you request:</label>
            <input type='number' onChange={(e) => handleInputChange(e, 'funding')} />
            <br />

            <label>Funding motivation:</label>
            <input type='text' onChange={(e) => handleInputChange(e, 'funding_motive')} />
            <br />

            <label>Set a deadline:</label>
            <input type="text" onChange={(e) => handleInputChange(e, 'deadline')} />
            <br />

            <button onClick={()=>{getUsers()}}>Add team</button>
            <div id="person-list">
            <label>Team name:</label>
            <input type="text" id="team-name" />
                {persons && Array.from(persons).map((person, index)=>(
                    <div key={index}>
                        <span>{person.fname} {person.lname}</span>
                        <input type="checkbox" value={person.id} onChange={(e)=>handleTeam(e,person)}></input>
                    </div>
                ))}
            </div>
            <button onClick={()=>createProject()}>Register Team</button>


            <button>Register</button>
        </div>
        </>
    )
}