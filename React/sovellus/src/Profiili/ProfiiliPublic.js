import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';


import { verifyTokenAsync } from "../asyncActions/authAsyncActions";
import { userLogout, verifyTokenEnd } from "../actions/authActions";

import { setAuthToken } from '../services/auth';
import { getUserListService } from '../services/user';
import { getProfileListService } from '../services/profile';
import { getProfilePostsService } from '../services/store';


import './Profiili.css';
import { MakePost } from '../Utils/Functions';

import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import { Image, Overlay, CardColumns } from 'react-bootstrap';

//Renderöidään julkinen profiili

function ProfilePublic() {
  const search = useLocation().search;
  const profileN = new URLSearchParams(search).get('profileN');

  const [userData, setUserData] = useState([]);
  const [profileData, setProfileData] = useState({});
  const [profileEducation, setProfileEducation] = useState([]);
  const [profileJobs, setProfileJobs] = useState([]);
  const [profilePosts, setProfilePosts] = useState([]);


  // get user profile data
  const getProfileData = async () => {
    if (profileN != null && profileN != undefined && profileN != "") {
      const result = await getProfileListService(profileN);
      const posts = await getProfilePostsService(profileN);

      let datat = result.data;
      let post = posts.data;

      setProfileData(datat.tiedot);
      setProfileEducation(datat.opinnot);
      setProfileJobs(datat.tyot);
      setProfilePosts(post.posts);
    }


  }

  // get user list on page load
  useEffect(() => {
    getProfileData();
  }, []);
  //Määritetään otsikot 
  //HUOM! otsikoiden name kentän pitää olla sama kun dataSource json objektin kenttien nimet muuten taulukko ei näytä dataa
  //defaultWidth: 72,
  const OtsikotKoulutukset = [
    { name: 'profile_userId', type: 'number', header: 'profile_userId', defaultVisible: false },
    { name: 'educationId', type: 'number', header: 'educationId', defaultVisible: false },
    { name: 'schoolName', defaultFlex: 1, header: 'Koulu' },
    { name: 'degree', defaultFlex: 1, header: 'Koulutus' },
    { name: 'startDate', defaultFlex: 1, header: 'Alkupäivä' },
    { name: 'endDate', defaultFlex: 1, header: 'Loppupäivä' },
  ]
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
  const gridStyleTyot = { height: "auto" }

  const ilmoitukset = () => {
    if (profilePosts.length == 0 || profilePosts == undefined || profilePosts == null) {
      return (
        <div><h3>ilmoitukset</h3>
          <p>Käyttäjällä ei ole ilmoituksia</p>
        </div>
      )
    }
    else {
      return (
        <div><h3>ilmoitukset</h3>
          <MakePost data={profilePosts} profileId={profileN} />
        </div>)
    }
  }

  const checkProfileImage = () => {
    if (profileData.image == null || profileData.image == undefined || profileData.image == "") {
      return (<Image className="img-thumbnail" src={"http://127.0.0.1:3100/images/DefaultImage.png"}></Image>)
    }
    else {
      return (<Image className="img-thumbnail" src={"http://127.0.0.1:3100/images/" + profileData.image}></Image>)
    }
  }

  const checkProfileDescription = () => {
    if (profileData.userInfo == "" || profileData == undefined || profileData.length == 0) {
      return (
        <p className="Profile-Description-Text">Käyttäjällä ei ole kuvausta</p>
      )
    }
    else {

      return (
        <p className="Profile-Description-Text">{profileData.userInfo}</p>
      )
    }
  }

  return (
    <div className="Profiili-Main">
      <div className="Profiili-UpperPartMain">
        <div className="Profiili-Esittely">
          <a href="/Kauppa">Takaisin kauppaan</a>
          <h1 className="Profiili-NimiOtsikko"> {profileData.name}</h1>

          {checkProfileImage()}
          <h3>Yhteystiedot</h3>
          <p> email: {profileData.email}</p>
          <p> puhelinnumero: {profileData.phonenumber}</p>
          
          <h3>Kuvaus</h3>
          {checkProfileDescription()}
          </div>
        <div className="Profiili-Tekstit">

          {/* <h3>Kuvaus</h3>
          {checkProfileDescription()} */}

          <h3>Koulutukset</h3>
          <ReactDataGrid
            showColumnMenuTool={false}
            sortable={false}
            rowHeight={25}
            style={gridStyleKoulutukset}
            idProperty="educationId"
            toggleRowSelectOnClick={true}
            defaultSelected={1}
            // onSelectionChange={(e) => { }}
            columns={OtsikotKoulutukset}
            dataSource={profileEducation}
          />
          <h3>Työt</h3>
          <ReactDataGrid
            showColumnMenuTool={false}
            sortable={false}
            rowHeight={25}
            style={gridStyleTyot}
            idProperty="jobsId"
            toggleRowSelectOnClick={true}
            defaultSelected={1}
            //onSelectionChange={(e) => { }}
            columns={OtsikotTyot}
            dataSource={profileJobs}
          />

        </div>
        <div></div>
      </div>
      <div>
        <CardColumns  className="Profile-CardColumns">
          {ilmoitukset()}
        </CardColumns>
        </div>
    </div>
  );

}

export { ProfilePublic };