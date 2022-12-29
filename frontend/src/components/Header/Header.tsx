import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout, UserState } from "../../State/User";
import './Header.css';
import logo from "../../Static/logo.png";
import logo2 from "../../Static/logo2.png";

export default function Header() {
    const dispatch = useDispatch();
    const user = useSelector((state)=> state) as UserState;

    function handleLogout(){
        dispatch(logout());
    }
    return (
        <div className="header">
            <div id="logo"><img src={logo2} alt="Logo" /></div>
            <ul className="links">
                <li><Link to="/">Home</Link></li>
                <li>{user.id === -1?<Link to="/login">Login</Link>:<Link to='/' onClick={()=>handleLogout()}>Logout</Link>}</li>              
                <li>{user.id === -1? <Link to="/register">Register</Link> : <Link to="/profile">Profile</Link>}</li>
                <li><Link to="/collabs">Collaborations</Link></li>
            </ul>
        </div>
    )
}

