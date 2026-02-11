// =============================
// HOW TO ADD YOUR OWN PHOTOS
// =============================
// 1. Put your images into: assets/photos/
// 2. Add each file path into the photos array below, for example:
//    "assets/photos/photo1.jpg", "assets/photos/beach.png"
// 3. The FIRST photo is used for the sliding puzzle.
// 4. The photos are also used in the story timeline.
// 5. You don’t need to touch the HTML or CSS, just update this array.
// 6. For capybara easter eggs, add a capybara image at: assets/photos/capybara.png

// ============ CONFIG ============

// List your photos here:
// Save your four favorite photos as:
// assets/photos/photo1.png
// assets/photos/photo2.png
// assets/photos/photo3.png
// assets/photos/photo4.png
// (you can change names, just keep the same format below)
const photos = [
    "assets/photos/photo1.jpg",
    "assets/photos/photo2.jpg",
    "assets/photos/photo3.jpg",
    "assets/photos/photo4.jpg"
  ];

// Editable story intro for typewriter
const loveLetterText = `
Funny how everything started because of Sreekar.

One block party.
One CAS 100 class.
And suddenly you were just… everywhere in my life.

I still remember taking you to Presque Isle to watch the sunset…
Except it was completely pitch black by the time we finally got there.
Didn’t matter though — being with you was more than enough.
`;
// Timeline entries (photos will be attached dynamically where available)
const timelineEvents = [
    {
        title: "CAS 100 — first time seeing you",
        description: "You were just a pretty stranger in a random class… and somehow you already stood out.",
        photoIndex: 0
    },
    {
        title: "Block party chaos",
        description: "Thank you, Sreekar, for accidentally starting a whole relationship. One loud night, one spark.",
        photoIndex: 1
    },
    {
        title: "Presque Isle: no sunset, still perfect",
        description: "We tried to be cute and watch the sunset. We got pitch black skies and cold air instead. Still one of my favorite nights.",
        photoIndex: 2
    },
    {
        title: "You moved into my bed (kind of)",
        description: "Somehow you just kept “sleeping over”… and now my bed feels wrong without you in it.",
        photoIndex: 3
    }
];

// =============================
// Utility: Section Management
// =============================

function showSection(id) {
    const sections = document.querySelectorAll(".section");
    sections.forEach((sec) => {
        if (sec.id === id) {
            sec.classList.add("active");
        } else {
            sec.classList.remove("active");
        }
    });
}

// =============================
// 1. Envelope Intro
// =============================

function openEnvelope() {
    const envelope = document.getElementById("envelope");
    if (!envelope) return;

    envelope.classList.add("open");

    setTimeout(() => {
        showSection("letter-section");
        typeWriter();
    }, 900);
}

// =============================
// 2. Typewriter Love Letter
// =============================

let typewriterIndex = 0;
let typewriterInterval = null;

function typeWriter() {
    const target = document.getElementById("typewriter-text");
    const continueBtn = document.getElementById("letter-continue");
    if (!target) return;

    target.textContent = "";
    target.classList.remove("typewriter-complete");
    typewriterIndex = 0;

    const text = loveLetterText;

    clearInterval(typewriterInterval);

    typewriterInterval = setInterval(() => {
        if (typewriterIndex >= text.length) {
            clearInterval(typewriterInterval);
            target.classList.add("typewriter-complete");
            if (continueBtn) continueBtn.style.display = "inline-flex";
            return;
        }
        target.textContent += text.charAt(typewriterIndex);
        typewriterIndex += 1;
    }, 32);
}

// =============================
// 3. Sliding Photo Puzzle (3x3)
// =============================

const PUZZLE_SIZE = 3;
let puzzleState = [];
let puzzleEmptyIndex = 8;

