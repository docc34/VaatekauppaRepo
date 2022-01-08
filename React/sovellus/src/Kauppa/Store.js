import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import './Store.css';
import { verifyTokenAsync } from "../asyncActions/authAsyncActions";
import { userLogout, verifyTokenEnd } from "../actions/authActions";

import {  Button, InputGroup, FormControl,  Modal, CardColumns } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { setAuthToken } from '../services/auth';
import { getStorePostsService } from '../services/store';
import { useLocation } from "react-router-dom";

import '@inovua/reactdatagrid-community/index.css'

import { MakePost, Error } from '../Utils/Functions';
//^Importataan kaikki paketit mitä tarvitaan

const Store = () => {
    //Otetaan tarvittavat muuttujat tokenin verifikointia varten
    const dispatch = useDispatch();
    const authObj = useSelector(state => state.auth);
    const { user, token, expiredAt } = authObj;

    const [storePostsData, setStorePostsData] = useState([]);
    const [labelSearchText, setLabelSearchText] = useState([]);
    

    const [searchObject, setSearchObject] = useState({jobPostTitle:null,priceSort:null});
    
    const search = useLocation().search;
    const jobPostTitle = new URLSearchParams(search).get('title');
    
    // set timer to renew token
    useEffect(() => {
        setAuthToken(token);
        const verifyTokenTimer = setTimeout(() => {
            dispatch(verifyTokenAsync(true));
        }, moment(expiredAt).diff() - 10 * 1000);
        return () => {
            clearTimeout(verifyTokenTimer);
        }
    }, [expiredAt, token])

    // haetaan kaikki ilmoitukset 
    const getStoreData = async (i) => {
        if(i != null){
        //let result = null;
        if(jobPostTitle != null && jobPostTitle != undefined && i?.jobPostTitle == "" || i?.jobPostTitle == null || i?.jobPostTitle == undefined){
          i.jobPostTitle = jobPostTitle;
        }
  
        let result = await getStorePostsService(i);
  
        if (result.error) {
          dispatch(verifyTokenEnd());
          if (result.response && [401, 403].includes(result.response.status))
              dispatch(userLogout());
          return;
        }
        let datat = result.data;
  
        setStorePostsData(datat.posts);
        }
        
    }
    
    const checkSellerStatus=()=>{
        
        if(user?.isSeller == 1){
            return(<a href="/Tyoilmoitukset">Hallinnoi työilmoituksia</a>)
        }
        else{
            return(null)
        }
    }
    // get user list on page load
    useEffect(() => {
        getStoreData({jobPostTitle:null,priceSort:null});
    }, []);


    return (<div className="Store-Post-Main-Box">
        <h1> Hae työilmoituksia</h1>
        
        {/* Hakukenttä */}
        <div className="Store-Search-Options-Container">
            <div>
                
                <InputGroup >
                    <InputGroup.Prepend className="Store-SearchBar-Button-Div">
                    <InputGroup.Text id="basic-addon1"><button className="Store-SearchBar-Button" onClick={() => {let i = searchObject; i.jobPostTitle = "%" + labelSearchText + "%"; setSearchObject(i); getStoreData(i); }}>{/*Tähän se suurennuslasin logo */}o</button></InputGroup.Text>
                </InputGroup.Prepend>
                    <FormControl onChange={(e) => { setLabelSearchText(e.target.value); }} placeholder="Hae" aria-label="Search" aria-describedby="basic-addon1" />
                </InputGroup>

                {checkSellerStatus()}
                
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