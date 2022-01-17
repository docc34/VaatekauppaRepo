insert into tax (taxPercentage) values (24);
insert into tax (taxPercentage) values (14);
insert into tax (taxPercentage) values (10);
insert into tax (taxPercentage) values (0);

insert into size (size) values("XS");
insert into size (size) values("S");
insert into size (size) values("M");
insert into size (size) values("L");
insert into size (size) values("XL");
insert into size (size) values("XXL");
insert into size (size) values("XXXL");

insert into color (color) values("White");
insert into color (color) values("Black");
insert into color (color) values("Green");
insert into color (color) values("Blue");
insert into color (color) values("Red");
insert into color (color) values("Yellow");
insert into color (color) values("Fuchsia");
insert into color (color) values("Silver");
insert into color (color) values("Gray");
insert into color (color) values("Olive");
insert into color (color) values("Purple");
insert into color (color) values("Maroon");
insert into color (color) values("Aqua");
insert into color (color) values("Lime");
insert into color (color) values("Teal");
insert into color (color) values("Navy");

insert into province (provinceName) values("Pirkanmaan_maakunta");
insert into province (provinceName) values("Uudenmaan_maakunta");
insert into province (provinceName) values("Pohjois-Pohjanmaan_maakunta");
insert into province (provinceName) values("Kymenlaakson_maakunta");
insert into province (provinceName) values("Satakunnan_maakunta");
insert into province (provinceName) values("Pohjois-Savon_maakunta");
insert into province (provinceName) values("Pohjois-Karjalan_maakunta");
insert into province (provinceName) values("Keski-Suomen_maakunta");
insert into province (provinceName) values("Varsinais-Suomen_maakunta");
insert into province (provinceName) values("Kainuun_maakunta");
insert into province (provinceName) values("Keski-Pohjanmaan_maakunta");
insert into province (provinceName) values("Pohjanmaan_maakunta");
insert into province (provinceName) values("Lapin_maakunta");
insert into province (provinceName) values("Ahvenanmaan_maakunta");

insert into city (cityName) values("");
insert into province (provinceName) values("");

insert into user (email,username,password,firstName,lastName,phonenumber,created,lastLogin,deleted,admin) values ("eemeli.antikainen@gmail.com","Eemeli","", "Eemeli","Antikainen","0409606973",'2022-10-1 18:00:00','2022-10-1 18:00:00',0,1);

insert into Location (userId,city,address,postalCode) values (1,"Kuopio","Presidentinkatu 5", "70400");

insert into post (label,price,description,sleeveLength,material,discount,length,deleted,deliveryDaysEstimateStarting,deliveryDaysEstimateEnding,colorId,sizeId,taxId,userId) values ("T-Paita",25.50,"Perus t-paita täysin musta","10cm","Villa, Muovi","20","80cm",0,3,10,1,3,1,1);
insert into post (label,price,description,sleeveLength,material,length,deleted,deliveryDaysEstimateStarting,deliveryDaysEstimateEnding,colorId,sizeId,taxId,userId) values ("T-Paita",26.00,"Perus hyvä t-paita","10cm","Villa","80cm",0,3,10,2,3,1,1);
insert into post (label,price,description,sleeveLength,material,length,deleted,deliveryDaysEstimateStarting,deliveryDaysEstimateEnding,colorId,sizeId,taxId,userId) values ("Huppari",50,"Pehmee lämmin tyylikäs huppari","50cm","Villa","120cm",0,5,15,4,4,1,1);
insert into post (label,price,description,sleeveLength,material,discount,length,deleted,deliveryDaysEstimateStarting,deliveryDaysEstimateEnding,colorId,sizeId,taxId,userId) values ("Tiukat housut",15,"Tiukat mustat spandex housut","50cm","Spandex","20","120cm",0,1,3,1,1,1,1);