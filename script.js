var map = L.map('map').setView([51.039439, -114.054339], 11);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

$(function() {
    $('input[name="daterange"]').daterangepicker({
        opens: 'right'
    }, async (start, end, label) => {
        const response = await fetch("https://data.calgary.ca/resource/c2es-76ed.geojson?$where=issueddate > '" + start.format('YYYY-MM-DD') + "' and issueddate < '" + end.format('YYYY-MM-DD') + "'");
        const geojson = await response.json();
        console.log(geojson);
    });
});