function initPuzzle() {
    const container = document.getElementById("puzzle-container");
    const message = document.getElementById("puzzle-message");
    if (!container) return;

    container.innerHTML = "";

    if (message) {
        if (!photos.length) {
            message.textContent = "Add at least one photo in assets/photos and list it in script.js to see this memory as a puzzle.";
        } else {
            message.textContent = "Tap the tiles next to the empty space to move them.";
        }
    }

    puzzleState = [];
    for (let i = 0; i < PUZZLE_SIZE * PUZZLE_SIZE; i++) {
        puzzleState.push(i);
    }
    puzzleEmptyIndex = PUZZLE_SIZE * PUZZLE_SIZE - 1;

    // Preload the image to ensure it's available
    if (photos[0]) {
        const img = new Image();
        img.onload = () => {
            // Image loaded successfully, create tiles
            createPuzzleTiles();
            shufflePuzzle();
        };
        img.onerror = () => {
            // Image failed to load, show error message
            if (message) {
                message.textContent = "Couldn't load the puzzle image. Make sure photo1.jpg exists in assets/photos/";
            }
            // Still create tiles but without image
            createPuzzleTiles();
        };
        img.src = photos[0];
    } else {
        createPuzzleTiles();
    }

    function createPuzzleTiles() {
        for (let i = 0; i < puzzleState.length; i++) {
            const tileIndex = puzzleState[i];
            const tile = document.createElement("div");
            tile.classList.add("puzzle-tile");
            tile.dataset.position = i.toString();
            tile.dataset.index = tileIndex.toString();

            if (tileIndex === PUZZLE_SIZE * PUZZLE_SIZE - 1) {
                tile.classList.add("empty");
            } else if (photos[0]) {
                const imgUrl = photos[0];
                const col = tileIndex % PUZZLE_SIZE;
                const row = Math.floor(tileIndex / PUZZLE_SIZE);
                const x = (col / (PUZZLE_SIZE - 1)) * 100;
                const y = (row / (PUZZLE_SIZE - 1)) * 100;

                tile.style.backgroundImage = `url("${imgUrl}")`;
                tile.style.backgroundPosition = `${x}% ${y}%`;
                tile.style.backgroundSize = "300% 300%";
            }

            tile.addEventListener("click", () => moveTile(i));
            container.appendChild(tile);
        }
    }
}

function shufflePuzzle() {
    let steps = 80;
    for (let s = 0; s < steps; s++) {
        const neighbors = getNeighborIndices(puzzleEmptyIndex);
        const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
        swapTiles(puzzleEmptyIndex, randomNeighbor);
        puzzleEmptyIndex = randomNeighbor;
    }
    renderPuzzle();
}

function getNeighborIndices(index) {
    const neighbors = [];
    const row = Math.floor(index / PUZZLE_SIZE);
    const col = index % PUZZLE_SIZE;

    if (row > 0) neighbors.push(index - PUZZLE_SIZE);
    if (row < PUZZLE_SIZE - 1) neighbors.push(index + PUZZLE_SIZE);
    if (col > 0) neighbors.push(index - 1);
    if (col < PUZZLE_SIZE - 1) neighbors.push(index + 1);

    return neighbors;
}

function swapTiles(i, j) {
    const temp = puzzleState[i];
    puzzleState[i] = puzzleState[j];
    puzzleState[j] = temp;
}

function moveTile(index) {
    const neighbors = getNeighborIndices(index);
    if (!neighbors.includes(puzzleEmptyIndex)) return;

    swapTiles(index, puzzleEmptyIndex);
    puzzleEmptyIndex = index;
    renderPuzzle();
    checkSolved();
}

function renderPuzzle() {
    const container = document.getElementById("puzzle-container");
    if (!container) return;

    const tiles = container.querySelectorAll(".puzzle-tile");
    tiles.forEach((tile, position) => {
        const logicalIndex = puzzleState[position];
        tile.dataset.position = position.toString();
        tile.dataset.index = logicalIndex.toString();

        if (logicalIndex === PUZZLE_SIZE * PUZZLE_SIZE - 1) {
            tile.classList.add("empty");
            tile.style.backgroundImage = "none";
        } else if (photos[0]) {
            tile.classList.remove("empty");
            const col = logicalIndex % PUZZLE_SIZE;
            const row = Math.floor(logicalIndex / PUZZLE_SIZE);
            const x = (col / (PUZZLE_SIZE - 1)) * 100;
            const y = (row / (PUZZLE_SIZE - 1)) * 100;
            tile.style.backgroundImage = `url("${photos[0]}")`;
            tile.style.backgroundPosition = `${x}% ${y}%`;
            tile.style.backgroundSize = "300% 300%";
        }
    });
}

