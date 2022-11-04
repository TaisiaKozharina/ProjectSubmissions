import axios from "axios";
import { useNavigate } from "react-router-dom"

const emailTemp: string = 'test666@test.com'
async function login() {
    try {
        const {data, status} = await axios.get<string>('http://localhost:8080/getpass',
        {
            params: {
                email: emailTemp
            }
        }
        );
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

export default function Login() {
    const navigate = useNavigate();
    return(
        <>
                <h3>Login page</h3>
                <label>Email:</label>
                <input type='text'/>
                <br />

                <label>Password:</label>
                <input type='password'/>
                <br />

                <button onClick={()=>login()}>Login</button>
                <button onClick={()=>navigate('/profile')}>To profile</button>
        </>

    )
}