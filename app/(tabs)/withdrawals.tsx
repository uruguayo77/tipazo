import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity, Alert, Platform } from 'react-native';
import { useTipsStore } from '@/store/tips-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { WithdrawalRequest } from '@/types';
import { Wallet, Building, ArrowRight, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function WithdrawalsScreen() {
  const { user } = useAuthStore();
  const { tips, withdrawals, fetchTips, fetchWithdrawals, requestWithdrawal, isLoading } = useTipsStore();
  const [refreshing, setRefreshing] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchTips(user.id);
      fetchWithdrawals(user.id);
    }
  }, [user]);

  const onRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await Promise.all([
        fetchTips(user.id),
        fetchWithdrawals(user.id)
      ]);
      setRefreshing(false);
    }
  };

  const calculateAvailableBalance = () => {
    const totalTips = tips.reduce((total, tip) => {
      if (tip.status === 'completed') {
        return total + tip.amount;
      }
      return total;
    }, 0);
    
    const totalWithdrawals = withdrawals.reduce((total, withdrawal) => {
      if (withdrawal.status !== 'failed') {
        return total + withdrawal.amount;
      }
      return total;
    }, 0);
    
    return Math.max(0, totalTips - totalWithdrawals);
  };

  const handleWithdraw = () => {
    const availableBalance = calculateAvailableBalance();
    setWithdrawalAmount(availableBalance);
    
    if (availableBalance <= 0) {
      Alert.alert('No Funds Available', 'You do not have any funds available to withdraw.');
      return;
    }
    
    Alert.alert(
      'Withdraw Funds',
      `Available balance: $${availableBalance.toFixed(2)}`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'To Wallet',
          onPress: () => handleWithdrawalConfirm('wallet'),
        },
        {
          text: 'To Bank',
          onPress: () => handleWithdrawalConfirm('bank'),
        },
      ]
    );
  };

  const handleWithdrawalConfirm = async (destination: 'wallet' | 'bank') => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.log('Haptics error:', error);
      }
    }
    
    if (!user) return;
    
    try {
      await requestWithdrawal(user.id, withdrawalAmount, destination);
      Alert.alert(
        'Withdrawal Requested',
        `Your withdrawal of $${withdrawalAmount.toFixed(2)} to your ${destination} has been requested.`
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to request withdrawal. Please try again.');
    }
  };

  const renderWithdrawalItem = ({ item }: { item: WithdrawalRequest }) => {
    const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    };

    const getStatusIcon = () => {
      switch (item.status) {
        case 'completed':
          return <CheckCircle size={16} color={colors.success} />;
        case 'pending':
          return <Clock size={16} color={colors.warning} />;
        case 'failed':
          return <XCircle size={16} color={colors.error} />;
        default:
          return null;
      }
    };

    return (
      <Card style={styles.withdrawalItem}>
        <View style={styles.withdrawalHeader}>
          <View style={styles.withdrawalInfo}>
            <View style={styles.withdrawalIconContainer}>
              {item.destination === 'wallet' ? (
                <Wallet size={20} color={colors.primary} />
              ) : (
                <Building size={20} color={colors.primary} />
              )}
            </View>
            <View>
              <Text style={styles.withdrawalDestination}>
                To {item.destination === 'wallet' ? 'Wallet' : 'Bank Account'}
              </Text>
              <Text style={styles.withdrawalDate}>{formatDate(item.createdAt)}</Text>
            </View>
          </View>
          <View style={styles.withdrawalAmount}>
            <Text style={styles.withdrawalAmountText}>${item.amount.toFixed(2)}</Text>
            <View style={styles.withdrawalStatus}>
              {getStatusIcon()}
              <Text style={[
                styles.withdrawalStatusText,
                item.status === 'completed' && styles.completedStatus,
                item.status === 'pending' && styles.pendingStatus,
                item.status === 'failed' && styles.failedStatus,
              ]}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Card style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>${calculateAvailableBalance().toFixed(2)}</Text>
        <Button
          title="Withdraw Funds"
          onPress={handleWithdraw}
          style={styles.withdrawButton}
          rightIcon={<ArrowRight size={20} color={colors.card} />}
          disabled={calculateAvailableBalance() <= 0}
        />
      </Card>
      
      <View style={styles.historyContainer}>
        <Text style={styles.sectionTitle}>Withdrawal History</Text>
        
        <FlatList
          data={withdrawals}
          keyExtractor={(item) => item.id}
          renderItem={renderWithdrawalItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No Withdrawals Yet"
              description="Your withdrawal history will appear here once you withdraw funds."
              icon={<Wallet size={48} color={colors.gray[400]} />}
            />
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  balanceCard: {
    padding: 24,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 24,
  },
  withdrawButton: {
    width: '100%',
  },
  historyContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: colors.text,
  },
  listContent: {
    paddingBottom: 16,
  },
  withdrawalItem: {
    padding: 16,
    marginBottom: 12,
  },
  withdrawalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  withdrawalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  withdrawalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  withdrawalDestination: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  withdrawalDate: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 4,
  },
  withdrawalAmount: {
    alignItems: 'flex-end',
  },
  withdrawalAmountText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  withdrawalStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  withdrawalStatusText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  completedStatus: {
    color: colors.success,
  },
  pendingStatus: {
    color: colors.warning,
  },
  failedStatus: {
    color: colors.error,
  },
});