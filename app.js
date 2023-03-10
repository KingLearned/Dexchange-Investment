const express = require('express')
const app = express()
const fs = require('fs')
const PATH = require('path')
const bodyparser = require('body-parser')
const CORS = require('cors')
const BCRYPT = require('bcrypt')
const JOI = require('joi') 
const MD5 = require('md5')
const session = require('express-session')
const UUID = require('uuid')
const MULTER = require('multer')
const PORT = process.env.PORT || 4400
const authenticated = require('speakeasy')
const MAILER = require('nodemailer')
const TWILIO = require('twilio')
const dotenv = require('dotenv')
const socket = require('socket.io')
dotenv.config()

// ###################### Serving Static Files ###########################
app.use(express.static(PATH.join(__dirname, './Public')))
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())


const expDate = 1000 * 60 * 60 * 24 * 7
app.use(session({
        name: "Dexchang_Session_1WKDph6mi3n6cpruyKzvGu0PON1mmbSjPqRqfUVO8tj9PAU5rxpE3X5rAG3UK9P8q4mQghsMuW9xqbxOIViJ2h2",
        secret: UUID.v4(),
        resave: false,
        saveUninitialized: process.env.NODE_ENV === "production",
        cookie: {
            httpOnly: process.env.NODE_ENV === "production" ? false : true,
            maxAge: expDate, 
            secure: false,
            sameSite: true //'strict'
        }
}))

//**************    IMPORTED MODULES    **************//
const MYSQL = require('./MODULES/Conn')
const { AccountGet, AccountPost } = require('./MODULES/useraccount')
const { DepositGet, DepositPost } = require('./MODULES/Deposit')
const ROI = require('./MODULES/Interest')
const PWDapi = require('./MODULES/pwdreset')

//************** CONSTUME MIDDLE-WARES **************//
const UserLoggedIn = (req, res, next) => {
    if(req.session.client){
        res.redirect('/')
    }else{
        next()
    }
}
const UserOut = (req, res, next) => {
    if(req.session.ForgotPassword){
        next()
    }else if(!req.session.client){
        res.redirect('/login')
    }else{
        next()
    }
}
const SetupCheck = (req, res, next) => {
    const {client}  = req.session

    const query = "SELECT * FROM `users` WHERE `username`=?"
    MYSQL.query(query, [client], (err, result) => {
        if(result[0].setup_status !== 'Done'){
            res.redirect('/Account-Setup')
        }else{
            next()
        }
    })
}
const SetupOff = (req, res, next) => {
    if(req.session.client){
        const {client}  = req.session
        const query = "SELECT * FROM `users` WHERE `username`=?"
        MYSQL.query(query, [client], (err, result) => {
            if(result[0].setup_status == 'Done'){
                res.redirect('/')
            }else{
                next()
            }
        })
    }else if(!req.session.client){
        res.redirect('/')
    }else{
        next()
    }
}
const PassCheck = (req, res, next) => {
    if(req.session.PassLink == null){
        res.redirect('/')
    }else{
        next()
    }
}
const Logout = (req, res, next) => {
    if(!req.session.client){
        res.redirect('/')
    }else{
        next()
    }
} 

app.get('/LogOut-Client', Logout, (req, res) =>{
    req.session.destroy(() => {
        "Dexchange_Session_1WKDph6mi3n6cpruyKzvGu0PON1mmbSjPqRqfUVO8tj9PAU5rxpE3X5rAG3UK9P8q4mQghsMuW9xqbxOIViJ2h2"
    })
    res.redirect('/')
})

//********************      CONTACT     ********************//
app.get('/contact', (req,res) =>{res.sendFile(PATH.join(__dirname, './Public/pages/contact.html'))})
//********************      ABOUT US    ********************//
app.get('/about-us', (req,res) =>{res.sendFile(PATH.join(__dirname, './Public/pages/about-us.html'))})

