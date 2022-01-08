select * from kayttajatunnukset;

insert into kayttajatunnukset (Kayttajanimi, Salasana) values("Tessu", "qwerty123");

INSERT INTO tyotehtava (tyotehtava,idSijainti,idAmmattinimike)
VALUES ('anestesialääkäri',1,7);
INSERT INTO tarve (idTyovuoro, idTyotehtava, maara, kiinnittamatonMaara)
VALUES
(1,9,3,0);
select * from tarve;