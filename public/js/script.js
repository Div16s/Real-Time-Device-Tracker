const socket = io(); // Connect to the socket.io server
console.log('Script loaded');

// Concept: Emit the coordinates of the connected user to the server
// This is done using the geolocation API which is available in the browser
// The watchPosition method is used to get the current position of the user
// The position object contains the latitude and longitude of the user
// This data is emitted to the server using the send-Location event
if(navigator.geolocation) {
    navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('send-Location', { latitude, longitude });
    }, (error) => {
        console.log(error);
    }, {
        // Concept: Enable high accuracy to get the accurate location of the user
        enableHighAccuracy: true,
        // Concept: Set the timeout to 3000 milliseconds to get the location
        timeout: 3000,
        // Concept: Set the maximum age to 0 to get the current location of the user without using the cache
        maximumAge: 0 
    });
}

// Map initialization 
// Concept: Create a map using the leaflet library and set the view to the center of the map with zoom level 16
const map = L.map('map').setView([0, 0], 16);

// Concept: Add the tile layer to the map
// The tile layer is added using the mapbox API
// The mapbox API provides different styles of maps
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Concept: Empty object to store the markers
const markers = {};

// Concept: Listen for the receive-Location event from the server
// The data contains the latitude and longitude of the user
// The data is then used to create a marker on the map
// The marker is then added to the map
socket.on('receive-Location', (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

// Concept: Listen for the user-disconnected event from the server
// The data contains the id of the user who disconnected
// The marker of the user is then removed from the map
socket.on('user-disconnected', (id) => {
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});

