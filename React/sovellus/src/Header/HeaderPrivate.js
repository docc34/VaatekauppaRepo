import React, { useState, useEffect } from 'react';
import { Navbar, Button, InputGroup, FormControl, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'
import { NavLink, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import {  useNavigate  } from 'react-router-dom';


const HeaderPrivate = () => {
    const [logOutModalShow, setLogOutModalShow] = useState(false);
    const [labelSearchText,setLabelSearchText] = useState("");
    const path = useLocation().pathname;
    const [cookies, setCookie,removeCookie] = useCookies(['token']);
    let navigate = useNavigate();

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
            <div className="flex-header-left-box">
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
                    <FormControl 
                    onChange={(e) => { setLabelSearchText(e.target.value); }} 
                    placeholder="Hae" aria-label="Search" aria-describedby="basic-addon1" />
                </InputGroup>
                </div>
            </div>
            {/* <div className="flex-header-spaceblock"></div> */}
            <div className="flex-header-links">
                <Navbar  id="flex-header-navbar" expand="md">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">

                        {/*Kotiin pääsee aina*/}
                        <NavLink className="flex-header-link" exact activeClassName="active" to="/">Etusivu</NavLink>
                        {/*Profiiliin pääsee vain kun on kirjautunut */}
                        <NavLink className="flex-header-link" activeClassName="active" to="/Profiili">Profiili</NavLink>
                        {/*Kauppaan pääsee vain kun ei ole kirjautunut */}
                        <NavLink className="flex-header-link" activeClassName="active" to="/Kauppa">Kauppa </NavLink>
                        {/*Kirjautumiseen pääsee vain kun ei ole kirjautunut */}
                        <a href='/Maksu'>Ostoskori: {cookies?.shoppingCart?.length}</a>
                        {/* TODO: Tähän ulos kirjautuminen */}
                        <NavLink className="flex-header-link" onClick={()=>{setLogOutModalShow(true);}} activeClassName="active" to="/">Kirjaudu ulos</NavLink>

                    </Navbar.Collapse>
                </Navbar>
            </div>
            <Modal
                show={logOutModalShow}
                className="SignOut-Modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header >
                    <Modal.Title id="contained-modal-title-vcenter">
                        Uloskirjautuminen
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="Return-Modal-Body">
                    <div className="return-main">
                        <div>
                            <h3>Haluatko varmasti kirjautua ulos</h3>
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
                window.location.reload();}}>Kirjaudu ulos</Button>
                        <Button onClick={() => { setLogOutModalShow(false); }}>Peruuta</Button>
                    </div>

                </Modal.Footer>
            </Modal>
        </div>
    )
}
export { HeaderPrivate }