import React, { useState, useEffect } from 'react';
import { Navbar, Button, InputGroup, FormControl, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Header.css'
import { NavLink, useLocation } from 'react-router-dom';
import { verifyTokenAsync, userLogoutAsync } from "./../asyncActions/authAsyncActions";
import { userLogout, verifyTokenEnd } from "./../actions/authActions";
import logo from './mrWorldwide.jpg'
import { useDispatch, useSelector } from 'react-redux';


const HeaderPrivate = () => {
 
    const dispatch = useDispatch();
       // handle click event of the logout button
       const handleLogout = () => {
        dispatch(userLogoutAsync());
      }
    const [labelSearchText,setLabelSearchText] = useState("");
    const path = useLocation().pathname;

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
                    <NavLink className="flex-header-link" exact activeClassName="active" to="/"><img className="header-img" src={logo}></img></NavLink>
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
                        <NavLink className="flex-header-link" onClick={handleLogout} activeClassName="active" to="/">Kirjaudu ulos</NavLink>

                    </Navbar.Collapse>
                </Navbar>
            </div>
        </div>
    )
}
export { HeaderPrivate }