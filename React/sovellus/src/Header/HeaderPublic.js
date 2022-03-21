import React, { useEffect, useState } from 'react';
import { Navbar, InputGroup, FormControl, Form, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'
import { NavLink } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { useCookies } from 'react-cookie';
import {Error} from '../Utils/Functions'
// import './Kirjautuminen.css';
import {  useNavigate  } from 'react-router-dom';
const HeaderPublic = () => {
    let [loginModalShow, setLoginModalShow] = useState(false);
    
    const [labelSearchText,setLabelSearchText] = useState("");
    const [message,setMessage] = useState("");
    const [loginState,setLoginState] = useState(false);
    const [logOutModalShow, setLogOutModalShow] = useState(false);
    
    const email = useFormInput('');
    const password = useFormInput('');
    const path = useLocation().pathname;
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    let navigate = useNavigate();
    
    // handle button click of login form
    //TODO:Handel login
    const handleLogin = async() => {
        try{
            let data = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/Authenticate/login",{
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body:JSON.stringify({username: email.value, password: password.value})
                });
                let result = await data.json();
                if (result?.status == "Error") {
                    setMessage(result.message);
                }
                else{
                    resetValues();
                    setCookie('token', result.token, { path: '/' ,expires: 0})
                    setCookie('userId', result.id, { path: '/' ,expires: 0})
                    setMessage("");
                    window.location.reload();
                }
        }
        catch{
            setMessage("Error");
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
        email.value = "";
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

    useEffect(async()=>{
        if(cookies.token!= "" && cookies.token != null ){
          const options = {
            method: 'GET',
            headers: {"Authorization": `Bearer ${cookies.token}`}
          }
    
          try{ 
            let validation = await fetch("https://vaatekauppayritysbackend.azurewebsites.net/api/authenticate/validatetoken", options)
            let data = await validation.json();
          
            if( data == true){
                setLoginState(true);
            }
            else{
                setLoginState(false);
            }
          }
          catch{
            setLoginState(false);
          }
        }
      },[cookies?.token]);
    
    const checkLoginStatus = ()=>{
        if(loginState == true){
            return(
                <div>
                    {/*Profiiliin pääsee vain kun on kirjautunut */}
                    <NavLink className="flex-header-link" activeClassName="active" to="/Profiili">Profiili</NavLink>
                    <NavLink className="flex-header-link" onClick={()=>{setLogOutModalShow(true);}} activeClassName="active" to="/">Kirjaudu ulos</NavLink>
                </div>
            );
        }
        else{
            return(
                <div>
                        <a className="flex-header-link" href="#" onClick={() => { setLoginModalShow(true) }}>Kirjaudu</a>
                </div>
            );
        }

    }
    return (
        <div className="flex-container">
            <div className="flex-header-logo">
                <NavLink className="header-text" exact activeClassName="active" to="/">
                <h3 >Unnamed</h3>
                    {/* <img className="header-img" src="https://vaatekauppastorage.blob.core.windows.net/defaultkuvat/mrWorldwide.jpg"></img> */}
                    </NavLink>
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
                        {checkLoginStatus()}
                        {/* TODO: Ostoskorin logo ja päivittyvät grafiikat kun ostoskoriin lisätään esineitä. */}
                        <NavLink className="flex-header-link" activeClassName="active" to="/Maksu">Ostoskori: {cookies?.shoppingCart?.length} </NavLink>
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
                                <Form.Label>Sähköposti</Form.Label>
                                <Form.Control className="login-inputs" type="email" placeholder="Sähköposti"{...email} autoComplete="new-password" />
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Salasana</Form.Label>
                                <Form.Control className="login-inputs" type="password" placeholder="Salasana" {...password} autoComplete="new-password" />
                            </Form.Group>
                            {/*<Button type="Submit"  defaultValue={loading ? 'Loading...' : 'Login'} onClick={handleLogin} disabled={loading} variant="primary" >Kirjaudu</Button>*/}
                            </Form>
                            <Error message={message}/>
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
                        <p>Voit palauttaa salasanan <NavLink onClick={() => { resetValues(); }} to="/SalasananPalautus">täältä</NavLink> </p>
                    </div>
                </Modal.Footer>
            </Modal>
            {/* Logoutmodal */}
            <Modal
                show={logOutModalShow}
                className="SignOut-Modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Signing out
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="Return-Modal-Body">
                    <div className="return-main">
                        <div>
                            <h3>Are you sure you want to Sign out</h3>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="Return-Modal-Footer">
                    <div>
                <Button className='HeaderLogoutModalButton' onClick={() => {setLogOutModalShow(false);
                removeCookie('Guid',{ path: '/Maksu' });
                removeCookie('currentLocationId',{ path: '/Maksu' });
                removeCookie('token',{ path: '/' });
                removeCookie('userId',{ path: '/' });
                removeCookie('shoppingCart',{ path: '/' }); 
                navigate("/"); 
                window.location.reload();}}>Sign out</Button>
                        <Button onClick={() => { setLogOutModalShow(false); }}>Cancel</Button>
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