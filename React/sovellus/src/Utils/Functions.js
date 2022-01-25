import './PostCss.css';
import { Image, Card, Row, Col } from 'react-bootstrap';
import { MDBRating } from 'mdbreact';
import React,{useEffect, useRef, useState} from 'react';
import { useCookies } from 'react-cookie';
//Tässä on funktioita joita käytetään frontissa esim julkaisujen renderöintiin.
{/* Tähän funktioon annetaan kaikki tietokannasta haetut ilmoitukset ja se luo jokaisesta alla olevan html mukaisen ilmoituksen */ }
const MakePost = (p) => {
  const [cookies,setCookie] = useCookies(['token']);

  //Julkaisu poisto ja muokkausnapeilla
  //#region 
  // if (p.mode == 1) {
  //   if(p.data != null){

  //   return (
  //   <div>
  //     <Row xs={1} sm={1} md={2}  xl={3}  className="g-4" >
  //       {p.data.map((e, i) => {
  //     const sendDataDelete = () => {
  //       p.receivePostDeleteData({ label: e.label, idjobPost: e.idJobPost }, i);
  //     }

  //     const sendDataModify = () => {
  //       p.receivePostModifyData({ idJobPost: e.idJobPost, label: e.label, priceStartingAt: e.priceStartingAt, priceEndingAt: e.priceEndingAt, hourEstimate: e.hourEstimate, description: e.description });
  //     }
  //         let url = "";
  //         if(e!= null){
  //            url = "/Maksu/?jobPostId=" + e.idJobPost;
  //         return (
  //         <Col>
  //           <Card className="Post-Card">
  //             <Card.Body>
  //               {/* Tähän tekstin tilalle roskiksen logo */}
  //               <input type="button" onClick={(x) => { sendDataDelete() }} value="Poista" ></input>
  //               {/* Tähän tekstin tilalle kynän logo */}
  //               <input type="button" onClick={(x) => { sendDataModify() }} value="Muokkaa" ></input>

  //               <Card.Title><MakeSmallProfileCard name={e.name} image={e.image} userId={e.userId} /></Card.Title>
  //               <Card.Text className=""> 
  //                 <div className="ProfileCardTitleContainer">
  //                   <div className="ProfileCardTitleLabelBox">
  //                     {e.label}
  //                   </div> 
  //                   <div>
  //                     Tuntiarvio:{e.hourEstimate} 
  //                   </div>
  //                 </div>
  //               </Card.Text>
                
  //               <div className="ProfileCardTitleContainer">
  //               <Card.Text className="ProfileCardTitleLabelBox">
  //                 {e.description}
  //               </Card.Text>

  //               <Card.Text>
  //               {ModelPriceRange(e)}
  //               </Card.Text>
  //               </div>

  //               <div className="ProfileCardTitleContainer">
  //               <Card.Text className="ProfileCardTitleLabelBox">
  //               {/* Tähän vois tähti arvostelut laittaa */}
  //               <MakeRatingStars/>
  //               </Card.Text>
  //               <Card.Text>
  //               <a href={url} className="ProfileCardText"> Osta</a>
  //               </Card.Text>
  //               </div>
  //             </Card.Body>
  //           </Card>
  //         </Col>)
  //       }})}
  //     </Row>
  //   </div>
  //   )
  // }
  // //))}
  // else{
  //   return(<div><p>Loading</p></div>)
  // }
  // }
  //Tämän ehkä voi häkätä frontista pitää tarkistaa
  // else {
    //Näin voi cutomoida kortin ulkonäköä
    //   <Card
    //   bg={variant.toLowerCase()}
    //   key={idx}
    //   text={variant.toLowerCase() === 'light' ? 'dark' : 'white'}
    //   style={{ width: '18rem' }}
    //   className="mb-2"
    // ></Card>
    //#endregion
    if(p.data != null){
    return (
    <div>
      <Row xs={1} sm={1} md={2}  xl={4}  className="g-4" >
        {p.data.map((e, i) => {
          if(e!= null){
            return (<Col>
              <Card className="Post-Card">
                <Card.Body>
                  <Card.Title>{e?.label}</Card.Title>
                  <Card.Text className=""> 
                    <div className="ProfileCardTitleContainer">
                      <div>
                      <p>Hinta: {e?.price}€</p>
                      </div>
                    </div>
                  </Card.Text>
                  {/* Tämä on ehdollista renderöintiä, pitää määrittää kenttiin jotka voi olla tyhjiä */}
                  {
                  e?.material ? (<Card.Text>
                    Materiaali: {e?.material}
                  </Card.Text> ): (null)
                  }
                  {
                  e?.length ? (<Card.Text>
                    Pituus: {e?.length}
                  </Card.Text> ):( null)
                  }
                  {
                  e?.sleeveLength ? (<Card.Text>
                    Hihan pituus: {e?.sleeveLength}
                  </Card.Text> ): (null)
                  }
                  {/* TODO: Tee funktio joka laskee hintaan mukaan alennuksen ja veron ja jos alennusta on muuta tyylityksiä ehdollisella reneröinnillä */}
                  {
                  e?.discount ? (<Card.Text>
                    Alennus: {e?.discount}%
                  </Card.Text> ): (null)
                  }
                  {
                  e?.tax ? (<Card.Text>
                    Vero: {e?.tax}%
                  </Card.Text> ): (null)
                  }
                  <div className="ProfileCardTitleContainer">
                  <Card.Text className="ProfileCardTitleLabelBox">
                    {e?.description}
                  </Card.Text>
                  </div>

                  <div className="ProfileCardTitleContainer">
                    <Card.Text className="ProfileCardTitleLabelBox">
                    {/* Tähän vois tähti arvostelut laittaa */}
                      <MakeRatingStars/>
                    </Card.Text>
                    <Card.Text>
                      <button onClick={()=>{if(cookies['shoppingCart'] == null || cookies['shoppingCart'] == undefined){
                        setCookie('shoppingCart', [{PostId:e?.id}], { path: '/' })
                      }
                      else{
                        var i = cookies['shoppingCart'];
                        var t = true;
                        i?.map((item,index)=>{
                          if(item?.PostId == e?.id){
                            t = false;
                          }
                        })

                        if(t == true)
                        {
                          i[i.length] ={PostId:e?.id}
                          console.log(i);
                          setCookie('shoppingCart', JSON.stringify(i), { path: '/',expires: 0})
                          window.location.reload();
                        }
                      }}}>Lisää ostoskoriin</button>
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

  // }
}
const MakeShoppingCartItem = (p) => {
  const [cookies,setCookie] = useCookies(['token']);
    if(p.data != null){
    return (
    <div>
      {p.data.map((e, i) => {

        if(e!= null){
          return (
            <div class="d-flex justify-content-between align-items-center mt-3 p-2 items rounded">
              {/* TODO:Hae tähän tuotekuvat. */}
              <div class="d-flex flex-row"><img class="rounded" src="https://i.imgur.com/QRwjbm5.jpg" width="40"/>
                <div class="ml-2"><span class="font-weight-bold d-block">{e?.label}</span><span class="spec">
                  {/* Tämä on ehdollista renderöintiä, pitää määrittää kenttiin jotka voi olla tyhjiä */}
                  {
                  e?.material ? (
                     e?.material
                  ): (null)
                  }
                  {
                  e?.length ? (
                    ","+ e?.length +"cm"
                  ):( null)
                  }
                  {
                  e?.sleeveLength ? 
                    ","+ e?.sleeveLength +"cm"
                  : (null)
                  }
                  {/* TODO: Tee funktio joka laskee hintaan mukaan alennuksen ja veron ja jos alennusta on muuta tyylityksiä ehdollisella reneröinnillä */}
                  {
                  e?.discount ? (
                    ","+ e?.discount +"%"
                  ): (null)
                  }
                  {
                  e?.tax ? (
                    ","+ e?.tax +"%"
                  ): (null)
                  }
                </span>
              </div>
              <div class="d-flex flex-row align-items-center"><span class="d-block">2</span><span class="d-block ml-5 font-weight-bold">{e?.price}</span><i class="fa fa-trash-o ml-3 text-black-50"></i> 
              <button onClick={()=>{
                var i = cookies['shoppingCart'];
                i?.map((item,index)=>{
                  if(item?.PostId == e?.id){
                      i.splice(index, 1)
                  }
                })
                
                setCookie('shoppingCart', JSON.stringify(i), { path: '/',expires: 0})
                
                window.location.reload();
              }}>Poista ostoskorista</button>
              </div>
            </div>  
          </div>
          )
        }
      })
    }
  </div>
  )
}
    else {
      return(<div><p>Loading</p></div>)
    }

  // }
}

//TODO: funktio joka muuttaa kuljetusarviopäivät päivämääriksi

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
  const [user, setUser] = useState("");
  useEffect(async ()=>{
   try{ 
    const options = {
      method: 'GET',
      headers: {"Authorization": `Bearer ${o.token}`}
    }
    
    var user = await fetch("https://localhost:44344/api/user",options)
    if(user?.Status == "Error" ){
    }
    else{
      
      setUser(await user?.json());
    }
  }
  catch{

  }
  },[]);

  const purchasedUnits = o.posts.map((e,i)=>{
    return({
      description: e.description,
      amount: {
        currency_code:"EUR",
        value: e.price
      }
    })
  });
  useEffect(()=>{
    //Luodaan napille funktiot
    if(o.posts != ""){
      window.paypal.Buttons({
        //Luodaan tilaus
        createOrder: (data, actions, error) =>{
          return actions.order.create({
            intent: "CAPTURE",
            payer:{
              email_address:user.email,
              name:{
                given_name:user.firstName,
                surname:user.lastName
              },
              phone_with_type:{
                phone_number:{
                  national_number:user.phonenumber
                }
              },
              address_portable:{
                address_line_1:user?.location?.address,
                postal_code:user?.location?.postalCode,
                country_code:"FI",
                admin_area_1:user?.province,
                admin_area_2:user?.city
              }
            },
            purchase_units:[
              {purchasedUnits}
            ]
          })
        },
        //Jos tilaus menee läpi toteutetaan on Approve funktio
        onApprove: async (data, actions) =>{
          //TODO: Julkaise ostoskorin sisältö ordereihin t
          //https://localhost:44344/api/Orders/OrderItem
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
  Paypal,
  MakeShoppingCartItem
}
