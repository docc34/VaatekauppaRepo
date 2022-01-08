import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';

import { verifyTokenAsync } from "../asyncActions/authAsyncActions";
import { userLogout, verifyTokenEnd } from "../actions/authActions";

import { Button, InputGroup, FormControl, Modal,CardColumns } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import { setAuthToken } from '../services/auth';
import { getStorePostsService } from '../services/store';

import '@inovua/reactdatagrid-community/index.css'

import { MakePost, Error } from '../Utils/Functions';
//^Importataan kaikki paketit mitä tarvitaan
import { getProfilePostsService } from '../services/store';
import { postPostService, postDeleteService, postModifyService } from '../services/postManager';

import './jobPostManager.css';

const PostManager = () => {
    //Otetaan tarvittavat muuttujat tokenin verifikointia varten
    const dispatch = useDispatch();
    const authObj = useSelector(state => state.auth);
    const { user, token, expiredAt } = authObj;

    const [modifyDataModal, setModifyDataModal] = useState(false);
    const [postModalShow, setPostModalShow] = useState(false);
    const [postLabel, setPostLabel] = useState("");
    const [postPriceStartingAt, setPostPriceStartingAt] = useState(0);
    const [postPriceEndingAt, setPostPriceEndingAt] = useState(0);

    const [postHourEstimate, setPostHourEstimate] = useState("");
    const [postDescription, setPostDescription] = useState("");
    const [idJobPost, setIdJobPost] = useState("");
    const [postData, setPostData] = useState("");
    const [profileId] = useState(user.userId);
    const [error, setError] = useState("");
    const [userPosts, setUserPosts] = useState([]);
    const [postModifyData, setPostModifyData] = useState([]);

    // set timer to renew token
    useEffect(() => {
        setAuthToken(token);
        const verifyTokenTimer = setTimeout(() => {
            dispatch(verifyTokenAsync(true));
        }, moment(expiredAt).diff() - 10 * 1000);
        return () => {
            clearTimeout(verifyTokenTimer);
        }
    }, [expiredAt, token])



    {/* nollaa kaikki ponnahdusikkunoiden arvot ja sulkee pnnahdusikkunat */ }
    const resetValues = () => {

        setPostModalShow(false);
        setModifyDataModal(false);
        setPostLabel("");
        setPostPriceStartingAt(0);
        setPostPriceEndingAt(0);
        setPostHourEstimate("");
        setPostDescription("");

    }
    // get user profile data
    const getUserPosts = async () => {

        const posts = await getProfilePostsService(user.userId);
        if (posts.error) {
            dispatch(verifyTokenEnd());
            if (posts.response && [401, 403].includes(posts.response.status))
                dispatch(userLogout());
            return;
        }

        let post = posts.data;

        setUserPosts(post.posts);
    }
    useEffect(async () => {
        if (postData != "") {
            const posts = await postPostService(postData);
            if (posts.error) {
                setError(posts.response.data.msg);
                dispatch(verifyTokenEnd());
                if (posts.response && [401, 403].includes(posts.response.status))
                    dispatch(userLogout());
                return;
            }

            let post = posts.data;

            resetValues();
            setError("");
        }
    }, [postData]);

    useEffect(() => {
        getUserPosts();
    }, []);


    const receivePostDeleteData = async (data) => {

        if (window.confirm("Haluatko varmasti poistaa julkaisun")) {
            if (data != undefined && data != null) {
                const posts = await postDeleteService({ selectedPost: data, userId: profileId });
                if (posts.error) {
                    setError(posts.response.data.msg);
                    dispatch(verifyTokenEnd());
                    if (posts.response && [401, 403].includes(posts.response.status))
                        dispatch(userLogout());
                    return;
                }
                let post = posts.data;
                resetValues();
                getUserPosts();
            }
        }
    }
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
        console.log(postModifyData);
        if (postModifyData.length != 0 && postModifyData != null) {

            const posts = await postModifyService(postModifyData);
            if (posts.error) {
                setError(posts.response.data.msg);
                dispatch(verifyTokenEnd());
                if (posts.response && [401, 403].includes(posts.response.status))
                    dispatch(userLogout());
                return;
            }
            let post = posts.data;
            resetValues();
            getUserPosts();
        }

    }, [postModifyData]);

    return (<div className="PostManagerMainBox">
        <h1> Hae työilmoituksia</h1>

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
               
                <Error error={error} />

            </Modal.Body>
            <Modal.Footer>
                {/* Ilmoituksen footteri */}
                <Button onClick={() => { setPostData({ userId: profileId, label: postLabel, priceStartingAt: postPriceStartingAt,priceEndingAt: postPriceEndingAt , hourEstimate: postHourEstimate, description: postDescription }); }}>Tallenna</Button>
                <Button onClick={() => { resetValues(); setError(""); }}>Peruuta</Button>
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
                <Error error={error} /></div>

            </Modal.Body>
            <Modal.Footer>
                {/* Ilmoituksen footteri */}
                <Button onClick={() => { setPostModifyData({ idJobPost: idJobPost, userId: profileId, label: postLabel, priceStartingAt: postPriceStartingAt,priceEndingAt: postPriceEndingAt, hourEstimate: postHourEstimate, description: postDescription }); }}>Tallenna</Button>
                <Button onClick={() => { resetValues(); setError(""); }}>Peruuta</Button>
            </Modal.Footer>
        </Modal>

        <CardColumns  className="Job-Post-CardColumns"> 
            <MakePost data={userPosts} mode={1} receivePostDeleteData={receivePostDeleteData} receivePostModifyData={receivePostModifyData} />
        </CardColumns>
    </div>)
}

export { PostManager }