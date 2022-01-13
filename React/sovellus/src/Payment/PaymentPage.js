import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import {  Button } from 'react-bootstrap';

import {CheckEmptyFields, Paypal} from '../Utils/Functions';
import './PaymentPage.css';
import { Error } from '../Utils/Functions';

import '@inovua/reactdatagrid-community/index.css'
import { useCookies } from 'react-cookie';

function PaymentPage() {
  const search = useLocation().search;
  const [checkout, setCheckout] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState("");

  const Id = new URLSearchParams(search).get('id');
  const [cookies] = useCookies(['token']);
  var x = CheckEmptyFields(["Post number"], [Id]);

  const GetJobPostById = async () => {
    try{
        if(x.status != false){
        //const result = await getProfileListService(profileN);
        const options = {
          method: 'GET',
          headers: {"Authorization": `Bearer ${cookies.token}`}
        }
        const posts = await fetch("https://localhost:44344/api/Posts/"+Id,options);
        let post = await posts.json();
        
        setPost(post);
        console.log(post);
      }
      else{
        setError(x.kentat);
      }
    }
    catch{
      setError("Error");
    }
  }
    
  useEffect(() => {
    GetJobPostById();
  }, []);
  // jobpost tarkistus ei ehkä toimi.
  if(x.status != false && post !="")
  {
    return (
      <div>
        <div>
          <div>
            <a href="/Kauppa">Takaisin kauppaan</a>
            <div>
              <h3>{post?.label}</h3>
              <p>Hinta: {post.price}</p>
              {post?.material ? 
                <p>{post?.material}</p>
                :null
              }
              {post?.discount ? <div>
                <p>{post?.discount}</p>
              </div>:null
              }
            </div>
            <Error error={error}/>
          </div>
          <div>
            {checkout ? (
                <Paypal id={Id} token={cookies.token}/>
            ):(
            <Button onClick={()=>{setCheckout(true);}}>Checkout</Button>
            )}
          
          </div>
        </div>
      </div>
    );
  }
  else{
    return(<div>
    <p>Error</p>
    </div>)
  }
}

export { PaymentPage };