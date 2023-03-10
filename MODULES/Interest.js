const MYSQL = require("./Conn")

const ROI = (req,res) => {
    res.redirect('/Client-Account') //Redirect to main User account dashboard

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
}

module.exports = ROI