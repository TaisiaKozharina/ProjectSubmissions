import axios from "axios";
import { useEffect, useState } from "react";
import {IProject} from "../../../../backend/src/models/Project";
import {IPerson} from "../../../../backend/src/models/Person";
import { ITopic } from "../../../../backend/src/models/Topic";
import { useSelector } from "react-redux";
import { UserState } from "../../State/User";
import { useNavigate } from "react-router-dom";
import { getTopics } from "../../api/topics";
import { createProject } from "../../api/projects";

export default function CreateProject(props:any ) {
    //const [persons, setPersons] = useState<IPerson[]>([]);
    const [project, setProject] = useState(props.proj as IProject);
    const [topics, setTopics] = useState<ITopic[]>([]);
    const navigate = useNavigate();
    const user = useSelector((state)=>state) as UserState;
    const update = props.proj.id > 1? true : false;
    console.log("Update? ",update);

    useEffect(()=>{
        console.log(project)
    }, [project]);

    // async function getUsers() {
    //     try {
    //         await axios.get('http://localhost:8080/allpers')
    //         .then((response)=>{
    //             let filterUsers = Array.from(response.data.persons) as IPerson[];
    //             filterUsers = filterUsers.filter(user => user.role===1);
    //             console.log(filterUsers);
    //             setPersons(...persons as [], filterUsers);
    //         });
    //     } 
    //     catch (error) {
    //         if (axios.isAxiosError(error)) {
    //             console.log('error message: ', error.message);
    //             return error.message;
    //           } else {
    //             console.log('unexpected error: ', error);
    //             return 'An unexpected error occurred';
    //           }
    //     }
    // }

    function getFinalTopics(topics:ITopic[], finalTopics=[] as ITopic[]){
        topics.forEach(topic=>{
            if(topic.children?.length===0 && topic.class!=='base'){
                finalTopics.push(topic);
            }
            else{
                getFinalTopics(topic.children as ITopic[], finalTopics)
            }
        })
        return finalTopics;  
    }

    const initializer = () => {getTopics().then(r=>setTopics(...topics as [], getFinalTopics(r)))};
    useEffect(initializer, []);
    
    const handleInputChange = (e:React.FormEvent, prop:string) => {
        setProject({
          ...project,
          [prop]: (e.target as HTMLInputElement).value
        })
    }


    return(
        <>
        <div style={{ visibility: props.visible? 'visible': 'hidden'}}>
            <div className="proj-card">
                <div className="card-header">
                    <h2>Creting new project</h2>
                </div>
                {/* {proj.createDate.toString()} */}
                <div className="card-item">
                    <h4>Topic:</h4>
                    <select onChange={(e) => {handleInputChange(e, 'topic_id');}}>
                    {Array.from(topics).filter(x=>x.class==='final').map((topic, index)=>(
                            <option key={index} value={topic.id} >{topic.title}</option>
                    ))}
                    </select>           
                </div>
                
                <div className="card-item">
                    <h4>Title:</h4>
                    <input type='text' value={project.title} onChange={(e) => handleInputChange(e, 'title')} />
                </div>

                <div className="card-item">
                    <h4>Aim:</h4>
                    <textarea value={project.aim} onChange={(e) => handleInputChange(e, 'aim')} />
                </div>
                
                <div className="card-item">
                    <h4>Description:</h4>
                    <textarea value={project.description} onChange={(e) => handleInputChange(e, 'description')} />
                </div>

                <div className="card-item">
                    <h4>Funding amount</h4>
                    <input type='number' value={project.funding} onChange={(e) => handleInputChange(e, 'funding')} />
                </div>

                <div className="card-item">
                    <h4>Funding motivation:</h4>
                    <textarea value={project.funding_motive} onChange={(e) => handleInputChange(e, 'funding_motive')} />
                </div>
                <div className="btn-panel">
                    <button onClick={()=>{createProject(update, user.id, project); navigate("/profile");}}>Save</button>
                </div>
            </div>            
        </div>
        </>
    )
}