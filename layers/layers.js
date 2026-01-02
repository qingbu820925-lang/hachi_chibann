var wms_layers = [];


        var lyr_GoogleMAP_0 = new ol.layer.Tile({
            'title': 'GoogleMAP 航空写真',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: ' ',
                url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
            })
        });
var format_hachichibanline_1 = new ol.format.GeoJSON();
var features_hachichibanline_1 = format_hachichibanline_1.readFeatures(json_hachichibanline_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_hachichibanline_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_hachichibanline_1.addFeatures(features_hachichibanline_1);
var lyr_hachichibanline_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_hachichibanline_1, 
                style: style_hachichibanline_1,
                //popuplayertitle: 'hachichiban-line',
                popuplayertitle: '地番は',
				interactive: true,
                title: '<img src="styles/legend/hachichibanline_1.png" /> hachichiban-line'
            });
var format_hachichibantext_2 = new ol.format.GeoJSON();
var features_hachichibantext_2 = format_hachichibantext_2.readFeatures(json_hachichibantext_2, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_hachichibantext_2 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_hachichibantext_2.addFeatures(features_hachichibantext_2);
var lyr_hachichibantext_2 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_hachichibantext_2, 
                style: style_hachichibantext_2,
                popuplayertitle: 'hachichiban-text',
                interactive: true,
                title: 'hachichiban-text'
            });

lyr_GoogleMAP_0.setVisible(true);lyr_hachichibanline_1.setVisible(true);lyr_hachichibantext_2.setVisible(true);
var layersList = [lyr_GoogleMAP_0,lyr_hachichibanline_1,lyr_hachichibantext_2];
lyr_hachichibanline_1.set('fieldAliases', {'azachiban': 'azachiban', });
lyr_hachichibantext_2.set('fieldAliases', {'azachiban': 'azachiban', });
lyr_hachichibanline_1.set('fieldImages', {'azachiban': 'TextEdit', });
lyr_hachichibantext_2.set('fieldImages', {'azachiban': 'TextEdit', });
lyr_hachichibanline_1.set('fieldLabels', {'azachiban': 'no label', });
lyr_hachichibantext_2.set('fieldLabels', {'azachiban': 'no label', });
lyr_hachichibantext_2.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});
