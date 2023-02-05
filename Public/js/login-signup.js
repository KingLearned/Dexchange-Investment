//*************** SIGNUP PAGE *******************//
$('.signup_form form').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
        method: "POST",
        data: {
            username: $('#new_client_username').val(),email: $('#new_client_email').val(),
            pwd: $('#new_client_pwd').val(),cpwd: $('#new_client_cpwd').val()
        },
        success: (data) => {
            const newUserReg = data.success ? window.location.href = '/login' : ($('#out').html(data.errMsg),setTimeout(() => {$('#out').html('')},2500))
        }
    })
})

/******************** LOGIN PAGE ********************/
let invalCount = 0
$('.login_form form').on('submit', (e) => {
    e.preventDefault()
    $.ajax({
        method: "POST",
        data: {
            User_Name: $('.client_username').val(),
            User_Pwd: $('.client_pwd').val()
        },
        success: (data) => {
            const check = [$('.client_username'),$('.client_pwd')]
            if(data.login){
                window.location.href = '/Interest'
            }else if(data.ErrMsg){
                if(data.ErrMsg == 'Invalid Password Or Username!'){
                    invalCount ++
                    if(invalCount > 2){
                        $('.Msg-out').html(`<a href="/${data.PassLink}" style="color:red;">FORGOT PASSWORD?</a>`)
                    }else{
                        $('.Msg-out').html(data.ErrMsg), setTimeout(() => {$('.Msg-out').html('')},2500)
                    }
                }else{
                    $('.Msg-out').html(data.ErrMsg), setTimeout(() => {$('.Msg-out').html('')},2500)
                }  
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
})

/****************** FORGOTTEN PASSWORD PAGE ***************************/
$('.forgotPWD').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
        method: "POST",
        data: {
            Email: $('#user_email').val(),
            User_Name: $('#user_name').val()
        },
        success: (data, valid) => {
            if(data.Bing){
                $('.Message').html(data.Bing)
                setTimeout(() => {
                    $('.Message').html('')
                }, 2000);
            }
            if(data.Granted){
                window.location.href = '/Client-Pwd-Rest'
            }
        }
    })
})

/****************** RESET PASSWORD PAGE ***************************/
$('.pwdRestForm').on('submit', function(e) {
    e.preventDefault()
    $.ajax({
        method: "POST",
        data: {
            Rest_code: $('#rest_code').val(),
            New_Pwd: $('#new_pwd').val(),
            CNew_Pwd: $('#cnew_pwd').val()
        },
        success: (data) => {
            if(data.success){
                window.location.href = '/Client-Account'
            }else if(data.FPR){
                window.location.href = '/login'
            }else{
                $('.notify').html(data.note)
                setTimeout(() => {
                $('.notify').html('')
                }, 3000)
            }
        }
    })
})

const NavBar = document.querySelector('.nav-cover')
let H = 0
function Toggle(){
    if(H == 0){
        NavBar.style.height = '300px'
        H = 1
    }else{
        NavBar.style.height = '0'
        H = 0
    }
}