// Get the city parameter from URL
const urlParams = new URLSearchParams(window.location.search);
const city = urlParams.get('city');

let allRooms = []; // Store all rooms globally

// Function to load search results
async function loadSearchResults() {
    const resultsDiv = document.getElementById("results");
    
    if (!city) {
        resultsDiv.innerHTML = `
            <div class="no-results">
                <h2>No search query provided</h2>
                <p>Please go back to the home page and enter a city to search.</p>
                <a href="index.html" class="back-button">Back to Home</a>
            </div>`;
        return;
    }

    try {
        const res = await fetch(`http://localhost:3000/roomdetails/searchresult?location=${encodeURIComponent(city)}`);
        const rooms = await res.json();

        if (!Array.isArray(rooms) || rooms.length === 0) {
            resultsDiv.innerHTML = `
                <div class="no-results">
                    <h2>No rooms found in "${city}"</h2>
                    <p>Try searching for a different city or check back later.</p>
                    <a href="index.html" class="back-button">Back to Home</a>
                </div>`;
            return;
        }

        allRooms = rooms; // Save all rooms for filtering
        renderRooms(rooms);
        populateCityDropdown(rooms);

    } catch (err) {
        console.error(err);
        resultsDiv.innerHTML = `
            <div class="no-results">
                <h2>Error loading results</h2>
                <p>There was an error fetching the room data. Please try again later.</p>
                <a href="index.html" class="back-button">Back to Home</a>
            </div>`;
    }
}

function renderRooms(rooms) {
    const resultsDiv = document.getElementById("results");
    const cardTemplate = document.getElementById("roomCardTemplate");
    const expandedTemplate = document.getElementById("expandedRoomTemplate");
    
    resultsDiv.innerHTML = ''; // Clear existing results

    // Remove any existing expanded modal
    const existingModal = document.getElementById('expanded-modal');
    if (existingModal) existingModal.remove();

    rooms.forEach(room => {
        const [latitude, longitude] = room.location_cordinate
            ? room.location_cordinate.split(',').map(coord => parseFloat(coord.trim()))
            : [NaN, NaN];

        if (isNaN(latitude) || isNaN(longitude)) {
            console.error("Invalid coordinates:", room.location_cordinate);
            return;
        }

        // Collapsed card
        const card = cardTemplate.content.cloneNode(true);
        card.querySelector('.rent').textContent = `₹${room.rent}/month`;
        card.querySelector('.city').textContent = room.city;
        card.querySelector('.state').textContent = room.state;
        card.querySelector('.bhk').textContent = room.bhk;
        card.querySelector('.property-type').textContent = room.property_type;
        card.querySelector('.available-from').textContent = room.available_from;
        card.querySelector('.buildup-area').textContent = `${room.buildup_area} sq.ft`;
        card.querySelector('.preferences').textContent = room.preferences;
        card.querySelector('.furnishing').textContent = room.furnishing;
        card.querySelector('.parking').textContent = room.parking;
        card.querySelector('.room-image img').src = JSON.parse(room.photos)[0] || '';

        // See More button logic
        const seeMoreBtn = card.querySelector('.see-more-btn');
        seeMoreBtn.addEventListener('click', () => showExpandedRoom(room));

        resultsDiv.appendChild(card);
    });
}

function showExpandedRoom(room) {
    // Remove any existing modal
    const existingModal = document.getElementById('expanded-modal');
    if (existingModal) existingModal.remove();

    // Add expanded-details class to body
    document.body.classList.add('expanded-details');

    const expandedTemplate = document.getElementById("expandedRoomTemplate");
    const modal = document.createElement('div');
    modal.id = 'expanded-modal';
    modal.className = 'room-card expanded';

    // Content
    const content = expandedTemplate.content.cloneNode(true);
    
    // Fill all fields
    content.querySelector('.property-title').innerHTML = `${room.bhk} ${room.property_type}`;
    content.querySelector('.rent').textContent = `₹${room.rent}/month`;
    content.querySelector('.deposit-text').textContent = `Security Deposit: ₹${room.deposit}`;
    content.querySelector('.address').textContent = room.address;
    content.querySelector('.landmark').textContent = room.landmark;
    content.querySelector('.pincode').textContent = room.pincode;
    content.querySelector('.buildup-area').textContent = `${room.buildup_area} sq.ft`;
    content.querySelector('.floor-number').textContent = room.floor_number;
    content.querySelector('.facing').textContent = room.facing;
    content.querySelector('.age-of-property').textContent = `${room.age_of_property} years`;
    content.querySelector('.preferences').textContent = room.preferences;
    content.querySelector('.furnishing').textContent = room.furnishing;
    content.querySelector('.parking').textContent = room.parking;
    content.querySelector('.available-from').textContent = room.available_from;
    content.querySelector('.description').textContent = room.description;

    // Map and coordinates
    const [latitude, longitude] = room.location_cordinate
        ? room.location_cordinate.split(',').map(coord => parseFloat(coord.trim()))
        : [NaN, NaN];
    
    const mapDiv = content.querySelector('.room-map');
    mapDiv.id = `map-${room.room_id}-expanded`;
    
    const directionLink = content.querySelector('.direction-link');
    directionLink.href = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

    // Main image and gallery overlay
    const photos = JSON.parse(room.photos);
    const mainImg = content.querySelector('.room-image img');
    if (photos.length > 0) {
        mainImg.src = photos[0];
        const overlay = content.querySelector('.gallery-overlay');
        if (photos.length > 1) {
            overlay.style.display = 'block';
            overlay.textContent = `+${photos.length - 1} more photos`;
        } else {
            overlay.style.display = 'none';
        }
    }

    // Remove close button logic
    // Add Show Less button logic
    setTimeout(() => {
        const showLessBtn = modal.querySelector('.show-less-btn');
        if (showLessBtn) {
            showLessBtn.addEventListener('click', () => {
                modal.remove();
                document.body.classList.remove('expanded-details');
            });
        }
    }, 0);

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Initialize map
    setTimeout(() => {
        initializeMap(`${room.room_id}-expanded`, latitude, longitude);
    }, 100);
}

