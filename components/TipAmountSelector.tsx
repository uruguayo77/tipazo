import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '@/constants/colors';

interface TipAmountSelectorProps {
  onSelectAmount: (amount: number) => void;
  initialAmount?: number;
}

const predefinedAmounts = [1, 3, 5, 10];

export const TipAmountSelector: React.FC<TipAmountSelectorProps> = ({
  onSelectAmount,
  initialAmount,
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(initialAmount || null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const handleSelectAmount = (amount: number) => {
    // Add a small delay to prevent touch event conflicts
    setTimeout(() => {
      setSelectedAmount(amount);
      setIsCustom(false);
      onSelectAmount(amount);
    }, 10);
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setSelectedAmount(numValue);
      onSelectAmount(numValue);
    } else {
      setSelectedAmount(null);
    }
  };

  const handleCustomPress = () => {
    // Add a small delay to prevent touch event conflicts
    setTimeout(() => {
      setIsCustom(true);
      setSelectedAmount(null);
    }, 10);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Tip Amount</Text>
      
      <View style={styles.amountsContainer}>
        {predefinedAmounts.map((amount) => (
          <TouchableOpacity
            key={amount}
            style={[
              styles.amountButton,
              selectedAmount === amount && !isCustom && styles.selectedButton,
            ]}
            onPress={() => handleSelectAmount(amount)}
            activeOpacity={0.7}
          >
            <Text 
              style={[
                styles.amountText,
                selectedAmount === amount && !isCustom && styles.selectedText,
              ]}
            >
              ${amount}
            </Text>
          </TouchableOpacity>
        ))}
        
        <TouchableOpacity
          style={[
            styles.amountButton,
            isCustom && styles.selectedButton,
          ]}
          onPress={handleCustomPress}
          activeOpacity={0.7}
        >
          <Text 
            style={[
              styles.amountText,
              isCustom && styles.selectedText,
            ]}
          >
            Custom
          </Text>
        </TouchableOpacity>
      </View>
      
      {isCustom && (
        <View style={styles.customAmountContainer}>
          <Text style={styles.dollarSign}>$</Text>
          <TextInput
            style={styles.customAmountInput}
            value={customAmount}
            onChangeText={handleCustomAmountChange}
            placeholder="Enter amount"
            keyboardType="decimal-pad"
            autoFocus
          />
        </View>
      )}
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
  amountsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amountButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray[300],
    backgroundColor: colors.card,
    minWidth: 70,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  selectedText: {
    color: colors.card,
  },
  customAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  dollarSign: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.gray[500],
  },
  customAmountInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    fontSize: 18,
    color: colors.text,
  },
});