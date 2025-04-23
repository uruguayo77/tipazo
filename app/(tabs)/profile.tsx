import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Avatar } from '@/components/Avatar';
import { router, useRootNavigationState } from 'expo-router';
import { User, Mail, Briefcase, CreditCard, Building, LogOut, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

export default function ProfileScreen() {
  const { user, logout, updateProfile, isLoading } = useAuthStore();
  const rootNavigationState = useRootNavigationState();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [occupation, setOccupation] = useState((user as any)?.occupation || '');
  const [walletAddress, setWalletAddress] = useState((user as any)?.walletAddress || '');
  const [bankAccount, setBankAccount] = useState((user as any)?.bankAccount?.accountNumber || '');
  const [bankName, setBankName] = useState((user as any)?.bankAccount?.bankName || '');
  const [routingNumber, setRoutingNumber] = useState((user as any)?.bankAccount?.routingNumber || '');

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => {
            logout();
            if (rootNavigationState?.key) {
              router.replace('/(auth)/welcome');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleEditToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (isEditing) {
      // Save changes
      updateProfile({
        name,
        email,
        occupation,
        walletAddress,
        bankAccount: {
          accountNumber: bankAccount,
          routingNumber,
          bankName,
        },
      });
    }
    
    setIsEditing(!isEditing);
  };

  const handlePickImage = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access your photos.');
      return;
    }
    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      updateProfile({
        photoUrl: result.assets[0].uri,
      });
    }
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handlePickImage} disabled={isLoading}>
          <View style={styles.avatarContainer}>
            <Avatar source={user.photoUrl} name={user.name} size={100} />
            <View style={styles.cameraIconContainer}>
              <Camera size={20} color={colors.card} />
            </View>
          </View>
        </TouchableOpacity>
        
        {!isEditing ? (
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.occupation}>{(user as any).occupation || 'Service Worker'}</Text>
          </View>
        ) : null}
        
        <Button
          title={isEditing ? "Save Profile" : "Edit Profile"}
          variant={isEditing ? "primary" : "outline"}
          onPress={handleEditToggle}
          isLoading={isLoading}
          style={styles.editButton}
        />
      </View>
      
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        {isEditing ? (
          <View style={styles.form}>
            <Input
              label="Full Name"
              value={name}
              onChangeText={setName}
              leftIcon={<User size={20} color={colors.gray[500]} />}
            />
            
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Mail size={20} color={colors.gray[500]} />}
            />
            
            <Input
              label="Occupation"
              value={occupation}
              onChangeText={setOccupation}
              leftIcon={<Briefcase size={20} color={colors.gray[500]} />}
            />
          </View>
        ) : (
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <User size={20} color={colors.gray[500]} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Mail size={20} color={colors.gray[500]} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Briefcase size={20} color={colors.gray[500]} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Occupation</Text>
                <Text style={styles.infoValue}>{(user as any).occupation || 'Not specified'}</Text>
              </View>
            </View>
          </View>
        )}
      </Card>
      
      <Card style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        
        {isEditing ? (
          <View style={styles.form}>
            <Input
              label="Wallet Address"
              value={walletAddress}
              onChangeText={setWalletAddress}
              placeholder="Enter your crypto wallet address"
              leftIcon={<CreditCard size={20} color={colors.gray[500]} />}
            />
            
            <Input
              label="Bank Account Number"
              value={bankAccount}
              onChangeText={setBankAccount}
              placeholder="Enter your bank account number"
              leftIcon={<Building size={20} color={colors.gray[500]} />}
            />
            
            <Input
              label="Routing Number"
              value={routingNumber}
              onChangeText={setRoutingNumber}
              placeholder="Enter your routing number"
              leftIcon={<Building size={20} color={colors.gray[500]} />}
            />
            
            <Input
              label="Bank Name"
              value={bankName}
              onChangeText={setBankName}
              placeholder="Enter your bank name"
              leftIcon={<Building size={20} color={colors.gray[500]} />}
            />
          </View>
        ) : (
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <CreditCard size={20} color={colors.gray[500]} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Wallet Address</Text>
                <Text style={styles.infoValue}>
                  {(user as any).walletAddress || 'Not specified'}
                </Text>
              </View>
            </View>
            
            <View style={styles.infoItem}>
              <Building size={20} color={colors.gray[500]} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Bank Account</Text>
                <Text style={styles.infoValue}>
                  {(user as any).bankAccount?.accountNumber 
                    ? `****${(user as any).bankAccount.accountNumber.slice(-4)}` 
                    : 'Not specified'}
                </Text>
              </View>
            </View>
            
            {(user as any).bankAccount?.bankName && (
              <View style={styles.infoItem}>
                <Building size={20} color={colors.gray[500]} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Bank Name</Text>
                  <Text style={styles.infoValue}>{(user as any).bankAccount.bankName}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </Card>
      
      <Button
        title="Logout"
        variant="outline"
        onPress={handleLogout}
        style={styles.logoutButton}
        leftIcon={<LogOut size={20} color={colors.error} />}
        textStyle={{ color: colors.error }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 16,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.card,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
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
  },
  editButton: {
    minWidth: 150,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  form: {
    gap: 8,
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContent: {
    marginLeft: 12,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.gray[500],
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: colors.text,
  },
  logoutButton: {
    marginTop: 8,
    marginBottom: 32,
    borderColor: colors.error,
  },
});