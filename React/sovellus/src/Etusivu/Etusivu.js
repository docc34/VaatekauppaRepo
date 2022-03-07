import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Etusivu.css'


const EtusivuTekstit = () => {
    return (
    <div>
        <h1>Unnamed</h1>
        <p>Unnamed on minun keksimä fiktiivinen vaatekauppa. Sivuilla voit ostaa vaatteita laajasta valikoimastamme</p>
        <p>Unnamed sivuilla voit luoda käyttäjän jonka kautta voit seurata tilauksiasi. Kukaan ei oikeasti käsittele tilauksia ja päivitä niiden tilaa mutta se olisi mahdollista.</p>
        <div className="flex-etusivu-container">
            <div className="flex-etusivu-tekstiloota-Vasen">
                <a href="/Rekisteroityminen" className="etusivu-muotoilu-otsikot"><img src="https://vaatekauppastorage.blob.core.windows.net/defaultkuvat/mrWorldwide.jpg" className="etusivu-muotoilu-Kuvat"></img></a>
                <p className="etusivu-muotoilu-tekstit">Jos haluat tehdä työilmoituksia sinun pitää rekisteröityä</p>
            </div>
            <div className="flex-etusivu-tekstiloota-Oikea">
                <a href="/Kauppa" className="etusivu-muotoilu-otsikot"><img src="https://vaatekauppastorage.blob.core.windows.net/defaultkuvat/mrWorldwide.jpg" className="etusivu-muotoilu-Kuvat"></img></a>

                <p className="etusivu-muotoilu-tekstit">Jos haluat etsiä työntekijöitä selaile kauppasivua</p>
            </div>
        </div>
    </div>
        
        )
}

export { EtusivuTekstit }

