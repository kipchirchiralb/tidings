

// let likes = document.querySelectorAll(".tyd-like-count");
// likes.forEach((like) => {
//   like.querySelector('.tyd-like-icon').addEventListener("click", (e) => {
//     console.log("tough");
//     let currCount = like.getElementsByTagName('p').textContent
//     like.querySelector('.likes-counter').textContent= currCount+1
    
//   });
// });

console.log("conn");
let scrollable = document.querySelector('#tyds-main-grid')
let scrollPos
scrollable.onscroll = (e)=>{
    scrollPos = e.target.scrollTop
    localStorage.setItem("scrollPos", scrollPos)
}

document.addEventListener("DOMContentLoaded",(e)=>{
    scrollPos = localStorage.getItem("scrollPos")
    if(scrollPos) scrollable.scrollTo(0, scrollPos)
})

// //sample - code
// document.addEventListener("DOMContentLoaded", function (event) {
//     let scrollpos = localStorage.getItem("scrollpos");
//     if (scrollpos) window.scrollTo(0, scrollpos);
//   });

//   window.onscroll = function (e) {
//     localStorage.setItem("scrollpos", window.scrollY);
//     console.log(scrollpos)
//   };
