// instance of the leaflet map
var map;

// layers
var worldMap;
var geoJsonLayers = new Object();

function mouseoverpoint(feature, layer) {
    if (isMouseOverPointFeature === false) {
        isMouseOverPointFeature = true;
        layer.setIcon(L.BeautifyIcon.icon(feature.properties.PaxowjzZhEuoAWOmaXSyUwStyle.StyleHover));
        layer.getElement().addEventListener("mouseover", function () {
            mouseoverpoint(feature, layer);
        });
        layer.getElement().addEventListener("mouseout", function () {
            mouseoutpoint(feature, layer);
        });
    }
}

function mouseoutpoint(feature, layer) {
    isMouseOverPointFeature = false;
    layer.setIcon(L.BeautifyIcon.icon(feature.properties.PaxowjzZhEuoAWOmaXSyUwStyle.Style));
    layer.getElement().addEventListener("mouseover", function () {
        mouseoverpoint(feature, layer);
    });
    layer.getElement().addEventListener("mouseout", function () {
        mouseoutpoint(feature, layer);
    });
}

var isMouseOverPointFeature = false;

window.leafletmap = {
    setupMap: function () {
        if (map == undefined) {
            // set map and add draw feature
            map = L.map('map', {
                zoom: 15,
                maxZoom: 100
            });
            map.zoomControl.setPosition('bottomright');
        }
    },

    // coordinateView: double[]
    // zoom: int
    addWorldMap: function () {
        if (map === undefined) {
            this.setupMap();
        }

        if (worldMap === undefined) {
            // add title showing leaflet map info
            worldMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxNativeZoom: 19,
                maxZoom: 25
            });
        }
        worldMap.addTo(map);

        map.setView([46.8, 6.74], 15);
    },

    removeWorldMap: function () {
        if (worldMap !== undefined) {
            worldMap.removeFrom(map);
        }
    },

    // name: string, the name of the layer to be added
    // geoJson: string
    // coordinateView: double[]
    // zoom: int
    addGeoJsonMap: function (name, geoJson, dotnetreference) {
        if (map === undefined) {
            this.setupMap();
        }

        if (geoJsonLayers[name] !== undefined) {
            geoJsonLayers[name].removeFrom(map);
        }

        geoJsonLayers[name] = L.geoJson(JSON.parse(geoJson), {
            pointToLayer: function (geoJsonPoint, latlng) {
                return L.marker(latlng, { icon: L.BeautifyIcon.icon(geoJsonPoint.properties.PaxowjzZhEuoAWOmaXSyUwStyle.Style)});
            },
            style: function (feature) {
                return feature.properties.PaxowjzZhEuoAWOmaXSyUwStyle.Style;
            },
            onEachFeature: function (feature, layer) {
                console.log(feature);
                layer.on({
                    mouseover: function (e) {
                        var layer = e.target;
                        if (feature.geometry.type === 'Point') {
                            mouseoverpoint(feature, layer);
                        } else {
                            layer.setStyle(feature.properties.PaxowjzZhEuoAWOmaXSyUwStyle.StyleHover);
                            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                                layer.bringToFront();
                            }
                        }
                    },
                    mouseout: function (e) {
                        var layer = e.target;
                        if (feature.geometry.type === 'Point') {
                            mouseoutpoint(feature, layer);
                        } else {
                            layer.setStyle(feature.properties.PaxowjzZhEuoAWOmaXSyUwStyle.Style);
                            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                                layer.bringToFront();
                            }
                        }
                    },
                    click: function (e) {
                        console.log(feature.id);
                        dotnetreference.invokeMethodAsync('OnFeatureClick', feature.id);
                    }
                });
            }
        }).addTo(map);
        //map.setView(coordinateView, zoom);
        try {
            var bounds = geoJsonLayers[name].getBounds();
            map.fitBounds(bounds);
        } catch (err) {

        }
    },

    removeGeoJsonMap: function (name) {
        if (geoJsonLayers[name] !== undefined) {
            geoJsonLayers[name].removeFrom(map);
        }
    }
}