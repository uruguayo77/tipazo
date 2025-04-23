import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams, useRootNavigationState } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { PaymentMethodSelector } from '@/components/PaymentMethodSelector';
import { useTipsStore } from '@/store/tips-store';
import { PaymentMethod } from '@/types';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export default function PaymentScreen() {
  const params = useLocalSearchParams<{ 
    workerId: string; 
    name: string; 
    occupation: string;
    amount: string;
    comment?: string;
    rating?: string;
  }>();
  
  const { workerId, name, amount, comment, rating } = params;
  const { sendTip, isLoading } = useTipsStore();
  const rootNavigationState = useRootNavigationState();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | undefined>(undefined);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const handleBack = () => {
    if (isProcessing || isComplete) return;
    
    // Add a small delay to prevent touch event conflicts
    setTimeout(() => {
      if (rootNavigationState?.key) {
        router.back();
      }
    }, 50);
  };

  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
  };

  const handlePayment = async () => {
    if (!paymentMethod || !workerId || !amount) {
      alert('Please select a payment method');
      return;
    }
    
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.log('Haptics error:', error);
      }
    }
    
    setIsProcessing(true);
    
    try {
      const tipAmount = parseFloat(amount);
      const tipRating = rating ? parseInt(rating, 10) : undefined;
      
      await sendTip(workerId, tipAmount, paymentMethod, comment, tipRating);
      
      setIsComplete(true);
      
      // Navigate to confirmation after a short delay
      setTimeout(() => {
        if (rootNavigationState?.key) {
          router.push({
            pathname: '/(client)/confirmation',
            params: { 
              workerId, 
              name, 
              amount,
            }
          });
        }
      }, 1500);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={[
            styles.backButton,
            (isProcessing || isComplete) && styles.disabledButton
          ]} 
          onPress={handleBack}
          disabled={isProcessing || isComplete}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        {isComplete ? (
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <CheckCircle size={64} color={colors.success} />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successMessage}>
              Your tip of ${amount} has been sent to {name}.
            </Text>
          </View>
        ) : isProcessing ? (
          <View style={styles.processingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.processingText}>Processing payment...</Text>
          </View>
        ) : (
          <>
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Tip Amount</Text>
              <Text style={styles.amount}>${amount}</Text>
              <Text style={styles.recipient}>to {name}</Text>
            </View>
            
            <PaymentMethodSelector
              onSelectMethod={handleSelectPaymentMethod}
              selectedMethod={paymentMethod}
            />
          </>
        )}
      </View>
      
      {!isProcessing && !isComplete && (
        <View style={styles.footer}>
          <Button
            title="Pay Now"
            onPress={handlePayment}
            disabled={!paymentMethod || isLoading}
            isLoading={isLoading}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  amountContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  amountLabel: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 8,
  },
  amount: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  recipient: {
    fontSize: 16,
    color: colors.gray[600],
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    fontSize: 18,
    color: colors.text,
    marginTop: 16,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  successIconContainer: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    lineHeight: 24,
  },
});