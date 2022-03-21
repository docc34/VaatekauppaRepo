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

    
    const [searchObject, setSearchObject] = useState({jobPostTitle:null,priceSort:null});
    
    const search = useLocation().search;
    const jobPostTitle = new URLSearchParams(search).get('title');
    const [cookies] = useCookies(['token']);
    
    // haetaan kaikki ilmoitukset 
    const getStoreData = async (i) => {
        if(i != null){
            try{
                const options = {
                    method: 'GET',
                    headers: {"Authorization": `Bearer ${cookies.token}`}
                }
                let url = "https://vaatekauppayritysbackend.azurewebsites.net/api/Posts/?1=1";
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
                if (posts?.status == "Error") {
                    setMessage(posts.message);
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
        getStoreData({jobPostTitle:null,priceSort:null});
    }, []);


    return (
    <div className="Store-Post-Main-Box">
        <h1> Hae tuotteita</h1>
        {/* Hakukenttä */}
        <div className="Store-Search-Options-Container">
            <div className='Store-Searchbar-Input-Container'>
                <InputGroup >
                    <InputGroup.Prepend className="Store-SearchBar-Button-Div">
                    <InputGroup.Text id="basic-addon1"><button className="Store-SearchBar-Button" onClick={() => {let i = searchObject; i.jobPostTitle =labelSearchText; setSearchObject(i); getStoreData(i); }}>{/*Tähän se suurennuslasin logo */}o</button></InputGroup.Text>
                </InputGroup.Prepend>
                    <FormControl  onChange={(e) => { setLabelSearchText(e.target.value); }} placeholder="Hae" aria-label="Search" aria-describedby="basic-addon1" />
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