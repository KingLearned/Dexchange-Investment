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

//**************    IMPORTED MODULES    **************//
const MYSQL = require('./MODULES/Conn')

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
                    res.json({ErrMsg: 'Invalid password or username!', PassLink: 'redirecting...'})
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

//**************************    PASSWORD RESET      **************************
app.get('/Client-Pwd-Rest', UserOut, (req,res) =>{res.sendFile(PATH.join(__dirname, './Public/pages/pwdreset.html'))})

app.post('/Client-Pwd-Rest', (req,res) =>{
    const {client,ForgotPassword}  = req.session

    const d = new Date()
    const DateMonth = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
    const DateDay = ['Sun', 'Mon', 'Tuse', 'Wed', 'Thur', 'Fri', 'Sat']
    const Day = DateDay[d.getDay()]
    const Month = DateMonth[d.getMonth()]
    var DateD = d.getDate()
    if(DateD < 10){
        DateD = `0${DateD}`
    }
    var Min = d.getMinutes()
    if(Min < 10){
        Min = `0${Min}`
    }
    var Sec = d.getSeconds()
    if(Sec < 10){
        Sec = `0${Sec}`
    }
    const Last_Upd =  `${Day} ${Month} ${DateD} ${d.getFullYear()} ${d.getHours()}:${Min}:${Sec}`
    const { Rest_code, New_Pwd, CNew_Pwd } = req.body

    if(Rest_code, New_Pwd, CNew_Pwd){
        if (New_Pwd == CNew_Pwd){
            if(client !== undefined){
                const query = "SELECT * FROM `users` WHERE `username`=? LIMIT 1"
                MYSQL.query(query, [client], (err, result) =>{
                    if (Rest_code !== result[0].pwd_reseter){
                        res.json({note: "Invalid Rest Code"})
                    }else if(Rest_code == result[0].pwd_reseter){
                        res.json({success: "Password Reset Successful!"})
                        const query = "UPDATE `users` SET `user_pwd`=?,`last_date`=? WHERE `username`=?"
                        MYSQL.query(query, [New_Pwd, Last_Upd, client], (err, result) =>{})
                    }else{
                        console.log('Not Successful')
                    }
                })
            }
            if(ForgotPassword !== undefined){
                const query = "SELECT * FROM `users` WHERE `email`=? LIMIT 1"
                MYSQL.query(query, [ForgotPassword], (err, result) =>{
                    if (Rest_code !== result[0].pwd_reseter){
                        res.json({note: "Invalid Rest Code"})
                    }else if(Rest_code == result[0].pwd_reseter){
                        res.json({FPR: "Forget Password Reset Successful!"})
                        const query = "UPDATE `users` SET `user_pwd`=?,`last_date`=? WHERE `email`=?"
                        MYSQL.query(query, [New_Pwd, Last_Upd, ForgotPassword], (err, result) =>{})
                    }else{
                        console.log('Not Successful')
                    }
                })
            }
        }else{
            res.json({note: 'Password Mismatched!'})
        }
    }else{
        res.json({note: 'Empty Field!'})
    }
})

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
app.get('/Client-Account', UserOut, SetupCheck, (req,res) =>{
    const {client}  = req.session
    const query = "SELECT * FROM `users` WHERE `username`=?"
    MYSQL.query(query,[client], (err, result) =>{
        const Finder = result[0].ref_key
        const query = "SELECT * FROM `users` WHERE `upline`=?"
        MYSQL.query(query,[Finder], (err, result1) =>{
            const query = "UPDATE `users` SET `total_ref`=? WHERE `username`=?"
            MYSQL.query(query, [result1.length, client], (err, result) =>{}) //FOR UPDATING TOTAL REFERRAL OF A USER!
        })
        // FOR UPDATING THE ACTIVE REFERRALS
        const query1 = "SELECT * FROM `users` WHERE `upline`=? AND `ref_status`=?"
        MYSQL.query(query1,[Finder, 'Active'], (err, result2) =>{
            const query = "UPDATE `users` SET `active_ref`=? WHERE `username`=?"
            MYSQL.query(query, [result2.length, client], (err, result) =>{}) //FOR UPDATING THE ACTIVE REFERRALS STATUS!
        })
    })
    res.sendFile(PATH.join(__dirname, './Public/pages/dashboard.html'))
})

