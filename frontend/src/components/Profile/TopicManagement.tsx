import axios from "axios";
import { useEffect, useState } from "react";
import { ITopic } from "../../../../backend/src/models/Topic";
import { addTopic, getTopics } from "../../api/topics";
import TopicList from "./TopicList";


export default function TopicManagement() {
    const [topics, setTopics] = useState<ITopic[]>([]);

    const initializer = () => {getTopics().then(r=>setTopics(...topics as [], r))};
    useEffect(initializer, []);

    return (
        <div>
            {/* <button onClick={() => getTopics()}>Hack</button> */}
            <div>Exiting topics:</div>
            <div>
                <ul id="topic-list">
                    {Array.from(topics).map((topic) => (
                        <TopicList key={topic.id} {...topic} />
                    ))}
                </ul>

                <div>
                    <h4>New category</h4>
                    <label>Category name: </label>
                    <input type="text" id='new_category' required></input>
                    <button onClick={() => addTopic((document.getElementById('new_category') as HTMLInputElement).value, null)}>Add category</button>
                </div>
            </div>

            <h2>Manage topics</h2>

            {topics.length > 0 &&
                <div>
                    <h4>New Topic</h4>
                    <label>Select Caegory</label>
                    <select id='select_parent'>
                        {Array.from(topics).filter(x => x.class !== 'final').map((topic, index) => (
                            <option key={index} value={topic.id}>{topic.title}</option>
                        ))}
                    </select>
                    <label>New topic name: </label>
                    <input type="text" id='new_topic' required></input>
                    <button onClick={
                        () => addTopic(
                            (document.getElementById('new_topic') as HTMLInputElement).value, (document.getElementById('select_parent') as HTMLInputElement).value as unknown as number
                        )
                    }>Add topic</button>
                </div>
            }
        </div>
    )
}