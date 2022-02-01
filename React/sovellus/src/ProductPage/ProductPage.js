import React, { useEffect, useState } from 'react';
import './ProductPage.css';

import {  Button, InputGroup, FormControl,  Modal, CardColumns } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useLocation } from "react-router-dom";

import '@inovua/reactdatagrid-community/index.css'
import { MakePost, Error ,FormatDeliveryEstimateToDate} from '../Utils/Functions';
//^Importataan kaikki paketit mitä tarvitaan

import { useCookies } from 'react-cookie';
const ProductPage = () => {
    const [post, setPost] = useState("");
    const [error, setError] = useState("");
    
    const search = useLocation().search;
    const postId = new URLSearchParams(search).get('id');
    const [cookies, setCookie] = useCookies(['token']);
    
    // haetaan ilmoitus julkaisun id:n mukaan
    const getStoreData = async () => {
        try{

            let data = await fetch("https://localhost:44344/api/Posts/"+postId,{
                method: 'GET'
            });
            let post = await data.json();
            if (post?.Status == "Error") {
                setError(post.Message);
            }
            else{
                setError("");
                setPost(post);
            }
        }
        catch{
            setError("Fatal Error");
        }
    }

    // get user list on page load
    useEffect(() => {
        getStoreData();
    }, []);


    return (
    <div className="Store-Post-Main-Box">
        <h1> {post?.label}</h1>
        <Error error={error}/>
        <p>Tuotteen arvioitu kuljetusaika:<FormatDeliveryEstimateToDate deliveryDaysEstimateStarting={post?.deliveryDaysEstimateStarting} deliveryDaysEstimateEnding={post?.deliveryDaysEstimateEnding}/></p>
        <button onClick={()=>{
            if(cookies['shoppingCart'] == null || cookies['shoppingCart'] == undefined){
            setCookie('shoppingCart', [{PostId:post?.id}], { path: '/' })
            }
            else{
                var i = cookies['shoppingCart'];
                var t = true;
                i?.map((item,index)=>{
                if(item?.PostId == post?.id){
                    t = false;
                }
                })

                if(t == true)
                {
                i[i.length] ={PostId:post?.id}
                setCookie('shoppingCart', JSON.stringify(i), { path: '/',expires: 0})
                window.location.reload();
                }
            }}}
        >Lisää ostoskoriin</button>
        {/* TODO: Muotoile sivu ja näytä kaikki datat.*/}
        <div className="Store-Card-Column-container">
            <CardColumns  className="Store-Card-Column">
                {/* <MakePost data={storePostsData} /> */}
            </CardColumns>
        </div>

    </div>)
}

export { ProductPage }