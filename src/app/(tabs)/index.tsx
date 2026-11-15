import { StyleSheet, Text, View } from 'react-native';

export default function FeedScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride Feed</Text>
      <Text style={styles.subtitle}>Community & personal e-bike rides will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#9CA3AF', fontSize: 14, textAlign: 'center' },
});