function checkSolved() {
    const continueBtn = document.getElementById("puzzle-continue");
    const message = document.getElementById("puzzle-message");

    const solved = puzzleState.every((value, index) => value === index);

    if (solved) {
        if (message) {
            message.textContent = "We don’t always have perfect timing… but somehow we always fit together ❤️";
        }
        if (continueBtn) {
            continueBtn.style.display = "inline-flex";
        }
        showConfetti();
    } else {
        if (message && !message.textContent) {
            message.textContent = "Keep going, we’re almost perfectly chaotic together 💕";
        }
    }
}

// =============================
// 4. Story Timeline / Memory Section
// =============================

function getPhotoByIndex(index) {
    if (index == null) return null;
    return photos[index] || null;
}

const capyGalleryClicks = {};
const CAPY_IMAGE_SRC = "assets/photos/capybara.png";

function initCapybaraGalleryEgg(root) {
    const container = root || document;
    const imgs = container.querySelectorAll("img.timeline-photo");
    imgs.forEach((img) => {
        const originalSrc = img.src;
        img.addEventListener("click", () => {
            const key = originalSrc;
            capyGalleryClicks[key] = (capyGalleryClicks[key] || 0) + 1;

            if (capyGalleryClicks[key] >= 3) {
                const previousSrc = img.src;
                img.src = CAPY_IMAGE_SRC;
                setTimeout(() => {
                    img.src = previousSrc;
                }, 700);
                capyGalleryClicks[key] = 0;
            }
        });
    });
}

function initTimeline() {
    const list = document.getElementById("timeline-list");
    if (!list) return;

    list.innerHTML = "";

    timelineEvents.forEach((event) => {
        const item = document.createElement("div");
        item.classList.add("timeline-item");

        const photoSrc = getPhotoByIndex(event.photoIndex);
        let photoNode;

        if (photoSrc) {
            const img = document.createElement("img");
            img.src = photoSrc;
            img.alt = event.title;
            img.classList.add("timeline-photo");
            photoNode = img;
        } else {
            const placeholder = document.createElement("div");
            placeholder.classList.add("timeline-photo", "timeline-photo-placeholder");
            placeholder.textContent = "❤";
            photoNode = placeholder;
        }

        const text = document.createElement("div");
        text.classList.add("timeline-text");

        const title = document.createElement("div");
        title.classList.add("timeline-title");
        title.textContent = event.title;

        const description = document.createElement("div");
        description.classList.add("timeline-description");
        description.textContent = event.description;

        text.appendChild(title);
        text.appendChild(description);

        item.appendChild(photoNode);
        item.appendChild(text);

        list.appendChild(item);
    });

    initCapybaraGalleryEgg(list);
}

// =============================
// 5. Reasons I Love You
// =============================

const reasons = [
    "You feel like home, even when everything else feels chaotic.",
    "You laugh at the dumbest things with me, and somehow it always makes my day.",
    "You steal my bed and I don’t mind—even when I’m clinging to the edge.",
    "You make even pitch-black beaches feel special.",
    "You turn boring days into something I actually remember.",
    "You’re the only person I want to tell everything to, good or bad.",
    "You somehow make me feel calm and excited at the same time.",
    "You look at me like I’m your person, and it melts me every time.",
    "Your sleepy face when you’ve basically moved into my bed forever.",
    "You turn “let’s hang out for a bit” into “wow it’s 3am again”.",
    "You make my room, my bed, and my whole life feel less empty.",
    "You remember tiny things I say and surprise me with them later.",
    "You let me see the soft, unfiltered version of you.",
    "You make me actually look forward to growing and changing.",
    "You make college chaos feel like an inside joke we’re in together.",
    "You somehow convince me to be social and I never regret it.",
    "You listen when I ramble about random things that don’t matter.",
    "You smell really, really good. Objectively.",
    "You hold my hand like you never want to let go.",
    "You send me the most unhinged memes and it’s peak romance.",
    "You trust me with the versions of you other people don’t see.",
    "You are both my safe place and my favorite adventure.",
    "You make me feel like I’m exactly where I’m supposed to be.",
    "You’re soft and kind in a way that feels rare.",
    "You have a whole personality built around capybaras and somehow it’s perfect.",
    "You let me be the one who gives you massages even when my hands are tired.",
    "You’re my favorite person to be high and stupid with.",
    "You make stuffed animals and Coke Cola look like essential life choices.",
    "You made my bed ours without even trying.",
    "You make me feel loved without needing big speeches or fancy words.",
    "You turn ordinary nights into core memories.",
    "With you, nothing has to go “perfectly” to still be perfect."
];

