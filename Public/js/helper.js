//*********** COPY REFERRAL LINK ***********//
function copylink(){
    let CopyText = document.querySelector('.yourref')
    // CopyText.select() //For Mobile Devices
    // CopyText.setSelectionRange(0,9999) //For Mobile Devices
    // document.execCommand('.yourref')
    navigator.clipboard.writeText(CopyText.innerHTML)
    alert(`Referral Key Copied: ${CopyText.innerHTML}`)
}
//*********** TOGGLE BAR HANDLER ***********//
const navBar = document.querySelector('.nav-cover')
let H = 0
function Toggle(){
    if(H == 0){
        navBar.style.height = '300px'
        H = 1
    }else{
        navBar.style.height = '0'
        H = 0
    }
}
