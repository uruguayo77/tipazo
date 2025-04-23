import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams, useRootNavigationState } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
import { ArrowLeft, Star, DollarSign } from 'lucide-react-native';

export default function WorkerProfileScreen() {
  const params = useLocalSearchParams<{ workerId: string; name: string; occupation: string }>();
  const rootNavigationState = useRootNavigationState();
  
  const { workerId, name, occupation } = params;
  
  const handleBack = () => {
    if (rootNavigationState?.key) {
      router.back();
    }
  };

  const handleTip = () => {
    if (rootNavigationState?.key) {
      router.push({
        pathname: '/(client)/tip-amount',
        params: { workerId, name, occupation }
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Worker Profile</Text>
        <View style={styles.placeholder} />
      </View>
      
      <View style={styles.profileContainer}>
        <View style={styles.profileHeader}>
          <Avatar 
            source="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200" 
            name={name} 
            size={100} 
          />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.occupation}>{occupation}</Text>
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Star size={16} color={colors.warning} fill={colors.warning} />
              <Text style={styles.ratingText}>(4.9)</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.divider} />
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.bio}>
            {occupation === 'Barista' 
              ? "I'm passionate about crafting the perfect cup of coffee. I've been a barista for 3 years and love creating latte art and experimenting with new brewing methods."
              : "I'm dedicated to providing excellent service and making your experience memorable. Thank you for considering a tip!"}
          </Text>
        </View>
        
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1000' }}
            style={styles.image}
          />
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          title="Leave a Tip"
          onPress={handleTip}
          style={styles.tipButton}
          leftIcon={<DollarSign size={20} color={colors.card} />}
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
  profileContainer: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  nameContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  occupation: {
    fontSize: 16,
    color: colors.gray[600],
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.gray[600],
  },
  divider: {
    height: 1,
    backgroundColor: colors.gray[200],
    marginBottom: 24,
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    color: colors.gray[700],
    lineHeight: 24,
  },
  imageContainer: {
    marginBottom: 24,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  tipButton: {
    width: '100%',
  },
});