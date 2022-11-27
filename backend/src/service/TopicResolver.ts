import { ITopic } from "../models/Topic";

export default function resolveTree(topics:ITopic[], base_topic: ITopic){
    //1. Select all topics that have this topic as parent
    //2. Assign them class middle -> for each call this method again
    //3. If no children - class final

    let direct_children =  topics.filter(x=> x.parent_id === base_topic.id);
    if(direct_children.length>0){
        base_topic.children = direct_children;
        if(base_topic.class !== 'base'){
            base_topic.class = 'middle';
        }
        direct_children.forEach(child=>{
            //Recursion for each child topic
            resolveTree(topics, child);
        })
    }
    else{
        base_topic.children = [] as ITopic[];
        if(base_topic.class !== 'base'){
            base_topic.class = 'final';
        }
    }
    return topics;
}