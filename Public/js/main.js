$('document').ready(
     // ######################### CHANGE PASSWORD PAGE ###################
    $('#new_pwd').on('click', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            data: {
                Current_Pwd: $('#current_pwd').val(),
                New_Pwd: $('#new_pass').val(),
                CNew_Pwd: $('#cnew_pass').val()
            },
            success: (data) => {
                if(data.success){
                    window.location.href = '/Client-Account'
                }else{
                    $('.pwd_notify').html(data.note)
                    setTimeout(() => {
                    $('.pwd_notify').html('')
                    }, 3000)
                }
            },
            error: (err) => {
                console.log(err)
            }
        })
    }),

     // ######################### DEPOSIT PAGE ###################
    $('#depo_confirm').on('click', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            data: {
                Coupon: $('#coupon').val(),
                Deposit_Amt: $('#depo_amt').val()
            },
            success: (data) => {
                if(data.success){
                    window.location.href = '/Interest'
                }else{
                    $('.depo_note').html(data.note)
                    setTimeout(() => {
                    $('.depo_note').html('')
                    }, 3000)
                }
            },
            error: (err) => {
                console.log(err)
            }
        })
    }),

     // ######################### SETUP ACCOUNT PAGE ###################
     $('#finish').on('click',function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            data: {
                Fullname: $('#fullname').val(),
                DOB: $('#dob').val(),
                Nation: $('#nation').val(),
                City: $('#city').val(),
                RefLink: $('#refkey').val()
            },
            success: (data) => {
                const Fullname = $('#fullname')
                const DOB = $('#dob')
                const Nation = $('#nation')
                const City = $('#city')
                const RefLink = $('#refkey')
                const check = [Fullname,DOB,Nation,City,RefLink]
                
                if(data.approve){
                    window.location.href = '/'
                }else{
                    $('.set_note').html(data.set)
                    setTimeout(() => {
                    $('.set_note').html('')
                    }, 3000)
                }
                for (let i = 0; i < check.length; i++) {
                    if(check[i].val() == ''){
                        return check[i].focus()
                    }
                }
            },
            error: (err) => {
                console.log(err)
            }
        })
    }),
)

// ######################### HOME PAGE ###################        
$.ajax({
    method: "POST",
    success: (data, valid) => {
            $('.out1').html(data.su)//sign up
            $('.out2').html(data.lo)//login 
            $('.out1').html(data.db)//dashboard
            $('.out2').html(data.lg)//logout 
            $('.Client_Name').html(`Hello, ${data.clientname}!`)//dashboard name
            $('.Profile_Name').html(data.clientname)//dashboard client name
            $('.Client_Email').html(data.clientemail)//dashboard client email
            $('.Last_Update').html(data.update)//dashboard last pwd_rest
            $('.Client_Wallet').html(data.wallet)//dashboard status
            $('.user-img').html(data.img)//dashboard status
            // ############ ACCOUNT SECTION ###################
            $('.Wallet_Balance').html(`$${Number(data.balance.toFixed(2)).toLocaleString()}`) //WALLET BALANCE (Main Display)
            $('.Wallet_SB').html(`$${Number(data.balance.toFixed(2)).toLocaleString()}`)
            $('.avail').html(`$${Number(data.balance.toFixed(2)).toLocaleString()}`)
            $('.Wallet_TD').html(`$${Number(data.deposit).toLocaleString()}.00`) //TOTAL DEPOSIT
            $('.Total_Withdraw').html(`$${Number(data.TotalWT).toLocaleString()}.00`) //TOTAL WITHDRAWAL
            $('.Last_WTH').html(`$${Number(data.LastWT).toLocaleString()}.00`) //LAST WITHDRAWAL
            $('.With_Date').html(data.WTHD == '' ? '00-00-0000' : data.WTHD) //WITHDRAWAL DATE
            $('.Last_DP').html(`$ ${Number(data.LastDP).toLocaleString()}.00`) //LAST DEPOSIT
            $('.current_bal').html(`$${Number(data.balance.toFixed(2)).toLocaleString()}`)
            $('.Current_Earned').html(`$${data.CurrentED}`) //CURRENT EARNED
            $('.Total_Earned').html(`$${data.TotalED}`) //TOTAL EARNED
            $('.Pend_Notice').html(`$${(data.Pending.toFixed(2)).toLocaleString()}`) //PENDING WITHDRAWAL
            if(data.Pending == 0){
                $('.Pend_status').html(`<span style="color: green;">Sucess</span>`)
            }else{
                $('.Pend_status').html(`<span style="color: blue;">Processing</span>`)
            }
            // WITHDRAWAL BUTTON
            if(data.balance <= 0){
                $('.withdraw_btn').html('')
                $('.withdraw_note').html('You have no funds to withdraw.')
            }else{
                $('.withdraw_btn').html(`<button >Withdraw</button>`)
                $('.withdraw_note').html('')
            }
            // ???????????????????????????

            // ############ WITHDRAWAL SECTION ###################
            $('.Wallet_Address').html(`${data.wallet}`)
            $('.Wallet_Nofity').html(`Your Bitcoin Wallet &rArr; ${data.wallet}`)

            // ############ REFFERAL SECTION ###################
            $('.upliner').html(data.Upline)
            $('.yourref').html(data.YourRef)
            $('.Total_ref').html(data.TRef)
            $('.Active_ref').html(data.ActiveRef)
            $('.Commission').html(`$ ${Number(Number(data.RefComm).toFixed(2)).toLocaleString()}`)
    },
    error: (err) => {
        console.log(err)
    }
})