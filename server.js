//requirements
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let fs = require('fs');
let app = express();
let multer = require('multer');
//engine being used 
app.set('view engine', 'ejs');
//engine html

let landing = path.join(__dirname, 'views', 'landing');
let index = path.join(__dirname, 'views', 'index');
let signUP = path.join(__dirname, 'views', 'signup');
//file Controls
let imag = path.join(__dirname, 'public', 'images', 'i.jpg')

//connection to database
let { connectToDb, getDb } = require(path.join(__dirname, 'db.js'));
let { ObjectId } = require('mongodb');
//db variable
let db;
//static file
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); //retrive data to database
connectToDb((err) => {
        if (!err) {
            let port = 5000;
            app.listen(port, () => {
                console.log(`app is  on port ${port}`);
            })
            db = getDb();
        }
    })
    //landing page
app.get('/', (req, res) => {
        //res.writeHead(200, { 'content-type': 'text/html' });
        //res.send('welcome')
        res.render(index);
        // res.end()
    }) //creating account page
app.get('/signUP.ejs', (req, res) => {
    res.render(signUP)
})

// 
// multer function working directory
let storageEngine = multer.diskStorage({
    destination: 'public/images',
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
    }
});
//validationSetting
let checkFileType = (file, cb) => {
    //image types
    let fileTypes = /jpeg|jpg|png|gif|svg/;
    let extName = fileTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    let mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extName) {
        return cb(null, true);
    } else {
        cb('error:u can only upload images !!')
    }
}
let upload = multer({
    storage: storageEngine,
    // fileFilter: (req, file, cb) => {
    //     checkFileType(file, cb)
    // }
});
//get user data
app.post('/signUp', upload.single('image'), (req, res) => {
        let file = req.file;
        let path = file.path
        const formData = req.body;
        let userEmail = formData.email;
        console.log(path);
        let collect = {...formData, ...file }
        db.collection('profile')
            .insertOne(collect)
            .then((result) => {


                res.render(landing, {
                    name: userEmail,
                    image: 'jodos'
                })
            })
            .catch((error) => {
                res.status(500).json({ error: error })
            })

    })
    //verification
app.post('/login', (req, res) => {
    let userData = req.body;

    let userEmail = userData.email;
    let userPassword = userData.password;
    // console.log(userEmail, userPassword);
    let dbData = []
    db.collection('profile')
        .find()
        .forEach(profile => {
            if (userEmail === profile.email) {

                dbData.push(profile)

                res.render(landing, { name: userEmail, image: dbData })

                //res.status(200).send(dbData)
            }


        })
})

// app.post('/image', upload.single('image'), (req, res) => {
//     let image = req.file;
//     let path = req.path;
//     // res.render(landing, { database: image });
//     db.collection('userImages')
//         .insertOne(image)
//         .then(() => {
//             res.send('successfull')
//         })
//         .catch(err => {
//             res.send({ err: err })
//         })



// });