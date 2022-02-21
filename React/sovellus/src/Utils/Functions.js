import './PostCss.css';
import { Image, Card, Row, Col } from 'react-bootstrap';
import { MDBRating } from 'mdbreact';
import React,{useEffect, useRef, useState} from 'react';
import { useCookies } from 'react-cookie';
import moment from 'moment';
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
            var url ="http://localhost:3000/Tuote?id="+e?.id;
            return (<Col>
              <Card className="Post-Card">
                <Card.Body>
                  <Card.Title><a href={url}class="font-weight-bold d-block">{e?.label}</a></Card.Title>
                  <Card.Text className=""> 
                    <div className="ProfileCardTitleContainer">
                      <div>
                      <p>Hinta: {e?.price}€</p>
                      </div>
                    </div>
                  </Card.Text>
                  <img className='ReviewLinkedImage' src={e?.imageLink}/>
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
                        window.location.reload();
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
}
const MakeShoppingCartItem = (p) => {
  const [cookies,setCookie] = useCookies(['token']);
  if(p.data != null && p.data != ""){
    return (
    <div>
      {p.data.map((e, i) => {
        if(p?.shoppingCart == true){
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
        }
        else{
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
                  <div class="d-flex flex-row align-items-center">
                    <span class="d-block">2</span>
                    <span class="d-block ml-5 font-weight-bold">{e?.price}</span>
                    <i class="fa fa-trash-o ml-3 text-black-50"></i> 
                </div>
              </div>  
            </div>
            )
          }
        }
    })
    }
  </div>
  )
}
    else {
      return(<div><p>Loading</p></div>)
    }
}

const FormatDeliveryEstimateToDate = (v)=>{
  if(CheckEmptyFields([v.deliveryDaysEstimateStarting,v.deliveryDaysEstimateEnding]) && v.deliveryDaysEstimateStarting < v.deliveryDaysEstimateEnding){
    var d = new Date();
    var starting = d.setDate(d.getDate() + v.deliveryDaysEstimateStarting);
    var ending = d.setDate(d.getDate() + v.deliveryDaysEstimateEnding);

    starting = moment(starting).format('DD.MM.YYYY');//, HH:mm Jos haluaisi ottaa tunnit ja minuutit käyttöön.
    ending = moment(ending).format('DD.MM.YYYY');

    return starting +"-"+ending
  }
  else{
    return null
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

//Näyttää tälle funktiolle annetun viestin käytän tätä errorien näyttämiseen
const Error = (props) => {
  return (<p className="errorText">{props.message}</p>)
}

const handleInputChange = (o)=>{
  if(o.target.value == null  || o.target.value == ""|| o.target.value == 0){
    o.target.setAttribute('style','border-color: #8f37aa; border-width: 2px')
    return null;
  }
  else{
    o.target.setAttribute('style','')
    return o.target.value;
  }
}

//Can also check objects but dosent tell what fields failed
const CheckEmptyFields = ( tarkistettavatTiedot)=>{
  let tarkistusStatus = true;
  //Object.values(obj) returns the objects values in an array
  //Tarkistaa onko tiedot tyhjiä ja palauttaa mitkä kentät on tyhjiä 
  try{
    tarkistettavatTiedot.map((e, i) => {
      if(typeof(e) == 'object'){
        Object.values(e).map((oe, oi) => {
          if (oe == null  || oe == "") {
            tarkistusStatus = false
          }
        });
      } 
      else{
        if (e == null || e == "") {
          tarkistusStatus = false
        }
      }
    });
    return tarkistusStatus
  }catch(e){
    console.log(e);
  }
  
}

// const CheckEmptyFieldsWithMessage = (tarkistusKentat, tarkistettavatTiedot)=>{

//   let tarkistusStatus = { status: true, kentat: "" };
//   let l = 0;
//   //Object.values(obj)

//   //Tarkistaa onko tiedot tyhjiä ja palauttaa mitkä kentät on tyhjiä
//   tarkistettavatTiedot.map((e, i) => {
//     if(typeof(e) == 'object'){
//       Object.values(e).map((oe, oi) => {
//         if (oe == null && l == 0 || oe == "" && l == 0) {
//           l++;
//           tarkistusStatus = { status: false, kentat: "Seuraavat kentät puuttuvat: "+ tarkistusKentat[i] }
//         }
//         else if(oe == null && l == 1 || oe == "" && l == 1){
//           tarkistusStatus = { status: false, kentat: tarkistusStatus.kentat + "," + tarkistusKentat[i] }
//         }
//       });
//     }
//       if (e == null && l == 0 || e == "" && l == 0) {
//           l++;
//           tarkistusStatus = { status: false, kentat: "Seuraavat kentät puuttuvat: "+ tarkistusKentat[i] }
//       }
//        else if(e == null && l == 1 || e == "" && l == 1){
      
//           tarkistusStatus = { status: false, kentat: tarkistusStatus.kentat + "," + tarkistusKentat[i] }
//       }

//   });
//   return tarkistusStatus
// }

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
    useEffect(()=>{
      //Luodaan napille funktiot
      if(o.posts != "" && user != ""&& user != null){
        window.paypal.Buttons({
          //Luodaan tilaus
          createOrder: (data, actions, error) =>{
            console.log(o.posts);
            console.log(user);
            if(o.posts != "" && user != ""&& user != null){
            var i = {
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
              purchase_units:
                o.posts.map((e,i)=>{
                  console.log(e);
                  return({
                    description: e.description,
                    reference_id: e.id,
                    amount: {
                      currency_code:"EUR",
                      value: e.price
                      //, breakdown:{
                      //   tax_total:{
                      //     currency_code:"EUR",
                      //     value: e.tax
                      //   },
                      //   discount:{
                      //     currency_code:"EUR",
                      //     value: e?.discount
                      //   }
                      // }
                    }
                  })
                })
                // TODO määritä shipping asetukset
              // ,application_context: {
              //   shipping_preference: 'NO_SHIPPING' 
              //   }
            };
            console.log(o.posts);
            console.log(i);
            return actions.order.create(i)
            }
            else{
              return null;
            }
          },
          //Jos tilaus menee läpi toteutetaan on Approve funktio
          onApprove: async (data, actions) =>{
            //TODO: Julkaise ostoskorin sisältö ordereihin t
            //https://localhost:44344/api/Orders/OrderItem
            const order = await (actions.order.capture()) 
            console.log(order);
            o.recieveOrder(order);
          },
          //Jos tilaus kaatuu tehdään onError funktio
          onError: (err) =>{
            console.log(err);
          }
          
        }).render(paypal.current)
      }
    },[user]);

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
  MakeShoppingCartItem,
  FormatDeliveryEstimateToDate,
  handleInputChange
}
