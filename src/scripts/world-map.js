const mymap = L.map('mapid').setView([40, 8], 2);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoiaWxsZW5hdGEiLCJhIjoiY2tpbHlheTNvMG1kejJzbGJ3d2MwZnJvdiJ9.VwLkkDFOzY09RruFl0u9dQ',
}).addTo(mymap);
