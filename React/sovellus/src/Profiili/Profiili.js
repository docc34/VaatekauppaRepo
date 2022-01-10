import React, { useEffect, useState, useRef } from 'react';

import { getProfileListService } from '../services/profile';
import { getProfilePostsService } from '../services/store';


import './Profiili.css';
import { MakePost } from '../Utils/Functions';

import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import { Image, Overlay, Tooltip, CardColumns } from 'react-bootstrap';

//Renderöidään perus profiili
function Profiili() {

  const [profileData, setProfileData] = useState([]);
  const [profileEducation, setProfileEducation] = useState([]);
  const [profileJobs, setProfileJobs] = useState([]);
  const [profilePosts, setProfilePosts] = useState([]);
  const [show, setShow] = useState(false);
  const target = useRef(null);

  var user = null;
  //TODO:User.userId pitää ottaa cookiesta
  // get user profile data
  const getProfileData = async () => {
    const result = await getProfileListService(0);
    const posts = await getProfilePostsService(0);
    if (result.error || posts.error) {
    //TODO:Error
    }
    let datat = result.data;
    let post = posts.data;

    setProfileData(await datat.tiedot);
    setProfileEducation(datat.opinnot);
    setProfileJobs(datat.tyot);
    setProfilePosts(post.posts);

    if ( datat?.tiedot?.userInfo == "" || datat?.tiedot == undefined || datat?.tiedot?.length == 0) {
      setTimeout(function () { //Aloittaa ajastimen
        setShow(true) //Renderöi popupin ajan jälkeen
      }.bind(show), 3000)
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
          <p>Et ole vielä tehnyt ilmoitusta</p>
        </div>
      )
    }
    else {
      return(
      <div><h3>ilmoitukset</h3>
        <MakePost data={profilePosts} />
      </div>)
    }
  }

  const checkProfileImage = () => {
    if (profileData?.image == null || profileData?.image == undefined || profileData?.image == "") {
      return (<Image className="img-thumbnail" src={"http://127.0.0.1:3100/images/DefaultImage.png"}></Image>)
    }
    else {
      return (<Image className="img-thumbnail" src={"http://127.0.0.1:3100/images/" + profileData.image}></Image>)
    }
  }


const checkProfileDescription =  ()=>{
  if ( profileData?.userInfo == "" || profileData == undefined || profileData?.length == 0) {

    return(
      <p className="Profile-Description-Text">Et ole vielä kirjoittanut kuvausta</p>
    )
  }
  else{
    
    return(
     <p className="Profile-Description-Text">{profileData.userInfo}</p> 
    )
  }
}
const checkIfUserIsSeller = ()=>{
  if(user?.isSeller){
    return(<div><a href="/Tyoilmoitukset">Hallinnoi työilmoituksia</a></div>)
  }
  else{
    return(null)
  }
}
    return (
      <div className="Profiili-Main">
        <div className="Profiili-UpperPartMain">
          <div className="Profiili-Esittely">
            <h1 className="Profiili-NimiOtsikko"> {user?.name}</h1>

            {checkProfileImage()}
            <h3>Yhteystiedot</h3>
            <p> email: {user?.email}</p>
            <p> puhelinnumero: {profileData?.phonenumber}</p>
            <h3>Kuvaus</h3>
            {checkProfileDescription()}
            </div>
          <div className="Profiili-Tekstit">
            {/* En vielä tiedä kumpi on parempi kuvaus kuvan alla vai töiden / koulutusten päällä */}
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
          <div className="Profiili-valikko">
            <h2>Asetukset</h2>
            
            <div ref={target}>< a href="/ProfiiliMuokkaus">Muokkaa profiilia</a></div>
            {checkIfUserIsSeller()}
            
            
            <Overlay target={target.current} show={show} placement="left">
              <Tooltip >
                <p>Tee profiilisi loppuun Muokkaa profiilia osiosta.</p>
              </Tooltip>
            </Overlay>
          </div>

        </div>
        <div>
        <CardColumns className="Profile-CardColumns">
        {ilmoitukset()}
        </CardColumns>
            </div>
      </div>
    );
  

}

export { Profiili };