// 1. Tạo hiệu ứng Icon bay ngay khi mở trang
const floatingContainer = document.getElementById('floating-container');
const icons = ['❤️', '💖', '🌸', '✨', '💕', '🥺', '🌷'];

for (let i = 0; i < 22; i++) {
    const item = document.createElement('div');
    item.className = 'floating-item';
    item.innerText = icons[Math.floor(Math.random() * icons.length)];
    item.style.left = `${Math.random() * 100}%`;
    item.style.animationDuration = `${4 + Math.random() * 5}s`;
    item.style.animationDelay = `${Math.random() * 5}s`;
    item.style.fontSize = `${1.2 + Math.random() * 1.2}rem`;
    floatingContainer.appendChild(item);
}

// 2. DOM Elements
const btnNo = document.getElementById('btnNo');
const btnYes = document.getElementById('btnYes');
const quiz = document.getElementById('quiz');
const message = document.getElementById('message');
const countdownEl = document.getElementById('countdown');
const musicBtn = document.getElementById('musicBtn');
const envelope = document.getElementById('envelope');
const typewriter = document.getElementById('typewriter');
const actionArea = document.getElementById('actionArea');

btnNo.style.left = '180px';

// 3. Nội dung bức thư đánh chữ
const textContent = "Anh biết anh đã sai và làm Bà Chã Nga buồn rồi. Anh xin lỗi Bà Chã Nga nhiều lắm! 🥺\n\nAnh hứa từ nay sẽ luôn nghe lời, thương Bà Chã Nga thật nhiều và không bao giờ làm Bà Chã Nga buồn nữa đâu...\n\nBà Chã Nga tha lỗi cho anh nha? ❤️";
let index = 0;

function typeText() {
    if (index < textContent.length) {
        typewriter.textContent += textContent.charAt(index);
        index++;
        setTimeout(typeText, 45);
    } else {
        // Gõ xong mới hiện câu hỏi và các nút
        actionArea.classList.remove('hidden');
    }
}

// 4. Mở bao thư
function openEnvelope() {
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        playMusic();
        setTimeout(typeText, 700);
    }
}

envelope.addEventListener('click', openEnvelope);

// 5. Nút "Không tha" di chuyển né tránh & Nút "Tha lỗi" to dần
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
    btnNo.style.zIndex = '9999';

    yesScale += 0.2;
    btnYes.style.transform = `scale(${yesScale})`;
}

btnNo.addEventListener('mouseover', moveButton);
btnNo.addEventListener('touchstart', (e) => {
    e.preventDefault();
    moveButton();
});

// 6. Nhạc nền
let audioCtx = null;
let isPlaying = false;

function playMusic() {
    if (isPlaying) return;
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    isPlaying = true;

    const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 440.00, 349.23];
    let noteIdx = 0;

    setInterval(() => {
        if (!isPlaying) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[noteIdx], audioCtx.currentTime);
        gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.4);
        noteIdx = (noteIdx + 1) % notes.length;
    }, 550);
}

document.body.addEventListener('click', playMusic, { once: true });
musicBtn.addEventListener('click', playMusic);

// 7. Đồng ý tha lỗi -> Bắn pháo hoa & tự đóng
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
            document.body.innerHTML = '<h1 style="color:white; font-family:sans-serif; text-align:center; margin-top:20%;">Tắt tab này giúp anh nha Bà Chã Nga 💖</h1>';
        }
    }, 1000);
});
