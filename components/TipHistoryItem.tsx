import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { Tip } from '@/types';
import { Card } from './Card';
import { CreditCard, Coins, MessageSquare, Star } from 'lucide-react-native';

interface TipHistoryItemProps {
  tip: Tip;
}

export const TipHistoryItem: React.FC<TipHistoryItemProps> = ({ tip }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getPaymentMethodIcon = () => {
    switch (tip.paymentMethod) {
      case 'card':
        return <CreditCard size={16} color={colors.gray[500]} />;
      case 'usdt':
      case 'ton':
        return <Coins size={16} color={colors.gray[500]} />;
      default:
        return null;
    }
  };

  const getPaymentMethodLabel = () => {
    switch (tip.paymentMethod) {
      case 'card':
        return 'Credit Card';
      case 'usdt':
        return 'USDT';
      case 'ton':
        return 'TON';
      default:
        return '';
    }
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <View style={styles.amountContainer}>
          <Text style={styles.amount}>${tip.amount.toFixed(2)}</Text>
          <Text style={styles.date}>{formatDate(tip.createdAt)}</Text>
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusBadge, styles[`${tip.status}Badge`]]}>
            <Text style={styles.statusText}>{tip.status}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          {getPaymentMethodIcon()}
          <Text style={styles.detailText}>{getPaymentMethodLabel()}</Text>
        </View>
        
        {tip.rating && (
          <View style={styles.detailItem}>
            <Star size={16} color={colors.warning} fill={colors.warning} />
            <Text style={styles.detailText}>{tip.rating}</Text>
          </View>
        )}
      </View>
      
      {tip.comment && (
        <View style={styles.commentContainer}>
          <MessageSquare size={16} color={colors.gray[500]} />
          <Text style={styles.comment}>{tip.comment}</Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  amountContainer: {
    flex: 1,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  date: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 4,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: colors.success + '20',
  },
  pendingBadge: {
    backgroundColor: colors.warning + '20',
  },
  failedBadge: {
    backgroundColor: colors.error + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginVertical: 12,
  },
  detailsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: colors.gray[600],
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  comment: {
    flex: 1,
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
});