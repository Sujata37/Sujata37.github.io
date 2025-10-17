// Get a reference to the span where the text will be typed
const typingSpan = document.querySelector(".typing");

// Get a NodeList of all the list items containing the text
const phrases = document.querySelectorAll(".typing-text ul li span");

// Convert the NodeList into an array for easier manipulation
const phrasesArray = Array.from(phrases).map(item => item.textContent);

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 150; // Speed of typing
const deletingSpeed = 75; // Speed of deleting
const pauseBetweenPhrases = 1500; // Pause after a phrase is fully typed

function typeEffect() {
    // Determine the current phrase to type
    const currentPhrase = phrasesArray[phraseIndex];

    if (!isDeleting) {
        // Typing
        if (charIndex < currentPhrase.length) {
            typingSpan.textContent += currentPhrase.charAt(charIndex);
            charIndex++;
            setTimeout(typeEffect, typingSpeed);
        } else {
            // After typing is complete, set a timeout to start deleting
            isDeleting = true;
            setTimeout(typeEffect, pauseBetweenPhrases);
        }
    } else {
        // Deleting
        if (charIndex > 0) {
            typingSpan.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeEffect, deletingSpeed);
        } else {
            // After deleting is complete, move to the next phrase
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrasesArray.length; // Loop back to the start
            setTimeout(typeEffect, typingSpeed);
        }
    }
}

// Start the animation when the page loads
document.addEventListener("DOMContentLoaded", () => {
    // Hide the original list items so only the animation is visible
    document.querySelector(".typing-text ul").style.display = "none";
    typeEffect();
});

// Sticky Navigation Bar
const nav = document.querySelector('.site-nav');

// Add a scroll event listener to toggle the 'is-stuck' class for styling (optional)
window.addEventListener('scroll', function() {
    if (document.documentElement.scrollTop > 20) {
        nav.classList.add('is-stuck');
    } else {
        nav.classList.remove('is-stuck');
    }
});

// Highlight nav links when sections are in view using IntersectionObserver
document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.site-nav a');
    const sections = Array.from(document.querySelectorAll('section[id]'));

    const observerOptions = {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // trigger when section is near middle
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute('id');
            const link = document.querySelector(`.site-nav a[href="#${id}"]`);
            if (entry.isIntersecting) {
                links.forEach(l => l.classList.remove('active'));
                if (link) link.classList.add('active');
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
});

// Animate skill progress bars when skills section is visible
document.addEventListener('DOMContentLoaded', () => {
    const skillsSection = document.querySelector('#skills');
    if (!skillsSection) return;

    const skillBars = skillsSection.querySelectorAll('.progress-bar');

    const skillsObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    // prefer data-pct attribute if present, else use inline style width
                    const dataPct = bar.getAttribute('data-pct');
                    let target = null;
                    if (dataPct) target = dataPct.replace('%','').trim();
                    if (!target) {
                        const inline = bar.style.width || '';
                        target = inline.replace('%','').trim() || '0';
                    }
                    // set width to trigger CSS transition
                    bar.style.width = target + '%';
                });
                obs.unobserve(skillsSection);
            }
        });
    }, {root: null, threshold: 0.3});

    skillsObserver.observe(skillsSection);
});

// removed leftover snippet that manipulated span widths