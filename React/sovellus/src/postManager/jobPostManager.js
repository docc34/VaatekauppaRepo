import React, { useEffect, useState } from 'react';
import moment from 'moment';

import { Button, InputGroup, FormControl, Modal,CardColumns } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


import '@inovua/reactdatagrid-community/index.css'

import { MakePost, Error } from '../Utils/Functions';
//^Importataan kaikki paketit mitä tarvitaan

import { postPostService, postDeleteService, postModifyService } from '../services/postManager';

import './jobPostManager.css';
import { useCookies } from 'react-cookie';

const PostManager = () => {
    var user = null;
    const [modifyDataModal, setModifyDataModal] = useState(false);
    const [postModalShow, setPostModalShow] = useState(false);
    const [postLabel, setPostLabel] = useState("");
    const [postPriceStartingAt, setPostPriceStartingAt] = useState(0);
    const [postPriceEndingAt, setPostPriceEndingAt] = useState(0);

    const [postHourEstimate, setPostHourEstimate] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [idJobPost, setIdJobPost] = useState("");
    const [postData, setPostData] = useState("");
    //TODO:User objekti pitää ottaa käyttöön
    //const [profileId] = useState(user.userId);
    const [message, setMessage] = useState("");
    const [userPosts, setUserPosts] = useState([]);
    const [postModifyData, setPostModifyData] = useState([]);
    const [file, setFile] = useState(null);
    const [errors, setErrors] = useState([]);
    const [cookies] = useCookies(['token']);


    {/* nollaa kaikki ponnahdusikkunoiden arvot ja sulkee pnnahdusikkunat */ }
    const resetValues = () => {
        setPostModalShow(false);
        setModifyDataModal(false);
        setPostLabel("");
        setPostPriceStartingAt(0);
        setPostPriceEndingAt(0);
        setPostHourEstimate("");
        setPostDescription("");

        setFile(null);
    }
    // get user profile data
    // const getUserPosts = async () => {

    //     const posts = null;
    //     if (posts.error) {
    //     //TODO:Error
    //     }

    //     let post = posts.data;

    //     setUserPosts(post.posts);
    // }
    // useEffect(async () => {
    //     if (postData != "") {
    //         const posts = await postPostService(postData);
    //         if (posts.error) {
    //             //TODO:Error
    //         }
    //         let post = posts.data;

    //         resetValues();
    //         setMessage("");
    //     }
    // }, [postData]);

    // useEffect(() => {
    //     getUserPosts();
    // }, []);


    // const receivePostDeleteData = async (data) => {

    //     if (window.confirm("Haluatko varmasti poistaa julkaisun")) {
    //         if (data != undefined && data != null) {
    //             const posts = await postDeleteService({ selectedPost: data, userId: profileId });
    //             if (posts.error) {
    //                             //TODO:Error

    //             }
    //             let post = posts.data;
    //             resetValues();
    //             getUserPosts();
    //         }
    //     }
    // }
    const receivePostModifyData = async (data) => {

        if (data != undefined && data != null) {
            setModifyDataModal(data);
            setPostLabel(data.label);
            setPostPriceStartingAt(data.priceStartingAt);
            setPostPriceEndingAt(data.priceEndingAt);
            setPostHourEstimate(data.hourEstimate);
            setPostDescription(data.description);
            setIdJobPost(data.idJobPost);
        }

    }
    useEffect(async () => {
        if (postModifyData.length != 0 && postModifyData != null) {

            const posts = await postModifyService(postModifyData);
            if (posts.error) {
            //TODO:Error
            }
            let post = posts.data;
            resetValues();
            //getUserPosts();
        }

    }, [postModifyData]);

    const addOrEdit = async (formData)=>{
        if (formData != "" && formData != null) {

            const options = {
                method: 'POST',
                headers: { "Authorization": `Bearer ${cookies?.token}` },
                body: formData
            }
            //, 'Content-Type': 'application/x-www-form-urlencoded'
            //, 'Content-Type': 'image/png'
            try {
                let data = await fetch("https://localhost:44344/api/Posts/image", options)
                let j = await data.json();
                if (j?.status != "Error") {
                    setMessage("Image added successfully.");
                    resetValues();
                }
                else {
                    setMessage(j?.message);
                }
            } catch {
                setMessage("Error!");
            }
        }
    }

    const handleFormSubmit = e =>{
        
        e.preventDefault();
        if( file != null){
        
        const formData = new FormData();
        formData.append("ImageLink", "imageName")
        formData.append("imageFile", file)
        formData.append("postId", 1)//TODO:Lisää tähän valitun julkaisun id
        //formData.append("description", attachmentDescription)
        addOrEdit(formData);

        }
    }
    // const validate=()=>{
    //     let temp = {};
    //     //temp.imageSource = imageSource ==defaultImageSource?false:true;
    //     //temp.description = attachmentDescription ==""?false:true;
    //     setErrors(temp);
    //     return Object.values(temp).every(x=>x==true)
    // }
    const setFileFromInput = e =>{
        if(e.target.files && e.target.files[0]){
        let imageFile = e.target.files[0];
        const reader = new FileReader();
        reader.onload = x=>{
            setFile(imageFile);

        }
        reader.readAsDataURL(imageFile);
        }
        else{
            setFile(null);
        }
    }
    const applyErrorClass= field =>((field in errors && errors[field] == false)?' invalid-field':'')

    return (<div className="PostManagerMainBox">
        <h1> Hae työilmoituksia</h1>
        <h3>Lisää kuva julkaisuun</h3>
        <form onSubmit={handleFormSubmit}>
            {/* <label htmlFor='attachmentDescription'>Picture description<input id="attachmentDescription" onChange={(e)=>{setAttachmentDescription(e.target.value);}} className="form-control"/></label> */}
            {/*onChange={showPreview}*/}
            <input onChange={setFileFromInput} type="file" accept='image/*' id="image-uploader" className={"form-control"+applyErrorClass("imageSource")}/>
            <Button type="submit">Save</Button>
        </form>
        <Button onClick={() => { setPostModalShow(true) }}>Tee työilmoitus</Button>
        {/* <Button onClick={() => { deleteSelectedPosts();}}>Poista valitut</Button> */}
        <a href="/Profiili">Profiiliin</a>

        {/* modalin asetukset määritetään tässä */}
        <Modal
            show={postModalShow}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header >
                <Modal.Title id="contained-modal-title-vcenter">
                    {/* Otsikko */}
                    Luo ilmoitus
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Tässä on ponnahdusikkunan kehon sisältö */}
                <div><label htmlFor="postLabel">Otsikko <input type="text" value={postLabel} id="postLabel" onChange={(e) => { setPostLabel(e.target.value); }}></input></label></div>
                <div><label htmlFor="postPriceStartingAt">Hinta <input type="number" value={postPriceStartingAt} id="postPriceStartingAt" onChange={(e) => { setPostPriceStartingAt(e.target.value); }}></input></label></div>
                <div><label htmlFor="postPriceEndingAt">Jos hinta vaihtelee voit laittaa tähän maksimi hinnan. <input type="number" value={postPriceEndingAt} id="postPriceEndingAt" onChange={(e) => { setPostPriceEndingAt(e.target.value); }}></input></label></div>
                <div><label htmlFor="postHourEstimate">Tuntiarvio <input id="postHourEstimate" value={postHourEstimate} type='number' onChange={e => setPostHourEstimate(e.target.value)}></input></label></div>
                {/* <label htmlFor="postDescription">Kuvaus  </label> */}
               <div> <InputGroup>
                     <InputGroup.Text>Kuvaus</InputGroup.Text>
                    
                    <FormControl as="textarea" value={postDescription}  onChange={(e) => { setPostDescription(e.target.value); }} />
                </InputGroup></div>
               
                <Error message={message} />

            </Modal.Body>
            <Modal.Footer>
                {/* Ilmoituksen footteri */}
                {/* <Button onClick={() => { setPostData({ userId: profileId, label: postLabel, priceStartingAt: postPriceStartingAt,priceEndingAt: postPriceEndingAt , hourEstimate: postHourEstimate, description: postDescription }); }}>Tallenna</Button> */}
                <Button onClick={() => { resetValues(); setMessage(""); }}>Peruuta</Button>
            </Modal.Footer>
        </Modal>


        {/* modalin asetukset määritetään tässä */}
        <Modal
            show={modifyDataModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header >
                <Modal.Title id="contained-modal-title-vcenter">
                    {/* Otsikko */}
                    Muokkaa ilmoitusta
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Tässä on ponnahdusikkunan kehon sisältö */}
                <div><label htmlFor="postLabel">Otsikko <input type="text" value={postLabel} id="postLabel" onChange={(e) => { setPostLabel(e.target.value); }}></input></label></div>
                <div><label htmlFor="postPriceStartingAt">Hinta alken <input type="number" value={postPriceStartingAt} id="postPriceStartingAt" onChange={(e) => { setPostPriceStartingAt(e.target.value); }}></input></label></div>
                <div><label htmlFor="postPriceEndingAt">Hinta loppuen <input type="number" value={postPriceEndingAt} id="postPriceEndingAt" onChange={(e) => { setPostPriceEndingAt(e.target.value); }}></input></label></div>
                <div><label htmlFor="postHourEstimate">Tuntiarvio <input id="postHourEstimate" value={postHourEstimate} type='number' onChange={e => setPostHourEstimate(e.target.value)}></input></label></div>
                
                <div><InputGroup>
                     <InputGroup.Text>Kuvaus</InputGroup.Text>
                    
                    <FormControl as="textarea" value={postDescription}  onChange={(e) => { setPostDescription(e.target.value); }} />
                </InputGroup>
                <Error message={message} /></div>

            </Modal.Body>
            <Modal.Footer>
                {/* Ilmoituksen footteri */}
                {/* <Button onClick={() => { setPostModifyData({ idJobPost: idJobPost, userId: profileId, label: postLabel, priceStartingAt: postPriceStartingAt,priceEndingAt: postPriceEndingAt, hourEstimate: postHourEstimate, description: postDescription }); }}>Tallenna</Button> */}
                <Button onClick={() => { resetValues(); setMessage(""); }}>Peruuta</Button>
            </Modal.Footer>
        </Modal>

        <CardColumns  className="Job-Post-CardColumns"> 
            {/* <MakePost data={userPosts} mode={1} receivePostDeleteData={receivePostDeleteData} receivePostModifyData={receivePostModifyData} /> */}
        </CardColumns>
    </div>)
}

export { PostManager }