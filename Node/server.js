require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {
  refreshTokens, COOKIE_OPTIONS, generateToken, generateRefreshToken,
  getCleanUser, verifyToken, clearTokens, handleResponse,
} = require('./utils');

const app = express();
const port = process.env.PORT || 3100;

const sqlR = require('./db/utils.js');
const sql = require('./db/customerSQL');
const sqlP = require('./db/ProfileSQL');
var hostname = "127.0.0.1";

// importataan reitit
const RegisteringRoutes = require('./private_routes/RegisteringRoutes');
const ProfileRoutes = require('./private_routes/ProfileRoutes');
const StoreRoutes = require('./private_routes/StoreRoutes');
const postManagerRoutes = require('./private_routes/postManagerRoutes');
const PublicStoreRoutes = require('./public_routes/PublicStoreRoutes');


//const cons = require('consolidate');
let ctrlProfile = require('./controllers/ProfileController');
let ctrlStore = require('./controllers/storeController');
let ctrlJobPosts = require('./controllers/postManagerController');

let userList = null;
app.use(async (req, res, next) => {
  //Haetaan käyttäjätunnukset
  //PITÄÄ SELVITTÄÄ ONKO TÄMÄ TURVALLISTA
  let hae = await sql.getTunnukset();
  userList = await hae;
  next();
});

// enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // url of the frontend application
  credentials: true // set credentials true for secure httpOnly cookie
}));
// parse application/json
app.use(bodyParser.json({ limit: '30mb' }));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb', parameterLimit: 50000 }));

// use cookie parser for secure httpOnly cookie
app.use(cookieParser(process.env.COOKIE_SECRET));

//Tähän objektiin tulee käyttäjän tietoja kirjautumisen jälkeen kuten id ja nimi
let userObj = {};


// middleware that checks if JWT token exists and verifies it if it does exist.
// In all private routes, this helps to know if the request is authenticated or not.
const authMiddleware = function (req, res, next) {
  // check header or url parameters or post parameters for token

  var token = req.headers['authorization'];
  if (!token) return handleResponse(req, res, 401);

  token = token.replace('Bearer ', '');

  // get xsrf token from the header
  const xsrfToken = req.headers['x-xsrf-token'];
  if (!xsrfToken) {
    return handleResponse(req, res, 403);
  }

  // verify xsrf token
  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  if (!refreshToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
    return handleResponse(req, res, 401);
  }

  // verify token with secret key and xsrf token
  verifyToken(token, xsrfToken, (err, payload) => {
    if (err)
      return handleResponse(req, res, 401);
    else {
      req.user = payload; //set the user to req so other routes can use it
      next();
    }
  });
}



// validate user credentials
app.post('/users/signin', function (req, res) {
  const user = req.body.username;
  const pwd = req.body.password;

  // return 400 status if username/password is not exist
  if (!user || !pwd) {
    return handleResponse(req, res, 400, null, "Username and Password required.");
  }

  const userData = userList.find(x => x.username === user && x.password === pwd);

  // return 401 status if the credential is not matched
  if (!userData) {
    return handleResponse(req, res, 401, null, "Username or Password is Wrong.");
  }

  // get basic user details
  userObj = getCleanUser(userData);

  // generate access token
  const tokenObj = generateToken(userData);

  // generate refresh token
  const refreshToken = generateRefreshToken(userObj.userId);

  // refresh token list to manage the xsrf token
  refreshTokens[refreshToken] = tokenObj.xsrfToken;

  // set cookies
  res.cookie('refreshToken', refreshToken, COOKIE_OPTIONS);
  res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);

  return handleResponse(req, res, 200, {
    user: userObj,
    token: tokenObj.token,
    expiredAt: tokenObj.expiredAt
  });
});


// handle user logout
app.post('/users/logout', (req, res) => {
  clearTokens(req, res);
  return handleResponse(req, res, 204);
});


// verify the token and return new tokens if it's valid
app.post('/verifyToken', function (req, res) {

  const { signedCookies = {} } = req;
  const { refreshToken } = signedCookies;
  if (!refreshToken) {
    return handleResponse(req, res, 204);
  }

  // verify xsrf token
  const xsrfToken = req.headers['x-xsrf-token'];
  if (!xsrfToken || !(refreshToken in refreshTokens) || refreshTokens[refreshToken] !== xsrfToken) {
    return handleResponse(req, res, 401);
  }

  // verify refresh token
  verifyToken(refreshToken, '', (err, payload) => {
    if (err) {
      return handleResponse(req, res, 401);
    }
    else {
      const userData = userList.find(x => x.userId === payload.userId);
      if (!userData) {
        return handleResponse(req, res, 401);
      }

      // get basic user details
      userObj = getCleanUser(userData);

      // generate access token
      const tokenObj = generateToken(userData);

      // refresh token list to manage the xsrf token
      refreshTokens[refreshToken] = tokenObj.xsrfToken;
      res.cookie('XSRF-TOKEN', tokenObj.xsrfToken);

      // return the token along with user details
      return handleResponse(req, res, 200, {
        user: userObj,
        token: tokenObj.token,
        expiredAt: tokenObj.expiredAt
      });
    }
  });

});


