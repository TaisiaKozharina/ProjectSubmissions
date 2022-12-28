import axios from "axios";

export async function getUsersForProj(projID: number):Promise<number[]> {
    let userIDs = {} as number[];
    try {
        await axios.get('http://localhost:8080/getmembersproject',
        {
            params:{
                projectID: projID
            }
        }).then((response)=>{
            //console.log(JSON.stringify(response.data, null, 4));
            console.log('response status is: ', response.status);
            console.log(response.data.members);
            userIDs = Array.from(response.data.members);
            
        })

    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log('error message: ', error.message);
            //return error.message;
          } else {
            console.log('unexpected error: ', error);
            //return 'An unexpected error occurred';
          }
    } finally{
        return userIDs;
    }
}