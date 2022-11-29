import axios from "axios";
import { useEffect, useState } from "react";
import { batch } from "react-redux";
import { ITopic } from "../../../backend/src/models/Topic";

function addFinalTopic(e:React.MouseEvent<HTMLButtonElement>){
    let btn = e.target as HTMLElement;
    let parentUl = btn.parentElement?.parentElement?.nextElementSibling;
    console.log(parentUl);
    let lastLi = parentUl?.lastChild as HTMLLIElement;
    console.log(lastLi);
    let newLi = lastLi.cloneNode();
    parentUl!.appendChild(newLi);
    console.log('done')
}

export default function TopicList(topic:ITopic){
    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{
        console.log("Hackers do not cry:" + refresh);
    }, [refresh])

    async function deleteTopic(id: number){
        try {
            //console.log('Passed id: '+id);
            await axios.post('http://localhost:8080/deletetopic',
            {
                id: id
            }
        ).then(response => {setRefresh(!refresh); console.log(response.status)})
        // if(status === 200){
        //     //refresh
        //     console.log("Successfully added topic to DB");
            
        // }
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

    return(
        <li className={`${topic.class} list-item`}>
            <div className="topic-header">
                <input type='text' value={topic.title} onChange={()=>{console.log('test')}}/>
                <div className="topic-options">
                    <button onClick={()=>deleteTopic(topic.id as number)}>Remove</button>
                    {(topic.class==='base' || topic.class==='middle') &&
                    <button onClick={()=>{}}>New topic</button>
                    }
                </div>
            </div>
            <ul>
                {topic.children &&
                    topic.children.map((child:ITopic) => (
                        <TopicList key={child.id} {...child as ITopic}/>
                    ))
                }
            </ul>
        </li>
    )
}