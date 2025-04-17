import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
}

interface LeafletMapProps {
  initialRegion: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  markers?: MapMarker[];
  onMarkerPress?: (markerId: string) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  initialRegion, 
  markers = [], 
  onMarkerPress 
}) => {
  const webViewRef = useRef<WebView>(null);

  // HTML pour la carte Leaflet
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { margin: 0; padding: 0; }
          #map { width: 100%; height: 100vh; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          // Initialisation de la carte
          const map = L.map('map').setView([${initialRegion.latitude}, ${initialRegion.longitude}], ${initialRegion.zoom});
          
          // Ajout de la couche CartoDB Positron
          L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
          }).addTo(map);
          
          // Ajout des marqueurs
          const markers = ${JSON.stringify(markers)};
          markers.forEach(marker => {
            const leafletMarker = L.marker([marker.latitude, marker.longitude])
              .addTo(map)
              .bindPopup(marker.title || '');
              
            leafletMarker.on('click', function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'markerClick',
                markerId: marker.id
              }));
            });
          });
          
          // Communication avec React Native
          map.on('moveend', function() {
            const center = map.getCenter();
            const zoom = map.getZoom();
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'mapMove',
              center: [center.lat, center.lng],
              zoom: zoom
            }));
          });

          // Envoyer un message quand la carte est prête
          map.whenReady(() => {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
          });
        </script>
      </body>
    </html>
  `;

  // Gestion des messages de la WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'markerClick' && onMarkerPress) {
        onMarkerPress(data.markerId);
      }
    } catch (error) {
      console.error('Erreur de parsing JSON:', error);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        scrollEnabled={false}
        bounces={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
  },
});

export default LeafletMap;
