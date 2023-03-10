const MYSQL = require('./Conn')
const PATH = require('path')

const AccountGet = (req,res) => {
    
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
    res.sendFile(PATH.join(__dirname, '../Public/pages/dashboard.html'))
}

const AccountPost = (req,res) => {
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
        //*******************   GENERAL HANDLER OF CLIENT ACCOUNT   ********************//
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
}

module.exports = {AccountGet, AccountPost}
