import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Etusivu.css'


const EtusivuTekstit = () => {
    return (
    <div className='EtusivuMainContainer'>
        <h1>Unnamed by Eemeli Antikainen</h1>
        <h4>Projekti on vielä keskeneräinen. Tyylitykset olen päättänyt tehdä viimesenä joten tällähtekellä sivut näyttävät tältä, mutta toiminnallisuutta on. Jos sivusta tai koodista on mitään kysymyksiä ota yhteyttä eemeli.antikainen@gmail.com</h4>
        
        <p>Unnamed on minun keksimä fiktiivinen vaatekauppa.</p>
        <p>Projektin frontti on tehty reactjs:llä. Backend on tehty Asp net core web api sovelluksena C# kielellä. Tietokanta on tehty MySql:lällä.</p>
        <p>Tietokannat ja kuvat tallennetaan azuren pilvipalveluihin palvelimelle. Sivut ovat julkaistu azuren pilvipalveluihin halvimmalle koneelle koska olen opiskelija joten latausajat ovat mitä ovat.</p>
        <p>Käyttäjä voi selailla ja tehdä tilauksia ilman käyttäjää tai luoda käyttäjätilin johon tallentuu yhteystiedot ja tehdyt tilaukset. Salasanankin voi palauttaa ja tilauksista laitetaan gmailia, taitaa tosin mennä nyt roskapostiin koska minulla ei ole luotettua domainia mistä lähetää gmailia.</p>
        <p>Maksaminen toimii paypalin sandbox ympäristössä. Sivu käyttää keksejä toiminnallisuuksiin.</p>
        <p>Käyttäjät tallennetaan toistaiseksi kahteen eri tietokantaan. Toiseen tallennetaan tunnukset salattuna ja sitä kautta hallinnoidaan käyttäjien rooleja. Toiseen tallennetaan käyttäjätiedot ilman salasanaa ja kaikki käyttäjään ja sivuihin liittyvä muu data.</p>
        <p>Kuva pää tietokannasta</p>
        <img src="https://vaatekauppastorage.blob.core.windows.net/ssmaindatabase/ssTietokannasta.PNG"/>
        <p>Kuva kirjautumis tietokannasta</p>
        <img src="https://vaatekauppastorage.blob.core.windows.net/ssmaindatabase/ssKirjautumiskannasta.PNG"/>
        {/* <div className="flex-etusivu-container">
            <div className="flex-etusivu-tekstiloota-Vasen">
                <a href="/Rekisteroityminen" className="etusivu-muotoilu-otsikot"><img src="https://vaatekauppastorage.blob.core.windows.net/defaultkuvat/mrWorldwide.jpg" className="etusivu-muotoilu-Kuvat"></img></a>
                <p className="etusivu-muotoilu-tekstit">Jos haluat tehdä työilmoituksia sinun pitää rekisteröityä</p>
            </div>
            <div className="flex-etusivu-tekstiloota-Oikea">
                <a href="/Kauppa" className="etusivu-muotoilu-otsikot"><img src="https://vaatekauppastorage.blob.core.windows.net/defaultkuvat/mrWorldwide.jpg" className="etusivu-muotoilu-Kuvat"></img></a>

                <p className="etusivu-muotoilu-tekstit">Jos haluat etsiä työntekijöitä selaile kauppasivua</p>
            </div>
        </div> */}
    </div>
        
        )
}

export { EtusivuTekstit }

