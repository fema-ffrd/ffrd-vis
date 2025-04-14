// global vars
let ri = "2";
let gridType = "depth";
let title = null;
let chart = null;
let data1 = null;
let data2 = null;
let data3 = null;
let data4 = null;
let data5 = null;
let data6 = null;
let data7 = null;
let marker = null;
let plot = null;
const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};
const CHART_COLORS_TRANSPARENT = {
    red: 'rgba(255, 99, 132, 0.5)',
    orange: 'rgba(255, 159, 64, 0.5)',
    yellow: 'rgba(255, 205, 86, 0.5)',
    green: 'rgba(75, 192, 192, 0.5)',
    blue: 'rgba(54, 162, 235, 0.5)',
    purple: 'rgba(153, 102, 255, 0.5)',
    grey: 'rgba(201, 203, 207, 0.5)'
};

// grab the api endpoint from the backend
let apiUrl = "";
fetch("/apiurl")
    .then(response => response.text())
    .then(responseUrl => {
        apiUrl = responseUrl;
    });

// set up map and basemap
var map = L.map('map').setView([38.079, -80.873], 11);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

// Set vis to  to titiler instance
let mapLayer = null;
changeMapLayer();

// set up UI for band selection
createSelectionWidget();

// set up UI for point query
createQueryWidget();

// set up UI for depth plot
createPlotWidget();

function getMapUrl() {
    if (gridType === "depth") {
        return "/cog/WebMercatorQuad/tilejson.json?tileMatrixSetId=WebMercatorQuad&tile_scale=1&path=aep_mean_depth_" + ri + "yr_COG.tif&bidx=1&unscale=false&resampling=nearest&reproject=nearest&colormap_name=nfip_depth&return_mask=true";
    } else if (gridType === "velocity") {
        return "/cog/WebMercatorQuad/tilejson.json?tileMatrixSetId=WebMercatorQuad&tile_scale=1&path=aep_mean_velocity_" + ri + "yr_COG.tif&bidx=1&unscale=false&resampling=nearest&reproject=nearest&colormap_name=nfip_vel&return_mask=true";;
    }
}

