import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {  Button,Form } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';


import moment from 'moment'


import './Profiili.css';
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'

import { Error, MakePost } from '../Utils/Functions';
import { useCookies } from 'react-cookie';

//Renderöidään profiilin muokkaus
const ProfiiliMuokkaus = () => {
  //Muuttujat
  const [profileFirstLoad, setProfileFirstLoad] = useState(0);
  const [profileEmail, setprofileEmail] = useState([]);
  const [profilePhonenumber, setProfilePhonenumber] = useState([]);
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [cityId, setCityId] = useState("");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [locationObject, setLocationObject] = useState("");
  const [cities, setCities] = useState([]);

  const [message, setMessage] = useState("");

  const [profileLocation, setProfileLocation] = useState([]);
  const [profileOrders, setProfileOrders] = useState([]);

  const [cookies] = useCookies(['token']);

  let navigate = useNavigate();
  function redirect() {
    navigate("/Profiili");
  }

   // get user profile data
   const getProfileData = async () => {
      const options = {
        method: 'GET',
        headers: {"Authorization": `Bearer ${cookies.token}`}
      }

      const result = await fetch("https://localhost:44344/api/user",options)
      //const posts = await getProfilePostsService(cookies?.userId);
      if (result?.Status == "Error") {
        setMessage(result.Message);
      }
      else{
        var i = await result.json();
        console.log(i);

        setprofileEmail(i?.email);
        setProfilePhonenumber(i?.phonenumber);
        setUserName(i.username);
        setFirstName(i.firstName);
        setLastName(i.lastName);
        setProfileLocation(i?.location);
        setProfileOrders(i?.orders);
        setCityId(i?.location?.cityId);
        setAddress(i?.location?.address);
        setPostalCode(i?.location?.postalCode);
        // setProfileData(i);
        // setProfileLocation(i?.location);
        // setProfileOrders(i?.orders);
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
  
     // get user profile data
     const modifyProfileData = async () => {
      const options = {
        method: 'GET',
        headers: {"Authorization": `Bearer ${cookies.token}`}
      }
  
      const result = await fetch("https://localhost:44344/api/user",options)
      //const posts = await getProfilePostsService(cookies?.userId);
      if (result?.Status == "Error") {
        setMessage(result.Message);
      }
      else{
        var i = await result.json();
        console.log(i);

        setprofileEmail(i?.email);
        setProfilePhonenumber(i?.phonenumber);
        setProfileLocation(i?.location);
        setProfileOrders(i?.orders);
        // setProfileData(i);
        // setProfileLocation(i?.location);
        // setProfileOrders(i?.orders);
      }
    }
  
 

  const TitlesOrders = [
    { name: 'id', type: 'number', header: 'id', defaultVisible: false },
    { name: 'price', defaultFlex: 1,type: 'number', header: 'Hinta'},
    {
      name: 'orderDate',
      header: 'Päivämäärä',
      defaultWidth: 165,
      // need to specify dateFormat 
      dateFormat: 'YYYY-MM-DD, HH:mm',
      //filterEditor: DateFilter,
      filterEditorProps: (props, { index }) => {
        // for range and notinrange operators, the index is 1 for the after field
        return {
          dateFormat: 'MM-DD-YYYY, HH:mm',
          placeholder: index == 1 ? 'Created date is before...': 'Created date is after...'
        }
      },
      //Momentjs formats the date
      render: ({ value, cellProps: { dateFormat } }) =>
        moment(value).format(dateFormat),
    },
    { name: 'status', defaultFlex: 1, header: 'Tilauksen tila'}
  ]
  //, border: "none"
  const gridStyleOrders = { height: "auto" }

  const citiesToSelect = cities.map((e,i)=>{
    return(<option value={e.id}>{e.cityName}</option>);
  });

   // hakee taulukkodatat sivun ladatessa
   useEffect(() => {
    if (profileFirstLoad == 0) {
      GetTableData();
      getProfileData();
      setProfileFirstLoad(1);
    }
  }, []);

  return (
    <div className="Profiili-Main">
      <div className="Profiili-UpperPartMain">
        <div className="Profiili-Esittely">
          <h1 className="Profiili-NimiOtsikko"> {userName}</h1>

          <div>
            <h4>Yhteystiedot</h4>
            <p> Etunimi: </p>
            <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); }}></input>
            <p> Sukunimi: </p>
            <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); }}></input>
            <p> Sähköposti: </p>
            <input type="text" value={profileEmail} onChange={(e) => { setprofileEmail(e.target.value); }}></input>
            <p> Puhelinnumero: </p>
            <input type="text" value={profilePhonenumber} onChange={(e) => { setProfilePhonenumber(e.target.value); }}></input>
          </div>

        </div>
        <div className="Profiili-Tekstit">
        <h3>Tilaukset</h3>
          <ReactDataGrid
            showColumnMenuTool={false}
            rowHeight={25}
            idProperty="id"
            toggleRowSelectOnClick={false}
            //defaultSelected={1}
            //onSelectionChange={(e) => {setSelectedUser(e); IsDeleteButtonDisabled();}}
            style={gridStyleOrders}
            columns={TitlesOrders}
            //defaultFilterValue={UserFilterValue}
            dataSource={profileOrders}
            //enableFiltering={enableFiltering}
            />
          
        </div>

        {/* Asetukset osio */}
        <div className="Profiili-valikko">
          <h2>Asetukset</h2>
         <div><a href="/ProfiiliMuokkaus">Muokkaa profiilia</a></div> 
         <div><a href="/Tyoilmoitukset">Hallinnoi työilmoituksia</a></div>
         <div> <button type="button" onClick={()=>{redirect();}}>Peruuta</button></div> 
         <div> <button type="button" onClick={() => { modifyProfileData(); }}>Tallenna</button></div> 
        </div>
      </div>
      <div>
        <div>
          {/* TODO: Tähän kaupungin autofill ja hae kaupungit backendista*/}
          <Form.Group controlId="formBasicCity">
          <select value={cityId} onChange={(e)=>{setCityId(e.target.value);}}>
            <option value="">Valitse kaupunki</option>
            {citiesToSelect}
          </select>
          </Form.Group>
          <Form.Group controlId="formBasicAddress">
            <Form.Label>osoite</Form.Label>
            <Form.Control placeholder="Osoite" value={address} onChange={(e)=>{setAddress(e.target.value);}}/>
          </Form.Group>
          <Form.Group controlId="formBasicPhonenumber">
            <Form.Label>Postinumero</Form.Label>
            <Form.Control placeholder="Postinumero" value={postalCode} onChange={(e)=>{setPostalCode(e.target.value);}}/>
          </Form.Group>
        </div>
        <p>Jee ala osa profiilia</p>
      </div>
    </div>
  );
}


export { ProfiiliMuokkaus };