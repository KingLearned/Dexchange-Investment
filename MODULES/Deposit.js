const MYSQL = require("./Conn")
const PATH = require('path')

const DepositGet = (req,res) => {
    const {client}  = req.session
    
    let text = ''
    let possible="ABCDEFGHIJKMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789&%$"
    for (let i=0; i<29; i++){ text += possible.charAt(Math.floor(Math.random()*possible.length)) }
    console.log(text)
    
    const query = "UPDATE `users` SET `coupon`=? WHERE `username`=?"
    MYSQL.query(query, [text, client], (err, result) =>{})

    res.sendFile(PATH.join(__dirname, '../Public/pages/deposit.html')) 
}

const DepositPost = (req,res) => {
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
}

module.exports = { DepositGet, DepositPost }