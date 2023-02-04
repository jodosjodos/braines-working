//requirements:
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let fs = require('fs');
let app = express();

let multer = require('multer');
//engine html 
let landing = path.join(__dirname, 'views', 'landing');
let index = path.join(__dirname, 'views', 'index');
let signUP = path.join(__dirname, 'views', 'signup');

//file Controls
let storage = multer.memoryStorage();
let upload = multer({ storage });
//connection to database
let { connectToDb, getDb } = require(path.join(__dirname, 'db.js'));
let { ObjectId } = require('mongodb');
//const { ppid } = require('process');
//db variable
let db;
//engine being used 
app.set('view engine', 'ejs')
    //static file
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'))

//retrive data to database
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
        res.send('welcome')
            // res.render(index);
            // res.end()
    })
    //creating account page
app.get('/signUP.html', (req, res) => {
    res.render(signUP)
})

//get user data
app.post('/access', (req, res) => {
        const formData = req.body;
        db.collection('profile')
            .insertOne(formData)
            .then((result) => {


                res.render(landing, { database: "welcome jodos" })
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
        console.log(userEmail, userPassword);
        let dbData = []
        db.collection('profile')
            .find()
            .forEach(profile => {
                if (userEmail === profile.email) {

                    dbData.push(profile)
                    res.render(file, { database: 'welcome' })

                    //res.status(200).send(dbData)
                } else {
                    res.status(404).send('user not found')
                }


            })


        // .catch(err => {
        //     res.status(500).json({ err: 'server err' })
        // })




    })
    //saving image of user
app.post('/image', upload.single('image'), (req, res) => {
    // let binaryData = req.file.buffer();
    // let newImage = {
    //     data: new Buffer.from(binaryData).toString('base64'),
    //     contentType: req.file.mimetype
    // }
    let img = req.file;

    db.collection('profile').updateOne(newImage, (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json({ err: result })
    })
})