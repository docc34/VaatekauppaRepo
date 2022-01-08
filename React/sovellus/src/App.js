import React, { useEffect } from 'react';
import { BrowserRouter, Switch, NavLink, Redirect, Route } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './App.css'

import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';

import { verifyTokenAsync } from './asyncActions/authAsyncActions';
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
  const authObj = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const {user, authLoading, isAuthenticated } = authObj;

  // verify token on app load
  useEffect(() => {
    dispatch(verifyTokenAsync());
  }, []);

  // checking authentication
  if (authLoading) {
    return <div className="content">Checking Authentication...</div>
  }

  //Tarkistaa kumpaa headeria tulee käyttää
  const Tarkista = () => {
    if (isAuthenticated == false) {
      return (<Route path="/" component={HeaderPublic} />)
    }
    else if (isAuthenticated == true) {
      return (<Route path="/" component={HeaderPrivate} />)
    }
    else {
      return (null)
    }
  }
  
  const checkIfUserIsSeller = ()=>{
    if(user?.isSeller == 1){
      return(<PrivateRoute path="/Tyoilmoitukset" component={PostManager} isAuthenticated={isAuthenticated} />)
    }
    else{
      return(null)
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
          <nav className="header">
            {Tarkista()}
          </nav>
          <div className="content">
            <Switch>
              <Route exact path="/" component={EtusivuTekstit} />
              {/* {checkStore()} */}
              <Route path="/Kauppa" component={Store}/>
              <PublicRoute path="/Maksu" component={PaymentPage} />
              
              <Route path="/ProfiiliPublic" component={ProfilePublic} isAuthenticated={isAuthenticated} />
              
              
              <PublicRoute path="/Rekisteroityminen" component={Rekisteroityminen} isAuthenticated={isAuthenticated} />
              
              <PrivateRoute path="/Profiili" component={Profiili} isAuthenticated={isAuthenticated} />
              {checkIfUserIsSeller()}

              <PrivateRoute path="/ProfiiliMuokkaus" component={ProfiiliMuokkaus} isAuthenticated={isAuthenticated} />
              <PrivateRoute path="/Maksu" component={PaymentPage} isAuthenticated={isAuthenticated} />
              {/* Ois siisti saaha profiili linkin klikkaus uudelleenohjaamaan kirjautumiseen */}
              <Redirect to={isAuthenticated ? '/Profiili' : '/'} />
            </Switch>
          </div>
          <div className="Footer">
            <Route path="/" component={Footer} />
          </div>
        
      </BrowserRouter>
    </div>
  );
}

export default App;