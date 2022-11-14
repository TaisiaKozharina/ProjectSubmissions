import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { UserState } from "../State/User";

export default function Profile() {
    const user = useSelector((state)=>state) as UserState;
    return(
        <>
            <h3>Profile page</h3>
            <h3>Welcome {user.lname}</h3>
            <h3>Fname {user.fname}</h3>
            <h3>Email {user.email}</h3>
            <h3>ID {user.id}</h3>
            <h3>Role {user.role}</h3>
        </>
    )
}