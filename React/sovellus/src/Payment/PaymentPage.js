import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import {  Button,Form,Tabs,Tab } from 'react-bootstrap';

import {CheckEmptyFields, Paypal} from '../Utils/Functions';
import './PaymentPage.css';
import { Error } from '../Utils/Functions';

import '@inovua/reactdatagrid-community/index.css'
import { useCookies } from 'react-cookie';
import {useNavigate} from 'react-router-dom';
function PaymentPage() {
  //#region 
  const search = useLocation().search;
  const [checkout, setCheckout] = useState(false);
  const [error, setError] = useState(false);
  const [post, setPost] = useState("");
  const [loggedIn, setLoggedIn] = useState("");

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [locationObject, setLocationObject] = useState("");

  const [tabKey, setTabKey] = useState("0");
  
  const [postalCodePut, setPostalCodePut] = useState("");
  const [addressPut, setAddressPut] = useState("");
  const [cityPut, setCityPut] = useState("");
  const [locationObjectPut, setLocationObjectPut] = useState("");
  const [currentLocationId, setCurrentLocationId] = useState("");
  const [putEnabled, setPutEnabled] = useState(true);

  let navigate = useNavigate();
  const Id = new URLSearchParams(search).get('id');
  const urlTabKey = new URLSearchParams(search).get('tabKey');
  const [cookies] = useCookies(['token']);
  var x = CheckEmptyFields(["Post number"], [Id]);
  //#endregion

  
  const GetJobPostById = async () => {
    try{
        if(x.status != false){
          const options = {
            method: 'GET',
            headers: {"Authorization": `Bearer ${cookies.token}`}
          }

          var check = await fetch("https://localhost:44344/api/Locations/user",options);
          var i = await check.json();
          if(i.status == "UserError") {
            setLoggedIn(1);}
          else if(i.status == "LocationError") {
            setLoggedIn(2);
          }
          else{
            setPostalCodePut(i.postalCode);
            setAddressPut(i.address);
            setCityPut(i.city);
            setCurrentLocationId(i.id);
            setLoggedIn(3);
            
            if(urlTabKey != null)setTabKey(urlTabKey.toString());
          }

          const posts = await fetch("https://localhost:44344/api/Posts/"+Id,options);
          let post = await posts.json();
          setPost(post);
        }
        else{
          setError(x.kentat);
        }
    }
    catch{
      setError("Error");
    }
  }

  useEffect(async() => {
    if(locationObjectPut != "" && putEnabled == false){
      try{
        const options = {
          method:'PUT',
          headers: { 'Content-Type': 'application/json' ,"Authorization": `Bearer ${cookies.token}`},
          body:JSON.stringify(locationObjectPut)
        }
        let answer = await fetch("https://localhost:44344/api/Locations/"+currentLocationId,options);
        let parsedAnswer = await answer.json();

        if(parsedAnswer?.status != "Error"){
          setError(parsedAnswer?.message);
          setPutEnabled(true);
        }
        else{
          setError(parsedAnswer?.message);
        }
      }
      catch{
        setError("Error");
      }
    }
  }, [locationObjectPut]);

  useEffect(async() => {
    if(locationObject != ""){
      try{const options = {
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify(locationObject)
      }
      let answer = await fetch("https://localhost:44344/api/Locations",options);
      let parsedAnswer = await answer.json();

      if(parsedAnswer?.status != "Error"){
        
        setError(parsedAnswer?.message);
        if(parsedAnswer?.message == "Location created succesfully")window.location.reload();
      }
      else{
        setError(parsedAnswer?.message);
      }}
      catch{
        setError("Error");
      }
    }
  }, [locationObject]);
  
  useEffect(() => {
    GetJobPostById();
  }, []);


  if(x.status != false && post !="" )
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

          <Tabs activeKey={tabKey} id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="0" title="Tilaustiedot" disabled>
              <p>Tab 1 tiedot</p>
              {/* TODO: Laita tietojen anto/Maksaminen vaiheistettuun tabiin */}
              {loggedIn == 1 || loggedIn == 2 ?(
              <div>
                {/* TODO: Tähän kaupungin autofill. */}
                <Form.Group controlId="formBasicCity">
                  <Form.Label>Kaupunki</Form.Label>
                  <Form.Control placeholder="Kaupunki"onChange={(e)=>{setCity(e.target.value);}}/>
                </Form.Group>
                <Form.Group controlId="formBasicAddress">
                  <Form.Label>osoite</Form.Label>
                  <Form.Control placeholder="Osoite"onChange={(e)=>{setAddress(e.target.value);}}/>
                </Form.Group>
                <Form.Group controlId="formBasicPhonenumber">
                  <Form.Label>Postinumero</Form.Label>
                  <Form.Control placeholder="Postinumero"onChange={(e)=>{setPostalCode(e.target.value);}}/>
                </Form.Group>
              </div>):null}

              {/* Jos on kirjautunut mutta ei ole vielä antanut osoitetietoja */}
              {loggedIn == 2 ?(<button type='button' onClick={()=>{setLocationObject({
                userId:cookies.userId,
                city:city,
                address:address,
                postalCode:postalCode,
                user: null
                });}}>Tallenna</button>): null}

              {/* Jos ei ole kirjautunut */}
              {loggedIn == 1?
              (<div>
                <p>Tämä renderöi jos et ole kirjautunut tai sinulla ei ole laitettuna sijaintitietoja vielä</p>
                
                <div>
                  <Form.Group controlId="formBasicUsername">
                    <Form.Label>Käyttäjänimi</Form.Label>
                    <Form.Control  placeholder="Käyttäjänimi" onChange={(e)=>{setUsername(e.target.value); }} />
                  </Form.Group>

                  <Form.Group controlId="formBasicName">
                    <Form.Label>Nimi</Form.Label>
                    <Form.Control   placeholder="Nimi" onChange={(e)=>{setName(e.target.value); }}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Salasana</Form.Label>
                    <Form.Control type="password" placeholder="Salasana"onChange={(e)=>{setPassword(e.target.value); }}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Salasana uudestaan</Form.Label>
                    <Form.Control type="password" placeholder="Salasana uudestaan"onChange={(e)=>{setPasswordAgain(e.target.value);}}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email"  placeholder="Email" onChange={(e)=>{setEmail(e.target.value);}}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPhonenumber">
                    <Form.Label>Puhelinnumero</Form.Label>
                    <Form.Control placeholder="Puhelinnumero"onChange={(e)=>{setPhonenumber(e.target.value);}}/>
                  </Form.Group>
                </div>
                <input type="Button" onClick={()=>{if(passwordAgain.value == password.value){
                  setLocationObject({
                    userId:cookies.UserId,
                    city:city,
                    address:address,
                    postalCode:postalCode,
                    user:{
                      userName:username, 
                      password: password,  
                      name: name,
                      email:email, 
                      phonenumber: phonenumber
                    }
                  });
                  }
                  else
                  {
                    setError("Salasanat eivät täsmää");
                  }
                  }} value={'Rekisteröidy'} variant="primary"/>
              </div>) : null}

                {/* Jos on kirjautunut ja on sijaintitiedot */}
              {loggedIn == 3 ?
              (<div>
                  <p>Tämä renderöi jos oot kirjautunut ja sulla on sijaintitiedot jo kerrottu</p>
                  <p>Tarkasta että osoitetiedot ovat oikein</p>
                  <button disabled={!putEnabled} onClick={()=>{setPutEnabled(false);}}>Muokkaa tietoja</button>
                  <button disabled={putEnabled} onClick={()=>{setPutEnabled(true);}}>Peruuta</button>
                  <div>
                    {/* TODO: Tähän kaupungin autofill. */}
                    <Form.Group controlId="formBasicCity">
                      <Form.Label>Kaupunki</Form.Label>
                      <Form.Control disabled={putEnabled} value={cityPut} placeholder="Kaupunki"onChange={(e)=>{setCityPut(e.target.value);}}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicAddress">
                      <Form.Label>osoite</Form.Label>
                      <Form.Control disabled={putEnabled}value={addressPut}placeholder="Osoite"onChange={(e)=>{setAddressPut(e.target.value);}}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPhonenumber">
                      <Form.Label>Postinumero</Form.Label>
                      <Form.Control disabled={putEnabled} value={postalCodePut}placeholder="Postinumero"onChange={(e)=>{setPostalCodePut(e.target.value);}}/>
                    </Form.Group>
                    <button disabled={putEnabled} type='button' onClick={()=>{setLocationObjectPut({
                      Id:currentLocationId,
                      userId:cookies.userId,
                      city:cityPut,
                      address:addressPut,
                      postalCode:postalCodePut,
                      user: null
                    });}}>Tallenna</button>
                  </div>

                <button onClick={()=>{setTabKey("1")}}>Maksamaan</button>
              </div>) : null}
            </Tab>
            <Tab eventKey="1" title="Maksaminen" disabled>
              <p>Tab 2 maksaminen</p>

              <div>
                {checkout ? (
                    <Paypal id={Id} token={cookies.token}/>
                ):(
                <Button onClick={()=>{setCheckout(true);}}>Checkout</Button>
                )}
              
              </div>
            <button onClick={()=>{setTabKey("0")}}>Peruuta</button>
            {/* TODO: */}
            <p>HUOM POISTA OIKEALLE NAPPI </p>
            <button onClick={()=>{setTabKey("2")}}>Oikealle</button>
            </Tab>
            <Tab eventKey="2" title="Tilaus valmis" disabled>
              <p>Tab 3 Tilaus valmis!</p>
            {/* TODO: */}
            <p>HUOM POISTA VASEMMALLE NAPPI </p>
            <button onClick={()=>{setTabKey("1")}}>Vasemmalle</button>
            </Tab>
          </Tabs>
          <div>
          </div>
        </div>
      </div>
    );
  }
  else{
    return(<div>
    <p>Loading</p>
    </div>)
  }
}

export { PaymentPage };