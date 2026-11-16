// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links, including ones added after load.
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        if (!link) {
            return;
        }

        const targetId = link.getAttribute('href');
        if (!targetId || targetId === '#') {
            return;
        }

        const targetSection = document.querySelector(targetId);
        if (!targetSection || targetSection.hidden) {
            return;
        }

        e.preventDefault();
        window.scrollTo({
            top: targetSection.offsetTop - 70,
            behavior: 'smooth'
        });
    });

    // Mobile navigation toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards, screenshots, support cards, and feedback options
    const animatedElements = document.querySelectorAll('.feature-card, .screenshot-item, .support-card, .download-card, .feedback-option');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // downloads.json keeps the last known total. When "api" is set, the live
    // count comes from the Cloudflare counter and download clicks add 1.
    const DOWNLOAD_COUNT_URL = 'downloads.json';
    const DOWNLOAD_COUNT_FALLBACK = 20673;
    const downloadCountElement = document.getElementById('download-count');
    let downloadCounterApi = '';

    async function loadDownloadCounter() {
        let downloadCount = DOWNLOAD_COUNT_FALLBACK;

        try {
            const response = await fetch(`${DOWNLOAD_COUNT_URL}?t=${Date.now()}`);
            if (response.ok) {
                const data = await response.json();
                const count = Number(data.count);
                if (Number.isFinite(count)) {
                    downloadCount = count;
                }
                if (typeof data.api === 'string') {
                    downloadCounterApi = data.api.trim().replace(/\/$/, '');
                }
            }
        } catch (error) {
            // Keep the seeded total if the file cannot be loaded.
        }

        if (downloadCounterApi) {
            try {
                const response = await fetch(downloadCounterApi);
                if (response.ok) {
                    const data = await response.json();
                    const count = Number(data.count);
                    if (Number.isFinite(count)) {
                        downloadCount = count;
                    }
                }
            } catch (error) {
                // Show the saved total when the live counter cannot be reached.
            }
        }

        if (downloadCountElement) {
            downloadCountElement.textContent = downloadCount.toLocaleString();
        }

        loadAnnouncement();
    }

    function safeAnnouncementHref(href) {
        if (typeof href !== 'string') {
            return '';
        }

        const value = href.trim();
        if (value.startsWith('#') && !value.startsWith('#//') && !value.includes('\\')) {
            return value;
        }
        if (/^[a-z0-9][a-z0-9._-]*\.html(?:#[A-Za-z0-9_-]+)?$/i.test(value)) {
            return value;
        }
        if (value.startsWith('mailto:') && !/[\s]/.test(value)) {
            return value;
        }

        try {
            const url = new URL(value);
            if (url.protocol === 'https:') {
                return url.href;
            }
        } catch (error) {
            return '';
        }

        return '';
    }

    function addText(parent, tag, text, className) {
        if (typeof text !== 'string' || !text.trim()) {
            return;
        }
        const element = document.createElement(tag);
        if (className) {
            element.className = className;
        }
        element.textContent = text;
        parent.appendChild(element);
    }

    function renderAnnouncement(announcement) {
        const card = document.createElement('article');
        card.className = 'announcement-card';

        addText(card, 'p', announcement.published, 'announcement-date');
        addText(card, 'h3', announcement.title);

        const blocks = Array.isArray(announcement.blocks) ? announcement.blocks : [];
        blocks.forEach((block) => {
            if (!block || typeof block.type !== 'string') {
                return;
            }

            if (block.type === 'heading') {
                addText(card, 'h4', block.text);
                return;
            }

            if (block.type === 'paragraph') {
                addText(card, 'p', block.text);
                return;
            }

            if (block.type !== 'list' || !Array.isArray(block.items)) {
                return;
            }

            const list = document.createElement('ul');
            list.className = 'announcement-points';
            block.items.forEach((item) => {
                if (!item) {
                    return;
                }
                const point = document.createElement('li');
                addText(point, 'strong', item.title);
                addText(point, 'p', item.text);
                addText(point, 'p', item.note, 'announcement-note');
                if (point.childNodes.length) {
                    list.appendChild(point);
                }
            });
            if (list.childNodes.length) {
                card.appendChild(list);
            }
        });

        const actions = Array.isArray(announcement.actions) ? announcement.actions : [];
        const actionRow = document.createElement('div');
        actionRow.className = 'announcement-actions';
        actions.forEach((action, index) => {
            const href = safeAnnouncementHref(action && action.href);
            const label = action && typeof action.label === 'string' ? action.label.trim() : '';
            if (!href || !label) {
                return;
            }
            const link = document.createElement('a');
            link.className = index === 0 ? 'btn btn-primary' : 'btn btn-secondary';
            link.href = href;
            if (href.startsWith('https://')) {
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
            }
            link.textContent = label;
            actionRow.appendChild(link);
        });
        if (actionRow.childNodes.length) {
            card.appendChild(actionRow);
        }

        return card;
    }

    function setAnnouncementStatus(message) {
        const status = document.getElementById('announcement-status');
        if (!status) {
            return;
        }
        status.hidden = !message;
        status.textContent = message || '';
    }

    async function loadAnnouncement() {
        const list = document.getElementById('announcement-list');
        if (!list) {
            return;
        }
        if (!downloadCounterApi) {
            setAnnouncementStatus('The latest note could not be loaded.');
            return;
        }

        try {
            const response = await fetch(`${downloadCounterApi}/announcement`);
            if (!response.ok) {
                setAnnouncementStatus('The latest note could not be loaded.');
                return;
            }
            const data = await response.json();
            const announcements = Array.isArray(data.announcements) ? data.announcements : [];
            const cards = announcements
                .slice()
                .sort((a, b) => String(b.publishedAt || '').localeCompare(String(a.publishedAt || '')))
                .map(renderAnnouncement)
                .filter((card) => card.querySelector('h3, p, h4'));

            list.replaceChildren(...cards);
            setAnnouncementStatus(cards.length ? '' : 'There are no announcements yet.');
        } catch (error) {
            setAnnouncementStatus('The latest note could not be loaded.');
        }
    }

    function recordDownloadClick() {
        if (!downloadCounterApi) {
            return;
        }
        const url = `${downloadCounterApi}/hit`;
        if (typeof navigator.sendBeacon === 'function' && navigator.sendBeacon(url)) {
            return;
        }
        fetch(url, { method: 'POST', mode: 'cors', keepalive: true });
    }

    document.querySelectorAll('a[href$=".zip"], a[href$=".dmg"]').forEach((link) => {
        link.addEventListener('click', recordDownloadClick);
    });

    loadDownloadCounter();
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // Email subscription functionality
    window.subscribeToUpdates = function() {
        const emailInput = document.getElementById('email-input');
        const email = emailInput.value.trim();
        
        if (!email) {
            alert('Please enter a valid email address.');
            return;
        }
        
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // Show loading state
        const button = document.querySelector('.btn-primary');
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
        button.disabled = true;
        
        // For now, show a temporary message until MailerLite is set up
        setTimeout(() => {
            alert('Thank you for your interest! Email subscription is being set up. Please check back soon or contact us at support@desktoppet.app');
            emailInput.value = '';
            button.innerHTML = originalText;
            button.disabled = false;
        }, 1500);
        
        // TODO: Replace with actual MailerLite form integration
        // This will be updated once you complete the MailerLite setup
    };
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Enhanced pixelated cat animation in hero section
    const pixelCat = document.getElementById('pixel-cat');
    if (pixelCat) {
        // More comprehensive sprite sequences
        const animations = {
            idle: [
                'assets/cat/idle/idle000.png', 'assets/cat/idle/idle001.png', 
                'assets/cat/idle/idle002.png', 'assets/cat/idle/idle003.png',
                'assets/cat/idle/idle004.png', 'assets/cat/idle/idle005.png',
                'assets/cat/idle/idle006.png', 'assets/cat/idle/idle007.png'
            ],
            walk: [
                'assets/cat/walk/walk000.png', 'assets/cat/walk/walk001.png',
                'assets/cat/walk/walk002.png', 'assets/cat/walk/walk003.png',
                'assets/cat/walk/walk004.png', 'assets/cat/walk/walk005.png',
                'assets/cat/walk/walk006.png', 'assets/cat/walk/walk007.png',
                'assets/cat/walk/walk008.png', 'assets/cat/walk/walk009.png',
                'assets/cat/walk/walk010.png', 'assets/cat/walk/walk011.png'
            ],
            sleep: [
                'assets/cat/sleep/sleep000.png', 'assets/cat/sleep/sleep001.png',
                'assets/cat/sleep/sleep002.png', 'assets/cat/sleep/sleep003.png',
                'assets/cat/sleep/sleep004.png', 'assets/cat/sleep/sleep005.png',
                'assets/cat/sleep/sleep006.png', 'assets/cat/sleep/sleep007.png'
            ],
            lick: [
                'assets/cat/lick/lick000.png', 'assets/cat/lick/lick001.png',
                'assets/cat/lick/lick002.png', 'assets/cat/lick/lick003.png',
                'assets/cat/lick/lick004.png', 'assets/cat/lick/lick005.png',
                'assets/cat/lick/lick006.png', 'assets/cat/lick/lick007.png',
                'assets/cat/lick/lick008.png', 'assets/cat/lick/lick009.png',
                'assets/cat/lick/lick010.png', 'assets/cat/lick/lick011.png',
                'assets/cat/lick/lick012.png', 'assets/cat/lick/lick013.png',
                'assets/cat/lick/lick014.png'
            ],
            jump: [
                'assets/cat/jump/jump000.png', 'assets/cat/jump/jump001.png',
                'assets/cat/jump/jump002.png'
            ]
        };
        
        let currentAnimation = 'idle';
        let currentFrame = 0;
        let animationInterval;
        
        // Function to play animation sequence
        function playAnimation(animationName) {
            currentAnimation = animationName;
            currentFrame = 0;
            
            if (animationInterval) clearInterval(animationInterval);
            
            animationInterval = setInterval(() => {
                const frames = animations[animationName];
                pixelCat.src = frames[currentFrame];
                currentFrame = (currentFrame + 1) % frames.length;
            }, 150); // Faster frame rate for smoother animation
        }
        
        // Start with idle animation
        playAnimation('idle');
        
        // Change animation every 4-6 seconds
        setInterval(() => {
            const animationNames = Object.keys(animations);
            const randomAnimation = animationNames[Math.floor(Math.random() * animationNames.length)];
            playAnimation(randomAnimation);
        }, Math.random() * 2000 + 4000); // 4-6 seconds
        
        // Add random movement to the pet
        setInterval(() => {
            const randomX = Math.random() * 30 - 15;
            const randomY = Math.random() * 30 - 15;
            pixelCat.style.transform = `translate(${randomX}px, ${randomY}px) scale(1.2)`;
            
            // Reset transform after movement
            setTimeout(() => {
                pixelCat.style.transform = 'translate(0, 0) scale(1.2)';
            }, 1000);
        }, 5000);
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add click ripple effect to buttons
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Download modal function
function showDownloadModal(platform) {
    // Create modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 16px;
        max-width: 500px;
        width: 90%;
        text-align: center;
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;

    modalContent.innerHTML = `
        <div style="font-size: 3rem; margin-bottom: 1rem;">${platform === 'Windows' ? '🪟' : '🍎'}</div>
        <h2 style="margin-bottom: 1rem; color: #1e293b;">Download for ${platform}</h2>
        <p style="margin-bottom: 2rem; color: #64748b;">
            The download will start automatically. If it doesn't, 
            <a href="#" style="color: #6366f1; text-decoration: none;">click here</a>.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center;">
            <button onclick="this.closest('.modal-overlay').remove()" 
                    style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; 
                           background: #e2e8f0; color: #64748b; cursor: pointer; font-weight: 500;">
                Cancel
            </button>
            <button onclick="window.open('#', '_blank'); this.closest('.modal-overlay').remove()" 
                    style="padding: 0.75rem 1.5rem; border: none; border-radius: 8px; 
                           background: #6366f1; color: white; cursor: pointer; font-weight: 500;">
                Download Now
            </button>
        </div>
    `;

    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Animate modal in
    requestAnimationFrame(() => {
        modalOverlay.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    });

    // Close modal when clicking overlay
    modalOverlay.addEventListener('click', function(e) {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });

    // Close modal with Escape key
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modalOverlay.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            padding: 1rem;
            gap: 1rem;
        }
        
        .nav-toggle.active .bar:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .nav-toggle.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active .bar:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
`;
document.head.appendChild(style);
