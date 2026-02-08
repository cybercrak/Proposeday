// Game Variables
const gameArea = document.getElementById('gameArea');
const basket = document.getElementById('basket');
const gameScreen = document.getElementById('gameScreen');
const proposalScreen = document.getElementById('proposalScreen');
const loveMeterFill = document.getElementById('loveMeterFill');
const heartCountDisplay = document.getElementById('heartCount');
const letterBtn = document.getElementById('letterBtn');
const letterDialog = document.getElementById('letterDialog');
const closeBtn = document.querySelector('.close');
const heartsCollected = document.querySelector('.hearts-collected');

let heartsCaught = 0;
const maxHearts = 10;

// Love Quotes
const loveQuotes = [
    "Feeling soooo lucky to have you in my life 🔔uhh. I always stay with you even if the situation we dont understand each other. You might have a thought what if we change in future or you couldn`t able to be the same. Even if you change or I change, I will better understand you again and choose you over you always, leaving will never be an option for me so don't worry about it buddy. Sometimes i may not be able to share the pain of yours but always remeber i will be there for you always. Lets achieve our dreams together 💪. I Love you sooo much to the moon 🌕 and back , ofcourse lady you are my Beautiful Moon 😍. Let me keep my romance shorter like my hair for now :) "
]
// Track mouse position for basket movement (horizontal only)
document.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;
    
    // Move basket left/right based on mouseX
    // Clamp between 0 and window width
    const basketPos = Math.max(0, Math.min(mouseX, window.innerWidth));
    basket.style.left = basketPos + 'px';
    basket.style.transform = 'translateX(-50%)';
});

// Create falling hearts
function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = '❤️';
    
    // Random horizontal position
    const randomX = Math.random() * (window.innerWidth - 50);
    heart.style.left = randomX + 'px';
    heart.style.top = '-50px';
    
    // Random fall duration (3-6 seconds)
    const duration = 3 + Math.random() * 3;
    heart.style.animationDuration = duration + 's';
    heart.style.animation = `fall ${duration}s linear forwards`;
    
    gameArea.appendChild(heart);
    
    // Check for collision while falling
    const fallInterval = setInterval(() => {
        const heartRect = heart.getBoundingClientRect();
        const basketRect = basket.getBoundingClientRect();
        
        // Increased collision detection area for easier catching
        if (
            heartRect.left < basketRect.right - 10 &&
            heartRect.right > basketRect.left + 10 &&
            heartRect.top < basketRect.bottom + 10 &&
            heartRect.bottom > basketRect.top + 20
        ) {
            clearInterval(fallInterval);
            heartsCaught++;
            
            // Add heart to basket display
            const smallHeart = document.createElement('div');
            smallHeart.textContent = '❤️';
            smallHeart.style.fontSize = '0.6em';
            smallHeart.style.animation = 'popIn 0.3s ease';
            heartsCollected.appendChild(smallHeart);
            
            updateLoveMeter();
            
            // Add caught animation
            heart.classList.add('caught');
            setTimeout(() => {
                heart.remove();
            }, 500);
        }
        
        // Remove if fallen off screen
        if (heartRect.top > window.innerHeight) {
            clearInterval(fallInterval);
            heart.remove();
        }
    }, 30);
    
    // Auto remove after fall duration
    setTimeout(() => {
        if (heart.parentElement) {
            heart.remove();
        }
        clearInterval(fallInterval);
    }, (duration + 1) * 1000);
}

// Update love meter
function updateLoveMeter() {
    const percentage = (heartsCaught / maxHearts) * 100;
    loveMeterFill.style.width = percentage + '%';
    heartCountDisplay.textContent = `Hearts Caught: ${heartsCaught} / ${maxHearts}`;
    
    // Check if love meter is full
    if (heartsCaught >= maxHearts) {
        showProposalScreen();
    }
}

// Show proposal screen
function showProposalScreen() {
    gameScreen.classList.remove('active');
    proposalScreen.classList.add('active');
    
    // Add celebration animation
    createConfetti();
}

// Create confetti effect
function createConfetti() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = ['❤️', '💕', '💖', '💗', '💝', '✨'][Math.floor(Math.random() * 6)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-50px';
            confetti.style.fontSize = '2em';
            confetti.style.zIndex = '100';
            confetti.style.animation = 'fall 3s linear';
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 100);
    }
}

// Letter button click
letterBtn.addEventListener('click', () => {
    displayAllQuotes();
    letterDialog.classList.add('show');
});

// Close dialog
closeBtn.addEventListener('click', () => {
    letterDialog.classList.remove('show');
});

// Click outside modal to close
window.addEventListener('click', (e) => {
    if (e.target === letterDialog) {
        letterDialog.classList.remove('show');
    }
});

// Display all quotes on one page
function displayAllQuotes() {
    const quoteContainer = document.getElementById('quoteContainer');
    quoteContainer.innerHTML = '';
    
    loveQuotes.forEach((quote, index) => {
        const quoteDiv = document.createElement('p');
        quoteDiv.className = 'quote-text';
        quoteDiv.textContent = '"' + quote + '"';
        quoteContainer.appendChild(quoteDiv);
        
        // Add signature without line break
        const signatureDiv = document.createElement('p');
        signatureDiv.className = 'signature-text';
        signatureDiv.innerHTML = 'Yours lovingly<br>Sarran 🐻';
        quoteContainer.appendChild(signatureDiv);
    });
}

// Start game
function startGame() {
    // Create hearts at intervals
    let heartCounter = 0;
    const heartInterval = setInterval(() => {
        if (heartCounter < maxHearts + 5) { // Extra hearts for practice
            createHeart();
            heartCounter++;
        }
        
        // Continue spawning hearts periodically
        if (heartCounter > maxHearts) {
            if (heartCounter < maxHearts + 5) {
                createHeart();
            }
        }
    }, 1500); // New heart every 1.5 seconds
    
    // Stop spawning when proposal screen is shown
    const originalAddClass = proposalScreen.classList.add;
    const checkAndStop = setInterval(() => {
        if (proposalScreen.classList.contains('active')) {
            clearInterval(heartInterval);
            clearInterval(checkAndStop);
        }
    }, 100);
}

// Initialize game
startGame();

// Handle window resize
window.addEventListener('resize', () => {
    // Adjust if needed
});
