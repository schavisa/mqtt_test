// Define the map centered on Calgary
var map = L.map('map').setView([51.039439, -114.054339], 11);

// Add the basemap
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Create the date picker and query the building permit api
$(function() {
    $('input[name="daterange"]').daterangepicker({
        opens: 'right',
        maxDate: new Date()
    }, async (start, end, label) => {
        const response = await fetch("https://data.calgary.ca/resource/c2es-76ed.geojson?$where=issueddate >= '" + start.format('YYYY-MM-DD') + "' and issueddate <= '" + end.format('YYYY-MM-DD') + "'");
        const geojson = await response.json();
        // Show matching results
        showData(geojson);
    });
});

// Keep track of the existing markers
var marker_array = new Array();

// Define the cluster group
var marker_group = L.markerClusterGroup();

function showData(data){
    // Remove old markers
    removeMarkers();

    for (let i = 0; i < data.features.length; i++) {
        if (data.features[i].properties.latitude != null && data.features[i].properties.longitude !=null) {
            // Marker
            var marker = L.marker([data.features[i].properties.latitude, data.features[i].properties.longitude]);
            marker_array.push(marker)

            // Pop-up
            var text = "<b>Issued Date: </b>" + data.features[i].properties.issueddate.slice(0, 10) + 
                        "<br><b>Community Name: </b>" + data.features[i].properties.communityname + 
                        "<br><b>Original Address: </b>" + data.features[i].properties.originaladdress + 
                        "<br><b>Work Class Group: </b>" + data.features[i].properties.workclassgroup + 
                        "<br><b>Contractor Name: </b>"+ data.features[i].properties.contractorname;
            marker.bindPopup(text);
        }
    }
    // Add markers to the map
    addMarkerClusterGroup();
}

// Go through the existing markers and remove them
function removeMarkers() {
    map.removeLayer(marker_group);
    for(let i = 0; i < marker_array.length; i++) {
        marker_group.removeLayer(marker_array[i]);
    }
    marker_array = new Array();
}

// Add markers to the cluster group
function addMarkerClusterGroup() {
    for (let i = 0; i < marker_array.length; i++) {
        marker_group.addLayer(marker_array[i]);
    }
    map.addLayer(marker_group);
}