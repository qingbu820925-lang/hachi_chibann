var wms_layers = [];


        var lyr_GoogleMAP_0 = new ol.layer.Tile({
            'title': 'GoogleMAP 航空写真',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            })
        });
var format_hachichiban_1 = new ol.format.GeoJSON();
var features_hachichiban_1 = format_hachichiban_1.readFeatures(json_hachichiban_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_hachichiban_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_hachichiban_1.addFeatures(features_hachichiban_1);
var lyr_hachichiban_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_hachichiban_1, 
                style: style_hachichiban_1,
                popuplayertitle: 'hachichiban',
                interactive: true,
                title: '<img src="styles/legend/hachichiban_1.png" /> hachichiban'
            });

lyr_GoogleMAP_0.setVisible(true);lyr_hachichiban_1.setVisible(true);
var layersList = [lyr_GoogleMAP_0,lyr_hachichiban_1];
lyr_hachichiban_1.set('fieldAliases', {'azachiban': 'azachiban', });
lyr_hachichiban_1.set('fieldImages', {'azachiban': 'TextEdit', });
lyr_hachichiban_1.set('fieldLabels', {'azachiban': 'inline label - visible with data', });
lyr_hachichiban_1.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});