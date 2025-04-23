import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { router, useLocalSearchParams, useRootNavigationState } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { TipAmountSelector } from '@/components/TipAmountSelector';
import { ArrowLeft, ArrowRight } from 'lucide-react-native';

export default function TipAmountScreen() {
  const params = useLocalSearchParams<{ workerId: string; name: string; occupation: string }>();
  const { workerId, name, occupation } = params;
  const rootNavigationState = useRootNavigationState();
  
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number>(5);
  
  const handleBack = () => {
    if (rootNavigationState?.key) {
      router.back();
    }
  };

  const handleContinue = () => {
    if (!tipAmount) {
      alert('Please select a tip amount');
      return;
    }
    
    if (rootNavigationState?.key) {
      router.push({
        pathname: '/(client)/payment',
        params: { 
          workerId, 
          name, 
          occupation,
          amount: tipAmount.toString(),
          comment,
          rating: rating.toString()
        }
      });
    }
  };

  const handleSelectAmount = (amount: number) => {
    setTipAmount(amount);
  };

  const handleRating = (value: number) => {
    setRating(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tip Amount</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.content}>
        <View style={styles.recipientInfo}>
          <Text style={styles.recipientLabel}>Tipping</Text>
          <Text style={styles.recipientName}>{name}</Text>
          <Text style={styles.recipientOccupation}>{occupation}</Text>
        </View>
        
        <TipAmountSelector onSelectAmount={handleSelectAmount} />
        
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingTitle}>Rate your experience</Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => handleRating(star)}
                style={styles.starButton}
              >
                <View style={[
                  styles.star,
                  star <= rating ? styles.starFilled : styles.starEmpty
                ]}>
                  <Text style={[
                    styles.starText,
                    star <= rating ? styles.starTextFilled : styles.starTextEmpty
                  ]}>★</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={styles.commentContainer}>
          <Text style={styles.commentTitle}>Leave a comment (optional)</Text>
          <TextInput
            style={styles.commentInput}
            value={comment}
            onChangeText={setComment}
            placeholder="Write a comment..."
            multiline
            maxLength={200}
          />
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          title="Continue to Payment"
          onPress={handleContinue}
          disabled={!tipAmount}
          rightIcon={<ArrowRight size={20} color={colors.card} />}
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
  recipientInfo: {
    marginBottom: 24,
  },
  recipientLabel: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  recipientOccupation: {
    fontSize: 16,
    color: colors.gray[600],
  },
  ratingContainer: {
    marginVertical: 16,
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  starButton: {
    padding: 4,
  },
  star: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starFilled: {
    backgroundColor: colors.warning + '20',
  },
  starEmpty: {
    backgroundColor: colors.gray[200],
  },
  starText: {
    fontSize: 24,
  },
  starTextFilled: {
    color: colors.warning,
  },
  starTextEmpty: {
    color: colors.gray[400],
  },
  commentContainer: {
    marginVertical: 16,
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  commentInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: colors.text,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
});