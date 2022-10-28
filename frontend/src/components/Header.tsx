import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="header">
            <div>Logo</div>
            <div className="links">
                <div><Link to="/">Home</Link></div>
                <div><Link to="/about">About</Link></div>
                <div><Link to="/login">Login</Link></div>
                <div><Link to="/register">Register</Link></div> 
                {/* <div><Link to="/profile">Profile</Link></div>  */}
            </div>
    
        </div>
    )
}

