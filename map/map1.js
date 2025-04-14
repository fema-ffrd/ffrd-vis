// grab the api endpoint from the backend
let apiUrl = "";
fetch("/apiurl")
    .then(response => response.text())
    .then(responseUrl => {
        apiUrl = responseUrl + "get_values";
    });

// set up map and basemap
var map = L.map('map').setView([38.503, -81.026], 11);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Set vis to  to titiler instance
let mapLayer = null;
changeMapLayer('/cog/WebMercatorQuad/tilejson.json?tileMatrixSetId=WebMercatorQuad&tile_scale=1&path=elk_middle_aep_depth_bands_COG.tiff&bidx=1&unscale=false&resampling=nearest&reproject=nearest&colormap_name=blues_r&return_mask=true');

// set up UI for band selection
createSelectionWidget();

// set up UI for point query
createQueryWidget();

// support functions
function changeMapLayer(url) {
    fetch(url)
    .then(res => {
        if (res.ok) return res.json();
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        console.log(data);

        let bounds = [...data.bounds];
        
        // Bounds crossing dateline
        if (bounds[0] > bounds[2]) {
        bounds[0] = bounds[0] - 360
        }
        var left = bounds[0],
        bottom = bounds[1],
        right = bounds[2],
        top = bounds[3];

        if (mapLayer) {
        map.removeLayer(mapLayer)
        }
    
        mapLayer = L.tileLayer(
            data.tiles[0], {
            minZoom: data.minzoom,
            maxZoom: data.maxzoom,
            bounds: L.latLngBounds([bottom, left], [top, right]),
        });
        mapLayer.addTo(map);
    })
    .catch(err => {
        console.warn(err)
    });
}

