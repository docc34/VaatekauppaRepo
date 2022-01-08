import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import {  Button } from 'react-bootstrap';

import { getJobPostListService } from '../services/postManager';

import {CheckEmptyFields, Paypal} from '../Utils/Functions';
import './PaymentPage.css';
import { MakePost } from '../Utils/Functions';

import '@inovua/reactdatagrid-community/index.css'

function PaymentPage() {
  const search = useLocation().search;
  const [checkout, setCheckout] = useState(false);
  const jobPostId = new URLSearchParams(search).get('jobPostId');
  console.log(jobPostId);
  var x = CheckEmptyFields(["Post number"], [jobPostId]);
  const [JobPost, setJobPost] = useState("");

    const GetJobPostById = async () => {
      if(x.status != false){
        //const result = await getProfileListService(profileN);
        const posts = await getJobPostListService(jobPostId);
        let post = await posts.data;
        
        console.log(post.posts);
        setJobPost(post);
      }
      else{
        console.log(x.kentat);
      }
      }
    
      useEffect(() => {
        GetJobPostById();
      }, []);
  // jobpost tarkistus ei ehkä toimi.
  if(x.status != false && JobPost !=""){

let l =  JobPost.posts[0];
console.log(l);
  return (
    <div>
      <div>
        <div>
          <a href="/Kauppa">Takaisin kauppaan</a>
          <p>JobPost haettu</p>
          <MakePost data={JobPost.posts} profileId={l.userId}  />
        </div>
        <div>
          {checkout ? (
              <Paypal id={jobPostId}/>
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
  <p>Postin numero ei ollut validi</p>
  </div>)
}
}

export { PaymentPage };