// let inputTextArea = document.getElementById("tyd-textarea");
// let tydProgress = document.getElementById("tyd-progress");
// inputTextArea.addEventListener("input", () => {
//   tydProgress.value = inputTextArea.value.length;
//   // tydProgress.textContent = inputTextArea.value.length;
// });

let likes = document.querySelectorAll(".tyd-like-count");
likes.forEach((like) => {
  like.getElementsByTagName('img').addEventListener("click", (e) => {
    console.log("tough");
    let currCount = like.getElementsByTagName('p').textContent
    like.getElementsByClassName('p').textContent= currCount+1
    
  });
});

console.log("conn");