// support functions
function changeMapLayer() {
    fetch(getMapUrl())
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
    title.innerText = "Select recurrence interval to display:"

    var rdo = L.DomUtil.create('div', 'btn-group', body);
    rdo.role = "group";
    var depth = L.DomUtil.create('input', 'btn-check', rdo);
    depth.type = "radio";
    depth.checked = true;
    depth.id = "depth";
    depth.name = "gridType";
    var depthLabel = L.DomUtil.create('label', 'btn btn-outline-primary', rdo);
    depthLabel.htmlFor = "depth";
    depthLabel.innerText = "Depth";
    var vel = L.DomUtil.create('input', 'btn-check', rdo);
    vel.type = "radio";
    vel.id = "vel";
    vel.name = "gridType";
    var velLabel = L.DomUtil.create('label', 'btn btn-outline-primary', rdo);
    velLabel.htmlFor = "vel";
    velLabel.innerText = "Velocity";
    L.DomEvent.on(depth, 'change', function() {
        gridType = "depth";
        changeMapLayer();
    });
    L.DomEvent.on(vel, 'change', function() {   
        gridType = "velocity";
        changeMapLayer();
    });

    var select = L.DomUtil.create('select', 'form-select', body);
    var opt1 = L.DomUtil.create('option', '', select);
    opt1.selected="selected";
    opt1.text = "2 Years";
    opt1.value = "2";
    var opt2 = L.DomUtil.create('option', '', select);
    opt2.text = "10 Years";
    opt2.value = "10";
    var opt3 = L.DomUtil.create('option', '', select);
    opt3.text = "25 Years";
    opt3.value = "25";
    var opt4 = L.DomUtil.create('option', '', select);
    opt4.text = "50 Years";
    opt4.value = "50";
    var opt5 = L.DomUtil.create('option', '', select);
    opt5.text = "100 Years";
    opt5.value = "100";
    var opt6 = L.DomUtil.create('option', '', select);
    opt6.text = "200 Years";
    opt6.value = "200";
    var opt7 = L.DomUtil.create('option', '', select);
    opt7.text = "500 Years";
    opt7.value = "500";
    L.DomEvent.disableClickPropagation(card);
    L.DomEvent.on(select, 'change', function() {
        ri = select.value;
        changeMapLayer();
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
}

function createQueryWidget() {
    // create widget DOM elements
    var card = L.DomUtil.create('div', 'card');
    card.style = "max-width: 500px;";
    var body = L.DomUtil.create('div', 'card-body', card);
    title = L.DomUtil.create('h5', 'card-text', body);
    title.innerText = "Raster values at selected point"; 
    var container = L.DomUtil.create('div', 'container-sm', body);
    var row1 = L.DomUtil.create('div', 'row', container);
    var cell1 = L.DomUtil.create('div', 'col-sm', row1);
    cell1.innerText = "2 Yr: ";
    data1 = L.DomUtil.create('p', '', cell1);
    var cell2 = L.DomUtil.create('div', 'col-sm', row1);
    cell2.innerText = "10 Yr: ";
    data2 = L.DomUtil.create('p', '', cell2);
    var cell3 = L.DomUtil.create('div', 'col-sm', row1);
    cell3.innerText = "25 Yr: ";
    data3 = L.DomUtil.create('p', '', cell3);
    var cell4 = L.DomUtil.create('div', 'col-sm', row1);
    cell4.innerText = "50 Yr: ";
    data4 = L.DomUtil.create('p', '', cell4);
    var row2 = L.DomUtil.create('div', 'row', container);
    var cell5 = L.DomUtil.create('div', 'col-sm', row2);
    cell5.innerText = "100 Yr: ";
    data5 = L.DomUtil.create('p', '', cell5);
    var cell6 = L.DomUtil.create('div', 'col-sm', row2);
    cell6.innerText = "200 Yr: ";
    data6 = L.DomUtil.create('p', '', cell6);
    var cell7 = L.DomUtil.create('div', 'col-sm', row2);
    cell7.innerText = "500 Yr: ";
    data7 = L.DomUtil.create('p', '', cell7);
    var btn = L.DomUtil.create('button', 'btn btn-secondary', body);
    btn.innerText = "Raster Cell Query";
    L.DomEvent.disableClickPropagation(card);
    var querying = false;
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
            plot.classlist.add('invisible');
        }
    });
    
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

function createPlotWidget() {
    // create widget DOM elements
    plot = L.DomUtil.create('div', 'invisible card');
    plot.style = "width: 800px;";
    let chartdiv = L.DomUtil.create('canvas', '', plot);
    L.DomEvent.disableClickPropagation(plot);
    chart = new Chart(chartdiv, {
        type: 'line',
        data: {
          labels: ['2 Yr', '10 Yr', '25 Yr', '50 Yr', '100 Yr', '200 Yr', '500 Yr'],
          datasets: [{
            label: 'Lower Bound',
            borderColor: CHART_COLORS.yellow,
            backgroundColor: CHART_COLORS_TRANSPARENT.grey,
            data: [],
            fill: 1
          }, {
            label: 'Mean Depth',
            borderColor: CHART_COLORS.blue,
            data: []
          }, {
            label: 'Upper Bound',
            borderColor: CHART_COLORS.red,
            backgroundColor: CHART_COLORS_TRANSPARENT.grey,
            data: [],
            fill: 1
          }]
        },
        options: {
            plugins: {
                filler: {
                    propagate: true
                }
            }
        }
      });

    // create Leaflet control and add to map
    const plotWidget = L.Control.extend({
        initialize: function (options) {
            L.Util.setOptions(this, options);
        },
        onAdd: function (map) {
            return plot;
        }
    });

    L.control.PlotWidget = function(options) {
        return new plotWidget(options);
    }

    new L.control.PlotWidget({"position": "bottomright"}).addTo(map);
}