let shownReasonsCount = 0;
const REASONS_TO_UNLOCK = 6;

function showReason() {
    const display = document.getElementById("reason-display");
    const continueBtn = document.getElementById("reasons-continue");
    if (!display) return;

    const randomIndex = Math.floor(Math.random() * reasons.length);
    const reason = reasons[randomIndex];

    display.classList.remove("visible");
    setTimeout(() => {
        display.textContent = reason;
        display.classList.add("visible");
    }, 20);

    shownReasonsCount += 1;
    if (shownReasonsCount >= REASONS_TO_UNLOCK && continueBtn) {
        continueBtn.style.display = "inline-flex";
    }
}

// =============================
// 6. Final Question + NO button easter egg
// =============================

let runawayCount = 0;
let noHoverCount = 0;

const runawayTexts = [
    "Are you sure? 😳",
    "Really sure?? 🥺",
    "Last chance! 💔",
    "Think again… 😢",
    "Please say yes 😘"
];

const capyNoTexts = [
    "capybara said yes",
    "don’t disappoint the capybara",
    "be nice 😭",
    "just press yes"
];

function runawayButton(event) {
    const noBtn = document.getElementById("no-button");
    if (!noBtn) return;

    const rect = noBtn.getBoundingClientRect();

    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance > 160) return;

    runawayCount += 1;
    noHoverCount += 1;

    const containerRect = document.body.getBoundingClientRect();

    const maxX = containerRect.width - rect.width - 16;
    const maxY = containerRect.height - rect.height - 16;

    const randomX = Math.max(8, Math.random() * maxX);
    const randomY = Math.max(60, Math.random() * maxY);

    noBtn.style.position = "fixed";
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;

    const scale = Math.max(0.65, 1 - runawayCount * 0.06);
    noBtn.style.transform = `scale(${scale})`;

    if (noHoverCount >= 5) {
        const textIndex = Math.floor(Math.random() * capyNoTexts.length);
        noBtn.textContent = capyNoTexts[textIndex];
    } else {
        const textIndex = Math.min(runawayTexts.length - 1, runawayCount - 1);
        noBtn.textContent = runawayTexts[textIndex];
    }
}

function handleYesClick() {
    const yesBtn = document.getElementById("yes-button");
    const noBtn = document.getElementById("no-button");
    const finalMsg = document.getElementById("final-message");
    const audio = document.getElementById("bg-music");

    if (yesBtn) {
        yesBtn.classList.add("yes-pulse");
        yesBtn.disabled = true;
    }
    if (noBtn) {
        noBtn.style.display = "none";
    }

    showConfetti(130);

    if (finalMsg) {
        finalMsg.textContent = "Obviously 💕 I love you. (Also yes, you’re officially my Valentine.)";
        finalMsg.classList.add("visible");
    }

    if (audio && typeof audio.play === "function") {
        audio.volume = 0.55;
        audio.play().catch(() => {});
    }

    spawnCapybaraParade();
}

// =============================
// Confetti
// =============================

function showConfetti(count = 80) {
    const container = document.getElementById("confetti-container");
    if (!container) return;

    const colors = ["#ff4c8b", "#ffb6c9", "#ffd166", "#9b5de5", "#00bbf9"];
    const docWidth = window.innerWidth;

    for (let i = 0; i < count; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti-piece");
        confetti.style.left = Math.random() * docWidth + "px";
        confetti.style.top = "-20px";

        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        const delay = Math.random() * 0.8;
        const duration = 1.3 + Math.random() * 1;
        confetti.style.animationDelay = `${delay}s`;
        confetti.style.animationDuration = `${duration}s`;

        const rotate = Math.random() * 360;
        confetti.style.transform = `rotate(${rotate}deg)`;

        container.appendChild(confetti);

        setTimeout(() => {
            if (confetti.parentNode) {
                confetti.parentNode.removeChild(confetti);
            }
        }, (delay + duration) * 1000 + 120);
    }
}

