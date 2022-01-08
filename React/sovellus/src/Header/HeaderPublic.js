import React, { useState } from 'react';
import { Navbar, InputGroup, FormControl, Form, Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'
import { NavLink } from 'react-router-dom';

import logo from './mrWorldwide.jpg'

import { useSelector, useDispatch } from 'react-redux';

import { useLocation } from "react-router-dom";
import { userLoginAsync } from './../asyncActions/authAsyncActions';
// import './Kirjautuminen.css';

const HeaderPublic = () => {
    let [loginModalShow, setLoginModalShow] = useState(false);
    const authObj = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [labelSearchText,setLabelSearchText] = useState("");
    
    const { userLoginLoading, loginError } = authObj;

    const username = useFormInput('');
    const password = useFormInput('');
    const path = useLocation().pathname;
    
    // handle button click of login form
    const handleLogin = () => {
        dispatch(userLoginAsync(username.value, password.value));
    }

    const resetValues = () => {
        setLoginModalShow(false);
        username.value = "";
        password.value = "";
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
                <NavLink className="flex-header-link" exact activeClassName="active" to="/"><img className="header-img" src={logo}></img></NavLink>
            </div>

            <div className="Header-SearchBar">
                <InputGroup className="Header-SearchBar">
                    <InputGroup.Prepend className="Header-SearchBar-Button-Div">
                        <InputGroup.Text id="basic-addon1">
                            {searchStore()}
                        </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl onChange={(e) => { setLabelSearchText(e.target.value); }} placeholder="Hae" aria-label="Search" aria-describedby="basic-addon1" />
                </InputGroup>
            </div>

            <div className="flex-header-spaceblock"></div>
            <div className="flex-header-links">
                <Navbar id="flex-header-navbar" expand="md">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">

                        {/*Kotiin pääsee aina*/}
                        <NavLink className="flex-header-link" exact activeClassName="active" to="/">Etusivu</NavLink>
                        {/*Profiiliin pääsee vain kun on kirjautunut */}
                        <NavLink className="flex-header-link" activeClassName="active" to="/Profiili">Profiili</NavLink>
                        <NavLink className="flex-header-link" activeClassName="active" to="/Kauppa">Kauppa </NavLink>
                        {/*Kirjautumiseen pääsee vain kun ei ole kirjautunut */}
                        {/* <NavLink className="flex-header-link" activeClassName="active" to="/Kirjautuminen">Kirjaudu</NavLink> */}

                        <a className="flex-header-link" href="#" onClick={() => { setLoginModalShow(true) }}>Kirjaudu</a>
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

                            <Error error={loginError} />
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer className="Login-Modal-Footer">
                    <div>
                        <Button  onClick={handleLogin} disabled={userLoginLoading} >{userLoginLoading ? 'Loading...' : 'Kirjaudu'}</Button>
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

const Error = (props) => {
    return (<p className="errorText">{props.error}</p>)
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