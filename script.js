// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
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

    // Observe feature cards, screenshots, and support cards
    const animatedElements = document.querySelectorAll('.feature-card, .screenshot-item, .support-card, .download-card');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Download counter functionality - global counter
    let downloadCount = 0;
    const downloadCountElement = document.getElementById('download-count');
    
    // Use a more reliable counter service
    const COUNTER_KEY = 'downloads';
    const COUNTER_NAMESPACE = 'desktoppet';
    
    // Fetch download count from reliable service
    async function fetchDownloadCount() {
        console.log('Fetching download count from:', `https://api.countapi.xyz/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`);
        
        try {
            // Try the primary countapi service
            const response = await fetch(`https://api.countapi.xyz/get/${COUNTER_NAMESPACE}/${COUNTER_KEY}`);
            console.log('API Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('API Response data:', data);
                downloadCount = data.value || 0;
                if (downloadCountElement) {
                    downloadCountElement.textContent = downloadCount.toLocaleString();
                }
                console.log('Download count loaded from API:', downloadCount);
                return;
            } else {
                console.log('API Response not OK:', response.status, response.statusText);
            }
        } catch (error) {
            console.log('Primary API failed:', error);
        }
        
        // Try alternative service
        try {
            const response = await fetch(`https://api.countapi.xyz/get/${COUNTER_NAMESPACE}/total`);
            if (response.ok) {
                const data = await response.json();
                downloadCount = data.value || 0;
                if (downloadCountElement) {
                    downloadCountElement.textContent = downloadCount.toLocaleString();
                }
                console.log('Download count loaded from backup API:', downloadCount);
                return;
            }
        } catch (error) {
            console.log('Backup API failed:', error);
        }
        
        // If all APIs fail, use localStorage as fallback
        console.log('All APIs failed, using localStorage fallback');
        downloadCount = parseInt(localStorage.getItem('downloadCount') || '0');
        if (downloadCountElement) {
            downloadCountElement.textContent = downloadCount.toLocaleString();
        }
    }
    
    function incrementDownloadCount() {
        // Increment on the primary service
        fetch(`https://api.countapi.xyz/hit/${COUNTER_NAMESPACE}/${COUNTER_KEY}`)
            .then(response => response.json())
            .then(data => {
                downloadCount = data.value || downloadCount + 1;
                if (downloadCountElement) {
                    downloadCountElement.textContent = downloadCount.toLocaleString();
                }
                console.log('Download count incremented:', downloadCount);
            })
            .catch(error => {
                console.log('Primary increment failed, trying backup');
                
                // Try backup service
                fetch(`https://api.countapi.xyz/hit/${COUNTER_NAMESPACE}/total`)
                    .then(response => response.json())
                    .then(data => {
                        downloadCount = data.value || downloadCount + 1;
                        if (downloadCountElement) {
                            downloadCountElement.textContent = downloadCount.toLocaleString();
                        }
                        console.log('Download count incremented via backup:', downloadCount);
                    })
                    .catch(backupError => {
                        // Final fallback to localStorage
                        console.log('All services failed, using localStorage');
                        downloadCount++;
                        localStorage.setItem('downloadCount', downloadCount.toString());
                        if (downloadCountElement) {
                            downloadCountElement.textContent = downloadCount.toLocaleString();
                        }
                    });
            });
    }

    // Load initial count
    fetchDownloadCount();
    
    // Download button functionality
    const downloadWindows = document.getElementById('download-windows');
    const downloadMacos = document.getElementById('download-macos');
    
    if (downloadWindows) {
        downloadWindows.addEventListener('click', function(e) {
            console.log('Windows download clicked');
            incrementDownloadCount();
        });
    }
    
    if (downloadMacos) {
        downloadMacos.addEventListener('click', function(e) {
            console.log('macOS download clicked');
            incrementDownloadCount();
        });
    }
    
    // TEMPORARY: Reset counter function (remove after testing)
    window.resetDownloadCounter = function() {
        console.log('Resetting download counter...');
        fetch(`https://api.countapi.xyz/set/${COUNTER_NAMESPACE}/${COUNTER_KEY}?value=0`)
            .then(response => response.json())
            .then(data => {
                console.log('Counter reset response:', data);
                downloadCount = 0;
                if (downloadCountElement) {
                    downloadCountElement.textContent = '0';
                }
                alert('Counter reset to 0! Now test on both devices.');
            })
            .catch(error => {
                console.log('Reset failed:', error);
                alert('Reset failed. Check console for details.');
            });
    };
    
    // Add reset button for testing
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Counter (Test)';
    resetButton.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999; padding: 8px 12px; background: #ff6b6b; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 12px;';
    resetButton.onclick = window.resetDownloadCounter;
    document.body.appendChild(resetButton);
    

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
