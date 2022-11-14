import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, logout, userSlice, UserState } from "../../State/User";

export default function Login() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();


    function handleEmail(event: React.FormEvent<HTMLInputElement>) {   
        let target = event.target as HTMLInputElement; 
        setEmail(target.value);  
    }

    function handlePass(event: React.FormEvent<HTMLInputElement>) {   
        let target = event.target as HTMLInputElement; 
        setPass(target.value);  
    }
    useEffect(()=>{
        console.log("Email changed to: "+ email);
        console.log("Pass changed to: "+ pass);
    }, [email, pass])

    async function authorize() {
        try {
            console.log('API call');
            const {data, status} = await axios.get('http://localhost:8080/getpass'
            , {
                params: {
                    email: email,
                    pass: pass
                }
            }
            );
            //console.log(JSON.stringify(data, null));
            console.log('Response status: '+status);
            const success = data.success;
            if(success){
                let user = data.person as UserState;
                console.log(user);
                dispatch(login(user));
                navigate("/profile");
            }
            else{
                setPass('');
                console.log('Incorrect pass. Try again.');
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



    return(
        <>
                <h3>Login page</h3>
                <label>Email:</label>
                <input type='text' value={email} onChange={handleEmail}/>
                <br />

                <label>Password:</label>
                <input type='password'value={pass} onChange={handlePass}/>
                <br />

                <button onClick={()=>authorize()}>Login</button>
                <button onClick={()=>navigate('/profile')}>To profile</button>
        </>

    )
}