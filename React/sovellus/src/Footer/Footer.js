import React, { useState, useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import './Footer.css'
const Footer = () => {

    return (<div className="Footer-Main-Container" >

        <div className="Footer-header"><h1 className="Footer-Header-Text">Yhteystiedot</h1></div>
        
        <div className="Footer-Text-Container">

            <div className="Footer-Info-Containers" >
                <div>
                    <p>Nimi: </p>
                    <p>Sähköposti: </p>
                    <p>Puhelinnumero: </p>
                </div>
                <div className="Footer-Info-Data">
                    <p>Eemeli Antikainen</p>
                    <p>yrityssähöposti@yritys.fi</p>
                    <p>044 829 1018</p>
                </div>

            </div>
            <div className="Footer-Info-Containers" >
            <div >
                    <p>Nimi: </p>
                    <p>Sähköposti: </p>
                    <p>Puhelinnumero: </p>
                </div>

                <div className="Footer-Info-Data" >
                    <p>Patrick Väisänen</p>
                    <p>yrityssähöposti@yritys.fi</p>
                    <p>040 129 7862</p>
                </div>
            </div>
        </div>

    </div>)
}

export { Footer }