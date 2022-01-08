import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
//import { Route, Link, BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import store from './store';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; import
'bootstrap-css-only/css/bootstrap.min.css'; 
import 'mdbreact/dist/css/mdb.css';
/*import reportWebVitals from './reportWebVitals';
import {EtusivuTekstit, Header} from './Etusivu/Etusivu';
import {Footer} from './Footer/Footer';
import {Kirjautuminen} from './Kirjautuminen/Kirjautuminen'
import {Dashboard} from './KirjautuminenTesti';
import PrivateRoute from './Utils/PrivateRoute';
import PublicRoute from './Utils/PublicRoute';
const routs = (
   
  < Router >
     <div>
     <Route path="/" component={  Header } />
     <Route  path="/Kotisivu" component={  EtusivuTekstit } />
     
        <PublicRoute  path="/Kirjautuminen" component={ Kirjautuminen } />
        <PrivateRoute  path="/dashboard" component={ Dashboard } />
        <Route path="/" component={  Footer } />
     </div>
  </ Router >
);
ReactDOM.render(
 /* <React.StrictMode>
    <Header />
    <EtusivuTekstit/>
    <Footer/>
  </React.StrictMode>,
  routs,document.getElementById('root')
);*/
//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(
   <React.StrictMode>
     <Provider store={store}>
       <App />
     </Provider>
   </React.StrictMode>,
   document.getElementById('root')
 );