//********************      LANDING PAGE        ********************//
app.get('/', (req,res) =>{
    const {client}  = req.session
    const dynoRoute = client ? ['/Client-Account','DASHBOARD','/LogOut-Client','LOGOUT'] : ['/login','LOGIN','/signup','SIGNUP']

    const SiteHome =`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="icon" type="images/x-icon" href="../images/icons/x-icon.png">
        <link rel="stylesheet" href="../styles/fontawesome-free-5.13.0-web/css/all.css">
        <link rel="icon" type="image/x-icon" href="./images/x-icon.png">
        <link rel="stylesheet" href="../styles/css/main.css">
        <link rel="stylesheet" href="../styles/css/query.css">
        <script type="text/javascript" src="../js/jquery.min.js"></script>
        <title>De Xchange</title>
    </head>
    <body>
    <div class="big-container" id="home">
        <div class="top-menu">
            <div class="logo-cover">
                <img src="../images/icons/logo.png" alt="">
            </div>
            <div class="nav-cover">
                <span><a href="#home">HOME</a></span>
                <span><a href="#about">ABOUT</a></span>
                <span><a href="">FAQ</a></span>
                <span><a href="/contact">CONTACT</a></span>
                <span><a href="">TERMS</a></span>
                <span><a href="${dynoRoute[0]}">${dynoRoute[1]}</a></span>
                <span><a href="${dynoRoute[2]}">${dynoRoute[3]}</a></span>
            </div>
            <button onclick="Toggle()">III</button>
        </div>
        <div class="bg-slide">
            <div class="blend"></div>
            <div class="pix-slide3 pix-img">
                <img src="../images/bg-slide/slide2.jpg" alt="">
            </div>
            <div class="pix-slide2 pix-img">
                <img src="../images/bg-slide/slide3.jpg" alt="">
            </div>
            <div class="pix-slide1 pix-img">
                <img src="../images/bg-slide/slide1.jpg" alt="">
            </div>
            <div class="slide-content">
                <h1>BEST BITCOIN <br> <span style="color: rgb(23, 230, 245);">INVESTMENT PLATFORM</span></h1>
            </div>
            <a href="#plan">GET STARTED</a>
        </div>

        <div class="intro">
            <h1>WE BELIEVE IN TRANSPARENCY</h1>

            <div class="intro-content">
                <div>
                    <img src="../images/icons/fairer-societies.png" alt="">
                    <h3>TRANSPARENT</h3>
                </div>
                <div>
                    <img src="../images/icons/empower-communities.png" alt="">
                    <h3>SAFE & SECURE</h3>
                </div>
                <div>
                    <img src="../images/icons/protect-planet.png" alt="">
                    <h3>PROFITABLE</h3>
                </DIV>
            </div>
        </div>

        <div class="we_do">
            <h1>WHAT WE DO & HOW IT WORKS</h1>
            <div class="content">
                <div>
                    <h2>WHAT WE DO</h2>
                    <p>We are a team of seasoned, successful veteran traders with over a decade of experience trading. 
                        Through out the years, we revolutionized Trading for thousands of traders, using our own statistical trading methods combining both fundamental & technical analysis. 
                        We analyze the markets 24/7, observe the world economy, and provide accurate trading plans every day.
                        Our goal is to deliver an unparalleled trading experience providing our clients with services that offer the most competitive trading conditions available in the market..
                    </p>
                </div>
                <div>
                    <h2>HOW IT WORKS</h2>
                    <p>At De-Xchange, we thrive to provide high-performance market analysis and accurate trading plans.
                        Our professional traders relentlessly analyze the markets 24/7 searching for the best trading opportunities.
                        Any of your deposit will run on a regular basis and bring profit of each calendar day.
                    </p>
                </div>
            </div>
        </div>

        <div class="steps">
            <h3>Safe And Secured Bitcoin Profit</h3>
            <h1>EARN IN SIMPLE STEPS!</h1>
            <div class="content">
                <div>
                    <h2>CREATE YOUR ACCOUNT</h2>
                    <p>Go to account registration sectionand fill a simple form that is needed to successfully complete your resgistration.</p>
                </div>
                <div>
                    <h2>MAKE A DEPOSITE</h2>
                    <p>Make a deposit to any of the 3 trading packages.</p>
                </div>
                <div>
                    <h2>PROFIT</h2>
                    <p>Make consistently huge profit and highly impressive returns with low-risk trading.</p>
                </div>
            </div>
        </div>

        <div class="about" id="about">
            <div>
                <img src="../images/bg-slide/bg-laptop.png" alt="about-image">
            </div>
            <div>
                <h1>ABOUT DE-XCHANGE</h1>
                <p>De-Xchange.org makes the trader of more than 40 encrypted currencies in world brokers (poliniex and others)
                    with strategies and a lot of responsibility, using high technology and advanced tools, monitored through a 
                    chart of a team of traders professional and experienced in this market, and thus have a very high profitability success.
                </p>
                <p>
                    A community founded to revolutionize the market of crypto-traders, inserted in this billionaire market, competitive and few 
                    people have access to. Trading through a team of professionals trader specialists, comes with an opportunity for anyone to produce 
                    results in this digital currency market. Be our partner by trading with us and get percentage return on trade. We keep your Principal safe and your profit is assured.
                </p>
            </div>
        </div>

        <div class="trade">   
            <h3>We're the best ever!</h3>
            <h1>WHY INVESTORS CHOOSE US</h1>

            <div class="content">
                <div>
                    <h4>INSTANT ACCOUNT</h4>
                    <p>Set up your account within seconds with De-Xchange.org, purchase a plan and start making your profits</p>
                </div>

                <div>
                    <h4>INSTANT WITHDRAWAL</h4>
                    <p>Withdrawals from De-Xchange.org wallet are sent to your external wallet instantly from the time of your withdrawal.</p>
                </div>
            
                <div>
                    <h4>DETAILED STATISTICS</h4>
                    <p>Get detailed statistics of your<br> plans purchased with De-Xchange.org and the daily returns you are getting from them.</p>
                </div>
            
                <div>
                    <h4>Traders Planning</h4>
                    <p>Your Principal multiplies with De-Xchange.org, withdraw your profits whenever you want or purchase more plans from them.</p>
                </div>
            
                <div>
                    <h4>SAVE YOUR TIME & MONEY</h4>
                    <p>You don’t need to spend hours on charts and analysis. We are constantly monitoring the market for you. With our years of expertise, you’ll be able to save trade loss and make money from the beginning. </p>
                </div>
            
                <div>
                    <h4>FAST CUSTOMER SUPPORT</h4>
                    <p>We provide 24/7 support</p>
                </div>
            </div>   
        </div>

        <div class="stat">
            <article class="row-1">
                <img src="../images/icons/rocket.png" alt="rocket" class="anim_img">
            </article>
            <article class="row-2">
                <h1>LIVE STATISTICS</h1>
                <div class="content">
                    <div>
                        <h2>12,000</h2>
                        <h3>Total Investors</h3>
                    </div>
                    <div>
                        <h2>45,100</h2>
                        <h3>Total Deposits</h3>
                    </div>
                    <div>
                        <h2>37,568</h2>
                        <h3>Total Withdrawals</h3>
                    </div>
                    <div>
                        <h2>1,375</h2>
                        <h3>Running Days</h3>
                    </div>
                </div>
            </article>
        </div>

        <div class="plan" id="plan">
            <h1>PICK A PLAN</h1>
            <div class="content">
                <div>
                    <h2>BASIC PACK 20%</h2>
                    <h3>Min - 50$</h3>
                    <h4><i class="fa fa-angle-down"></i></h4>
                    <h3>Max - 5,000$</h3>
                    <h4><i class="fa fa-angle-down"></i></h4>
                    <h3>5% Referral Bonus</h3>
                    <h3>After 2 Days</h3>
                    <h2 class="select"><a href="/Client-Account">SELECT</a></h2>
                </div>
                <div>
                    <h2>STANDARD PACK 45%</h2>
                    <h3>Min - 6,000$</h3>
                    <h4><i class="fa fa-angle-down"></i></h4>
                    <h3>Max - 20,000$</h3>
                    <h4><i class="fa fa-angle-down"></i></h4>
                    <h3>5% Referral Bonus</h3>
                    <h3>After 4 Days</h3>
                    <h2 class="select"><a href="/Client-Account">SELECT</a></h2>
                </div>
                <div>
                    <h2>PROFESSIONAL PACK 70%</h2>
                    <h3>Min - 20,000$</h3>
                    <h4><i class="fa fa-angle-down"></i></h4>
                    <h3>Max - 50,000$</h3>
                    <h4><i class="fa fa-angle-down"></i></h4>
                    <h3>5% Referral Bonus</h3>
                    <h3>After 6 Days</h3>
                    <h2 class="select"><a href="/Client-Account">SELECT</a></h2>
                </div>
            </div>
        </div>

        <div class="footer_side">
            <h1><span style="border-bottom: 3px solid skyblue;">DE-XC</span>HANGE</h1>
            <div class="col-1">
                <div>
                    <h2>ADDRESS:</h2>
                    <p>wroclaw Poland, 507-123</p>
                </div>
                <div>
                    <h2>EMAIL:</h2>
                    <p>info@dexchange.org</p>
                </div>
                <div>
                    <h2>TELE:</h2>
                    <p>+157-125-102 <br> +157-967-038</p>
                </div>
            </div>
            <div class="col-2"></div>
            <h6 class="copywrite">© 2022 De-Xchange.org. All Rights Reserved.</h6>
        </div>
    </div>
    <script type="text/javascript" src="../js/helper.js"></script>
    <script type="text/javascript" src="../js/slideShow.js"></script>
    </body>
    </html>
    `
    res.send(SiteHome)
    // res.sendFile(PATH.join(__dirname, './Public/pages/index.html'))  
})

