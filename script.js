let speech = new SpeechSynthesisUtterance();

let voices = [];

let voiceSelect = document.querySelector("select");

let downloadButton = document.querySelector("#downloadBtn");
let textInput = document.querySelector("#text-input");

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    speech.voice = voices[0];

    voices.forEach((voice, i) => (voiceSelect.options[i] = new Option(voice.name, i)));
}

voiceSelect.addEventListener("change", () => {
    speech.voice = voices[voiceSelect.value];
})

document.querySelector("button").addEventListener("click", () => {
    speech.text = document.querySelector("textarea").value;
    window.speechSynthesis.speak(speech);
})

// Recording and Download Functionality
let mediaRecorder;
let audioChunks = [];

listenButton.addEventListener("click", () => {
    let stream = new MediaStream();
    let audioContext = new AudioContext();
    let destination = audioContext.createMediaStreamDestination();
    mediaRecorder = new MediaRecorder(destination.stream);
    let source = audioContext.createMediaStreamSource(stream);
    source.connect(destination);

    mediaRecorder.start();
    audioChunks = [];

    speech.onend = () => {
        mediaRecorder.stop();
    };
    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };
    mediaRecorder.onstop = () => {
        let audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        let audioUrl = URL.createObjectURL(audioBlob);
        downloadButton.href = audioUrl;
        downloadButton.download = "speech.mp3";
    };
});