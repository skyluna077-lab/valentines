let currentLang = 'en';
let noClickCount = 0;
const translations = {
    "en": {
        "title": "Valentine's Request",
        "question": "Will you be my Valentine?",
        "yes": "Yes!",
        "no": "No",
        "yay": "Yay! I love you! ❤️",
        "intro": "Hi Vivienne, I have something to ask you....",
        "next": "Next",
        "sad_1": "Are you sure?",
        "sad_2": "Think again...",
        "sad_3": "Please? 🥺",
        "sad_4": "You're breaking my heart!",
        "sad_5": "I'll be very sad..."
    },
    "bi": {
        "title": "Invitasyon sa Valentine",
        "question": "Gusto mo magin Valentine ko?",
        "yes": "Iyo!",
        "no": "Dai",
        "yay": "Yay! Padangat ta ka! ❤️",
        "intro": "Hi Vivienne, igwa akong ihahapot saimo...",
        "next": "Sunod",
        "sad_1": "Sigurado ka?",
        "sad_2": "Isipon mo giraray...",
        "sad_3": "Pakiulay? 🥺",
        "sad_4": "Pigpapahibi mo an sakuyang puso!",
        "sad_5": "Mapupungaw ako pwerte..."
    }
};

// Removed fetch to avoid CORS on file:// protocol
document.addEventListener('DOMContentLoaded', () => {
    updateContent();
});

function setLanguage(lang) {
    currentLang = lang;
    updateContent();
}

function updateContent() {
    if (!translations[currentLang]) return;

    document.title = translations[currentLang].title;
    document.getElementById('intro-text').innerText = translations[currentLang].intro;
    document.getElementById('next-btn').innerText = translations[currentLang].next;
    document.getElementById('question-text').innerText = translations[currentLang].question;
    document.getElementById('yes-btn').innerText = translations[currentLang].yes;
    document.getElementById('no-btn').innerText = translations[currentLang].no;

    const celebrationH1 = document.getElementById('yay-text');
    if (celebrationH1) {
        celebrationH1.innerText = translations[currentLang].yay;
    }
}

function showQuestion() {
    document.getElementById('intro-content').classList.add('hidden');
    document.getElementById('main-content').classList.remove('hidden');
}

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = '❤️';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = Math.random() * 2 + 3 + 's';
    heart.style.opacity = Math.random();
    document.body.appendChild(heart);

    setTimeout(() => {
        heart.remove();
    }, 4000);
}

function sayYes() {
    document.getElementById('main-content').classList.add('hidden');
    document.getElementById('celebration').classList.remove('hidden');
    document.body.classList.add('shake');
    setTimeout(() => document.body.classList.remove('shake'), 2000);

    // Play fanfare audio
    const audio = document.getElementById('fanfare-audio');
    if (audio) {
        audio.currentTime = 0;
        audio.play().then(() => {
            console.log("Audio playing successfully");
        }).catch(e => {
            console.error("Audio play failed:", e);
            // Fallback: reload and play
            audio.load();
            audio.play().catch(err => console.error("Final audio retry failed:", err));
        });
    }

    // Initial big burst
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Fireworks effect
    const count = 200;
    const defaults = {
        origin: { y: 0.7 }
    };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
            particleCount: Math.floor(count * particleRatio)
        }));
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });

    // Floating hearts
    const heartInterval = setInterval(createHeart, 100);
    setTimeout(() => clearInterval(heartInterval), 10000);

    // Continuous side cannons
    const end = Date.now() + (15 * 1000);
    const colors = ['#ff4d6d', '#ff758f', '#ffccd5', '#ffffff'];

    (function frame() {
        confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

function handleNoClick() {
    noClickCount++;
    const questionText = document.getElementById('question-text');
    const noBtn = document.getElementById('no-btn');
    const yesBtn = document.getElementById('yes-btn');

    if (noClickCount <= 5) {
        const sadKey = `sad_${noClickCount}`;
        questionText.innerText = translations[currentLang][sadKey];

        // Make the yes button bigger each time!
        // Make the yes button bigger each time!
        const currentSize = parseFloat(window.getComputedStyle(yesBtn).fontSize);
        const newSize = currentSize * 1.5; // Increase font size by 50% each time
        yesBtn.style.fontSize = `${newSize}px`;
    } else {
        // After 5 clicks, maybe hide the no button or something funny
        noBtn.classList.add('hidden');
    }
}

function startConfetti() {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}