app.post('/Client-Account', UserOut, (req,res) =>{
    const {client}  = req.session

    const New_Wallet = req.body.new_wallet_Add
    const Deposit = req.body.deposit_amount
    const {Withdraw} = req.body
    const {Current_Pwd, New_Pwd, CNew_Pwd} = req.body
        if(New_Wallet){
        //################ WALLET ADDRESS HANDLER ######################//
            const query = "UPDATE `users` SET `wallet_no`=? WHERE `username`=?"
            MYSQL.query(query, [New_Wallet, client], (err, result) =>{
                res.redirect('/Client-Account')
            })
        }else if(Current_Pwd, New_Pwd, CNew_Pwd){
        //################ PASSWORD CHANGE HANDLER ######################//
            const d = new Date()
            const DateMonth = ['Jan', 'Feb', 'Mar', 'April', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec']
            const DateDay = ['Sun', 'Mon', 'Tuse', 'Wed', 'Thur', 'Fri', 'Sat']
            const Day = DateDay[d.getDay()]
            const Month = DateMonth[d.getMonth()]
            var DateD = d.getDate()
            if(DateD < 10){
                DateD = `0${DateD}`
            }
            var Min = d.getMinutes()
            if(Min < 10){
                Min = `0${Min}`
            }
            var Sec = d.getSeconds()
            if(Sec < 10){
                Sec = `0${Sec}`
            }
            const Last_Upd =  `${Day} ${Month} ${DateD} ${d.getFullYear()} ${d.getHours()}:${Min}:${Sec}`
            if(Current_Pwd, New_Pwd, CNew_Pwd){
                if (New_Pwd == CNew_Pwd){
                    const query = "SELECT * FROM `users` WHERE `username`=? LIMIT 1"
                    MYSQL.query(query, [client], (err, result) =>{
                        if (Current_Pwd !== result[0].user_pwd){
                            res.json({note: "Invalid Current Password"})
                        }else if(Current_Pwd == result[0].user_pwd){
                            res.json({success: "Password Change Successful!"})
                            const query = "UPDATE `users` SET `user_pwd`=?,`last_date`=? WHERE `username`=?"
                            MYSQL.query(query, [New_Pwd, Last_Upd, client], (err, result) =>{})
                        }else{
                            console.log('Not Successful')
                        }
                    })
                }else{
                    res.json({note: 'Password Mismatched!'})
                }
            }else{
                res.json({note: 'Empty Field!'})
            }
        }else if(Deposit){
        //################ DEPOSIT HANDLER ######################//
            res.redirect('/Client-Deposit-Confirmation')

        }else if(Withdraw) {
        //****************  WITHDRAWAL HANDLER  ****************//
            if(Withdraw >= 10){
                const query = "SELECT * FROM `users` WHERE `username`=? LIMIT 1"
                MYSQL.query(query, [client], (err, result) => {
                    if(result[0].wallet_no == ''){ //for wallet address

                        res.json({Notify: 'No Wallet Address Avaliable!'})
                    }else if(Number(Number(Withdraw).toFixed(2)) >= Number(Number(result[0].balance).toFixed(2))){ //for balance check
                        res.json({Notify: 'Amount Must Be < Current Balance!'})

                    }else if(result[0].pend_withdraw !== 0){ //for pending withdrawals

                        res.json({Notify: 'A Withdrawal Is Still In Process!'})
                    }else if((Number(Number(Withdraw).toFixed(2)) < Number(Number(result[0].balance).toFixed(2))) && result[0].pend_withdraw == 0){

                        const D = new Date().getDate() < 10 ? "0"+new Date().getDate() : new Date().getDate();
                        const M = (new Date().getMonth()+1) > 9 ? new Date().getMonth()+1 : `0${(new Date().getMonth()+1)}`;
                        const Y = new Date().getFullYear()

                        const S = new Date().getSeconds() < 10 ? "0"+new Date().getSeconds() : new Date().getSeconds();
                        const Mi = new Date().getMinutes() < 10 ? "0"+new Date().getMinutes() : new Date().getMinutes();
                        const H = new Date().getHours() < 10 ? "0"+new Date().getHours() : new Date().getHours();

                        const Day = `${D}-${M}-${Y}|${H}:${Mi}:${S}`

                        const query = "UPDATE `users` SET `balance`=?,`pend_withdraw`=?,`total_withdraw`=?,`date`=? WHERE `username`=?"
                        MYSQL.query(query, [Number(result[0].balance) - Number(Withdraw), Withdraw, result[0].total_withdraw + Number(Withdraw),`${D}-${M}-${Y}`, client], (err, result) =>{
                            res.json({Approved: '/Client-Account'})
                        })
                        
                        const query1 = "INSERT INTO `manager`(`client_name`, `balance`, `amount`, `date`) VALUES(?, ?, ? ,?)"
                        MYSQL.query(query1, [client,Number(result[0].balance) - Number(Withdraw),Number(Withdraw),Day], (err, result) =>{})
                    }
                })
            }else{
                res.json({Notify: 'Amount Too Low (Must Be >= $10)!'})
            }
        }else{
        //################ GENERAL HANDLER OF CLIENT ACCOUNT######################//
            const query = "SELECT * FROM `users` WHERE `username`=? LIMIT 1"
            MYSQL.query(query, [client], (err, result) => {
                if(result){
                    const last_date = result[0].last_date == '' ? 'None' : result[0].last_date
                    const wallet_Add = result[0].wallet_no == '' ? 'None' : result[0].wallet_no
                    const wallet_Bal = Number(result[0].balance) == '0' ? 0.00 : Number(result[0].balance)
                    const wallet_Dep = result[0].total_depo == '' ? '0.00' : result[0].total_depo
                    const Total_with = result[0].total_withdraw == '' ? '0' : result[0].total_withdraw
                    const Last_with = result[0].last_withdraw == '' ? '0' : result[0].last_withdraw
                    const Last_Depo = result[0].last_depo == '' ? '0.00' : result[0].last_depo
            
                    let Current_Earn = Number(Number(result[0].current_earn).toFixed(2)).toLocaleString(); if(Current_Earn == '0'){Current_Earn = '0.00'}
                    let Total_Earn = Number(Number(result[0].total_earn).toFixed(2)).toLocaleString(); if(Total_Earn == '0'){Total_Earn = '0.00'}
                    

                    const PendWTH = result[0].pend_withdraw
                    return res.json({clientname: result[0].username, 
                        clientemail: `${result[0].email}`,update: last_date,wallet: wallet_Add, balance: wallet_Bal,
                        deposit: wallet_Dep,TotalWT: Total_with,LastWT: Last_with,WTHD:result[0].date,LastDP: Last_Depo,CurrentED: Current_Earn,
                        TotalED: Total_Earn,Pending: PendWTH,Upline: result[0].upline,YourRef: result[0].ref_key,
                        TRef: result[0].total_ref,ActiveRef: result[0].active_ref,RefComm: result[0].ref_comm,
                    })
                }else{
                    console.log('Data UnInitialized!!!')
                }
            })
        }
})

//**************************    DEPOSIT PAGE    **************************//
app.get('/Client-Deposit-Confirmation', UserOut,(req,res) =>{
        const {client}  = req.session
        function Coupon_Code(){
            var text =''
            var possible="ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789&%$"
            for (let i=0; i<29; i++){
                text += possible.charAt(Math.floor(Math.random()*possible.length))
            }
            
            const query = "UPDATE `users` SET `coupon`=? WHERE `username`=?"
            MYSQL.query(query, [text, client], (err, result) =>{})
            
            console.log(text)
        }Coupon_Code()
        res.sendFile(PATH.join(__dirname, './Public/pages/deposit.html'))  
})

app.post('/Client-Deposit-Confirmation', UserOut,(req,res) =>{
    const {client}  = req.session

    const { Coupon, Deposit_Amt } = req.body
    if(Coupon, Deposit_Amt){
        const query = "SELECT * FROM `users` WHERE `username`=? LIMIT 1"
        MYSQL.query(query, [client], (err, result) =>{
            if (Coupon !== result[0].coupon){
                res.json({note: "Invalid Coupon!"})
            }else if(Coupon == result[0].coupon && Deposit_Amt <= 49){
                res.json({note: "Amount Is Too Low! (must be greater than $50)"})
            }else if(Coupon == result[0].coupon && Deposit_Amt > 60000){
                res.json({note: "Amount Is Too Hign! (must be less than $60000)"})
            }else if(Coupon == result[0].coupon && Deposit_Amt > 49 && Deposit_Amt <= 60000){
                res.json({success: "Deposit Successful!"})
                var add = result[0].total_depo
                if(add == 0){
                    add = 0
                }
                var bal = (Number(result[0].balance) + Number(Deposit_Amt)) + Number(result[0].current_earn)
                if(bal == '0'){
                    bal = 0
                }
                const query = "UPDATE `users` SET `ref_status`=?,`balance`=?,`total_depo`=?,`last_depo`=?,`total_earn`=? WHERE `username`=?"
                MYSQL.query(query, ['Active', bal, Number(Deposit_Amt) + add, Deposit_Amt, Number(result[0].total_earn)+Number(result[0].current_earn), client], (err, result) =>{})
                const query1 = "UPDATE `users` SET `current_earn`=? WHERE `username`=?"
                MYSQL.query(query1, [0, client], (err, result) =>{})

                // ########## UPDATING OF UPLINERS COMMISSION ##########
                const query2 = "SELECT * FROM `users` WHERE `ref_key`=?"
                MYSQL.query(query2, [result[0].upline], (err, SubResult) =>{
                    if(result[0].upline !== 'None'){
                        const query = "UPDATE `users` SET `ref_comm`=?,`balance`=? WHERE `ref_key`=?"
                        MYSQL.query(query, [SubResult[0].ref_comm + ((5/100)*Deposit_Amt),Number(SubResult[0].balance)+((5/100)*Deposit_Amt), result[0].upline], (err, result) =>{})
                    }
                })

                const coupon_code = 'D$vh%_njtg' + ((Math.floor(Math.random() * 5)+45) * (Math.floor(Math.random() * 5)+15))*1267892 + 'stu$ebf%d'
                const reset = "UPDATE `users` SET `coupon`=? WHERE `username`=?"
                MYSQL.query(reset, [coupon_code, client], (err, result) =>{})


            }else{
                console.log('Not Successful')
            }
        })
    }else{
        res.json({note: 'Empty Field!'})
    }
})

//**************************    CURRENT EARNED FORMULAR     **************************//
app.get('/Interest',/*UserOut,*/ (req,res) =>{
    res.redirect('/Client-Account') // INITIALIZATION OF THE INTEREST FURMULAR AND REDIRECTING TO DASHBOARD
    const {client}  = req.session
    function Interest() {
        const query = "SELECT * FROM `users` WHERE `username`=? LIMIT 1"
        MYSQL.query(query, [client], (err, result) => {
            if(result){
                const check = result[0].last_depo
                var IntMultiple = 0
                var stop = 0
                if(check > 49 && check < 6000){ 
                    IntMultiple = ((20/(((60*1))))/100)*result[0].last_depo
                    stop = Number(result[0].last_depo*(20/100)) //FOR 20% INTEREST (20/(((60*60)*24)*2))/100
                }
                if(check >= 6000 && check < 20000){
                    IntMultiple = ((45/(((60*1))))/100)*result[0].last_depo
                    stop = Number(result[0].last_depo*(45/100)) //FOR 45% INTEREST (45/(((60*60)*24)*4))/100
                }
                if(check >= 20000 && check <= 50000){
                    IntMultiple = ((75/(((60*1))))/100)*result[0].last_depo
                    stop = Number(result[0].last_depo*(75/100)) //FOR 75% INTEREST (75/(((60*60)*24)*6))/100
                }
                
                const earnbal = IntMultiple
                if(Number(result[0].current_earn)+0.5 > stop){
                    clearInterval(call) //STOP OF THE INTEREST FUNCTION
                }else if(result[0].last_depo >= 50 && result[0].last_depo < 5999){
                    if(Number(result[0].current_earn) < Number(result[0].last_depo*(20/100))){
                        const query = "UPDATE `users` SET `current_earn`=? WHERE `username`=?"
                        MYSQL.query(query, [(Number(earnbal)+Number(result[0].current_earn)), client], (err, result) =>{})
                        // console.log(Number(result[0].current_earn))
                    }
                }else if (result[0].last_depo >= 6000 && result[0].last_depo < 19999){
                    if(Number(result[0].current_earn) < Number(result[0].last_depo*(45/100))){
                        const query = "UPDATE `users` SET `current_earn`=? WHERE `username`=?"
                        MYSQL.query(query, [(Number(earnbal)+Number(result[0].current_earn)), client], (err, result) =>{})
                        // console.log(Number(result[0].current_earn))
                    }
                }else if(result[0].last_depo >= 20000 && result[0].last_depo <= 50000){
                    if(Number(result[0].current_earn) < Number(result[0].last_depo*(75/100))){
                        const query = "UPDATE `users` SET `current_earn`=? WHERE `username`=?"
                        MYSQL.query(query, [(Number(earnbal)+Number(result[0].current_earn)), client], (err, result) =>{})
                        // console.log(Number(result[0].current_earn))
                    }
                }
            }
        })
    }
    const call = setInterval(Interest, 1000)
})

app.get('/admin', (req, res) => {
    res.sendFile(PATH.join(__dirname, './Public/pages/test.html'))
})

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