import React, { useEffect,useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

// import { useSelector, useDispatch } from 'react-redux';
import './App.css'
import { useCookies } from 'react-cookie';

//import { verifyTokenAsync } from './asyncActions/authAsyncActions';
import { EtusivuTekstit } from './Etusivu/Etusivu';
import { HeaderPublic } from './Header/HeaderPublic';
import { HeaderPrivate } from './Header/HeaderPrivate';

import { Footer } from './Footer/Footer';
import { Rekisteroityminen } from './Rekisteroityminen/Rekisteroityminen'
import { Profiili } from './Profiili/Profiili';
import { ProfiiliMuokkaus } from './Profiili/ProfiiliMuokkaus';

import { Store } from './Kauppa/Store';
import { ProfilePublic } from './Profiili/ProfiiliPublic';

import { PostManager } from './postManager/jobPostManager';
import {PaymentPage} from './Payment/PaymentPage';
//Tää tiedosto renderöidään index.js:ssä. 
//Täällä hoidetaan sivun reititys 
//Kaikille sivuille renderöidään footer ja joko julkinen tai yksityinen header
function App() {
  const [cookies] = useCookies(['token']);
  const [state, setState] = useState();
  
  useEffect(async()=>{
    if(cookies.token!= "" && cookies.token != null ){
      const options = {
        method: 'GET',
        headers: {"Authorization": `Bearer ${cookies.token}`}
      }

      try{ let validation = await fetch("https://localhost:44344/api/authenticate/validatetoken", options)
        let data = await validation.json();
      
        if( data == true){
        setState(true);
        }
        else{
        setState(false);
        }
      }
      catch{
        setState(false);
      }
    }
  },[cookies?.token]);

  const checkToken = ()=>{
    if(state == true ){
      return(
      <div>
        <nav className="header">
          <Routes>
            <Route path="/*" element={<HeaderPrivate />} />
          </Routes>
        </nav>

        <div className="content">
          <Routes>
            <Route path="/" element={<EtusivuTekstit />} />
            <Route path="/Kauppa" element={<Store />}/>
            <Route path="/Maksu" element={<PaymentPage />} />
            <Route path="/ProfiiliPublic" element={<ProfilePublic />}/>
            <Route path="/Profiili" element={<Profiili />}/>
            <Route path="/ProfiiliMuokkaus" element={<ProfiiliMuokkaus />}/>
            <Route path="/Maksu" element={<PaymentPage />}/>
            <Route path="/Julkaisut" element={<PostManager />}/>
          </Routes>
        </div>

        <footer className="footer">
          <Routes>
            <Route path="/" element={<Footer />} />
          </Routes>
        </footer>
      </div>
    )
    }
    else{
      return (
      <div>
        <nav className="header">
          <Routes>
            <Route path="/*" element={<HeaderPublic />} />
          </Routes>
        </nav>
        <div className="content">
        <Routes>
          <Route path="/" element={<EtusivuTekstit />} />
          <Route path="/Kauppa" element={<Store />}/>
          <Route path="/Maksu" element={<PaymentPage />} />
          <Route path="/Rekisteroityminen" element={<Rekisteroityminen />}/>
        </Routes>
        </div>
        <footer className="footer">
          <Routes>
            <Route path="/*" element={<Footer />} />
          </Routes>
        </footer>
      </div>
      );
    }
  }



return (
  <Router>
    {checkToken()}
  </Router>
);
}

export default App;