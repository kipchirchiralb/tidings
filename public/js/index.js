let inputTextArea = document.getElementById("tyd-textarea");
let tydProgress = document.getElementById("tyd-progress");
inputTextArea.addEventListener("input", () => {
  tydProgress.value = inputTextArea.value.length;
  tydProgress.textContent = inputTextArea.value.length;
});
