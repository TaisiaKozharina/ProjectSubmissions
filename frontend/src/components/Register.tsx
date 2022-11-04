import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios";


type PersonData = {
    id?: number,
    fname: string,
    lname: string,
    dob: Date,
    country: string,
    address: string,
    email: string,
    phone: string,
    password: string
}

type Persons = {
    data: PersonData[]
}


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

    async function getPersons() {
        try {
            const {data, status} = await axios.get<Persons>('http://localhost:8080/allpers');
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

    async function addPerson(){
        console.log("Clicked register");
        if(email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i) && pass.length >= 6){
            try {
                console.log("Entered try block");
                const {data, status} = await axios.post<PersonData>('http://localhost:8080/addpers',
                    {
                        fname: fname,
                        lname: lname,
                        dob: dob,
                        country: country,
                        address: address,
                        email: email,
                        phone: phone,
                        pass: pass
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
        else{
            console.log("Error in input, smth does not match requirements")
        }
    }

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

            <button onClick={() => addPerson()}>Register</button>
{/* 
            <button onClick={getPersons}>Show Persons</button>

            {persons.map((val, key) => {
                return <div key={key}>{val.pers_fname}</div>
            })} */}

            <button onClick={() => getPersons()}>API Call</button>

        </div>
    );
}