//**************************    LOGIN (APP GET) **************************//
app.get('/login', UserLoggedIn, (req,res) =>{res.sendFile(PATH.join(__dirname, './Public/pages/login.html'))})

app.post('/login', UserLoggedIn, (req,res) =>{
    const { User_Name, User_Pwd } = req.body
    if(User_Name, User_Pwd){
        const query = "SELECT * FROM `users` WHERE `username`=?"
        MYSQL.query(query, [User_Name],(err, result) => {
            if(result.length > 0){
                if((User_Name.toLocaleLowerCase() == result[0].username.toLocaleLowerCase()) && (User_Pwd == result[0].user_pwd)){
                    req.session.client = result[0].username
                    res.json({login: 'Success'})
                }else{
                    res.json({ErrMsgP: 'Invalid password or username!', PassLink: 'redirecting...'})
                }

            }else{
                res.json({ErrMsg: 'User dose not exist!'})
            }
        })
    }

    function GeneLink(){
        var text =''
        var possible="abcde-fghijkmnopqrstuvwxyz"
        for (let i=0; i<201; i++){
        text += possible.charAt(Math.floor(Math.random()*possible.length))
        }
        req.session.PassLink = text
    }GeneLink()
    
})
//**************************    SIGNUP (APP GET)    **************************//
app.get('/signup', UserLoggedIn, (req,res) =>{res.sendFile(PATH.join(__dirname, './Public/pages/sign-up.html'))})

