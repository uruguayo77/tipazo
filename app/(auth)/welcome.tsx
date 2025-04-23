import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { router, useRootNavigationState } from 'expo-router';
import { Button } from '@/components/Button';
import { colors } from '@/constants/colors';
import { QrCode, Wallet } from 'lucide-react-native';

export default function WelcomeScreen() {
  const rootNavigationState = useRootNavigationState();

  const handleClientFlow = () => {
    if (rootNavigationState?.key) {
      router.push('/(client)/scan');
    }
  };

  const handleWorkerFlow = () => {
    if (rootNavigationState?.key) {
      router.push('/(auth)/login');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>TipQR</Text>
          <Text style={styles.subtitle}>Digital tipping made easy</Text>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?q=80&w=1000' }}
            style={styles.image}
          />
        </View>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <QrCode size={24} color={colors.primary} />
            <Text style={styles.featureText}>Scan QR codes to leave tips</Text>
          </View>
          <View style={styles.featureItem}>
            <Wallet size={24} color={colors.primary} />
            <Text style={styles.featureText}>Multiple payment options</Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Text style={styles.actionTitle}>I want to...</Text>
          <Button
            title="Leave a Tip"
            onPress={handleClientFlow}
            style={styles.button}
            leftIcon={<QrCode size={20} color={colors.card} />}
          />
          <Button
            title="Receive Tips"
            onPress={handleWorkerFlow}
            variant="outline"
            style={styles.button}
            leftIcon={<Wallet size={20} color={colors.primary} />}
          />
        </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.gray[600],
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  features: {
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
  },
  actions: {
    marginTop: 'auto',
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  button: {
    marginBottom: 16,
  },
});