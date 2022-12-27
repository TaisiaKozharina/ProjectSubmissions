import axios from "axios";
import { ITopic } from "../../../backend/src/models/Topic";

export async function getTopics():Promise<ITopic[]> {
    let topics = {} as ITopic[];
    try {
        await axios.get('http://localhost:8080/alltopics')
        .then((response)=>{
            //console.log(response);
            if(response.data.topics.length>0){
                topics = Array.from(response.data.topics) as ITopic[];
                console.log(topics);
                //setTopics(...topics as [], getFinalTopics(raw_topics));
            }
        });
    } 
    catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            //return error.message;
            return {} as ITopic[]
          } else {
            console.log('unexpected error: ', error);
            //return 'An unexpected error occurred';
            return {} as ITopic[]
          }
    }
    finally{
        return topics;
    }
}

export async function addTopic(title: string, parent: number | null) {
    try {
        console.log('Passed title: ' + title);
        console.log('Passed parent id: ' + parent);
        const { data, status } = await axios.post('http://localhost:8080/addtopic',
            {
                title: title,
                parent: parent
            }
        );
        console.log(JSON.stringify(data, null, 4));
        console.log('response status is: ', status);
        if (status === 200) {
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