app.post('/signup', UserLoggedIn, (req, res) =>{
    const {username, email, pwd, cpwd} = req.body

    if(username, email, pwd, cpwd){
        if (pwd == cpwd){
            const query = "INSERT INTO `users`(`username`, `email`, `user_pwd`, `balance`, `current_earn`, `total_earn`) VALUES(?, ?, ?, ?, ?, ?)"
            MYSQL.query(query, [username, email, pwd, '0', '0', '0'], (err, result) =>{
                if (err == `Error: ER_DUP_ENTRY: Duplicate entry '${username}' for key 'username'`){
                    res.json({errMsg: "username already registered"})
                }else if(err == `Error: ER_DUP_ENTRY: Duplicate entry '${email}' for key 'email'`){
                    res.json({errMsg: "email already registered"})
                }else if(result){
                    res.json({success: "user registered successfully!"})
                }else{
                    console.log('Not Successful')
                }
            })
        }else{
            res.json({errMsg: 'password mismatched!'})
        }
    } 
})

//**************************    FORGOT PASSWORD     **************************//
app.get(`/redirecting...`,  (req,res) =>{
    res.redirect(`${req.session.PassLink}`)
    app.get(`/${req.session.PassLink}`, PassCheck, (req,res) =>{res.sendFile(PATH.join(__dirname, './Public/pages/forgotpwd.html'))})

    app.post(`/${req.session.PassLink}`, PassCheck, (req,res) =>{
        const {Email, User_Name} = req.body
        if(Email, User_Name){
            const query = "SELECT * FROM `users` WHERE `email`=?"
            MYSQL.query(query, [Email],(err, result) =>{
                if(result.length > 0){
                    req.session.ForgotPassword = Email
                    req.session.PassLink = ''
                    res.json({Granted:'Valid'})

                    const codeRest = ((Math.floor(Math.random() * 5)+45) * (Math.floor(Math.random() * 5)+15))*1267892
                    console.log(codeRest)//Sending of code to user Email
                    const query = "UPDATE `users` SET `pwd_reseter`=? WHERE `email`=?"
                    MYSQL.query(query, [codeRest, Email], (err, result) =>{}) 
                }else{
                    res.json({Bing:'<span style="color:red;">Invalid Email Address!</span>'})
                }   
            })
        }
    })
})

