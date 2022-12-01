import axios from "axios";
import { useEffect, useState } from "react";
import {IProject} from "../../../backend/src/models/Project";
import {IPerson} from "../../../backend/src/models/Person";
import { ITopic } from "../../../backend/src/models/Topic";
import { useSelector } from "react-redux";
import { UserState } from "../State/User";

export default function CreateProject(props: any) {
    const [persons, setPersons] = useState<IPerson[]>([]);
    const [project, setProject] = useState({} as IProject);
    const [topics, setTopics] = useState<ITopic[]>([]);
    const user = useSelector((state)=>state) as UserState;

    useEffect(()=>{
        console.log(project)
    }, [project]);

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

    function getFinalTopics(topics:ITopic[], finalTopics=[] as ITopic[]){
        topics.forEach(topic=>{
            if(topic.children?.length==0 && topic.class!=='base'){
                finalTopics.push(topic);
            }
            else{
                getFinalTopics(topic.children as ITopic[], finalTopics)
            }
        })
        return finalTopics;  
    }

    async function getTopics() {
        try {
            await axios.get('http://localhost:8080/alltopics')
            .then((response)=>{
                //console.log(response);
                if(response.data.topics.length>0){
                    let raw_topics = Array.from(response.data.topics) as ITopic[];
                    console.log(raw_topics);
                    setTopics(...topics as [], getFinalTopics(raw_topics));
                }
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
            await axios.post('http://localhost:8080/addteam',
            {
               name:project.title, //default name, if person adds other team members, they can change it then
               leader_id:user.id
            }).then(async (response)=>{
                console.log(JSON.stringify(response.data, null, 4));
                console.log('response status is: ', response.status);
                let newteamID = response.data.teamID
                await axios.post('http://localhost:8080/addproject',
                {
                   project:project,
                   team_id:newteamID
                }).then((response)=>{
                    console.log(JSON.stringify(response.data, null, 4));
                    console.log('response status is: ', response.status);
                });
            });

            
            
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
    
    const handleInputChange = (e:React.FormEvent, prop:string) => {
        setProject({
          ...project,
          [prop]: (e.target as HTMLInputElement).value
        })
    }


    return(
        <>
        <button onClick={()=>getTopics()}>Hack</button>
        <div style={{ visibility: props.visible? 'visible': 'hidden'}}>
            <h3>Creting new project</h3>

            <label>Choose topic:</label>
            <select onChange={(e) => {handleInputChange(e, 'topic_id');}}>
                {Array.from(topics).filter(x=>x.class==='final').map((topic, index)=>(
                        <option key={index} value={topic.id} >{topic.title}</option>
                ))}
                
            </select>
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
            <textarea onChange={(e) => handleInputChange(e, 'funding_motive')} />
            <br />

            <label>Set a deadline:</label>
            <input type="text" onChange={(e) => handleInputChange(e, 'deadline')} />
            <br />

            <button onClick={()=>createProject()}>Create</button>

        </div>
        </>
    )
}