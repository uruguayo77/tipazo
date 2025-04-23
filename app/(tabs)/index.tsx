import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useTipsStore } from '@/store/tips-store';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { TipHistoryItem } from '@/components/TipHistoryItem';
import { EmptyState } from '@/components/EmptyState';
import { Card } from '@/components/Card';
import { Tip } from '@/types';
import { DollarSign, TrendingUp, Calendar, Inbox } from 'lucide-react-native';

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const { tips, fetchTips, isLoading } = useTipsStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTips(user.id);
    }
  }, [user]);

  const onRefresh = async () => {
    if (user) {
      setRefreshing(true);
      await fetchTips(user.id);
      setRefreshing(false);
    }
  };

  const calculateTotalEarnings = () => {
    return tips.reduce((total, tip) => total + tip.amount, 0);
  };

  const calculateTodayEarnings = () => {
    const today = new Date().toDateString();
    return tips
      .filter(tip => new Date(tip.createdAt).toDateString() === today)
      .reduce((total, tip) => total + tip.amount, 0);
  };

  const getRecentTips = (): Tip[] => {
    return [...tips]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  };

  if (tips.length === 0 && !isLoading) {
    return (
      <View style={styles.container}>
        <EmptyState
          title="No Tips Yet"
          description="Your tip history will appear here once you receive tips."
          icon={<Inbox size={64} color={colors.gray[400]} />}
          style={styles.emptyState}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statsContainer}>
        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <DollarSign size={20} color={colors.primary} />
          </View>
          <Text style={styles.statLabel}>Today</Text>
          <Text style={styles.statValue}>${calculateTodayEarnings().toFixed(2)}</Text>
        </Card>
        
        <Card style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <TrendingUp size={20} color={colors.secondary} />
          </View>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>${calculateTotalEarnings().toFixed(2)}</Text>
        </Card>
      </View>
      
      <View style={styles.recentContainer}>
        <Text style={styles.sectionTitle}>Recent Tips</Text>
        
        <FlatList
          data={getRecentTips()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TipHistoryItem tip={item} />}
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
              title="No Tips Yet"
              description="Your tip history will appear here once you receive tips."
              icon={<Calendar size={48} color={colors.gray[400]} />}
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
  statsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 16,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  recentContainer: {
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
  },
});