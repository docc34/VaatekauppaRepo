import React, { useEffect, useState, useRef } from 'react';

import { getProfileListService } from '../services/profile';
import { getProfilePostsService } from '../services/store';


import './Profiili.css';
import { MakePost } from '../Utils/Functions';

import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import { Image, Overlay, Tooltip, CardColumns } from 'react-bootstrap';
import { useCookies } from 'react-cookie';

//Renderöidään perus profiili
function Profiili() {

  const [profileData, setProfileData] = useState([]);
  const [profileLocation, setProfileLocation] = useState([]);
  const [error, setError] = useState("");
  // const [show, setShow] = useState(false);
  const target = useRef(null);
  const [cookies] = useCookies(['token']);

  var user = null;
  //TODO:User.userId pitää ottaa cookiesta
  // get user profile data
  const getProfileData = async () => {
    const options = {
      method: 'GET',
      headers: {"Authorization": `Bearer ${cookies.token}`}
    }

    const result = await fetch("https://localhost:44344/api/user",options)
    //const posts = await getProfilePostsService(cookies?.userId);
    if (result?.Status == "Error") {
      setError(result.Message);
    }
    else{
      var i = await result.json();
      setProfileData(i);
      setProfileLocation(i?.location)
    }
    //let post = posts.data;

    //setProfilePosts(post);

    // if ( datat?.tiedot?.userInfo == "" || datat?.tiedot == undefined || datat?.tiedot?.length == 0) {
    //   setTimeout(function () { //Aloittaa ajastimen
    //     setShow(true) //Renderöi popupin ajan jälkeen
    //   }.bind(show), 3000)
    // }

  }

  // get user list on page load
  useEffect(() => {
    getProfileData();
  }, []);


  const OtsikotTyot = [
    { name: 'profile_userId', type: 'number', header: 'profile_userId', defaultVisible: false },
    { name: 'jobsId', type: 'number', header: 'jobsId', defaultVisible: false },
    { name: 'workplace', defaultFlex: 1, header: 'Työpaikka' },
    { name: 'profession', defaultFlex: 1, header: 'Ammatti' },
    { name: 'startDate', defaultFlex: 1, header: 'Alkupäivä' },
    { name: 'endDate', defaultFlex: 1, header: 'Loppupäivä' },
  ]
  //, border: "none"
  const gridStyleKoulutukset = { height: "auto" }

  const checkProfileImage = () => {
    if (profileData?.image == null || profileData?.image == undefined || profileData?.image == "") {
      return (<Image className="img-thumbnail" src={"http://127.0.0.1:3100/images/DefaultImage.png"}></Image>)
    }
    else {
      return (<Image className="img-thumbnail" src={"http://127.0.0.1:3100/images/" + profileData.image}></Image>)
    }
  }

    return (
      <div className="Profiili-Main">
        <div className="Profiili-UpperPartMain">
          <div className="Profiili-Esittely">
            <h1 className="Profiili-NimiOtsikko"> {profileData?.name}</h1>

              {checkProfileImage()}
              <h3>Yhteystiedot</h3>
              <p> email: {profileData?.email}</p>
              <p> puhelinnumero: {profileData?.phonenumber}</p>
              <h3>Osoitetiedot</h3>
              <p> kaupunki: {profileLocation?.city}</p>
              <p> osoite: {profileLocation?.address}</p>
              <p> postinumero: {profileLocation?.postalCode}</p>
            </div>
          <div className="Profiili-Tekstit">
            <p>Tähän haetaan tehdyt tilaukset datagridissä</p>
            {error}
          </div>
          <div className="Profiili-valikko">
            <h2>Asetukset</h2>
            
            <div ref={target}>< a href="/ProfiiliMuokkaus">Muokkaa profiilia</a></div>
            
            {/* <Overlay target={target.current} show={show} placement="left">
              <Tooltip >
                <p>Tee profiilisi loppuun Muokkaa profiilia osiosta.</p>
              </Tooltip>
            </Overlay> */}
          </div>

        </div>
      </div>
    );
  

}

export { Profiili };