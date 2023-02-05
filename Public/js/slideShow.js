// ####################### ANIMANATION ##############################
const slide = document.querySelector('.pix-slide1')
const slide2 = document.querySelector('.pix-slide2')
const content = document.querySelector('.slide-content')

function slideauto(){
    setTimeout(() => {
        slide.style.transition = '1s'
        content.style.transition = '1s'
        slide.style.transform = 'translateX(0)'

        content.style.transform = 'translateX(-100vw)'
        setTimeout(() => {
            content.style.transform = 'translateX(0)'
            content.innerHTML = '<h1>BEST BITCOIN <br> <span style="color: rgb(23, 230, 245);">INVESTMENT PLATFORM</span></h1>'
        }, 1000);
    }, 1000);

    setTimeout(() => {
        setTimeout(() => {
            slide2.style.transition = '1s'
            content.style.transition = '1s'
            slide2.style.transform = 'translateX(0)'
        }, 1000);

        setTimeout(() => {  
            slide.style.transition = '1s'
            content.style.transition = '1s'
            slide.style.transform = 'translateX(-100%)'
            
            content.style.transform = 'translateX(100vw)'
            setTimeout(() => {
                
                content.style.transform = 'translateX(0)'
                content.innerHTML = '<h1>MOST TRUSTED <br> <span style="color: rgb(23, 230, 245);">TRADING PLATFORM</span></h1>'
            }, 1000);
        }, 2000);
    }, 9000);

    setTimeout(() => {
        setTimeout(() => {
            slide2.style.transition = '1s'
            content.style.transition = '1s'
            slide2.style.transform = 'translateX(0)'
        }, 1000);

        setTimeout(() => {  
            slide2.style.transition = '1s'
            content.style.transition = '1s'
            slide2.style.transform = 'translateX(-100%)'
            
            content.style.transform = 'translateX(100vw)'
            setTimeout(() => {
                
                content.style.transform = 'translateX(0)'
                content.innerHTML = '<h1>MOST ACTIVE <br> <span style="color: rgb(23, 230, 245);">COSTUMER CARE SERVICE</span></h1>'
            }, 1000);
        }, 2000);
    }, 20000);
}slideauto()
setInterval(slideauto, 31000)
// ######################################################################

// ############## ROCKET ANIMATION ##########################
const ImgAnim = document.querySelector('.anim_img')
function Imgauto(){
    setTimeout(() => {
        ImgAnim.style.transition = '5s'
        ImgAnim.style.transform = 'translateY(-230px) rotateX(90deg) scale(0.2)'
    }, 1000);
    setTimeout(() => {
        ImgAnim.style.transform = 'translateY(100px) rotateX(180deg)'
    }, 6000);
    setTimeout(() => {
        ImgAnim.style.transform = 'translateY(100px) rotateX(0)'
    }, 10000);
}Imgauto()
setInterval(Imgauto, 13000)