//**************************    PASSWORD RESET      **************************//
app.get('/Client-Pwd-Rest', UserOut, (req,res) =>{res.sendFile(PATH.join(__dirname, './Public/pages/pwdreset.html'))})
app.post('/Client-Pwd-Rest', PWDapi, (req,res) =>{})

//**************************    ACCOUNT SETUP   **************************//
app.get('/Account-Setup', SetupOff, (req,res) =>{res.sendFile(PATH.join(__dirname, './Public/pages/setup.html'))})

app.post('/Account-Setup', SetupOff, (req,res) =>{
    const {client}  = req.session
    const { Fullname, DOB, Nation, City, RefLink } = req.body
    
    if(Fullname && DOB && Nation && City){
        if(RefLink){
            const query = "SELECT * FROM `users` `ref_key`"
            MYSQL.query(query, (err, result) =>{
                for (let i = 0; i < result.length; i++) {
                    if(RefLink == result[i].ref_key){
                        const UserRef = `Ref-Key-${client}${((Math.floor(Math.random() * 5)+45) * (Math.floor(Math.random() * 5)+15))*3}`
                        const query = "UPDATE `users` SET `ref_key`=?,`upline`=?,`setup_status`=? WHERE `username`=?"
                        MYSQL.query(query, [UserRef,RefLink, 'Done', client], (err, result) =>{})
                        return res.json({approve: 'Approved!'})
                    }
                }
                for (let i = 0; i < result.length; i++) {
                    if(RefLink !== result[i].ref_key){
                        return res.json({set: 'Invalid Referral Key!'})
                    }
                }
            })
        }else{
            res.json({approve: 'Approved!'})
            const UserRef = `Ref-Key-${client}${((Math.floor(Math.random() * 5)+45) * (Math.floor(Math.random() * 5)+15))*3}`
            const query = "UPDATE `users` SET `ref_key`=?,`upline`=?,`setup_status`=? WHERE `username`=?"
            MYSQL.query(query, [UserRef,'None', 'Done', client], (err, result) =>{})
        }
    }else{
        res.json({set: 'Empty Field!'})
    }
})

//**************************    CLIENT DASHBOARD GET   **************************//
app.get('/Client-Account', UserOut, SetupCheck, AccountGet, (req,res) => {})
app.post('/Client-Account', UserOut, AccountPost, (req,res) =>{})

//**************************    DEPOSIT PAGE    **************************//
app.get('/Client-Deposit-Confirmation', UserOut, DepositGet, (req,res) =>{})
app.post('/Client-Deposit-Confirmation', UserOut, DepositPost, (req,res) =>{})

//**************************    CURRENT EARNED FORMULAR     **************************//
app.get('/Interest', UserOut, ROI, (req,res) =>{})

//********************************    ADMINISTRATORS ROUTE     ********************************//
app.get('/admin', (req, res) => { res.sendFile(PATH.join(__dirname, './Public/pages/test.html')) })
app.post('/admin', (req, res) => {

    const RunReq = req.body.approved

    if(RunReq){
        const query = "SELECT * FROM `users` WHERE `username`=? LIMIT 1"
        MYSQL.query(query, [RunReq], (err, result) => {
            const query = "UPDATE `users` SET `last_withdraw`=?,`pend_withdraw`=? WHERE `username`=?"
            MYSQL.query(query, [Number(result[0].pend_withdraw),0, RunReq], (err, result) =>{})

            const query1 = "DELETE FROM `manager` WHERE `manager`.`client_name`=?"
            MYSQL.query(query1, [RunReq], (err, result) =>{})
        })
        res.redirect('/admin')
    }else{
        const query = "SELECT * FROM `manager`"
        MYSQL.query(query, (err, MainResult) => {
          return  res.json({MainLog: MainResult})
        })
    }
})

app.listen(PORT, () => console.log(`Server Running on Port ${PORT}`))