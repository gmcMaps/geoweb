function addFarmacias() {

    //var url = 'datos/farmacias.geojson';
    var url = farmaciasGeoJSON;
    map.addSource('farmacias', {
        type: 'geojson',
        data: url
    });

    map.addLayer({
        'id': 'farmacias',
        'type': 'circle',
        'source': 'farmacias',
        'paint': {
            'circle-color': '#00ff00',
            'circle-radius': 5,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2
        }
    });


} // fin funcion



function buscarFarmacias(valor) {

    var resultadosFarmacias = [];

   // console.info(farmaciasGeoJSON);
    for (var i = 0; i < farmaciasGeoJSON.features.length; i++) {

        var feature = farmaciasGeoJSON.features[i];

        if (feature.properties.nombre && 
            feature.properties.nombre
            .toLowerCase()
            .includes(valor.toLowerCase())
        ) {

            feature['place_name'] = `💊 ${feature.properties.nombre}`;
            feature['center'] = feature.geometry.coordinates;
            feature['place_type'] = ['place'];
            resultadosFarmacias.push(feature);
        }
    }
    return resultadosFarmacias;
} // fin funcion



function addFarmaciasCercanas() {

    map.addSource('farmacias_sel', {
        type: 'geojson',
        data: {
            'type': 'FeatureCollection',
            'features': []
        }
    });

    map.addLayer({
        'id': 'farmacias_sel',
        'type': 'circle',
        'source': 'farmacias_sel',
        'paint': {
            'circle-color': '#f909b5',
            'circle-radius': 8,
            'circle-stroke-color': '#ffffff',
            'circle-stroke-width': 2
        }
    });

   map.addLayer({
        "id": "farmacias_sel_text",
        "type": "symbol",
        "source": "farmacias_sel",
        "layout": {
          'text-field': ['concat',['get', 'distancia'],' m'],
          "text-size": 15,
          'text-offset': [0, 1.3],
          'text-anchor': 'left'
        },
        'paint': {
            'text-color': '#f909b5',
            'text-halo-color': '#333333',
            'text-halo-width': 1
        }
      });

    map.on("click", "farmacias", function (e) {

        var puntoClick = turf.point([e.lngLat.lng, e.lngLat.lat]);
        var ff = farmaciasGeoJSON;

        for (var i = 0; i < ff.features.length; i++) {

            var puntoFarmacia = turf.point(ff.features[i].geometry.coordinates);
            var distancia = turf.distance(puntoClick, puntoFarmacia, { units: 'meters' });
            ff.features[i].properties.distancia = parseInt(distancia);

        }

        ff.features.sort(function (a, b) {
            return a.properties.distancia - b.properties.distancia
        });

        map.getSource('farmacias_sel').setData(turf.featureCollection(ff.features.slice(1, 6)));

    })



} // fin funcion
