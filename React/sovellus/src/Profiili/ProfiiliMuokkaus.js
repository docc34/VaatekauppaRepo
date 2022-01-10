import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button, Modal, Image , InputGroup, FormControl,CardColumns} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { getUserListService } from '../services/user';
import { getProfileListService, setProfileListService, postProfileEducationAddService, postProfileJobsAddService, deleteProfileJobsService, deleteProfileEducationService, postProfilePictureService } from '../services/profile';
import { getProfilePostsService } from '../services/store';

import './Profiili.css';
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'

import { Error, MakePost } from '../Utils/Functions';

//Renderöidään profiilin muokkaus
const ProfiiliMuokkaus = () => {
  //Muuttujat
  const [userData, setUserData] = useState([]);
  const [profileFirstLoad, setProfileFirstLoad] = useState(0);
  const [profileInfo, setProfileInfo] = useState("");
  const [profileEducation, setProfileEducation] = useState([]);
  const [profileJobs, setProfileJobs] = useState([]);
  const [profileId, setProfileId] = useState([]);
  const [profileEmail, setprofileEmail] = useState([]);
  const [profilePhonenumber, setProfilePhonenumber] = useState([]);
  const [profileImage, setProfileImage] = useState({ image: "" });


  const [educationModalShow, setEducationModalShow] = useState(false);
  const [educationSchoolName, setEducationSchoolName] = useState("");
  const [educationDegree, setEducationDegree] = useState("");
  const [educationStartDate, setEducationStartDate] = useState("");
  const [educationEndDate, setEducationEndDate] = useState("");
  const [educationData, setEducationData] = useState("");
  const [selectedRowEducation, setSelectedRowEducation] = useState("");


  const [jobsModalShow, setJobsModalShow] = useState(false);
  const [jobsName, setJobsName] = useState("");
  const [jobsProfession, setjobsProfession] = useState("");
  const [jobsStartDate, setJobsStartDate] = useState("");
  const [jobsEndDate, setJobsEndDate] = useState("");
  const [jobsData, setJobsData] = useState("");
  const [error, setError] = useState("");
  const [selectedRowJobs, setSelectedRowJobs] = useState("");
  const [sentImgFile, setSentImgFile] = useState("");

  const [profilePosts, setProfilePosts] = useState([]);

  var user = null;
  let navigate = useNavigate();
  function redirect() {
    navigate("/Profiili");
  }
  // get user list
  const getUserList = async () => {
    const result = await getUserListService(user.userId);
    if (result.error) {
      //TODO:Error
    }
    setUserData(result.data.userList[0]);
  }

  //TODO:User objektiin nykyinen user
  // Hakee profiilin taulukkodatat
  const getProfileData = async () => {
    const result = await getProfileListService(0);
    const posts = await getProfilePostsService(0);
    if (result.error || posts.error) {
      //TODO:Error
      }
    let datat = result.data;
    let post = posts.data;
    
    if (datat.tiedot != null & datat.tiedot != undefined) {
      setProfileId(datat.tiedot.userId);
      setProfileInfo(datat.tiedot.userInfo);
      setprofileEmail(datat.tiedot.email);
      setProfilePhonenumber(datat.tiedot.phonenumber);
      setProfileImage(datat.tiedot.image);
      setProfileEducation(datat.opinnot);
      setProfileJobs(datat.tyot);
      setProfilePosts(post.posts);

    }

  }

  // modify user profile data
  const modifyProfileData = async () => {
    const result = await setProfileListService({ userId: profileId, userInfo: profileInfo, email: profileEmail, phonenumber: profilePhonenumber, fileName: sentImgFile.name });
    if (result.error) {
     //TODO:Error
    }
    if (result.statusText == "OK") {
      redirect();
    }
  }
  // Lisää koulutus
  useEffect(async () => {
    if (educationData != "") {
      const result = await postProfileEducationAddService(educationData);
      if (result.error) {

        //TODO:Error
      }
      if (result.statusText == "OK") {

        resetValues();
        setError("");
        setEducationData("");
        getProfileData();
      }
    }
  }, [educationData]);

  // Lisää työpaikka
  useEffect(async () => {
    if (jobsData != "") {
      const result = await postProfileJobsAddService(jobsData);
      if (result.error) {
        //TODO:Error
      }
      if (result.statusText == "OK") {
        getProfileData();
        resetValues();
        setError("");
        setJobsData("");
      }
    }
  }, [jobsData]);


  const deleteEducationRow = async () => {

    if (selectedRowEducation.selected != null || selectedRowEducation != "") {
      const result = await deleteProfileEducationService({ educationId: selectedRowEducation.data.educationId, userId: profileId });
      if (result.error) {
        //TODO:Error
      }
      if (result.statusText == "OK") {
        setSelectedRowEducation("");
        getProfileData();
      }
    }
  }
  // Poista työpaikka
  const deleteJobRow = async () => {

    if (selectedRowJobs.selected != null || selectedRowJobs != "") {
      const result = await deleteProfileJobsService({ jobsId: selectedRowJobs.data.jobsId, userId: profileId });
      if (result.error) {
        //TODO:Error
      }
      if (result.statusText == "OK") {
        setSelectedRowJobs("");
        getProfileData();
      }
    }
  }

  // hakee taulukkodatat sivun ladatessa
  useEffect(() => {
    if (profileFirstLoad == 0) {
      getUserList();
      getProfileData();
      setProfileFirstLoad(1);
    }
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

  {/* tällähetkellä turhaa paskaa jota ehkä käytän jos toteutan koulutusten/töiden muokkauksen*/ }
  const gridStyleKoulutukset = { height: "auto" }
  const gridStyleTyot = { height: "auto" }


  {/* nollaa kaikki ponnahdusikkunoiden arvot ja sulkee pnnahdusikkunat */ }
  const resetValues = () => {

    setEducationModalShow(false);
    setEducationDegree("");
    setEducationSchoolName("");
    setEducationStartDate("");
    setEducationEndDate("");

    setJobsModalShow(false);
    setJobsName("");
    setjobsProfession("");
    setJobsStartDate("");
    setJobsEndDate("");

  }
  // Lähettää kuvatiedoston
  useEffect(async () => {
    if (sentImgFile != "" && sentImgFile != null && sentImgFile.type == "image/jpeg" || sentImgFile.type == "image/png") {

      const formData = new FormData();
      formData.append('dataFile', sentImgFile, sentImgFile.name);


      const result = await postProfilePictureService(formData, profileId);
      if (result.error) {
        //TODO:Error
      }
      if (result.statusText == "OK") {
        getProfileData();
        resetValues();
        setError("");
        setSentImgFile("");
      }
    }
  }, [sentImgFile]);

  const ilmoitukset = () => {
    if (profilePosts.length < 1 || profilePosts == undefined || profilePosts == null) {
      return (
        <div><h3>ilmoitukset</h3>
          <p>Et ole vielä tehnyt ilmoitusta</p>
        </div>
      )
    }
    else {
      <div><h3>ilmoitukset</h3>
        <p>Et ole vielä tehnyt ilmoitusta</p>
        <MakePost data={profilePosts} />
      </div>
    }
  }

  const checkProfileImage = ()=>{
    if( profileImage == null || profileImage == undefined ||  profileImage == ""){
      return(<Image className="img-thumbnail" src={"http://127.0.0.1:3100/images/DefaultImage.png"}></Image>)
    }
    else{
      return(<Image className="img-thumbnail" src={"http://127.0.0.1:3100/images/" + profileImage}></Image>)
    }
  }

  return (
    <div className="Profiili-Main">
      <div className="Profiili-UpperPartMain">
        <div className="Profiili-Esittely">
          <h1 className="Profiili-NimiOtsikko"> {userData.name}</h1>
          {checkProfileImage()}

          <div className="Profiili-Kuvan-Input">
            <input type="file" accept="image/png, image/jpeg" onChange={(e) => { setSentImgFile(e.target.files[0]); }} /> </div>

          <div>
            <h3>Yhteystiedot</h3>
            <p> email: </p>
            <input type="text" value={profileEmail} onChange={(e) => { setprofileEmail(e.target.value); }}></input>
            <p> puhelinnumero: </p>
            <input type="text" value={profilePhonenumber} onChange={(e) => { setProfilePhonenumber(e.target.value); }}></input>
            <h3>Kuvaus</h3>
            <InputGroup>
            {/* <InputGroup.Text>Kuvaus</InputGroup.Text>
            Mahdollista lisätä tekstiotsikko */}
            <FormControl as="textarea"  value={profileInfo} onChange={(e) => { setProfileInfo(e.target.value); }} />
            </InputGroup>
          </div>

        </div>
        <div className="Profiili-Tekstit">

          {/* <h3>Kuvaus</h3>
          
          <InputGroup> */}
          {/* <InputGroup.Text>Kuvaus</InputGroup.Text>
          Mahdollista lisätä tekstiotsikko */}
          {/* <FormControl as="textarea"  value={profileInfo} onChange={(e) => { setProfileInfo(e.target.value); }} />
          </InputGroup> */}

          <h3>Koulutukset</h3>
          {/* Avaa koulutusten ponnahdusikkunan */}
          <Button variant="primary" onClick={() => setEducationModalShow(true)}> Lisää koulutus</Button>
          <Button variant="primary" disabled={selectedRowEducation.selected == null} onClick={() => deleteEducationRow()}> Poista</Button>


          {/* modalin asetukset määritetään tässä */}
          <Modal
            show={educationModalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {/* Otsikko */}
                Lisää koulutus
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Tässä on ponnahdusikkunan kehon sisältö */}
             <div> <label htmlFor="SchoolName">Koulun nimi <input type="text" value={educationSchoolName} id="SchoolName" onChange={(e) => { setEducationSchoolName(e.target.value); }}></input></label></div>
             <div> <label htmlFor="Degree">Koulutus <input type="text" value={educationDegree} id="Degree" onChange={(e) => { setEducationDegree(e.target.value); }}></input></label></div>
             <div> <label htmlFor="educationStartDateInput">Aloitus päivämäärä <input id="educationStartDateInput" value={educationStartDate} type='date' dateformat={"yyyy/MM/dd"} onChange={e => setEducationStartDate(e.target.value)}></input></label></div>
             <div> <label htmlFor="educationEndDateInput">Lopetus päivämäärä <input id="educationEndDateInput" value={educationEndDate} type='date' dateformat={"yyyy/MM/dd"} onChange={e => setEducationEndDate(e.target.value)}></input></label></div>
              <Error error={error} />

            </Modal.Body>
            <Modal.Footer>
              {/* Ilmoituksen footteri */}
              <Button onClick={() => { setEducationData({ userId: profileId, schoolName: educationSchoolName, degree: educationDegree, startDate: educationStartDate, endDate: educationEndDate }); }}>Tallenna</Button>
              <Button onClick={() => { resetValues(); setError(""); }}>Peruuta</Button>
            </Modal.Footer>
          </Modal>
          {/* custom taulukko: reactdatagrid */}
          <ReactDataGrid
            showColumnMenuTool={false}
            sortable={false}
            rowHeight={25}
            style={gridStyleKoulutukset}
            idProperty="educationId"
            toggleRowSelectOnClick={true}
            defaultSelected={1}
            onSelectionChange={(e) => { setSelectedRowEducation(e) }}
            columns={OtsikotKoulutukset}
            dataSource={profileEducation}
          />

          <h3>Työt</h3>
          {/* Avaa töiden ponnahdusikkunan */}
          <Button variant="primary" onClick={() => setJobsModalShow(true)}> Lisää työpaikka</Button>
          <Button variant="primary" disabled={selectedRowJobs.selected == null} onClick={() => deleteJobRow()}> Poista</Button>

          {/*   modalin asetukset määritetään tässä */}
          <Modal
            show={jobsModalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >

            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {/* Otsikko */}
                Lisää työpaikka
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* Tässä on ponnahdusikkunan kehon sisältö */}
              <div><label htmlFor="workplaceName">Työpaikan nimi <input type="text" value={jobsName} id="workplaceName" onChange={(e) => { setJobsName(e.target.value); }}></input></label></div>
              <div><label htmlFor="profession">Ammatti <input type="text" value={jobsProfession} id="profession" onChange={(e) => { setjobsProfession(e.target.value); }}></input></label></div>
              <div><label htmlFor="jobsStartDateInput">Aloitus päivämäärä <input id="jobsStartDateInput" value={jobsStartDate} type='date' dateformat={"yyyy/MM/dd"} onChange={e => setJobsStartDate(e.target.value)}></input></label></div>
              <div><label htmlFor="jobsEndDateInput">Lopetus päivämäärä <input id="jobsEndDateInput" value={jobsEndDate} type='date' dateformat={"yyyy/MM/dd"} onChange={e => setJobsEndDate(e.target.value)}></input></label></div>

              <Error error={error} />
            </Modal.Body>
            <Modal.Footer>
              {/* Ilmoituksen footteri */}
              <Button onClick={() => { setJobsData({ userId: profileId, workplace: jobsName, profession: jobsProfession, startDate: jobsStartDate, endDate: jobsEndDate }); }}>Tallenna</Button>
              <Button onClick={() => { resetValues(); }}>Peruuta</Button>
            </Modal.Footer>
          </Modal>

          {/* custom taulukko: reactdatagrid */}
          <ReactDataGrid
            showColumnMenuTool={false}
            sortable={false}
            rowHeight={25}
            style={gridStyleTyot}
            idProperty="jobsId"
            defaultSelected={1}
            toggleRowSelectOnClick={true}
            onSelectionChange={(e) => { setSelectedRowJobs(e) }}
            columns={OtsikotTyot}
            dataSource={profileJobs}
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
        <CardColumns  className="Profile-CardColumns">
        {ilmoitukset()}
        </CardColumns>
      </div>
    </div>
  );
}


export { ProfiiliMuokkaus };