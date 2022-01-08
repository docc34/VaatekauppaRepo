import './PostCss.css';
import { Image, Card, Row, Col } from 'react-bootstrap';
import { MDBRating } from 'mdbreact';
import React,{useEffect, useRef, useState} from 'react';
import {getStorePostsService} from '../services/store';
//Tässä on funktioita joita käytetään frontissa esim julkaisujen renderöintiin.
{/* Tähän funktioon annetaan kaikki tietokannasta haetut ilmoitukset ja se luo jokaisesta alla olevan html mukaisen ilmoituksen */ }
const MakePost = (p) => {
  if (p.mode == 1) {
    if(p.data != null){

    return (
    <div>
      <Row xs={1} sm={1} md={2}  xl={3}  className="g-4" >
        {p.data.map((e, i) => {
      const sendDataDelete = () => {
        p.receivePostDeleteData({ label: e.label, idjobPost: e.idJobPost }, i);
      }

      const sendDataModify = () => {
        p.receivePostModifyData({ idJobPost: e.idJobPost, label: e.label, priceStartingAt: e.priceStartingAt, priceEndingAt: e.priceEndingAt, hourEstimate: e.hourEstimate, description: e.description });
      }
          let url = "";
          if(e!= null){
             url = "/Maksu/?jobPostId=" + e.idJobPost;
          return (
          <Col>
            <Card className="Post-Card">
              <Card.Body>
                {/* Tähän tekstin tilalle roskiksen logo */}
                <input type="button" onClick={(x) => { sendDataDelete() }} value="Poista" ></input>
                {/* Tähän tekstin tilalle kynän logo */}
                <input type="button" onClick={(x) => { sendDataModify() }} value="Muokkaa" ></input>

                <Card.Title><MakeSmallProfileCard name={e.name} image={e.image} userId={e.userId} /></Card.Title>
                <Card.Text className=""> 
                  <div className="ProfileCardTitleContainer">
                    <div className="ProfileCardTitleLabelBox">
                      {e.label}
                    </div> 
                    <div>
                      Tuntiarvio:{e.hourEstimate} 
                    </div>
                  </div>
                </Card.Text>
                
                <div className="ProfileCardTitleContainer">
                <Card.Text className="ProfileCardTitleLabelBox">
                  {e.description}
                </Card.Text>

                <Card.Text>
                {ModelPriceRange(e)}
                </Card.Text>
                </div>

                <div className="ProfileCardTitleContainer">
                <Card.Text className="ProfileCardTitleLabelBox">
                {/* Tähän vois tähti arvostelut laittaa */}
                <MakeRatingStars/>
                </Card.Text>
                <Card.Text>
                <a href={url} className="ProfileCardText"> Osta</a>
                </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>)
        }})}
      </Row>
    </div>
    )
  }
  //))}
  else{
    return(<div><p>Loading</p></div>)
  }
  }
  //Tämän ehkä voi häkätä frontista pitää tarkistaa
  else {
    //Näin voi cutomoida kortin ulkonäköä
    //   <Card
    //   bg={variant.toLowerCase()}
    //   key={idx}
    //   text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
    //   style={{ width: '18rem' }}
    //   className="mb-2"
    // ></Card>
    
    if(p.data != null){

    return (
    <div>
      <Row xs={1} sm={1} md={2}  xl={3}  className="g-4" >
        {p.data.map((e, i) => {
          let url = "";
          if(e!= null){
             url = "/Maksu/?jobPostId=" + e.idJobPost;
          return (<Col>
            <Card className="Post-Card">
              <Card.Body>
                <Card.Title><MakeSmallProfileCard name={e.name} image={e.image} userId={e.userId} /></Card.Title>
                <Card.Text className=""> 
                  <div className="ProfileCardTitleContainer">
                    <div className="ProfileCardTitleLabelBox">
                      {e.label}
                    </div> 
                    <div>
                      Tuntiarvio:{e.hourEstimate} 
                    </div>
                  </div>
                </Card.Text>
                
                <div className="ProfileCardTitleContainer">
                <Card.Text className="ProfileCardTitleLabelBox">
                  {e.description}
                </Card.Text>

                <Card.Text>
                {ModelPriceRange(e)}
                </Card.Text>
                </div>

                <div className="ProfileCardTitleContainer">
                <Card.Text className="ProfileCardTitleLabelBox">
                {/* Tähän vois tähti arvostelut laittaa */}
                <MakeRatingStars/>
                </Card.Text>
                <Card.Text>
                <a href={url} className="ProfileCardText"> Osta</a>
                </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </Col>)
        }})}
      </Row>
    </div>

    )
  }
    else {
      return(<div><p>Loading</p></div>)
    }

  }
}
const ModelPriceRange = (e)=>{
  if(e?.priceEndingAt == 0){
    return(<p>Hinta: {e.priceStartingAt}€</p>)
  }
  else{
  return(<p>Hinta: {e.priceStartingAt}-{e.priceEndingAt}€</p>)
  }
}
const MakeRatingStars = (o) =>{
  //Tällä voi antaa tähdille custom tekstit
  // const [basic] = useState([
  //   {
  //     tooltip: 'Very Bad'
  //   },
  //   {
  //     tooltip: 'Poor'
  //   },
  //   {
  //     tooltip: 'Ok',
  //     choosed: true
  //   },
  //   {
  //     tooltip: 'Good'
  //   },
  //   {
  //     tooltip: 'Excellent'
  //   }
  // ]);
  return(
    <div>
      <MDBRating 
      iconSize="1x" 
      //data={basic}
      iconRegular
      
      />
    </div>
  )
}
//Tämä tekee "Profiilikortin" eli pienen kortin jossa on käyttäjän nimi ja kuva jotka linkittävät käyttäjän julkiseen profiiliin.
const MakeSmallProfileCard = (p) => {
  let url = "/profiiliPublic?profileN=" + p.userId;
  return (
    <div className="ProfileCardMain">
      <Image className="ProfileCardImg" src={"http://127.0.0.1:3100/images/" + p.image} roundedCircle />
      <a href={url} className="ProfileCardText"> {p.name}</a>
    </div>
  )
}
//Näyttää tälle funktiolle annetun viestin käytän tätä errorien näyttämiseen
const Error = (props) => {
  return (<p className="errorText">{props.error}</p>)
}
const CheckEmptyFields = (tarkistusKentat, tarkistettavatTiedot)=>{

  let tarkistusStatus = { status: true, kentat: "" };
  let l = 0;
  //Tarkistaa onko tiedot tyhjiä ja palauttaa mitkä kentät on tyhjiä
  tarkistettavatTiedot.map((e, i) => {
      
      if (e == null && l == 0 || e == "" && l == 0) {
          l++;
          tarkistusStatus = { status: false, kentat: "Seuraavat kentät puuttuvat: "+ tarkistusKentat[i] }
      }
       else if(e == null && l == 1 || e == "" && l == 1){
      
          tarkistusStatus = { status: false, kentat: tarkistusStatus.kentat + "," + tarkistusKentat[i] }
      }

  });
  return tarkistusStatus
}

const Paypal = (o)=>{

  const paypal = useRef();
  const [post, setPost] = useState("");
  useEffect(async ()=>{
    const i = await getStorePostsService({jobPostId:o.id});
    console.log(i);
    if(i.statusText = "OK"){
      setPost(i.data.posts[0]);
    }
  },[]);

  useEffect(()=>{
    //Luodaan napille funktiot
    if(post != ""){
      window.paypal.Buttons({
        //Luodaan tilaus
        createOrder: (data, actions, error) =>{
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units:[
              {
                description: "sssd",
                amount: {
                  currency_code:"EUR",
                  value: post.priceStartingAt
                }
              },
            ]
          })
        },
        //Jos tilaus menee läpi toteutetaan on Approve funktio
        onApprove: async (data, actions) =>{
          const order = await (actions.order.capture()) 
          console.log(order);
        },
        //Jos tilaus kaatuu tehdään onError funktio
        onError: (err) =>{
          console.log(err);
        }
        
      }).render(paypal.current)
    }
  },[post]);

  return(
  <div>
      <div ref={paypal}></div>
  </div>
  );
}
export {
  MakePost,
  Error,
  CheckEmptyFields,
  Paypal
}
