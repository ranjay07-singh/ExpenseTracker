import { colors } from '@/constants/theme';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';

const FinanceTips = ({ state, tipsData }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>📍 {state} - Financial Tips ({tipsData.language})</Text>

      {tipsData.tips.map((tip, index) => (
        <View key={index} style={styles.tipBox}>
          <Text style={styles.tipText}>• {tip}</Text>
        </View>
      ))}

      {tipsData.blogLinks?.length > 0 && (
        <View style={styles.linkSection}>
          <Text style={styles.linkHeader}>🔗 Read More:</Text>
          {tipsData.blogLinks.map((link, index) => (
            <Text
              key={index}
              style={styles.link}
              onPress={() => Linking.openURL(link)}
            >
              {link}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: colors.neutral800,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
    backgroundColor: colors.neutral900,
    padding: 5,
    borderRadius: 10,
  },
  tipBox: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  tipText: {
    fontSize: 16,
    color: '#444',
  },
  linkSection: {
    marginTop: 20,
  },
  linkHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
  },
  link: {
    color: '#1e90ff',
    textDecorationLine: 'underline',
    marginBottom: 6,
    fontSize: 15,
  },
});

export default FinanceTips;
