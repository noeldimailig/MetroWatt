import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import MapView, { Polyline, PROVIDER_DEFAULT } from 'react-native-maps';
import * as Location from 'expo-location';
import { Play, Square, BatteryCharging, ShieldAlert } from 'lucide-react-native';

interface Coord {
  latitude: number;
  longitude: number;
}

// Haversine formula to compute distance in kilometers
function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [routeCoords, setRouteCoords] = useState<Coord[]>([]);
  const [distanceKm, setDistanceKm] = useState(0);
  const [speedKmh, setSpeedKmh] = useState(0);
  const [elapsedSec, setElapsedSec] = useState(0);

  const locationSub = useRef<Location.LocationSubscription | null>(null);
  const mapRef = useRef<MapView | null>(null);

  // Timer while recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => setElapsedSec((prev) => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRide = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Location permission is required to track your e-trike route.');
      return;
    }

    setRouteCoords([]);
    setDistanceKm(0);
    setElapsedSec(0);
    setIsRecording(true);

    locationSub.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 2000,
        distanceInterval: 5,
      },
      (loc) => {
        const { latitude, longitude, speed } = loc.coords;
        const currentSpeed = speed && speed > 0 ? speed * 3.6 : 0; // m/s to km/h
        setSpeedKmh(currentSpeed);

        setRouteCoords((prev) => {
          if (prev.length > 0) {
            const last = prev[prev.length - 1];
            const delta = getDistanceKm(last.latitude, last.longitude, latitude, longitude);
            setDistanceKm((d) => d + delta);
          }
          return [...prev, { latitude, longitude }];
        });

        mapRef.current?.animateCamera({
          center: { latitude, longitude },
          zoom: 16,
        });
      }
    );
  };

  const stopRide = () => {
    locationSub.current?.remove();
    locationSub.current = null;
    setIsRecording(false);
    setSpeedKmh(0);
    Alert.alert('Trip Saved!', `You tracked ${distanceKm.toFixed(2)} km on your e-trike.`);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60).toString().padStart(2, '0');
    const remSec = (sec % 60).toString().padStart(2, '0');
    return `${mins}:${remSec}`;
  };

  // Heavy e-trikes typically consume more Wh/km (~30-40 Wh/km) than standard bikes
  const estWattHours = Math.round(distanceKm * 35);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        showsUserLocation
        showsMyLocationButton
        userInterfaceStyle="dark"
      >
        {routeCoords.length > 1 && (
          <Polyline coordinates={routeCoords} strokeColor="#00F5D4" strokeWidth={6} />
        )}
      </MapView>

      <View style={styles.hud}>
        <View style={styles.headerRow}>
          <Text style={styles.badgeText}>⚡ E-TRIKE MODE</Text>
          <Text style={styles.timerText}>{formatTime(elapsedSec)}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{speedKmh.toFixed(1)}</Text>
            <Text style={styles.statLabel}>KM/H</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{distanceKm.toFixed(2)}</Text>
            <Text style={styles.statLabel}>KM TRAVELED</Text>
          </View>
        </View>

        <View style={styles.trikeMetaRow}>
          <View style={styles.metaPill}>
            <BatteryCharging size={14} color="#FEE440" />
            <Text style={styles.metaText}>~{estWattHours} Wh used</Text>
          </View>
          <View style={styles.metaPill}>
            <ShieldAlert size={14} color="#00F5D4" />
            <Text style={styles.metaText}>3/4 Wheel Profile</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.actionBtn, isRecording ? styles.stopBtn : styles.startBtn]}
          onPress={isRecording ? stopRide : startRide}
        >
          {isRecording ? (
            <>
              <Square size={20} color="#FFF" fill="#FFF" />
              <Text style={styles.btnTextDark}>FINISH TRIP</Text>
            </>
          ) : (
            <>
              <Play size={20} color="#0B0F19" fill="#0B0F19" />
              <Text style={styles.btnTextLight}>START TRIP</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19' },
  map: { flex: 1 },
  hud: {
    backgroundColor: '#111827',
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: '#1F2937',
  },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badgeText: { color: '#00F5D4', fontWeight: '800', fontSize: 12, letterSpacing: 1 },
  timerText: { color: '#F9FAFB', fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 14 },
  statBox: { alignItems: 'center' },
  statValue: { color: '#FFFFFF', fontSize: 36, fontWeight: '900', fontVariant: ['tabular-nums'] },
  statLabel: { color: '#9CA3AF', fontSize: 10, fontWeight: '700', marginTop: 2 },
  trikeMetaRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  metaPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#1F2937',
    paddingVertical: 8,
    borderRadius: 10,
  },
  metaText: { color: '#E5E7EB', fontSize: 12, fontWeight: '600' },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
  },
  startBtn: { backgroundColor: '#00F5D4' },
  stopBtn: { backgroundColor: '#EF4444' },
  btnTextLight: { color: '#0B0F19', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
  btnTextDark: { color: '#FFFFFF', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
});