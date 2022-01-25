import React, { useEffect, useState } from 'react';
import { Navbar, InputGroup, FormControl, Form, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'
import { NavLink } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie';
import {Error} from '../Utils/Functions'
// import './Kirjautuminen.css';

const HeaderPublic = () => {
    let [loginModalShow, setLoginModalShow] = useState(false);
    
    const [labelSearchText,setLabelSearchText] = useState("");
    const [error,setError] = useState("");

    const username = useFormInput('');
    const password = useFormInput('');
    const path = useLocation().pathname;
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    
    // handle button click of login form
    //TODO:Handel login
    const handleLogin = async() => {
        try{
            let data = await fetch("https://localhost:44344/api/Authenticate/login",{
            
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body:JSON.stringify({username: username.value, password: password.value})
                });
                let result = await data.json();
                if (result?.Status == "Error") {
                    setError(result.Message);
                }
                else{
                resetValues();
                setCookie('token', result.token, { path: '/' ,expires: 0})
                setCookie('userId', result.id, { path: '/' ,expires: 0})
                  setError("");
                }
        }
        catch{
            setError("Error");
        }
            
    }
    useEffect(()=>{
        if(cookies?.loginModal == "true"){
            setLoginModalShow(true);
        }
        else{
            setLoginModalShow(false);
        }
    },[]);

    const resetValues = () => {
        setLoginModalShow(false);
        username.value = "";
        password.value = "";
        removeCookie('loginModal', { path: '/' });
    }

    const searchStore =()=>{
        if(path != "/Kauppa"){
            if(labelSearchText == ""){
            return(<a className="Header-SearchBar-Link Header-SearchBar-Button" href="/Kauppa">{/*Tähän se suurennuslasin logo */}o</a>)
            }
            else{
            return(<a className="Header-SearchBar-Link Header-SearchBar-Button" href={"/Kauppa?title="+labelSearchText}>{/*Tähän se suurennuslasin logo */}o</a>)
            }
        }
        else{
            //return(<button className="Header-SearchBar-Button">{/*Tähän se suurennuslasin logo */}o</button>)
            return(<a className="Header-SearchBar-Link Header-SearchBar-Button" href={"/Kauppa?title="+labelSearchText}>{/*Tähän se suurennuslasin logo */}o</a>)
        }
    }
    return (
        <div className="flex-container">
            <div className="flex-header-logo">
                <NavLink className="flex-header-link" exact activeClassName="active" to="/"><img className="header-img" src="https://vaatekauppastorage.blob.core.windows.net/defaultkuvat/mrWorldwide.jpg"></img></NavLink>
            </div>

            <div className="Header-SearchBar">
                <InputGroup className="Header-SearchBar">
                    <InputGroup.Prepend className="Header-SearchBar-Button-Div">
                        <InputGroup.Text id="basic-addon1">
                            {searchStore()}
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl onChange={(e) => { setLabelSearchText(e.target.value); }} placeholder="Hae kaupasta" aria-label="Search" aria-describedby="basic-addon1" />
                </InputGroup>
            </div>

            <div className="flex-header-spaceblock"></div>
            <div className="flex-header-links">
                <Navbar id="flex-header-navbar" expand="md">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        {labelSearchText}
                        {/*Kotiin pääsee aina*/}
                        <NavLink className="flex-header-link" exact activeClassName="active" to="/">Etusivu</NavLink>
                        {/*Profiiliin pääsee vain kun on kirjautunut */}
                        <NavLink className="flex-header-link" activeClassName="active" to="/Kauppa">Kauppa </NavLink>
                        {/*Kirjautumiseen pääsee vain kun ei ole kirjautunut */}
                        {/* <NavLink className="flex-header-link" activeClassName="active" to="/Kirjautuminen">Kirjaudu</NavLink> */}
                        <a className="flex-header-link" href="#" onClick={() => { setLoginModalShow(true) }}>Kirjaudu</a>
                        {/* TODO: Ostoskorin logo ja päivittyvät grafiikat kun ostoskoriin lisätään esineitä. */}
                        <a href='/Maksu'>Ostoskori: {cookies?.shoppingCart?.length}</a>
                    </Navbar.Collapse>
                </Navbar>
            </div>
            {/* modalin asetukset määritetään tässä */}
            <Modal
                show={loginModalShow}
                className="Login-Modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        {/* Otsikko */}
                        Kirjaudu
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="Login-Modal-Body">
                    <div className="login-main">
                        <div><Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Käyttäjänimi</Form.Label>
                                <Form.Control className="login-inputs" type="username" placeholder="Käyttäjänimi"{...username} autoComplete="new-password" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Salasana</Form.Label>
                                <Form.Control className="login-inputs" type="password" placeholder="Salasana" {...password} autoComplete="new-password" />
                            </Form.Group>
                            {/*<Button type="Submit"  defaultValue={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} variant="primary" >Kirjaudu</Button>*/}
                            </Form>
                            <Error error={error}/>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer className="Login-Modal-Footer">
                    <div>
                        <Button  onClick={handleLogin} >Kirjaudu</Button>
                        <Button onClick={() => { resetValues(); }}>Peruuta</Button></div>
                    {/* Ilmoituksen footteri */}
                    <div>
                        <p>Eikö sinulla ole käyttäjää. Voit rekisteröityä <NavLink onClick={() => { resetValues(); }} to="/Rekisteroityminen">Täältä</NavLink> </p>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    )
}


// custom hook to manage the form input
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
export { HeaderPublic }