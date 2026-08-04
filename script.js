const btnNo = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');
const quiz = document.getElementById('quiz');
const message = document.getElementById('message');
const countdownEl = document.getElementById('countdown');
const musicBtn = document.getElementById('musicBtn');
const envelope = document.getElementById('envelope');
const typewriter = document.getElementById('typewriter');
const questionArea = document.getElementById('questionArea');

btnNo.style.left = '200px';

// Máy đánh chữ lời xin lỗi
const text = "Anh biết anh làm Bà Chã buồn rồi. Anh xin lỗi nhiều lắm! Anh hứa sẽ không tái phạm nữa đâu...";
let index = 0;

function typeText() {
    if (index < text.length) {
        typewriter.textContent += text.charAt(index);
        index++;
        setTimeout(typeText, 50);
    } else {
        // Gõ xong mới hiện câu hỏi và nút
        questionArea.classList.remove('hidden');
    }
}

// Mở bao thư và rút lá thư lên
function openEnvelope() {
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        setTimeout(typeText, 800);
    }
}

envelope.addEventListener('click', openEnvelope);
setTimeout(openEnvelope, 800);

// Nút "Chưa tha đâu" di chuyển né chuột
let yesScale = 1;

function moveButton() {
    const padding = 20;
    const maxX = window.innerWidth - btnNo.offsetWidth - padding;
    const maxY = window.innerHeight - btnNo.offsetHeight - padding;

    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    btnNo.style.position = 'fixed';
    btnNo.style.left = `${randomX}px`;
    btnNo.style.top = `${randomY}px`;

    yesScale += 0.15;
    btnYes.style.transform = `scale(${yesScale})`;
}

btnNo.addEventListener('mouseover', moveButton);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveButton();
});

// Nhạc nền Web Audio API
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

// Sự kiện bấm nút Tha lỗi
btnYes.addEventListener('click', () => {
    quiz.style.display = 'none';
    btnNo.style.display = 'none';
    message.style.display = 'block';

    if (typeof confetti === 'function') {
        confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 }
        });
    }

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
