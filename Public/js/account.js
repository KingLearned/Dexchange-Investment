// ###################### ACCOUNT HANDLER ######################
const Account = document.querySelector('.right_control')
const Deposit = document.querySelector('.deposit')
const Referral = document.querySelector('.referral')
const Referral_link = document.querySelector('.referral_link')
const Withdraw = document.querySelector('.withdraw')
const Edit_Account = document.querySelector('.edit_account') //Not Yet
const Security = document.querySelector('.security') //Not Yet

const Acct = document.querySelector('.home')
const depo = document.querySelector('.dep')
const ref = document.querySelector('.ref')
const reflink = document.querySelector('.reflink')
const wdr = document.querySelector('.with')
const accted = document.querySelector('.edit')
const sec = document.querySelector('.sec')

function home(){
    Account.style.display = 'flex'
    Acct.style.color = 'gold', Acct.style.background = 'rgba(1, 1, 22)'
    depo.style.color = '', depo.style.background = ''
    ref.style.color = '', ref.style.background = ''
    reflink.style.color = '', reflink.style.background = ''
    wdr.style.color = '', wdr.style.background = ''
    accted.style.color = '', accted.style.background = ''
    sec.style.color = '', sec.style.background = ''

    Deposit.style.display = 'none'
    Referral.style.display = 'none'
    Referral_link.style.display = 'none'
    Withdraw.style.display = 'none'
    Edit_Account.style.display = 'none'
    Security.style.display = 'none'
}
function deposit(){
    Deposit.style.display = 'flex'
    depo.style.color = 'gold', depo.style.background = 'rgba(1, 1, 22)'
    Acct.style.color = '', Acct.style.background = ''
    ref.style.color = '', ref.style.background = ''
    reflink.style.color = '', reflink.style.background = ''
    wdr.style.color = '', wdr.style.background = ''
    accted.style.color = '', accted.style.background = ''
    sec.style.color = '', sec.style.background = ''

    Account.style.display = 'none'
    Referral.style.display = 'none'
    Referral_link.style.display = 'none'
    Withdraw.style.display = 'none'
    Edit_Account.style.display = 'none'
    Security.style.display = 'none'
}
function referrals(){
    Referral.style.display = 'flex'
    ref.style.color = 'gold', ref.style.background = 'rgba(1, 1, 22)'
    depo.style.color = '', depo.style.background = ''
    Acct.style.color = '', Acct.style.background = ''
    reflink.style.color = '', reflink.style.background = ''
    wdr.style.color = '', wdr.style.background = ''
    accted.style.color = '', accted.style.background = ''
    sec.style.color = '', sec.style.background = ''

    Account.style.display = 'none'
    Deposit.style.display = 'none'
    Referral_link.style.display = 'none'
    Withdraw.style.display = 'none'
    Edit_Account.style.display = 'none'
    Security.style.display = 'none'
}
function referrallink(){
    Referral_link.style.display = 'flex'
    reflink.style.color = 'gold', reflink.style.background = 'rgba(1, 1, 22)'
    depo.style.color = '', depo.style.background = ''
    ref.style.color = '', ref.style.background = ''
    Acct.style.color = '', Acct.style.background = ''
    wdr.style.color = '', wdr.style.background = ''
    accted.style.color = '', accted.style.background = ''
    sec.style.color = '', sec.style.background = ''

    Account.style.display = 'none'
    Deposit.style.display = 'none'
    Referral.style.display = 'none'
    Withdraw.style.display = 'none'
    Edit_Account.style.display = 'none'
    Security.style.display = 'none'
}
function withdrawal(){
    Withdraw.style.display = 'flex'
    wdr.style.color = 'gold', wdr.style.background = 'rgba(1, 1, 22)'
    depo.style.color = '', depo.style.background = ''
    ref.style.color = '', ref.style.background = ''
    reflink.style.color = '', reflink.style.background = ''
    Acct.style.color = '', Acct.style.background = ''
    accted.style.color = '', accted.style.background = ''
    sec.style.color = '', sec.style.background = ''

    Account.style.display = 'none'
    Deposit.style.display = 'none'
    Referral.style.display = 'none'
    Referral_link.style.display = 'none'
    Edit_Account.style.display = 'none'
    Security.style.display = 'none'
}
function accountedit(){
    Edit_Account.style.display = 'flex'
    accted.style.color = 'gold', accted.style.background = 'rgba(1, 1, 22)'
    depo.style.color = '', depo.style.background = ''
    ref.style.color = '', ref.style.background = ''
    reflink.style.color = '', reflink.style.background = ''
    wdr.style.color = '', wdr.style.background = ''
    Acct.style.color = '', Acct.style.background = ''
    sec.style.color = '', sec.style.background = ''

    Account.style.display = 'none'
    Deposit.style.display = 'none'
    Referral.style.display = 'none'
    Referral_link.style.display = 'none'
    Withdraw.style.display = 'none'
    Security.style.display = 'none'
}
function security(){
    Security.style.display = 'flex'
    sec.style.color = 'gold', sec.style.background = 'rgba(1, 1, 22)'
    depo.style.color = '', depo.style.background = ''
    ref.style.color = '', ref.style.background = ''
    reflink.style.color = '', reflink.style.background = ''
    wdr.style.color = '', wdr.style.background = ''
    accted.style.color = '', accted.style.background = ''
    Acct.style.color = '', Acct.style.background = ''

    Account.style.display = 'none'
    Deposit.style.display = 'none'
    Referral.style.display = 'none'
    Referral_link.style.display = 'none'
    Withdraw.style.display = 'none'
    Edit_Account.style.display = 'none'
}
function logoutbtn(){
    window.location.href = '/LogOut-Client'
}
// ###################### WITHDRAWAL HANDLER ######################
const closeBtn = document.querySelector('.close')
const withdraw_btn = document.querySelector('.withdraw_btn')
const withdraw_form = document.querySelector('.withdraw_form')
closeBtn.addEventListener('click', () => {
    withdraw_form.style.display = 'none'
})
withdraw_btn.addEventListener('click', () => {
    withdraw_form.style.display = 'flex'
})
// checking of withdrawal balance against the with withdrawing amount of the client
$('.With_Btn').on('click', function(e) {
    e.preventDefault()
    $.ajax({
        method: "POST",
        data: {
            Withdraw: $('.check').val()
        },
        success: (data) => {
            const check = $('.check')
            function clr(){setTimeout(() => {$('.Notify').html('')}, 4000);}
            if(check.val() == ''){check.focus(),$('.Notify').html('Empty Field!'),clr()}
            if(data.Notify){
                $('.Notify').html(data.Notify),clr()
            }
            if(data.Approved){
                window.location.href = data.Approved
            }

        },
        error: (err) => {
            console.log(err)
        }
    })
})
// Deposit Initiatives
const Pack = document.querySelector('.select_plan')
const DepAmt = document.querySelector('.deposit_amount')
const ROI = document.querySelector('.ROI')
Pack.addEventListener('change', () => {
    if(Pack.value == 'Basic Pack'){
        DepAmt.value = 50
    }
    if(Pack.value == 'Standard Pack'){
        DepAmt.value = 6000
    }
    if(Pack.value == 'Professional Pack'){
        DepAmt.value = 20000
    }

    //ROI CALCULATOR
    const Amount = DepAmt.value
    if(Amount >= 50){
        ROI.innerHTML = (20/100)*Amount
    }
    if(Amount >= 6000){
        ROI.innerHTML = (45/100)*Amount
    }
    if(Amount >= 20000){
        ROI.innerHTML = (75/100)*Amount
    }
})
DepAmt.addEventListener('change', () => {
    const Amount = DepAmt.value
    if(Amount >= 50 && Amount <= 6000){
        ROI.innerHTML = (20/100)*Amount
        Pack.value = 'Basic Pack'
    }
    if(Amount >= 6000 && Amount <= 20000){
        ROI.innerHTML = (45/100)*Amount
        Pack.value = 'Standard Pack'
    }
    if(Amount >= 20000 && Amount <= 50000){
        ROI.innerHTML = (75/100)*Amount
        Pack.value = 'Professional Pack'
    }
    if(Amount > 50000){
        DepAmt.value = 50000
        ROI.innerHTML = (75/100)*50000
        Pack.value = 'Professional Pack'
    }
})