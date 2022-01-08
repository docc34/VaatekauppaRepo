insert into userdata (username, password, name) values("Topi", "S@lasana","Topi Tossavainen"); 
insert into userdata (username, password, name) values("docc34", "S@lasana","Eemeli Antikainen"); 

insert into profile (userInfo, gmail, phonenumber, userId,deleted) values("Jee jee", "Eemeli.antikainen@gmail.com","040 928 1728", "1",0);

insert into jobs (profile_userId,workplace, profession, startDate, endDate) values(1,"Koti", "Koodaaja","2020-08-01", "2021-12-30");

insert into education (profile_userId,schoolName, degree, startDate, endDate) values(1,"Lumit lukio", "Ylioppilas","2019-08-01", "2021-06-01");

INSERT INTO jobPost (`idjobPost`,`label`,`priceEstimate`,`hourEstimate`,`description`,`userId`,`deleted`) VALUES (2,'Ruohonleikkuuta','200-300€',2,'Ajan nurmikkosi ruohonleikkurilla.',1,0);
INSERT INTO jobPost (`idjobPost`,`label`,`priceEstimate`,`hourEstimate`,`description`,`userId`,`deleted`) VALUES (3,'Rakennustyötä','1000-3000€',10,'Osaan rakentaa perus puutöitä, vajoja ja laitureita. ',2,0);
INSERT INTO jobPost (`idjobPost`,`label`,`priceEstimate`,`hourEstimate`,`description`,`userId`,`deleted`) VALUES (5,'Koodausta','15000-20000€',100,'Voin tehdä yrityksellesi simppelit SPA nettisivut. ',2,0);
INSERT INTO jobPost (`idjobPost`,`label`,`priceEstimate`,`hourEstimate`,`description`,`userId`,`deleted`) VALUES (6,'Ruohonleikkuuta','200-300€',2,'Ajan nurmikkosi ruohonleikkurilla.',2,0);
INSERT INTO jobPost (`idjobPost`,`label`,`priceEstimate`,`hourEstimate`,`description`,`userId`,`deleted`) VALUES (7,'Ruohonleikkuuta','200-300€',2,'Ajan nurmikkosi ruohonleikkurilla.',1,0);
INSERT INTO jobPost (`idjobPost`,`label`,`priceEstimate`,`hourEstimate`,`description`,`userId`,`deleted`) VALUES (8,'Koodausta','50000€',500,'Teen mitä vaan koodiprojektia seuraavilla kielillä: Javascript, Html5, CSS, C#, MySQL. Kerro vain idea ja palaveerataan kuinka tämä toteutetaan ja sitten tehdään se.',1,0);
INSERT INTO jobPost (`idjobPost`,`label`,`priceEstimate`,`hourEstimate`,`description`,`userId`,`deleted`) VALUES (9,'ddddd','50000€',3,'ddddddd',1,0);
INSERT INTO jobPost (`idjobPost`,`label`,`priceEstimate`,`hourEstimate`,`description`,`userId`,`deleted`) VALUES (10,'aaa','2',11,'Teen mitä vaan koodiprojektia seuraavilla kielillä: Javascript, Html5, CSS, C#, MySQL. Kerro vain idea ja palaveerataan kuinka tämä toteutetaan ja sitten tehdään se.',1,0);
INSERT INTO jobPost (`idjobPost`,`label`,`priceEstimate`,`hourEstimate`,`description`,`userId`,`deleted`) VALUES (11,'aaa','2',11,'Teen mitä vaan koodiprojektia seuraavilla kielillä: Javascript, Html5, CSS, C#, MySQL. Kerro vain idea ja palaveerataan kuinka tämä toteutetaan ja sitten tehdään se.',1,0);
INSERT INTO jobPost (`idjobPost`,`label`,`priceEstimate`,`hourEstimate`,`description`,`userId`,`deleted`) VALUES (12,'aaa','2',11,'Teen mitä vaan koodiprojektia seuraavilla kielillä: Javascript, Html5, CSS, C#, MySQL. Kerro vain idea ja palaveerataan kuinka tämä toteutetaan ja sitten tehdään se.',1,0);
