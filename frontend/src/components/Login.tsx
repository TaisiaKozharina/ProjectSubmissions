import { useNavigate } from "react-router-dom"

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

                <button onClick={()=>navigate('/profile')}>Login</button>
        </>

    )
}