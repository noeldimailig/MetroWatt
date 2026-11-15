import { View, Text, StyleSheet } from 'react-native';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rider Profile</Text>
      <Text style={styles.subtitle}>Total km, Wh consumed & CO₂ saved stats.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0F19', alignItems: 'center', justifyContent: 'center', padding: 20 },
  title: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  subtitle: { color: '#9CA3AF', fontSize: 14, textAlign: 'center' },
});