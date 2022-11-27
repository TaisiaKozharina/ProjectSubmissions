import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, UserState } from "../../State/User";
import './Header.css';

export default function Header() {
    const dispatch = useDispatch();
    const user = useSelector((state)=> state) as UserState;

    function handleLogout(){
        dispatch(logout());
    }
    return (
        <div className="header">
            <div>Logo</div>
            <div className="links">
                <div><Link to="/">Home</Link></div>
                <div><Link to="/about">About</Link></div>
                <div>{user.id === ''?<Link to="/login">Login</Link>:<Link to='/' onClick={()=>handleLogout()}>Logout</Link>}</div>              
                <div><Link to="/register">Register</Link></div>
                {/* <div><Link to="/profile">Profile</Link></div>  */}
            </div>
    
        </div>
    )
}

