import React, { useEffect, useState } from 'react';
import './Store.css';

import {  Button, InputGroup, FormControl,  Modal, CardGroup as CardColumns } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useLocation } from "react-router-dom";

import '@inovua/reactdatagrid-community/index.css'

import { MakePost, Error } from '../Utils/Functions';
//^Importataan kaikki paketit mitä tarvitaan
import { useCookies } from 'react-cookie';
const Store = () => {
    const [storePostsData, setStorePostsData] = useState([]);
    const [labelSearchText, setLabelSearchText] = useState([]);
    const [message, setMessage] = useState([]);
    const [emailObject, setEmailObject] = useState("");
    const [emailTo, setEmailTo] = useState("");
    
    const [searchObject, setSearchObject] = useState({jobPostTitle:null,priceSort:null});
    
    const search = useLocation().search;
    const jobPostTitle = new URLSearchParams(search).get('title');
    const [cookies] = useCookies(['token']);
    
    useEffect(async()=>{
        if(emailObject != ""){
            const options = {
                method: 'GET',
                headers: {"Authorization": `Bearer ${cookies.token}`}
            }
            var i = await fetch("https://localhost:44344/api/Email/Send?toAddress="+emailObject,options);
            console.log(i);
        }
    },[emailObject]);
    // haetaan kaikki ilmoitukset 
    const getStoreData = async (i) => {
        if(i != null){
            try{
                const options = {
                    method: 'GET',
                    headers: {"Authorization": `Bearer ${cookies.token}`}
                }
                let url = "https://localhost:44344/api/Posts/?1=1";
                if( i?.jobPostTitle != "" && i?.jobPostTitle != null && i?.jobPostTitle != undefined){
                    url += "&title="+i.jobPostTitle;
                }
                else if(jobPostTitle != null && jobPostTitle != undefined){
                    url += "&title="+jobPostTitle;
                }
                if(i?.priceSort != "" && i?.priceSort != null && i?.priceSort != undefined){
                    url += "&sortPrice="+i?.priceSort;
                }


                let data = await fetch(url,options);
                let posts = await data.json();
                if (posts?.Status == "Error") {
                    setMessage(posts.Message);
                }
                else{
                    setMessage("");
                    setStorePostsData(posts);
                }
            }
            catch{
                setMessage("Fatal Error");
            }
        }
    }

    // get user list on page load
    useEffect(() => {
        console.log(cookies?.shoppingCart);
        getStoreData({jobPostTitle:null,priceSort:null});
    }, []);


    return (
    <div className="Store-Post-Main-Box">
        <h1> Hae tuotteita</h1>
        <input onChange={(e)=>{setEmailTo(e.target.value)}}></input>
        {emailTo}
        <button onClick={()=>{setEmailObject(emailTo)}}>Lähetä gmail</button>
        {/* Hakukenttä */}
        <div className="Store-Search-Options-Container">
            <div>
                
                <InputGroup >
                    <InputGroup.Prepend className="Store-SearchBar-Button-Div">
                    <InputGroup.Text id="basic-addon1"><button className="Store-SearchBar-Button" onClick={() => {let i = searchObject; i.jobPostTitle =labelSearchText; setSearchObject(i); getStoreData(i); }}>{/*Tähän se suurennuslasin logo */}o</button></InputGroup.Text>
                </InputGroup.Prepend>
                    <FormControl onChange={(e) => { setLabelSearchText(e.target.value); }} placeholder="Hae" aria-label="Search" aria-describedby="basic-addon1" />
                </InputGroup>
                <Error message={message}/>
            </div>
            {/* Outobugi ei näytä nappeja jos ovat tässä */}
            <div>

                <Button  onClick={()=>{let i = searchObject; i.priceSort = "desc"; setSearchObject(i); getStoreData(i); }}>Kalliimmat ensin</Button>
                <Button  onClick={()=>{let i = searchObject; i.priceSort = "asc"; setSearchObject(i); getStoreData(i);}}>Halvimmat ensin</Button>
            </div>
        </div>

        <div className="Store-Card-Column-container">
            <CardColumns  className="Store-Card-Column">
                <MakePost data={storePostsData} />
            </CardColumns>
        </div>

    </div>)
}

export { Store }