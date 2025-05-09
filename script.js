document.addEventListener('DOMContentLoaded', () => {
    // making all navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    const enterButton = document.querySelector('.enter-button');
    const locationMarkers = document.querySelectorAll('.location-marker');
    const locationLabels = document.querySelectorAll('.location-label');
    
    console.log("Enter button found:", enterButton); // Debug line to check if enter button is found
    
    // Audio objects for each location
    const audioPlayers = {
        athens: new Audio('./audio/athens-music.mp3'),
        rhodes: new Audio('./audio/rhodes-music.mp3'),
        patmos: new Audio('./audio/patmos-music.mp3')
    };
    
    // Set loop and volume for all audio players
    Object.values(audioPlayers).forEach(player => {
        player.loop = true;
        player.volume = 0.5;
    });
    
    // Function to stop all audio
    function stopAllAudio() {
        Object.values(audioPlayers).forEach(player => {
            player.pause();
            player.currentTime = 0;
        });
    }

    // switch between spaces
    function switchSpace(targetId) {
        console.log("Switching to:", targetId); // Debug line
        
        // Hide all spaces
        document.querySelectorAll('.space').forEach(space => {
            space.classList.remove('active');
        });
        
        // Stop all audio when switching spaces
        stopAllAudio();
        
        // Show target space
        const targetSpace = document.getElementById(targetId);
        if (targetSpace) {
            targetSpace.classList.add('active');
            
            // Play music automatically when entering a location (except entrance)
            if (targetId !== 'entrance' && audioPlayers[targetId]) {
                audioPlayers[targetId].play().catch(error => {
                    console.log('Audio autoplay prevented by browser:', error);
                    // We'll add music controls later for user-initiated playback
                });
            }
        } else {
            console.error(`Target space with id "${targetId}" not found`);
        }
    }

    // IMPORTANT: Setup event listeners for navigation buttons FIRST
    // event listeners
    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            switchSpace(targetId);
        });
    });

    // event listener for enter button
    if (enterButton) {
        console.log("Adding click event to enter button"); // Debug line
        enterButton.addEventListener('click', () => {
            console.log("Enter button clicked"); // Debug line
            switchSpace('athens');
        });
    } else {
        console.warn("Enter button not found!");
    }

    // event listeners for the location markers
    locationMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const targetId = marker.getAttribute('data-target');
            if (targetId) {
                switchSpace(targetId);
            }
        });
    });

    // event listeners to location labels
    locationLabels.forEach(label => {
        label.style.cursor = 'pointer';
        label.addEventListener('click', () => {
            const prev = label.previousElementSibling;
            if (prev && prev.classList.contains('location-marker')) {
                const targetId = prev.getAttribute('data-target');
                if (targetId) {
                    switchSpace(targetId);
                }
            }
        });
    });
    
    // Define locations after setting up critical navigation
    const locations = ['athens', 'rhodes', 'patmos'];
    
    // Create music controls for each location
    locations.forEach(location => {
        const locationDiv = document.getElementById(location);
        
        if (locationDiv) {
            // Create music control container
            const musicControls = document.createElement('div');
            musicControls.className = 'music-controls';
            
            // Create play/pause button
            const playPauseBtn = document.createElement('button');
            playPauseBtn.className = 'music-button play-pause';
            playPauseBtn.innerHTML = '<span class="music-icon">▶</span>';
            playPauseBtn.title = 'Play/Pause Music';
            
            // Create volume control
            const volumeControl = document.createElement('input');
            volumeControl.type = 'range';
            volumeControl.min = '0';
            volumeControl.max = '1';
            volumeControl.step = '0.1';
            volumeControl.value = '0.5';
            volumeControl.className = 'volume-slider';
            volumeControl.title = 'Volume';
            
            // Add the controls to the container
            musicControls.appendChild(playPauseBtn);
            musicControls.appendChild(volumeControl);
            
            // Add event listeners
            playPauseBtn.addEventListener('click', () => {
                const player = audioPlayers[location];
                if (player.paused) {
                    stopAllAudio(); // Stop any other playing audio
                    player.play();
                    playPauseBtn.innerHTML = '<span class="music-icon">⏸</span>';
                } else {
                    player.pause();
                    playPauseBtn.innerHTML = '<span class="music-icon">▶</span>';
                }
            });
            
            volumeControl.addEventListener('input', () => {
                audioPlayers[location].volume = volumeControl.value;
            });
            
            // Add the music controls to the page
            const navigationButtons = locationDiv.querySelector('.navigation-buttons');
            if (navigationButtons) {
                locationDiv.insertBefore(musicControls, navigationButtons);
            } else {
                locationDiv.appendChild(musicControls);
            }
        }
    });

    // Create popup for each main image in each location
    locations.forEach(location => {
        // Select the main image for this location
        const mainImage = document.querySelector(`#${location} .gallery-img`);
        
        if (mainImage) {
            // Create or select existing popup
            let popup = document.querySelector(`#${location}-popup`);
            
            if (!popup) {
                // Create popup if it doesn't exist
                popup = document.createElement('div');
                popup.id = `${location}-popup`;
                popup.className = 'image-popup';
                
                const popupContent = document.createElement('div');
                popupContent.className = 'popup-content';
                
                const closeButton = document.createElement('span');
                closeButton.className = 'popup-close';
                closeButton.innerHTML = '&times;';
                
                const popupTitle = document.createElement('h3');
                popupTitle.textContent = `${location.charAt(0).toUpperCase() + location.slice(1)} Memory`;
                
                const popupText = document.createElement('p');
                popupText.textContent = `My memories of ${location} are filled with beautiful moments and adventures.`;
                
                popupContent.appendChild(closeButton);
                popupContent.appendChild(popupTitle);
                popupContent.appendChild(popupText);
                popup.appendChild(popupContent);
                
                // Add popup after the main image
                mainImage.parentNode.appendChild(popup);
            }
            
            // Add click event to main image
            mainImage.addEventListener('click', () => {
                popup.style.display = 'flex';
            });
            
            // Add click event to close button
            const closeButton = popup.querySelector('.popup-close');
            if (closeButton) {
                closeButton.addEventListener('click', () => {
                    popup.style.display = 'none';
                });
            }
        }
    });

    // Update music controls when audio state changes
    function updateMusicControls() {
        locations.forEach(location => {
            const player = audioPlayers[location];
            const playPauseBtn = document.querySelector(`#${location} .play-pause`);
            
            if (playPauseBtn) {
                if (player.paused) {
                    playPauseBtn.innerHTML = '<span class="music-icon">▶</span>';
                } else {
                    playPauseBtn.innerHTML = '<span class="music-icon">⏸</span>';
                }
            }
        });
    }
    
    // thumbnail clicks
    document.querySelectorAll('.thumbnail').forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            const mainImage = thumbnail.closest('.gallery-container').querySelector('.gallery-img');
            const tempSrc = mainImage.src;
            mainImage.src = thumbnail.src;
            thumbnail.src = tempSrc;
            
            // a subtle animation
            mainImage.style.opacity = '0';
            setTimeout(() => {
                mainImage.style.opacity = '1';
            }, 50);
        });
    });

    // Add fade-in animation for images
    document.querySelectorAll('.gallery-img, .thumbnail').forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.5s ease';
        
        // to load images with a fade-in effect
        img.onload = () => {
            img.style.opacity = '1';
        };
        
        // If image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });
    
    // Close popup when clicking outside the content
    document.addEventListener('click', (event) => {
        document.querySelectorAll('.image-popup').forEach(popup => {
            if (event.target === popup) {
                popup.style.display = 'none';
                
                // Find which location this popup belongs to
                const locationId = popup.id.split('-')[0];
                // We don't pause the audio anymore when closing popup
                
                // Update the music controls
                updateMusicControls();
            }
        });
    });
    
    // Update music controls when audio plays or pauses
    Object.entries(audioPlayers).forEach(([location, player]) => {
        player.addEventListener('play', updateMusicControls);
        player.addEventListener('pause', updateMusicControls);
    });
});