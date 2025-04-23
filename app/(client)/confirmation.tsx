import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native';
import { router, useLocalSearchParams, useRootNavigationState } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { CheckCircle, Home, QrCode } from 'lucide-react-native';

export default function ConfirmationScreen() {
  const params = useLocalSearchParams<{ 
    workerId: string; 
    name: string; 
    amount: string;
  }>();
  
  const { name, amount } = params;
  const rootNavigationState = useRootNavigationState();

  const handleScanAgain = () => {
    if (rootNavigationState?.key) {
      router.push('/(client)/scan');
    }
  };

  const handleHome = () => {
    if (rootNavigationState?.key) {
      router.push('/(auth)/welcome');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <CheckCircle size={80} color={colors.success} />
          </View>
          
          <Text style={styles.title}>Thank You!</Text>
          <Text style={styles.message}>
            Your tip of <Text style={styles.highlight}>${amount}</Text> to <Text style={styles.highlight}>{name}</Text> has been sent successfully.
          </Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000' }}
            style={styles.image}
          />
        </View>
        
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Why Tipping Matters</Text>
          <Text style={styles.infoText}>
            Your generosity makes a real difference in the lives of service workers. Tips often make up a significant portion of their income.
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          title="Scan Another Code"
          onPress={handleScanAgain}
          style={styles.scanButton}
          leftIcon={<QrCode size={20} color={colors.card} />}
        />
        <Button
          title="Return to Home"
          onPress={handleHome}
          variant="outline"
          style={styles.homeButton}
          leftIcon={<Home size={20} color={colors.primary} />}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
  highlight: {
    fontWeight: 'bold',
    color: colors.text,
  },
  imageContainer: {
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: colors.gray[100],
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 22,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
    gap: 12,
  },
  scanButton: {
    width: '100%',
  },
  homeButton: {
    width: '100%',
  },
});