// get list of the users
app.get('/users/getList/:id', authMiddleware, async (req, res) => {
  let id = req.params.id;
  let hae = await sqlR.executeSingleSql("select * from userdata where userId=?", [id]);
  userList = await hae;
  const list = userList.map(x => {
    const user = x;
    delete user.password;
    return user;
  });
  return handleResponse(req, res, 200, { random: Math.random(), userList: list });
});

// Verify user is authenticated to be an seller
// app.get('/users/verify/:userId', authMiddleware, async (req, res) => {
//   let userData = await ctrlProfile.getProfileData(req);

//   //Tee tarvittavat tarkistukset käyttäjälle. jotta tiedetään onko käyttäjä verifikoitu myyjäksi. Jos ei ole ei voida päästää hallinnoimaan/Luomaan ilmoituksia. 
//   //Tämän vois ehkä korvata boolean arvolla user objektissa.
//   if(1 == 0){
//   return true;
//   }
//   else{
//     return false;
//   }

// });


const multer = require('multer');
// handle storage using multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, 'E:/Kesäkanta/YritysKanta/React/sovellus/src/uploads');
    cb(null, 'E:/Kesäkanta/YritysKantaV2/YritysKanta/Node/uploads/images');
  },
  filename: function (req, file, cb) {
    console.log(file);
    cb(null, `${file.fieldname}-${Date.now()}${(file.originalname)}`);
  }
});
var upload = multer({ storage: storage });


// serving static files
// app.use('/uploads', express.static(__dirname+'/uploads'));
app.use(express.static('uploads'));
// app.get('/Kirjautuminen', function (req, res) {
//   res.sendFile('/Kirjautuminen');
// })
// handle single file upload
app.post('/profiles/img/:userId', upload.single('dataFile'), async (req, res, next) => {
  let userId = req.params.userId;
  const file = req.file;

  if (!file ) {
    return res.status(400).send({ msg: 'Please upload a file.' });
  }
  if (file.mimetype != "image/jpeg" &&  file.mimetype != "image/png") {
    console.log('File type was wrong');
    return res.status(400).send({ msg: 'File type was wrong' });
  }
  //Tallentaa kuvan kovakoodatun polun tietokantaan
  let answer = await sqlP.postImgPath([ file.filename, userId]);
  return res.send({ msg: 'File uploaded successfully.', file,answer });
});
//Tämä funktio handlettaa monen kuvatiedoston uploadaamista samaan aikaan
// handle multiple file upload
// app.post('/uploadmultifile', upload.array('dataFiles', 10), (req, res, next) => {
//    const files = req.files;
//    if (!files || (files && files.length === 0)) {
//       return res.status(400).send({ message: 'Please upload a file.' });
//    }
//    return res.send({ message: 'File uploaded successfully.', files });
// });

// const openFile = (req, res, next) => {
//   File.findOne({ _id: req.params.userId,path:req.params.path }, function(err, users) {
//       if (err) {
//           return res.status(400).json({
//               error: errorHandler.getErrorMessage(err)
//           });
//       }
//       console.log(users);
//       console.log(users.path);

//   });
// };

// //route of this controller***
// router.route('/api/openfile/:id')


app.use(RegisteringRoutes);
app.use(PublicStoreRoutes);

//Ne joissa ei tarvitse tarkistusta pitää laittaa ennen autentikointia

//Middleware joka tarkistaa että sisäänkirjautuneen käyttäjän id on sama kuin backendiin lähetetyn pyynnön id
//Tämä estää sen että kukatahansa sisäänkirjautunut käyttäjä voisi muuttaa kenetahansa sisäänkirjautuneen käyttäjän tietoja.
const userIdCheckMiddleWare = function (req, res, next) {

  let userId = null;
  let user = userObj;
  //let userId = req.body.userId;
  

  if (req.body.userId) userId = req.body.userId;
  

  if (userId == undefined || userId == null) {
    userId = req.params.userId;
    
    if (userId == undefined || userId == null) {
      userId = req.body.e;
      
      if (userId == undefined || userId == null) {

        return handleResponse(req, res, 403);
      }
    }
  }
  if (user == {}) {
    return handleResponse(req, res, 403);
  }
  if (user.userId != userId) {
    if (user.userId != userId.userId) {
      return handleResponse(req, res, 403);
    }

    else {
      next();
    }
  }
  else {
    next();
  }
}
//Tänne pitää laittaa kaikki reitit jotka käyttävät parametreja
app.get('/profile/basicInfo/:userId', ctrlProfile.getProfileData);
app.get('/profile/posts/:userId',  ctrlStore.getProfilePosts);
app.get('/store/posts/:jobPostId',  ctrlJobPosts.getJobPost);


app.use(authMiddleware, userIdCheckMiddleWare, StoreRoutes);
app.use(authMiddleware, userIdCheckMiddleWare, postManagerRoutes);
app.use(authMiddleware, userIdCheckMiddleWare, ProfileRoutes);



app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
