import React, { useState, useEffect } from 'react';
import { Button, Form } from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import './Rekisteroityminen.css'
import { NavLink } from 'react-router-dom';

//Renderöi rekisteröitymissivun
const Rekisteroityminen = ()=>{
    const [loading, setLoading] = useState(false);
    const username = useFormInput('');
    const password = useFormInput('');
    const passwordAgain = useFormInput('');
    const name = useFormInput('');
    const email = useFormInput('');
    const phonenumber = useFormInput('');
    const [error, setError] = useState(null);

    //TODO: Avaa kirjautuminen
    let navigate = useNavigate();
    //Kutsutaan rekisteröitymisen backendiä
    useEffect( async()=>{
         if(loading != false){
          let post = await fetch("https://localhost:44344/api/Authenticate/register", {
            
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({username: username.value, password: password.value,  name: name.value,email:email.value , phonenumber: phonenumber.value})
            });
            let tarkistus = await post.json();
            if( tarkistus.status == "NOT OK"){
                setError(tarkistus.msg);
            } 
            else{
              setError("");
              navigate("/");
            }
            setLoading(false);
         }
        
    },[loading]);

return(
<div className="login-main"> 
<div>
  
  <Form>
<Form.Group controlId="formBasicUsername">
  <Form.Label>Käyttäjänimi</Form.Label>
  <Form.Control  placeholder="Käyttäjänimi" {...username} />

</Form.Group>

<Form.Group controlId="formBasicName">
  <Form.Label>Nimi</Form.Label>
  <Form.Control   placeholder="Nimi" {...name}/>
</Form.Group>

<Form.Group controlId="formBasicPassword">
  <Form.Label>Salasana</Form.Label>
  <Form.Control type="password" placeholder="Salasana"{...password}/>
</Form.Group>

<Form.Group controlId="formBasicPassword">
  <Form.Label>Salasana uudestaan</Form.Label>
  <Form.Control type="password" placeholder="Salasana uudestaan"{...passwordAgain}/>
</Form.Group>

<Form.Group controlId="formBasicEmail">
  <Form.Label>Email</Form.Label>
  <Form.Control type="email"  placeholder="Email" {...email}/>
</Form.Group>

<Form.Group controlId="formBasicPhonenumber">
  <Form.Label>Puhelinnumero</Form.Label>
  <Form.Control placeholder="Puhelinnumero"{...phonenumber}/>
</Form.Group>
<input type="Button" onClick={()=>{if(passwordAgain.value == password.value){
  setLoading(true)}
  else
  {
    setError("Salasanat eivät täsmää");
  }
  }} value={'Rekisteröidy'} disabled={loading} variant="primary"/><br />

</Form>
<p>Onko sinulla jo käyttäjä. Voit kirjautua sisään  <NavLink  to="/Kirjautuminen">Täältä</NavLink> </p>
<Error error={error}/>
</div>
  </div>
  )
}
const Error=(props)=>{
return(<p className="errorText">{props.error}</p>)
}
const useFormInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  const handleChange = e => {
    setValue(e.target.value);
  }
  return {
    value,
    onChange: handleChange
  }
}
export {Rekisteroityminen}