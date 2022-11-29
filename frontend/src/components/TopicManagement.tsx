import axios from "axios";
import { useEffect, useState } from "react";
import {ITopic} from "../../../backend/src/models/Topic";
import TopicList from "./TopicList";


export default function TopicManagement() {
    const [topics, setTopics] = useState<ITopic[]>([])

    async function addTopic(title: string, parent: number|null){
        try {
            console.log('Passed title: '+title);
            console.log('Passed parent id: '+parent);
            const {data, status} = await axios.post('http://localhost:8080/addtopic',
            {
                title: title,
                parent: parent
            }
        );
        console.log(JSON.stringify(data, null, 4));
        console.log('response status is: ', status);
        if(status === 200){
            //refresh
            console.log("Successfully added topic to DB");
        }
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

    async function getTopics() {
        try {
            await axios.get('http://localhost:8080/alltopics')
            .then((response)=>{
                //console.log(response);
                if(response.data.topics.length>0){
                    let raw_topics = Array.from(response.data.topics) as ITopic[];
                    console.log(raw_topics);
                    setTopics(...topics as [], raw_topics);
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

    return(
        
        <div>
            <button onClick={()=>getTopics()}>Hack</button>


            <div>Exiting topics:</div>
            <div>
                <ul id="topic-list">
                    {Array.from(topics).map((topic)=>(
                        <TopicList key={topic.id} {...topic}/>
                    ))}
                </ul>

                <div>
                <h4>New category</h4>
                <label>Category name: </label>
                <input type="text" id='new_category' required></input>
                <button onClick={()=>addTopic((document.getElementById('new_category') as HTMLInputElement).value, null)}>Add category</button>
            </div>
            </div>

            <h2>Manage topics</h2>


            
            {topics.length>0 &&
            <div>
                <h4>New Topic</h4>
                <label>Select Caegory</label>
                <select id='select_parent'>
                {Array.from(topics).filter(x=>x.class!=='final').map((topic, index)=>(
                    <option key={index} value={topic.id}>{topic.title}</option>
                ))}
                </select>
                <label>New topic name: </label>
                <input type="text" id='new_topic' required></input>
                <button onClick={
                    ()=>addTopic(
                        (document.getElementById('new_topic') as HTMLInputElement).value, (document.getElementById('select_parent') as HTMLInputElement).value as unknown as number
                        )
                        }>Add topic</button>
            </div>
            }
        </div>
    )
}