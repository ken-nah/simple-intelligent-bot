const socket = io();

const outputYou = document.querySelector(".output-you");
const outputBot = document.querySelector(".output-bot");

window.SpeechRecognition =
  window.SpeechRecognition ||
  window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

recognition.addEventListener("speechend", () => {
  recognition.stop();
});

document
  .querySelector("#e")
  .addEventListener("click", () => {
    recognition.start();
  });

recognition.addEventListener("result", e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join("");

  if (e.results[0].isFinal) {
    outputYou.textContent = transcript;
    socket.emit("chat message", transcript);
  }
});

recognition.addEventListener("error", e => {
  outputBot.textContent = "Error: " + e.error;
});

function synthVoice(text) {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  synth.speak(utterance);

  utterance.onend = function(event) {
    recognition.start();
  };
}

socket.on("bot reply", function(replyText) {
  synthVoice(replyText);

  if (replyText == "") replyText = "(No answer...)";
  outputBot.textContent = replyText;
});