// =============================
// Floating Hearts Background
// =============================

function initFloatingHearts() {
    const container = document.querySelector(".floating-hearts");
    if (!container) return;

    function createHeart() {
        const heart = document.createElement("div");
        heart.classList.add("floating-heart");
        heart.textContent = "❤";
        const size = 14 + Math.random() * 10;
        heart.style.fontSize = `${size}px`;
        heart.style.left = Math.random() * 100 + "%";
        heart.style.animationDuration = 6 + Math.random() * 4 + "s";
        heart.style.opacity = "0";

        container.appendChild(heart);

        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 10000);
    }

    for (let i = 0; i < 10; i++) {
        setTimeout(createHeart, i * 300);
    }

    setInterval(createHeart, 800);
}

// =============================
// Capybara Easter Eggs
// =============================

function spawnCapybara() {
    const el = document.createElement("div");
    el.classList.add("capy-floating");

    const img = document.createElement("img");
    img.src = CAPY_IMAGE_SRC;
    img.alt = "Secret capybara";

    img.onerror = () => {
        el.innerHTML = "<span>🦫</span>";
    };

    el.appendChild(img);

    const startY = 40 + Math.random() * (window.innerHeight * 0.4);
    el.style.top = `${startY}px`;

    document.body.appendChild(el);

    const handleClick = (ev) => {
        ev.stopPropagation();
        showCapybaraHearts(ev.clientX, ev.clientY);
        showCapybaraToast("capybara approved 🦫");
        el.removeEventListener("click", handleClick);
        if (el.parentNode) el.parentNode.removeChild(el);
    };

    el.addEventListener("click", handleClick);

    setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
    }, 13000);
}

function showCapybaraHearts(x, y) {
    for (let i = 0; i < 8; i++) {
        const heart = document.createElement("div");
        heart.classList.add("capy-heart");
        heart.textContent = "🩷";
        const offsetX = (Math.random() - 0.5) * 40;
        const offsetY = (Math.random() - 0.5) * 20;
        heart.style.left = `${x + offsetX}px`;
        heart.style.top = `${y + offsetY}px`;
        heart.style.animationDelay = `${Math.random() * 0.2}s`;

        document.body.appendChild(heart);
        setTimeout(() => {
            if (heart.parentNode) heart.parentNode.removeChild(heart);
        }, 1100);
    }
}

function showCapybaraToast(message) {
    const existing = document.querySelector(".capy-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.classList.add("capy-toast");
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.add("show");
    });

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => {
            if (toast.parentNode) toast.parentNode.removeChild(toast);
        }, 250);
    }, 1500);
}

function initFloatingCapybara() {
    setTimeout(() => {
        spawnCapybara();
        setInterval(spawnCapybara, 25000 + Math.random() * 10000);
    }, 8000);
}

let konamiBuffer = [];
let capybaraModeEnabled = false;
const KONAMI_SEQUENCE = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a"
];

function initKonamiCode() {
    window.addEventListener("keydown", (e) => {
        konamiBuffer.push(e.key);
        if (konamiBuffer.length > KONAMI_SEQUENCE.length) {
            konamiBuffer.shift();
        }

        const normalized = konamiBuffer.map((k) => k.toLowerCase());
        const target = KONAMI_SEQUENCE.map((k) => k.toLowerCase());

        if (normalized.length === target.length &&
            normalized.every((v, i) => v === target[i])) {
            triggerCapybaraMode();
            konamiBuffer = [];
        }
    });
}

function triggerCapybaraMode() {
    if (capybaraModeEnabled) return;
    capybaraModeEnabled = true;

    document.body.classList.add("capy-mode-hearts");

    const overlay = document.createElement("div");
    overlay.classList.add("capy-overlay");

    const content = document.createElement("div");
    content.classList.add("capy-overlay-content");

    const img = document.createElement("img");
    img.classList.add("capy-overlay-img");
    img.src = CAPY_IMAGE_SRC;
    img.alt = "Capybara mode";

    img.onerror = () => {
        img.remove();
        const span = document.createElement("span");
        span.classList.add("capy-overlay-img");
        span.textContent = "🦫";
        content.appendChild(span);
    };

    const text = document.createElement("div");
    text.classList.add("capy-overlay-text");
    text.textContent = "You unlocked Capybara Mode";

    content.appendChild(img);
    content.appendChild(text);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    showConfetti(90);

    overlay.addEventListener("click", () => {
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    });
}

