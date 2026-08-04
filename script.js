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

// Canvas hiệu ứng Trái tim lơ lửng
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');
let hearts = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class FloatingHeart {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 15 + 10;
        this.speedY = Math.random() * 1.5 + 0.8;
        this.opacity = Math.random() * 0.7 + 0.3;
        this.angle = Math.random() * Math.PI * 2;
    }
    update() {
        this.y -= this.speedY;
        this.x += Math.sin(this.angle) * 0.5;
        this.angle += 0.02;
        if (this.y < -20) this.reset();
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#ff4b2b';
        ctx.font = `${this.size}px sans-serif`;
        ctx.fillText('❤️', this.x, this.y);
        ctx.restore();
    }
}

for (let i = 0; i < 25; i++) {
    hearts.push(new FloatingHeart());
}

function animateHearts() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(h => {
        h.update();
        h.draw();
    });
    requestAnimationFrame(animateHearts);
}
animateHearts();

// Lời xin lỗi gõ máy chữ
const text = "Anh biết anh làm Bà Chã buồn rồi. Anh xin lỗi nhiều lắm! Anh hứa sẽ không tái phạm nữa đâu...";
let index = 0;

function typeText() {
    if (index < text.length) {
        typewriter.textContent += text.charAt(index);
        index++;
        setTimeout(typeText, 50);
    } else {
        // KHI GÕ HẾT CHỮ -> Hiện phần câu hỏi và 2 nút tha lỗi/không tha
        questionArea.classList.remove('hidden');
    }
}

// Mở phong thư
function openEnvelope() {
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        setTimeout(typeText, 800);
    }
}

envelope.addEventListener('click', openEnvelope);
setTimeout(openEnvelope, 800);

// Nút "Chưa tha đâu" né tránh không thể bấm được
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

// Nhạc nền Web Audio API du dương
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

// Bấm Tha Lỗi -> Bắn pháo hoa & đếm ngược tắt trang
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
