const btnNo = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');
const quiz = document.getElementById('quiz');
const message = document.getElementById('message');
const countdownEl = document.getElementById('countdown');
const musicBtn = document.getElementById('musicBtn');

btnNo.style.left = '200px';

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart-fall');
    const hearts = ['❤️', '💖', '🌸', '✨', '💕', '💗', '🧸'];
    heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 2 + 3 + 's';
    heart.style.fontSize = Math.random() * 1.2 + 1 + 'rem';
    document.body.appendChild(heart);
    setTimeout(() => { heart.remove(); }, 5000);
}
setInterval(createHeart, 300);

function moveButton() {
    const padding = 20;
    const maxX = window.innerWidth - btnNo.offsetWidth - padding;
    const maxY = window.innerHeight - btnNo.offsetHeight - padding;

    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    btnNo.style.position = 'fixed';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;
}

btnNo.addEventListener('mouseover', moveButton);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveButton();
});

let audioCtx = null;
let isPlaying = false;

function playRomanticMelody() {
    if (isPlaying) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    isPlaying = true;

    const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63];
    let noteIdx = 0;

    setInterval(() => {
        if (!isPlaying) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIdx], audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
        noteIdx = (noteIdx + 1) % notes.length;
    }, 600);
}

document.body.addEventListener('click', () => { playRomanticMelody(); }, { once: true });
musicBtn.addEventListener('click', () => { playRomanticMelody(); });

btnYes.addEventListener('click', () => {
    quiz.style.display = 'none';
    btnNo.style.display = 'none';
    message.style.display = 'block';

    setInterval(createHeart, 80);

    let timeLeft = 5;
    const timer = setInterval(() => {
        timeLeft--;
        countdownEl.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            window.close();
            document.body.innerHTML = '<h1 style="color:white; font-family:sans-serif;">Tắt tab này giúp anh nha Bà Chã 💖</h1>';
        }
    }, 1000);
});
