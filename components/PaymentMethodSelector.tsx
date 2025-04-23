import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/constants/colors';
import { PaymentMethod } from '@/types';
import { CreditCard, Coins } from 'lucide-react-native';

interface PaymentMethodSelectorProps {
  onSelectMethod: (method: PaymentMethod) => void;
  selectedMethod?: PaymentMethod;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onSelectMethod,
  selectedMethod,
}) => {
  const paymentMethods: { id: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    {
      id: 'card',
      label: 'Credit Card',
      icon: <CreditCard size={24} color={selectedMethod === 'card' ? colors.card : colors.gray[600]} />,
    },
    {
      id: 'usdt',
      label: 'USDT',
      icon: <Coins size={24} color={selectedMethod === 'usdt' ? colors.card : colors.gray[600]} />,
    },
    {
      id: 'ton',
      label: 'TON',
      icon: <Coins size={24} color={selectedMethod === 'ton' ? colors.card : colors.gray[600]} />,
    },
  ];

  const handleMethodPress = (method: PaymentMethod) => {
    // Add a small delay to prevent touch event conflicts
    setTimeout(() => {
      onSelectMethod(method);
    }, 10);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>
      
      <View style={styles.methodsContainer}>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            style={[
              styles.methodButton,
              selectedMethod === method.id && styles.selectedButton,
            ]}
            onPress={() => handleMethodPress(method.id)}
            activeOpacity={0.7}
          >
            <View style={styles.methodContent}>
              {method.icon}
              <Text 
                style={[
                  styles.methodText,
                  selectedMethod === method.id && styles.selectedText,
                ]}
              >
                {method.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  methodsContainer: {
    gap: 12,
  },
  methodButton: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.card,
  },
  methodContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  methodText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectedText: {
    color: colors.card,
  },
});