// query function
function performQuery(event) {
    title.innerText = "Raster " + gridType + " values at selected point";
    if (marker) {
        marker.setLatLng(event.latlng);
    } else {
        marker = L.marker(event.latlng).addTo(map);
    }

    var intervals = ["2", "10", "25", "50", "100", "200", "500"];
    var promises = [];

    intervals.forEach(i => {
        promises.push(doRasterFetch(gridType, i, event.latlng.lat, event.latlng.lng));
        if (gridType === "depth") {
            promises.push(doRasterFetch("std_dev", i, event.latlng.lat, event.latlng.lng));
        }
    });

    Promise.all(promises).then((values) => {
        if (gridType === "depth") {
            // parse out grids and stddev
            var means = [];
            var std_devs = [];
            var upperBound = "";
            var lowerBound = "";
            var uppers = [];
            var lowers = [];
            values.forEach((data, i) => {
                switch(i) {
                    case 0:
                        data1.innerText = parseVal(data[0].value);
                        means.push(data[0].value || 0);
                        break;
                    case 2:
                        data2.innerText = parseVal(data[0].value);                            
                        means.push(data[0].value || 0);
                        break;
                    case 4:
                        data3.innerText = parseVal(data[0].value);
                        means.push(data[0].value || 0);
                        break;
                    case 6:
                        data4.innerText = parseVal(data[0].value);
                        means.push(data[0].value || 0);
                        break;
                    case 8:
                        data5.innerText = parseVal(data[0].value);
                        means.push(data[0].value || 0);
                        break;
                    case 10:
                        data6.innerText = parseVal(data[0].value);
                        means.push(data[0].value || 0);
                        break;
                    case 12:
                        data7.innerText = parseVal(data[0].value);
                        means.push(data[0].value || 0);
                        break;
                    case 1:
                    case 3:
                    case 5:
                    case 7:
                    case 9:
                    case 11:
                    case 13:
                        std_devs.push(data[0].value || 0);
                        break;
                }
            });
            var ciPromises = [];
            means.forEach((mean, i) => {
                ciPromises.push(doCIFetch(mean, std_devs[i]));
            });
            Promise.all(ciPromises).then((ciValues) => {
                ciValues.forEach((ci) => {
                    uppers.push(plotCutoff(ci.upper_val));
                    lowers.push(plotCutoff(ci.lower_val));
                    upperBound = (Number(ci.upper_bound) * 100) + " pct";
                    lowerBound = (Number(ci.lower_bound) * 100) + " pct";
                });
                chart.data.datasets[0].data = lowers;
                chart.data.datasets[0].label = lowerBound;
                chart.data.datasets[1].data = means;    
                chart.data.datasets[2].data = uppers;
                chart.data.datasets[2].label = upperBound;
                chart.update();
                plot.classList.remove('invisible');
            });
        } else if (gridType === "velocity") {
            plot.classList.add('invisible');
            values.forEach((data, i) => {
                var val = parseVal(data[0].value);
                switch(i) {
                    case 0:
                        data1.innerText = val;
                        break;
                    case 1:
                        data2.innerText = val;
                        break;
                    case 2:
                        data3.innerText = val;
                        break;
                    case 3:
                        data4.innerText = val;
                        break;
                    case 4:
                        data5.innerText = val;
                        break;
                    case 5:
                        data6.innerText = val;
                        break;
                    case 6:
                        data7.innerText = val;
                        break;
                }
            });
        }
    });
}    

function doRasterFetch(type, ri, lat, lon) {
    var file;
    switch(type) {
        case "depth":
            file = "aep_mean_depth_" + ri + "yr_COG.tif";
            break;
        case "velocity":
            file = "aep_mean_velocity_" + ri + "yr_COG.tif";
            break;
        case "std_dev":
            file = "aep_stdev_depth_" + ri + "yr_COG.tif";
            break;
    }

    var data = {
        file: file,
        bands: [1],
        lat: lat,
        lon: lon
    }

    return fetch(apiUrl + "get_values", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (res.ok) return res.json();
        throw new Error('Network error on query API.');
    });
}

function doCIFetch(mean, std_dev) {
    var data = {
        haz_stats: {
            mean: mean,
            std_dev: std_dev
        }
    }

    return fetch(apiUrl + "get_ci_values", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    }).then(res => {
        if (res.ok) return res.json();
        throw new Error('Network error on CI API.');
    });
}

function parseVal(val) {
    if (!val) {
        return "No Data";
    } else {
        return val.toFixed(1);
    }
}

function plotCutoff(val) {
    if (val <0) {
        return 0;
    }
    return val;
}