function createSelectionWidget() {
    // create widget DOM elements
    var card = L.DomUtil.create('div', 'card');
    var body = L.DomUtil.create('div', 'card-body', card);
    var title = L.DomUtil.create('h5', 'card-text', body);
    title.innerText = "Select raster band to display:"
    var select = L.DomUtil.create('select', 'form-select', body);
    var opt1 = L.DomUtil.create('option', '', select);
    opt1.selected="selected";
    opt1.text = "Band 1";
    opt1.value = "1";
    var opt2 = L.DomUtil.create('option', '', select);
    opt2.text = "Band 2";
    opt2.value = "2";
    var opt3 = L.DomUtil.create('option', '', select);
    opt3.text = "Band 3";
    opt3.value = "3";
    var opt4 = L.DomUtil.create('option', '', select);
    opt4.text = "Band 4";
    opt4.value = "4";
    var opt5 = L.DomUtil.create('option', '', select);
    opt5.text = "Band 5";
    opt5.value = "5";
    var opt6 = L.DomUtil.create('option', '', select);
    opt6.text = "Band 6";
    opt6.value = "6";
    var opt7 = L.DomUtil.create('option', '', select);
    opt7.text = "Band 7";
    opt7.value = "7";
    var opt8 = L.DomUtil.create('option', '', select);
    opt8.text = "Band 8";
    opt8.value = "8";
    L.DomEvent.disableClickPropagation(card);
    L.DomEvent.on(select, 'change', function() {
        changeMapLayer('/cog/WebMercatorQuad/tilejson.json?tileMatrixSetId=WebMercatorQuad&tile_scale=1&path=elk_middle_aep_depth_bands_COG.tiff&bidx=' + select.value + '&unscale=false&resampling=nearest&reproject=nearest&colormap_name=blues_r&return_mask=true');
    });

    // create Leaflet control and add to map
    const selectionWidget = L.Control.extend({
        initialize: function (options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {
            return card;
        }
    });

    L.control.SelectionWidget = function(options) {
        return new selectionWidget(options);
    }

    new L.control.SelectionWidget({"position": "topright"}).addTo(map);

};

function createQueryWidget() {
    // create widget DOM elements
    var card = L.DomUtil.create('div', 'card');
    card.style = "max-width: 500px;";
    var body = L.DomUtil.create('div', 'card-body', card);
    var title = L.DomUtil.create('h5', 'card-text', body);
    title.innerText = "Raster values at selected point"; 
    var container = L.DomUtil.create('div', 'container-sm', body);
    var row1 = L.DomUtil.create('div', 'row', container);
    var cell1 = L.DomUtil.create('div', 'col-sm', row1);
    cell1.innerText = "Band 1: ";
    var data1 = L.DomUtil.create('p', '', cell1);
    var cell2 = L.DomUtil.create('div', 'col-sm', row1);
    cell2.innerText = "Band 2: ";
    var data2 = L.DomUtil.create('p', '', cell2);
    var cell3 = L.DomUtil.create('div', 'col-sm', row1);
    cell3.innerText = "Band 3: ";
    var data3 = L.DomUtil.create('p', '', cell3);
    var cell4 = L.DomUtil.create('div', 'col-sm', row1);
    cell4.innerText = "Band 4: ";
    var data4 = L.DomUtil.create('p', '', cell4);
    var row2 = L.DomUtil.create('div', 'row', container);
    var cell5 = L.DomUtil.create('div', 'col-sm', row2);
    cell5.innerText = "Band 5: ";
    var data5 = L.DomUtil.create('p', '', cell5);
    var cell6 = L.DomUtil.create('div', 'col-sm', row2);
    cell6.innerText = "Band 6: ";
    var data6 = L.DomUtil.create('p', '', cell6);
    var cell7 = L.DomUtil.create('div', 'col-sm', row2);
    cell7.innerText = "Band 7: ";
    var data7 = L.DomUtil.create('p', '', cell7);
    var cell8 = L.DomUtil.create('div', 'col-sm', row2);
    cell8.innerText = "Band 8: ";
    var data8 = L.DomUtil.create('p', '', cell8);   
    var btn = L.DomUtil.create('button', 'btn btn-secondary', body);
    btn.innerText = "Raster Cell Query";
    L.DomEvent.disableClickPropagation(card);
    var querying = false;
    var marker = null;
    var mapelem = L.DomUtil.get('map');
    L.DomEvent.on(btn, 'click', function() {
        querying = !querying;
        if (querying) {
            btn.classList.remove('btn-secondary')
            btn.classList.add('btn-success');
            mapelem.classList.remove('leaflet-grab')
            mapelem.classList.add('leaflet-crosshair');
            map.on('click', performQuery);
        } else {
            btn.classList.add('btn-secondary')
            btn.classList.remove('btn-success');
            mapelem.classList.add('leaflet-grab')
            mapelem.classList.remove('leaflet-crosshair');
            map.off('click', performQuery);
            if (marker) {
                marker.remove();
                marker = null;
            };
            data1.innerText = '';
            data2.innerText = '';
            data3.innerText = '';
            data4.innerText = '';
            data5.innerText = '';
            data6.innerText = '';
            data7.innerText = '';
            data8.innerText = '';
        }
    });

    // query function
    function performQuery(event) {
        if (marker) {
            marker.setLatLng(event.latlng);
        } else {
            marker = L.marker(event.latlng).addTo(map);
        }

        var data = {
            file: "elk_middle_aep_depth_bands_COG.tiff",
            bands: [1, 2, 3, 4, 5, 6, 7, 8],
            lat: event.latlng.lat,
            lon: event.latlng.lng
        }

        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.ok) return res.json();
            throw new Error('Network error on query API.');
        }).then(data => {
            console.log(data);
            data.forEach(b => {
                var val = b.value;
                if (!val) { // API returns null if NODATA
                    val = "No Data" 
                } else {
                    val = val.toFixed(5);
                }
                switch (b.band) {
                    case 1:
                        data1.innerText = val;
                        break;
                    case 2:
                        data2.innerText = val;
                        break;
                    case 3:
                        data3.innerText = val;
                        break;
                    case 4:
                        data4.innerText = val;
                        break;
                    case 5:
                        data5.innerText = val;
                        break;
                    case 6:
                        data6.innerText = val;
                        break;
                    case 7:
                        data7.innerText = val;
                        break;
                    case 8:
                        data8.innerText = val;
                        break;
                }
            });
        });
    }

    // create Leaflet control and add to map
    const queryWidget = L.Control.extend({
        initialize: function (options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {
            return card;
        }
    });

    L.control.QueryWidget = function(options) {
        return new queryWidget(options);
    }

    new L.control.QueryWidget({"position": "bottomleft"}).addTo(map);
}