const MYSQL = require("./Conn")

const PWDapi = (req,res) => {
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
}

module.exports = PWDapi