function initializeMap(roomId, latitude, longitude) {
    const mapId = `map-${roomId}`;
    if (window[`map_${roomId}`]) {
        window[`map_${roomId}`].remove();
    }
    window[`map_${roomId}`] = L.map(mapId).setView([latitude, longitude], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
    }).addTo(window[`map_${roomId}`]);
    L.marker([latitude, longitude]).addTo(window[`map_${roomId}`]);
        setTimeout(() => {
        window[`map_${roomId}`].invalidateSize();
        }, 200);
}

// Populate city dropdown
function populateCityDropdown(rooms) {
    const citySet = new Set(rooms.map(r => r.city));
    const citySelect = document.getElementById('filterCity');
    if (citySelect) {
        citySelect.innerHTML = '<option value="">Any</option>' +
            Array.from(citySet).map(city => `<option value="${city}">${city}</option>`).join('');
    }
}

// Filter logic
document.addEventListener('DOMContentLoaded', function() {
    // Initialize filter form
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const city = document.getElementById('filterCity').value;
            const rentMin = parseFloat(document.getElementById('filterRentMin').value) || 0;
            const rentMax = parseFloat(document.getElementById('filterRentMax').value) || Infinity;
            const bhk = document.getElementById('filterBHK').value;
            const preferences = document.getElementById('filterPref').value;
            const availableFrom = document.getElementById('filterAvailableFrom').value;

            let filtered = allRooms.filter(room => {
                // Check if all required room properties exist
                if (!room) return false;

                // City filter
                if (city && room.city && room.city.toLowerCase() !== city.toLowerCase()) {
                    return false;
                }

                // Rent filter
                const roomRent = parseFloat(room.rent);
                if (!isNaN(roomRent)) {
                    if (roomRent < rentMin || roomRent > rentMax) {
                        return false;
                    }
                }

                // BHK filter
                if (bhk) {
                    const roomBHK = String(room.bhk).toLowerCase();
                    const filterBHK = bhk.toLowerCase();
                    if (roomBHK !== filterBHK) {
                        return false;
                    }
                }

                // Preferences filter
                if (preferences && room.preferences && 
                    room.preferences.toLowerCase() !== preferences.toLowerCase()) {
                    return false;
                }

                // Available from filter
                if (availableFrom && room.available_from) {
                    const roomDate = new Date(room.available_from);
                    const filterDate = new Date(availableFrom);
                    if (roomDate > filterDate) {
                        return false;
                    }
                }

                return true;
            });

            if (filtered.length === 0) {
                const resultsDiv = document.getElementById("results");
                resultsDiv.innerHTML = `
                    <div class="no-results">
                        <h2>No matching rooms found</h2>
                        <p>Try adjusting your filter criteria.</p>
                    </div>`;
            } else {
                renderRooms(filtered);
            }
        });
    }
});

// Create overlay div if it doesn't exist
if (!document.querySelector('.expanded-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'expanded-overlay';
    document.body.appendChild(overlay);
}

// Add event listeners for expandable content
document.addEventListener('DOMContentLoaded', function() {
    // Add click event to all "See More" buttons
    document.querySelectorAll('.see-more-btn').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const roomCard = this.closest('.room-card');
            toggleDetails(roomCard);
        });
    });

    // Add click event to overlay
    const overlay = document.querySelector('.expanded-overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            const expandedCard = document.querySelector('.room-card.expanded');
            if (expandedCard) {
                toggleDetails(expandedCard);
            }
        });
    }
});

// Update the toggleDetails function
function toggleDetails(card) {
    const isExpanded = card.classList.contains('expanded');
    const body = document.body;
    const overlay = document.querySelector('.expanded-overlay');
    const closeButton = document.querySelector('.close-expanded');
    const expandableContent = card.querySelector('.expandable-content');

    if (!isExpanded) {
        // Close any other expanded cards
        document.querySelectorAll('.room-card.expanded').forEach(expandedCard => {
            if (expandedCard !== card) {
                expandedCard.classList.remove('expanded');
                expandedCard.querySelector('.expandable-content').classList.remove('active');
            }
        });

        // Expand the clicked card
        card.classList.add('expanded');
        body.classList.add('expanded-details');
        overlay.style.display = 'block';
        closeButton.style.display = 'flex';
        
        // Trigger reflow to ensure smooth animation
        void card.offsetWidth;

        // Add active class to expandable content
            expandableContent.classList.add('active');

        // Scroll to the top of the expanded content
        card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        // Collapse the card
        card.classList.remove('expanded');
        body.classList.remove('expanded-details');
        overlay.style.display = 'none';
        closeButton.style.display = 'none';
        expandableContent.classList.remove('active');
    }
}

// Add Leaflet library
const leafletScript = document.createElement('script');
leafletScript.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
document.body.appendChild(leafletScript);

// Load results when page loads
window.onload = loadSearchResults;