let globalClickCount = 0;

function capybaraPeek() {
    const existing = document.querySelector(".capy-peek");
    if (existing) return;

    const el = document.createElement("div");
    el.classList.add("capy-peek");

    const img = document.createElement("img");
    img.src = CAPY_IMAGE_SRC;
    img.alt = "Peeking capybara";

    img.onerror = () => {
        el.innerHTML = "<span>🦫</span>";
    };

    el.appendChild(img);
    document.body.appendChild(el);

    setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
    }, 2200);
}

function initCapybaraClickCounter() {
    document.addEventListener("click", (e) => {
        if (
            e.target.closest(".capy-floating") ||
            e.target.closest(".capy-overlay") ||
            e.target.closest(".capy-toast")
        ) {
            return;
        }

        globalClickCount += 1;
        if (globalClickCount >= 10) {
            capybaraPeek();
            globalClickCount = 0;
        }
    });
}

function spawnCapybaraParade() {
    const el = document.createElement("div");
    el.classList.add("capy-walk");

    const img = document.createElement("img");
    img.src = CAPY_IMAGE_SRC;
    img.alt = "Victory capybara";

    img.onerror = () => {
        el.innerHTML = "<span>🦫</span>";
    };

    el.appendChild(img);
    document.body.appendChild(el);

    setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
    }, 7500);
}

// =============================
// Event Wiring
// =============================

document.addEventListener("DOMContentLoaded", () => {
    const envelope = document.getElementById("envelope");
    if (envelope) {
        envelope.addEventListener("click", openEnvelope);
    }

    const letterContinue = document.getElementById("letter-continue");
    if (letterContinue) {
        letterContinue.addEventListener("click", () => {
            showSection("puzzle-section");
            initPuzzle();
        });
    }

    const puzzleContinue = document.getElementById("puzzle-continue");
    if (puzzleContinue) {
        puzzleContinue.addEventListener("click", () => {
            showSection("timeline-section");
            initTimeline();
        });
    }

    const puzzleReshuffle = document.getElementById("puzzle-reshuffle");
    if (puzzleReshuffle) {
        puzzleReshuffle.addEventListener("click", () => {
            if (photos[0]) {
                shufflePuzzle();
            }
        });
    }

    const puzzleSkip = document.getElementById("puzzle-skip");
    if (puzzleSkip) {
        puzzleSkip.addEventListener("click", () => {
            const message = document.getElementById("puzzle-message");
            const continueBtn = document.getElementById("puzzle-continue");
            if (message) {
                message.textContent = "Sometimes skipping ahead is okay too ❤️";
            }
            if (continueBtn) {
                continueBtn.style.display = "inline-flex";
            }
        });
    }

    const timelineContinue = document.getElementById("timeline-continue");
    if (timelineContinue) {
        timelineContinue.addEventListener("click", () => {
            showSection("fun-section");
        });
    }

    const funContinue = document.getElementById("fun-continue");
    if (funContinue) {
        funContinue.addEventListener("click", () => {
            showSection("reasons-section");
        });
    }

    const reasonButton = document.getElementById("reason-button");
    if (reasonButton) {
        reasonButton.addEventListener("click", showReason);
    }

    const reasonsContinue = document.getElementById("reasons-continue");
    if (reasonsContinue) {
        reasonsContinue.addEventListener("click", () => {
            showSection("final-section");
        });
    }

    const yesButton = document.getElementById("yes-button");
    if (yesButton) {
        yesButton.addEventListener("click", handleYesClick);
    }

    const noButton = document.getElementById("no-button");
    if (noButton) {
        document.addEventListener("mousemove", runawayButton);
        noButton.addEventListener("mouseenter", runawayButton);
    }

    initFloatingHearts();
    initKonamiCode();
    initFloatingCapybara();
    initCapybaraClickCounter();
});
