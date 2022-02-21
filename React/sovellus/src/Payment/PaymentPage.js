import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import {  Button,Form,Tabs,Tab } from 'react-bootstrap';

import {CheckEmptyFields, Paypal,handleInputChange} from '../Utils/Functions';
import './PaymentPage.css';
import { Error } from '../Utils/Functions';

import '@inovua/reactdatagrid-community/index.css'
import { useCookies } from 'react-cookie';
import {useNavigate} from 'react-router-dom';
import {MakeShoppingCartItem} from '../Utils/Functions';
import {ResponsePage} from './ResponsePage';

function PaymentPage() {
  //#region 
  const search = useLocation().search;
  const [checkout, setCheckout] = useState(false);
  const [message, setMessage] = useState(false);
  const [posts, setPosts] = useState("");
  const [loggedIn, setLoggedIn] = useState("");

  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [cityId, setCityId] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [locationObject, setLocationObject] = useState("");

  const [tabKey, setTabKey] = useState("0");
  
  const [postalCodePut, setPostalCodePut] = useState("");
  const [addressPut, setAddressPut] = useState("");
  const [cityPutId, setCityPutId] = useState("");
  const [locationObjectPut, setLocationObjectPut] = useState("");
  const [currentLocationId, setCurrentLocationId] = useState("");
  const [putEnabled, setPutEnabled] = useState(true);
  const [paypalResponseObject, setPaypalResponseObject] = useState("");
  const [order, setOrder] = useState("");
  const [price, setPrice] = useState("");
  const [register, setRegister] = useState(false);
  const [testErrors, setTestErrors] = useState([]);
  
  const [cities, setCities] = useState([]);
  let navigate = useNavigate();
  //const Id = new URLSearchParams(search).get('id');
  const urlTabKey = new URLSearchParams(search).get('tabKey');
  const [cookies,setCookie,removeCookie] = useCookies(['token']);
  //var x = CheckEmptyFields(["Post number"], [Id]);
  //#endregion
  const GetJobPosts = async () => {
    if(posts == "" && cookies?.shoppingCart != null){
      try{
          const options = {
            method: 'GET',
            headers: {"Authorization": `Bearer ${cookies.token}`}
          }

          if(cookies?.currentLocationId != 0 && cookies?.currentLocationId != null && cookies?.currentLocationId != undefined ){
            //Jos käyttäjällä ei ole käyttäjätiliä mutta sijainti on jo annettu aikaisemmin ja on vielä cookiessa tallella.
            var check = await fetch("https://localhost:44344/api/Locations/"+cookies?.currentLocationId,options);
            var i = await check.json();
            if(i.status != "Error") {
              setPostalCodePut(i.postalCode);
              setAddressPut(i.address);
              setCityPutId(i.cityId);
              setCookie('currentLocationId', i.id, { path: '/Maksu'});
              // setCurrentLocationId(i.id);
              setLoggedIn(3);
              
              if(urlTabKey != null)setTabKey(urlTabKey.toString());
            }
            else{
              setMessage("Error");
            }
            
          }
          else{

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
              setCityPutId(i.cityId);
              setCookie('currentLocationId', i.id, { path: '/Maksu'});
              // setCurrentLocationId(i.id);
              setLoggedIn(3);
              
              if(urlTabKey != null)setTabKey(urlTabKey.toString());
            }
            
          }
          //Hakee julkaisut ostoskorin sisällön mukaan, keho ottaa listan juilkaisujen ideitä [2,4] jne
          const fetchPosts = await fetch("https://localhost:44344/api/Orders/Posts",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(cookies?.shoppingCart)
          });
          let post = await fetchPosts.json();
          
          
          if(post.status == "Error" || fetchPosts.status == 400){
            setMessage(post?.message);
            setPosts([]);
          }
          else{ 
            setPosts(post);
            var orderItems = post.map((e,i)=>{
              return{
                PostId:e?.id,
                Amount:1
              }//TODO: laita tähän tuotteiden määrä kun otat sen käyttöön.
            });
  
            var price = await fetch("https://localhost:44344/api/Orders/price",{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(orderItems)
            });
            setPrice( await price.json());
        }
      }
      catch(e){
        console.log(e);
      }
    }
  }
  const GetTableData = async () => {
    try{
      const options = {
        method: 'GET'
      }
      if(cities.length == 0){
        var i = await fetch("https://localhost:44344/api/Cities",options);
        var data = await i.json();
        setCities(data);
      }
    }
    catch{
      setMessage("Error");
    }
  }

  useEffect(async() => {
    if(locationObjectPut != "" && putEnabled == false && CheckEmptyFields([locationObjectPut])){
      try{
        const options = {
          method:'PUT',
          headers: { 'Content-Type': 'application/json' ,"Authorization": `Bearer ${cookies.token}`},
          body:JSON.stringify(locationObjectPut)
        }
        let answer = await fetch("https://localhost:44344/api/Locations/"+cookies.currentLocationId,options);
        let parsedAnswer = await answer.json();

        if(parsedAnswer?.status != "Error"){
          setMessage(parsedAnswer?.message);
          setPutEnabled(true);
        }
        else{
          setMessage(parsedAnswer?.message);
        }
      }
      catch{
        setMessage("Error");
      }
    }
  }, [locationObjectPut]);

  useEffect(async() => {
    if(locationObject != "" && CheckEmptyFields([locationObject])){
      if(register == true){
        try{const options = {
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          body:JSON.stringify(locationObject)
        }
        let answer = await fetch("https://localhost:44344/api/Locations",options);
        let parsedAnswer = await answer.json();
  
        if(parsedAnswer?.status != "Error"){
          
          setMessage(parsedAnswer?.message);
          if(parsedAnswer?.message == "Location created succesfully")window.location.reload();
          else if(parsedAnswer?.message == "User created succesfully"){
          setCookie('loginModal', "true", { path: '/' ,expires: 0});window.location.reload();}
        }
        else{
          setMessage(parsedAnswer?.message);
        }}
        catch{
          setMessage("Error");
        }
      }
      else if(register == false){
        try{const options = {
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          body:JSON.stringify(locationObject)
        }
        let answer = await fetch("https://localhost:44344/api/Locations",options);
        let parsedAnswer = await answer.json();
  
        if(parsedAnswer?.status != "Error"){
          setCookie('userEmail', locationObject.user.email, { path: '/Maksu'});
          setCookie('userFirstname', locationObject.user.firstname, { path: '/Maksu'});
          setCookie('userLastname', locationObject.user.lastname, { path: '/Maksu'});
          
          setMessage(parsedAnswer?.message);
          if(parsedAnswer?.message == "Location created succesfully")
            window.location.reload();
          else if(parsedAnswer?.message == "User created succesfully"){
            setCookie('loginModal', "true", { path: '/' ,expires: 0});
            window.location.reload();}
        }
        else if(parsedAnswer?.message != null && parsedAnswer?.message != ""){
          setMessage(parsedAnswer?.message);
        }
        else{
          //Tallenetaan sijainnin luonnin yhteydessä luotu guid cookiehen
          setCookie('locationGuid', parsedAnswer, { path: '/Maksu' });
          //setLocationGuid(parsedAnswer);
        }
      }
        catch{
          setMessage("Error");
        }
      }
      
    }
  }, [locationObject]);
  
  useEffect(async () => {
    await GetJobPosts();
    await GetTableData();
  }, []);

  const citiesToSelect = cities.map((e,i)=>{
    return(<option value={e.id}>{e.cityName}</option>);
  });

  const RecieveOrder = (object)=>{
    //TODO: Määritä että paypal maksu on mennyt läpi
    if(object != null && object != undefined){
      setPaypalResponseObject(object);
      setTabKey("2");
      //Tyhjentää ostoskorin ostoksen jälkeen
      //TODO: Ota käyttöön
      //removeCookie('shoppingCart',{ path: '/' });
    }
  }

  //Aktivoituu kun paypal maksu menee läpi ja luo tilauksen
  useEffect(async ()=>{
    if(paypalResponseObject != ""){
      try{
        var orderItems = posts.map((e,i)=>{
          return{
            PostId:e?.id,
            Amount:1
          }//TODO: laita tähän tuotteiden määrä kun otat sen käyttöön.
        });

        var options = {
        method:'POST',
        headers: { 'Content-Type': 'application/json' ,"Authorization": `Bearer ${cookies.token}`},
        body:JSON.stringify({
          LocationId: cookies.currentLocationId,
          OrderItems: orderItems,
          Guid: cookies.locationGuid,
          Email: cookies.userEmail,
          firstName: cookies.userFirstname,
          lastName: cookies.userLastname
        })
        }

      let answer = await fetch("https://localhost:44344/api/Orders",options);
      let parsedAnswer = await answer.json();

      if(parsedAnswer?.status == "Error"){
        setMessage(parsedAnswer?.message);
      }
      else{
        options = {
          method:'GET',
          headers: { 'Content-Type': 'application/json' ,"Authorization": `Bearer ${cookies.token}`}
        }
        //Post palauttaa Guid:n jolla haetaan juuri luotu order
        answer = await fetch("https://localhost:44344/api/Orders/"+parsedAnswer,options);
        parsedAnswer = await answer.json();
        //Poistetaan cookiet joihin tallennettiin ei kirjautuneen käyttäjän tiedot
        removeCookie('userEmail',{ path: '/Maksu' });
        removeCookie('userFirstname',{ path: '/Maksu' });
        removeCookie('userLastname',{ path: '/Maksu' });
        //Voi ottaa käyttöön että poista cookiehin tallennetut sijaintitiedot.
        // removeCookie('locationGuid',{ path: '/Maksu' });
        // removeCookie('currentLocationId',{ path: '/Maksu' });
        setOrder(parsedAnswer);
      }}
      catch(e){
        setMessage(e);
      }
    }
  },[paypalResponseObject]);



  if(posts != "")
  {
    return (
      <div>
        <div>
          <div>
            <a href="/Kauppa">Takaisin kauppaan</a>
            <Error message={message}/>
          </div>

          <Tabs activeKey={tabKey} id="uncontrolled-tab-example" className="mb-3">
            <Tab eventKey="0" title="Tilaustiedot" disabled>
              <h3>Ostoskori</h3>
              <MakeShoppingCartItem shoppingCart={true} data={posts} />
              {/* TODO: Laita tietojen anto/Maksaminen vaiheistettuun tabiin */}
              {loggedIn == 1 || loggedIn == 2 ?(
              <div>
                {/* TODO: Tähän kaupungin autofill ja hae kaupungit backendista*/}
                <Form.Group controlId="formBasicCity">
                <select onBlur={(e)=>{handleInputChange(e)}} onChange={(e)=>{setCityId(handleInputChange(e));}}>
                  <option value="">Valitse kaupunki</option>
                  {citiesToSelect}
                </select>
                </Form.Group>
                <Form.Group controlId="formBasicAddress">
                  <Form.Label>osoite</Form.Label>
                  <Form.Control onBlur={(e)=>{handleInputChange(e)}} placeholder="Osoite"onChange={(e)=>{setAddress(handleInputChange(e));}}/>
                </Form.Group>
                <Form.Group controlId="formBasicPhonenumber">
                  <Form.Label>Postinumero</Form.Label>
                  <Form.Control onBlur={(e)=>{handleInputChange(e)}} placeholder="Postinumero"onChange={(e)=>{setPostalCode(handleInputChange(e));}}/>
                </Form.Group>
              </div>):null}

              {/* Jos on kirjautunut mutta ei ole vielä antanut osoitetietoja */}
              {loggedIn == 2 ?(<button type='button' onClick={()=>{setLocationObject({
                userId:cookies.userId,
                cityId:cityId,
                address:address,
                postalCode:postalCode,
                user: null,
                orderItems:cookies?.shoppingCart
                });}}>Tallenna</button>): null}

              {/* Jos ei ole kirjautunut */}
              {loggedIn == 1?
              (<div>
                <p>Tämä renderöi jos et ole kirjautunut tai sinulla ei ole laitettuna sijaintitietoja vielä</p>
                
                <div>
                  <Form.Group controlId="formBasicName">
                    <Form.Label>Etunimi</Form.Label>
                    <Form.Control onBlur={(e)=>{handleInputChange(e)}} placeholder="Etunimi" onChange={(e)=>{setFirstName(handleInputChange(e)); }}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicName">
                    <Form.Label>Sukunimi</Form.Label>
                    <Form.Control  onBlur={(e)=>{handleInputChange(e)}} placeholder="Sukunimi" onChange={(e)=>{setLastName(handleInputChange(e)); }}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control onBlur={(e)=>{handleInputChange(e)}} type="email"  placeholder="Email" onChange={(e)=>{setEmail(handleInputChange(e));}}/>
                  </Form.Group>

                  <Form.Group controlId="formBasicPhonenumber">
                    <Form.Label>Puhelinnumero</Form.Label>
                    <Form.Control onBlur={(e)=>{handleInputChange(e)}} placeholder="Puhelinnumero"onChange={(e)=>{setPhonenumber(handleInputChange(e));}}/>
                  </Form.Group>

                  <label htmlFor='setRegisterInput'>Haluatko luoda käyttäjän tilauksen yhteydessä</label>

                  <input id="setRegisterInput" type="checkbox" onClick={(e)=>{setRegister(e.target.checked);console.log(e.target.checked)}}/>
                  {register == true ? (
                  <div>
                    <Form.Group controlId="formBasicUsername">
                      <Form.Label>Käyttäjänimi</Form.Label>
                      <Form.Control onBlur={(e)=>{handleInputChange(e)}} placeholder="Käyttäjänimi" onChange={(e)=>{setUsername(handleInputChange(e)); }} />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Salasana</Form.Label>
                      <Form.Control onBlur={(e)=>{handleInputChange(e)}} type="password" placeholder="Salasana"onChange={(e)=>{setPassword(handleInputChange(e)); }}/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                      <Form.Label>Salasana uudestaan</Form.Label>
                      <Form.Control onBlur={(e)=>{handleInputChange(e)}} type="password" placeholder="Salasana uudestaan"onChange={(e)=>{setPasswordAgain(handleInputChange(e));}}/>
                    </Form.Group>
                  </div>) : (null)}
                  
                </div>
                <input type="Button" onClick={()=>{
                  if(register == true){
                    if(passwordAgain.value == password.value){
                      setLocationObject({
                        userId:cookies.UserId,
                        cityId:cityId,
                        address:address,
                        postalCode:postalCode,
                        user:{
                          userName:username, 
                          password: password,  
                          firstname: firstName,
                          lastname: lastName,
                          email:email, 
                          phonenumber: phonenumber
                        }
                      });
                      }
                      else
                      {
                        setMessage("Salasanat eivät täsmää");
                      }
                  }
                  else{
                    setLocationObject({
                      userId:cookies.UserId,
                      cityId:cityId,
                      address:address,
                      postalCode:postalCode,
                      user:{
                        userName:"0", 
                        password:"0",  
                        firstname: firstName,
                        lastname: lastName,
                        email:email, 
                        phonenumber: phonenumber
                      }
                  })
                  }}} value={'Tallenna'} variant="primary"/>
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
                    <select disabled={putEnabled} value={cityPutId} onBlur={(e)=>{handleInputChange(e)}} onChange={(e)=>{setCityPutId(handleInputChange(e));}}>
                      <option value="">Valitse kaupunki</option>
                      {citiesToSelect}
                    </select>
                    </Form.Group>
                    <Form.Group controlId="formBasicAddress">
                      <Form.Label>osoite</Form.Label>
                      <Form.Control onBlur={(e)=>{handleInputChange(e)}} disabled={putEnabled}value={addressPut}placeholder="Osoite"onChange={(e)=>{setAddressPut(handleInputChange(e));}}/>
                    </Form.Group>
                    <Form.Group controlId="formBasicPhonenumber">
                      <Form.Label>Postinumero</Form.Label>
                      <Form.Control onBlur={(e)=>{handleInputChange(e)}} disabled={putEnabled} value={postalCodePut}placeholder="Postinumero"onChange={(e)=>{setPostalCodePut(handleInputChange(e));}}/>
                    </Form.Group>
                    <button disabled={putEnabled} type='button' onClick={()=>{setLocationObjectPut({
                      Id:cookies.currentLocationId,
                      userId:cookies.userId,
                      cityId:cityPutId,
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
              <div class="container mt-5 p-3 rounded cart">
                <div class="row no-gutters">
                      <div class="col-md-8">
                          <div class="product-details mr-2">
                              <div class="d-flex flex-row align-items-center"><i class="fa fa-long-arrow-left"></i><span class="ml-2">Maksaminen</span></div>
                              <hr/>
                              <h6 class="mb-0">Ostoskori</h6>
                              <div class="d-flex justify-content-between"><span>Sinulla on {posts?.length} tuotetta ostoskorissa</span>
                                  {/* <div class="d-flex flex-row align-items-center"><span class="text-black-50">Sort by:</span>
                                      <div class="price ml-2"><span class="mr-1">price</span><i class="fa fa-angle-down"></i></div>
                                  </div> */}
                              </div>
                              <MakeShoppingCartItem shoppingCart={true} data={posts} />
                          </div>
                      </div>
                      <div class="col-md-4">
                          <div class="payment-info">
                              <div class="d-flex justify-content-between align-items-center"><span>Card details</span></div>
                              <Paypal recieveOrder={RecieveOrder} posts={posts} token={cookies.token}/>
                              <hr class="line"/>
                              {/* TODO: Laske tähän hinnat äläkä käytä staattisia arvoja. */}
                              <div class="d-flex justify-content-between information"><span>Subtotal</span><span>$3000.00</span></div>
                              <div class="d-flex justify-content-between information"><span>Verot</span><span>24%</span></div>
                              {/* TODO:Hae tähän tuotteiden oikea veroprosentti */}
                              <div class="d-flex justify-content-between information"><span>Kokonaishinta</span><span>{price}€</span></div>
                          </div>
                      </div>
                  </div>
              </div>
              {/* <div>
                {checkout ? (
                    <Paypal posts={posts} token={cookies.token}/>
                ):(
                <Button onClick={()=>{setCheckout(true);}}>Checkout</Button>
                )}
              
              </div> */}
            <button onClick={()=>{setTabKey("0")}}>Peruuta</button>
            {/* TODO: */}
            <p>HUOM POISTA OIKEALLE NAPPI </p>
            <button onClick={()=>{setTabKey("2")}}>Oikealle</button>
            </Tab>
            <Tab eventKey="2" title="Tilaus valmis" disabled>
              <ResponsePage price={price} posts={posts} order={order} paypalResponseObject={paypalResponseObject} />
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
    {message != "" ? 
    (
      <p>{message}</p>
    ):
    (
      <p>Loading</p>
    )}
    

    </div>)
  }
}

export { PaymentPage };