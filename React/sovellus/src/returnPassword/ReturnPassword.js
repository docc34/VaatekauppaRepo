import React, { useEffect, useState } from 'react';
import './ReturnPassword.css';

import 'bootstrap/dist/css/bootstrap.min.css';


import '@inovua/reactdatagrid-community/index.css'

//^Importataan kaikki paketit mitä tarvitaan
import { useCookies } from 'react-cookie';
const ReturnPassword = () => {
    const [message, setMessage] = useState("");
    const [emailObject, setEmailObject] = useState("");
    const [emailTo, setEmailTo] = useState("");

    const [cookies] = useCookies(['token']);
    
    useEffect(async()=>{
        if(emailObject != ""){
            const options = {
                method: 'GET',
                headers: {"Authorization": `Bearer ${cookies.token}`}
            }
            var i = await fetch("https://localhost:44344/api/Email/Send?toAddress="+emailObject,options);
            console.log(i);
            setMessage(await i.json());
        }
    },[emailObject]);
    


    return (
    <div className="Store-Post-Main-Box">
        <h1> Palauta salasana</h1>
        <p>Anna käyttäjätilisi sähköposti</p>
        <input onChange={(e)=>{setEmailTo(e.target.value)}}></input>
        {/* TODO: Lisää ilmoitus että sähköposti on lähetetty ja vaihtoehto lähettää sähköposti uudestaan */}
        {message}
        <button onClick={()=>{setEmailObject(emailTo)}}>Lähetä gmail</button>
    </div>)
}

export { ReturnPassword }