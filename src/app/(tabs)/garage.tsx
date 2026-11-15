import { StyleSheet, Text, View } from 'react-native';

export default function GarageScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>E-Bike Garage</Text>
      <Text style={styles.subtitle}>Saved bikes, battery Wh specs & maintenance logs.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#9CA3AF', fontSize: 14, textAlign: 'center' },
});