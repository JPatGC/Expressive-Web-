// Initialize the map when the page loads
function initializeMap() {
    // Create map centered on Greece
    const map = L.map('interactive-map').setView([38.5, 24.5], 6);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
    }).addTo(map);

    // Define your destinations with corrected coordinates
    const destinations = [
        {
            name: 'Athens',
            coords: [37.983389, 23.727508],
            description: 'Where I met Viki, had sandals made by a poet, and discovered Eurovision.',
            target: 'athens'
        },
        {
            name: 'Rhodes',
            coords: [36.441039, 28.222527],
            description: 'Regal Rhodes with its medieval walled city and ancient temples. Where I found my favorite sweater.',
            target: 'rhodes'
        },
        {
            name: 'Patmos',
            coords: [37.308889, 26.549167],
            description: 'Memories of Patmos leave me speechless.',
            target: 'patmos'
        }
    ];

    // Use simpler, more reliable icon
    const customIcon = L.icon({
        iconUrl: 'data:image/svg+xml,' + encodeURIComponent(`
            <svg width="40" height="50" viewBox="0 0 40 50" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 0C8.955 0 0 8.955 0 20c0 14.286 20 30 20 30s20-15.714 20-30C40 8.955 31.045 0 20 0z" fill="#e74c3c"/>
                <circle cx="20" cy="20" r="8" fill="white"/>
            </svg>
        `),
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50]
    });

    // Add markers for each destination
    console.log('Adding markers for destinations:', destinations);
    
    destinations.forEach((dest, index) => {
        console.log(`Adding marker ${index + 1}: ${dest.name} at ${dest.coords}`);
        
        const marker = L.marker(dest.coords, { icon: customIcon }).addTo(map);
        
        // Add a label for better visibility
        L.marker(dest.coords).bindTooltip(dest.name, {
            permanent: true,
            direction: 'bottom',
            offset: [0, 10],
            className: 'location-label-tooltip'
        }).addTo(map);
        
        // Create popup content
        const popupContent = `
            <div class="map-popup-content">
                <h3>${dest.name}</h3>
                <p>${dest.description}</p>
                <button class="popup-navigate-btn" data-target="${dest.target}">Explore ${dest.name}</button>
            </div>
        `;
        
        marker.bindPopup(popupContent, {
            maxWidth: 250,
            className: 'custom-popup'
        });
        
        // Add click event to navigate to the location
        marker.on('click', function() {
            // Small delay to let the popup render
            setTimeout(() => {
                const navigateBtn = document.querySelector(`[data-target="${dest.target}"]`);
                if (navigateBtn && !navigateBtn.hasListener) {
                    navigateBtn.hasListener = true;
                    navigateBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        window.switchSpace(dest.target);
                        map.closePopup();
                    });
                }
            }, 100);
        });
        
        // Debug: Log that marker was added
        console.log(`Marker added for ${dest.name}`);
    });
    
    // Adjust map view to show all markers with some padding
    const group = new L.featureGroup(destinations.map(dest => L.marker(dest.coords)));
    map.fitBounds(group.getBounds().pad(0.1));

    // Draw a line connecting the destinations
    const routeLine = destinations.map(dest => dest.coords);
    L.polyline(routeLine, {
        color: '#e74c3c',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 5'
    }).addTo(map);
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize the map first
    initializeMap();
    
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

    // switch between spaces - Make this function globally accessible
    window.switchSpace = function(targetId) {
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

    // event listeners for the location markers (SVG markers if any)
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