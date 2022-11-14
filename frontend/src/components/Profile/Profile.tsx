import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UserState } from "../../State/User";
import profPic from "../../static/Prof_Pic0.png";
import './Profile.css';

function UserProf(props: any){

}

function AdminProf(props: any){

}

function CEOProf(props: any){

}
export default function Profile() {
    const user = useSelector((state)=>state) as UserState;
    return(
        <>
            <div className="profile">
                <div className="header">
                    <h3>Welcome, {user.lname} {user.fname}</h3>
                </div>
                <div className="pers-info">
                    <div><img src={profPic}/></div>
                    <div>
                        <h5>Personal Information</h5>
                        <p>Full name: {user.lname} {user.fname}</p>
                        <p>Email: {user.email}</p>
                        <p>ID: {user.id}</p>
                        <p>Team: in development</p>
                    </div>
                </div>
                <div>
                    IN DEVELOPMENT
                </div>
            </div>


            
        </>
    )
}