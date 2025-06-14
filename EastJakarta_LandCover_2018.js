//=====================================================================================================//
//                      Remote Sensing Assistant Technical Test Submission                             //
//                            By : Michelle Agustaranny Sekar Arum                                     //
//=====================================================================================================//

////1.Data Input and Definition, AOI Definition, and Object Centering
var AOI = SHP_JakartaTimur;
var referencedata = LocationCrowdAnnotationPerSample; //the combined table of locations.csv, samplesLocation.csv, and crowdAnnotationsConsenscusPerSample.csv
Map.addLayer(LocationCrowdAnnotationPerSample);
Map.addLayer(AOI);
Map.centerObject(AOI);

////2. Cloud Masking
function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = 1 << 3;
  var cloudsBitMask = 1 << 5;
  // Get the pixel QA band.
  var qa = image.select('QA_PIXEL');
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  // Return the masked image, scaled to reflectance, without the QA bands.
  return image.updateMask(mask).divide(10000)
      .select(['SR_B1','SR_B2','SR_B3','SR_B4','SR_B5','SR_B6','SR_B7'])
      .copyProperties(image, ["system:time_start"]);
}

////3. Calling the Landsat 8 Data and Cloud Masking for Data Testing
var image = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
              .filterDate('2018-01-01', '2018-12-31')
              .filterBounds(AOI)
              .map(maskL8sr)
              .median()
              .clip(AOI)
              print(image, '2018');

Map.addLayer(image, imageVisParam, 'Jakarta Timur Imagery 2018')

////4. Variables
// Spectral Indices for Landsat 8 Surface Reflectance
// Bands expected: nir = B5, red = B4, swir1 = B6, swir2 = B7
//Implemented from source Github https://github.com/HadiEO/RestoreMapping/blob/main/restorelcmap/1_Generate_Composites_Covariates_Functions.js

function NDVI(image) {
  return image.normalizedDifference(['SR_B5', 'SR_B4']).multiply(10000).int16().rename('ndvi');
}

function NDWI(image) {
  return image.normalizedDifference(['SR_B5', 'SR_B6']).multiply(10000).int16().rename('ndwi');
}

function NBR(image) {
  return image.normalizedDifference(['SR_B5', 'SR_B7']).multiply(10000).int16().rename('nbr');
}

function SAVI(image) {
  var savi = image.expression(
    '(1 + L) * ((NIR - RED) / (NIR + RED + L))', {
      'NIR': image.select('SR_B5').toFloat(),
      'RED': image.select('SR_B4').toFloat(),
      'L': 0.9
    });
  return savi.multiply(10000).int16().rename('savi');
}

function EVI2(image) {
  var evi2 = image.expression(
    '(2.5 * (NIR - RED)) / (NIR + 2.4 * RED + 1)', {
      'NIR': image.select('SR_B5').toFloat(),
      'RED': image.select('SR_B4').toFloat()
    });
  return evi2.multiply(10000).int16().rename('evi2');
}

function calcIndicesLandsat(image) {
  return image
    .addBands(NDVI(image))
    .addBands(NDWI(image))
    .addBands(NBR(image))
    .addBands(SAVI(image))
    .addBands(EVI2(image));
}

var composite = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
              .filterDate('2018-01-01', '2018-12-31')
              .filterBounds(AOI)
              .map(maskL8sr)
              .median()
              .clip(AOI)
              print(image, '2018');
  
var imageWithIndices = calcIndicesLandsat(composite);

//Indices Visualization Parameter 
var visNDVI = {min: 0, max: 9000, palette: ['white', 'green']};
var visNDWI = {min: -1000, max: 8000, palette: ['brown', 'blue']};
var visNBR  = {min: -1000, max: 8000, palette: ['white', 'black']};
var visSAVI = {min: 0, max: 8000, palette: ['yellow', 'darkgreen']};
var visEVI2 = {min: 0, max: 8000, palette: ['pink', 'blue']};

//Visualizing indices(variables) to Map
Map.addLayer(imageWithIndices.select('ndvi'), visNDVI, 'NDVI');
Map.addLayer(imageWithIndices.select('ndwi'), visNDWI, 'NDWI');
Map.addLayer(imageWithIndices.select('nbr'), visNBR, 'NBR');
Map.addLayer(imageWithIndices.select('savi'), visSAVI, 'SAVI');
Map.addLayer(imageWithIndices.select('evi2'), visEVI2, 'EVI2');
//All of the above code have been tested and ran without error, and provide the map visualization that is indicated

//=====================================================================================================//
//                      Next Step if Reference Data is Imbued with Pile Class                          //
//                 (Disclaimer :Code is implemented from my own experience in GEE)                     //
//=====================================================================================================//

////5. Extracting VI Value from Reference Data
//var VIExtractsSta = imageWithIndices.reduceRegions({
  //collection: Point,
 // reducer: ee.Reducer.first(),
  //scale: 30
//}).filter(ee.Filter.notNull(['ndvi', 'ndwi', 'nbr', 'savi', 'evi2'])); 

//print('Extracted spectral indices by point:', VIExtractsSta);
//Map.addLayer(Point, {}, 'Sample Points');

////6. Training Data in Random Forest
// Assume point features have a property called 'PileClass'
//var classifier = ee.Classifier.smileRandomForest(10).train({
  //features: VIExtractsSta,
  //classProperty: 'PileClass',
  //inputProperties: ['ndvi', 'ndwi', 'nbr', 'savi', 'evi2']
//});

//var classified = VIimage.classify(classifier, 'predicted');

//Map.addLayer(classified, {min: 1, max: 7, palette: ['green', 'yellow', 'blue', 'gray', 'red', 'purple', 'brown']}, 'Predicted Land Cover');

////7. Confusion Matrix and Overall Accuracy
//var confusionMatrix = classifier.confusionMatrix();
//print('Confusion matrix:', confusionMatrix);
//print('Overall Accuracy:', confusionMatrix.accuracy());
