import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [dob, setDob] = useState('');
    const [country, setCountry] = useState('');
    const [address, setAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [pass, setPass] = useState('');
    const [persons, setPersons] = useState([]);
    const navigate = useNavigate();

    const [validForm, setValidForm] = useState(false);

    useEffect(()=>{
        if(validForm) navigate("/home");
        else{
            setEmail("");
            setPass("");
        }
    }, [validForm])

    // const register = () => {
    //     if(email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && pass.length >= 6){
    //         console.log(pass);
    //         const hashPass = bcrypt.hashSync(pass, 10);
    //         console.log(hashPass);
    //         Axios.post('http://localhost:3001/create',
    //             {
    //                 fname: fname,
    //                 lname: lname,
    //                 dob: dob,
    //                 country: country,
    //                 address: address,
    //                 email: email,
    //                 phone: phone,
    //                 pass: hashPass
    //             }
    //         ).then(() => { console.log("Successful save"); })
    //         setValidForm(true);
    //     }
    //     else{
    //         setValidForm(false);
    //     }

        
    // }

    // const getPersons = () => {
    //     console.log("GetPersons");
    //     Axios.get('http://localhost:3001/getpersons').then((response) => { 
    //         setPersons(response.data);
    //         console.log(response.data);
    //     });
    //     console.log(persons);
    // }

    return (
        <div className="">
            <h3>Enter information about yourself</h3>

            <label>First Name:</label>
            <input type='text' onChange={(e) => setFName(e.target.value)} />

            <br />

            <label>Last Name:</label>
            <input type='text' onChange={(e) => setLName(e.target.value)} />
            <br />

            <label>DOB Name:</label>
            <input type='text' onChange={(e) => setDob(e.target.value)} />
            <br />

            <label>Country:</label>
            <input type='text' onChange={(e) => setCountry(e.target.value)} />
            <br />

            <label>Address:</label>
            <input type='text' onChange={(e) => setAddress(e.target.value)} />
            <br />

            <label>Email:</label>
            <input type='text' onChange={(e) => setEmail(e.target.value)} />
            <br />

            <label>Phone:</label>
            <input type='text' onChange={(e) => setPhone(e.target.value)} />
            <br />

            <label>Create a password:</label>
            <input type='password' onChange={(e) => setPass(e.target.value)} />
            <br />

            {/* <button onClick={register}>Register</button>

            <button onClick={getPersons}>Show Persons</button>

            {persons.map((val, key) => {
                return <div key={key}>{val.pers_fname}</div>
            })} */}

        </div>
    );
}