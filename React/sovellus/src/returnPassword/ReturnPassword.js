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
    const [emailSent, setEmailSent] = useState(false);

    const [cookies] = useCookies(['token']);
    
    useEffect(async()=>{
        if(emailObject != ""){
            const options = {
                method: 'GET',
                headers: {"Authorization": `Bearer ${cookies.token}`}
            }
            var i = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Email/Send?toAddress="+emailObject,options);
            var response = await i.json();
            if(response?.status != "Error"){
                setMessage(response?.message);
                setEmailSent(true);
            }
            else{
                setMessage(response?.message);
            }
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