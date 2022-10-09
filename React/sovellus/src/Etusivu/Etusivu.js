import React, { useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Etusivu.css'


const EtusivuTekstit = () => {

    var titleContainer =  null;

    useEffect(()=>{
        titleContainer =  document.getElementById('EtusivuTitleMainContainerId');
    },[]);
    function fadeOutOnScroll(element) {

        if (element == null) {
            return;
        }
        else{
        var distanceToTop = window.pageYOffset + element.getBoundingClientRect().top;
        var elementHeight = element.offsetHeight;
        var scrollTop = document.documentElement.scrollTop;
        
        var opacity = 1;
        
        if (scrollTop > distanceToTop) {
            opacity = 1 - (scrollTop - distanceToTop) / elementHeight;
        }
        
        if (opacity >= 0) {
            element.style.opacity = opacity;
        }
        }
        
        
    }
    
    function scrollHandler() {
        fadeOutOnScroll(titleContainer);
    }
    
    window.addEventListener('scroll', scrollHandler);

    return (
    <div className='EtusivuMainContainer'>
        <div id="EtusivuTitleMainContainerId" className="EtusivuTitleMainContainer">
            <div className='EtusivuTitleContainer'>
                <h1 className="EtusivuTitleText">Unnamed </h1>
                <h1 className="EtusivuTitleText">by Eemeli Antikainen</h1>
            </div> 
        </div>
        <div  className='EtusivuTextsMainFlexContainer'>
            <div className='EtusivuFlexBox'>

            </div>

            <div className='EtusivuTextsMainContainer'>
                <div>
                    <div className='EtusivuTextsContainer EtusivuTextsContainerType1'>
                        <h4>Projektin tarkoitus</h4>
                        <h4 id='EtusivuDisclaimer'>Projekti on vielä keskeneräinen.</h4>
                        <p> Tyylitykset olen päättänyt tehdä viimesenä joten tällähtekellä sivut näyttävät tältä, mutta toiminnallisuutta on. Jos sivusta tai koodista on mitään kysymyksiä ota yhteyttä eemeli.antikainen@gmail.com</p>
                        <p>Unnamed on minun keksimä fiktiivinen vaatekauppa.</p>
                        <p>Projektin frontti on tehty reactjs:llä. Backend on tehty Asp net core web api sovelluksena C# kielellä. Tietokanta on tehty MySql:lällä.</p>
                    </div>
                </div>
                <div>
                    <div className='EtusivuTextsContainer EtusivuTextsContainerType2'>
                        <h4>Sivun toiminnallisuutta ja teknistä tietoa</h4>
                        <ul>
                            <li>Käyttäjä voi selata tuotteita ja tehdä ostoksia maksaen paypalilla</li>
                            <li>Käyttäjä voi rekisteröidä käyttäjän ja kirjautua sisään, jotta tilaustiedot ja tehdyt tilaukset tallentuisi.</li>
                            <li>Käyttäjä voi tietenkin muokata ja poistaa profiilinsa</li>
                            <li>Admin käyttäjä voi Luoda/muokata/poistaa tuotteita</li>
                        </ul>
                        <p>Tietokannat ja kuvat tallennetaan azuren pilvipalveluihin palvelimelle. Sivut ovat julkaistu azuren pilvipalveluihin halvimmalle koneelle koska olen opiskelija joten latausajat ovat mitä ovat.</p>
                        <p>Käyttäjä voi selailla ja tehdä tilauksia ilman käyttäjää tai luoda käyttäjätilin johon tallentuu yhteystiedot ja tehdyt tilaukset. Salasanankin voi palauttaa ja tilauksista laitetaan gmailia, taitaa tosin mennä nyt roskapostiin koska minulla ei ole luotettua domainia mistä lähetää gmailia.</p>
                        <p>Maksaminen toimii paypalin sandbox ympäristössä. Sivu käyttää keksejä toiminnallisuuksiin.</p>
                        <p>Käyttäjät tallennetaan toistaiseksi kahteen eri tietokantaan. Toiseen tallennetaan tunnukset salattuna ja sitä kautta hallinnoidaan käyttäjien rooleja. Toiseen tallennetaan käyttäjätiedot ilman salasanaa ja kaikki käyttäjään ja sivuihin liittyvä muu data.</p>

                    </div>
                </div>
                <div>
                    <div className='EtusivuTextsContainer EtusivuTextsContainerType1'>
                        <h4>Linkit, liitteet</h4>
                        <p>Kuva pää tietokannasta</p>

                    <img className="EtuSivuImages" src="https://vaatekauppastorage.blob.core.windows.net/ssmaindatabase/ssTietokannasta.PNG"/>
                    <p>Kuva kirjautumis tietokannasta</p>
                    <img className="EtuSivuImages" src="https://vaatekauppastorage.blob.core.windows.net/ssmaindatabase/ssKirjautumiskannasta.PNG"/>
                    </div>
                </div>
                
            </div>
            <div  className='EtusivuFlexBox'></div>
            
        </div>
        

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

