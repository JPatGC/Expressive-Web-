document.addEventListener('DOMContentLoaded', () => {
    // Get navigation elements
    const navButtons = document.querySelectorAll('.nav-button');
    const enterButton = document.querySelector('.enter-button');
    const mapMarkers = document.querySelectorAll('.map-marker');
    const galleryImgs = document.querySelectorAll('.gallery-img');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Music player functionality
    let currentAudio = null;

    // Function to pause all audio
    function pauseAllAudio() {
        const allAudios = document.querySelectorAll('audio');
        allAudios.forEach(audio => {
            audio.pause();
            const parentControls = audio.parentElement;
            if (parentControls) {
                const playButton = parentControls.querySelector('.play-pause');
                if (playButton) {
                    const icon = playButton.querySelector('.music-icon');
                    if (icon) icon.textContent = '▶';
                }
            }
        });
    }
    
    // Function to switch between pages
    function switchSpace(targetId) {
        console.log("Switching to:", targetId);
        
        // Pause all audio when switching spaces
        pauseAllAudio();
        
        // Hide all spaces
        document.querySelectorAll('.space').forEach(space => {
            space.classList.remove('active');
        });
        
        // Show target space
        const targetSpace = document.getElementById(targetId);
        if (targetSpace) {
            targetSpace.classList.add('active');
            
            // Auto-play the music for the current space (uncomment if you want auto-play)
            
            setTimeout(() => {
                const audio = targetSpace.querySelector('audio');
                if (audio) {
                    audio.play().catch(e => console.error('Could not autoplay audio:', e));
                    const playButton = targetSpace.querySelector('.play-pause');
                    if (playButton) {
                        const icon = playButton.querySelector('.music-icon');
                        if (icon) icon.textContent = '❚❚';
                    }
                    currentAudio = audio;
                }
            }, 1000);
            
        } else {
            console.error(`Target space with id "${targetId}" not found`);
        }
    }
    
    // Navigation button event listeners
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            switchSpace(targetId);
        });
    });
    
    // Enter button event listener
    if (enterButton) {
        enterButton.addEventListener('click', () => {
            switchSpace('athens');
        });
    }
    
    // Map marker event listeners
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const targetId = marker.getAttribute('data-target');
            if (targetId) {
                switchSpace(targetId);
            }
        });
    });
    
    // Image popup functionality for Athens
    const athensMainImg = document.getElementById('athens-main-img');
    const athensPopup = document.getElementById('athens-popup');
    
    if (athensMainImg && athensPopup) {
        // Open popup when clicking on main Athens image
        athensMainImg.addEventListener('click', () => {
            athensPopup.style.display = 'flex';
        });
        
        // Close popup when clicking on X
        const closeBtn = athensPopup.querySelector('.popup-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                athensPopup.style.display = 'none';
            });
        }
        
        // Close popup when clicking outside content
        athensPopup.addEventListener('click', (e) => {
            if (e.target === athensPopup) {
                athensPopup.style.display = 'none';
            }
        });
    }
    
    // Thumbnail functionality - switch main image when clicking thumbnails
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Get parent gallery container
            const gallery = this.closest('.gallery-container');
            if (gallery) {
                const mainImg = gallery.querySelector('.main-image img');
                if (mainImg) {
                    mainImg.src = this.src;
                    mainImg.alt = this.alt;
                }
            }
        });
    });
    
    // Optional - image error handling
    const mapImage = document.querySelector('.greece-map-img');
    if (mapImage) {
        mapImage.onerror = function() {
            this.onerror = null;
            this.style.height = '300px';
            this.style.backgroundColor = '#e0e9f0';
            this.style.border = '3px solid #3a6ea5';
            console.log('Could not load map image, using fallback style');
        };
    }
    
    // Handle gallery image errors
    const allImages = document.querySelectorAll('img');
    allImages.forEach(img => {
        img.onerror = function() {
            this.onerror = null;
            this.src = '';
            this.style.backgroundColor = '#f8f9fa';
            console.log('Could not load image, using fallback style');
        };
    });
    
    // Set up music controls
    const musicControls = document.querySelectorAll('.music-controls');
    musicControls.forEach(control => {
        const playPauseBtn = control.querySelector('.play-pause');
        const volumeSlider = control.querySelector('.volume-slider');
        const audio = control.querySelector('audio');
        
        if (playPauseBtn && audio) {
            playPauseBtn.addEventListener('click', () => {
                const icon = playPauseBtn.querySelector('.music-icon');
                
                if (audio.paused) {
                    // Pause any currently playing audio
                    pauseAllAudio();
                    
                    // Play this audio
                    audio.play().catch(e => {
                        console.error('Error playing audio:', e);
                        alert('Could not play audio. Make sure your audio files exist in an "audio" folder.');
                    });
                    
                    if (icon) icon.textContent = '❚❚';
                    currentAudio = audio;
                } else {
                    audio.pause();
                    if (icon) icon.textContent = '▶';
                    currentAudio = null;
                }
            });
        }
        
        if (volumeSlider && audio) {
            // Set initial volume
            audio.volume = volumeSlider.value / 100;
            
            // Update volume when slider is changed
            volumeSlider.addEventListener('input', () => {
                audio.volume = volumeSlider.value / 100;
            });
        }
    });
});