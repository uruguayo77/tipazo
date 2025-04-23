import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Platform } from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { colors } from '@/constants/colors';
import { QRCode } from '@/components/QRCode';
import { Card } from '@/components/Card';
import { Avatar } from '@/components/Avatar';
import { Share2, Download, Printer } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function QRCodeScreen() {
  const { user } = useAuthStore();
  const [isSharing, setIsSharing] = useState(false);

  if (!user) return null;

  // Create a URL with worker info that can be scanned
  const qrValue = `https://tipqr.app/tip/${user.id}?name=${encodeURIComponent(user.name)}&occupation=${encodeURIComponent((user as any).occupation || '')}`;

  const handleShare = async () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setIsSharing(true);
    try {
      await Share.share({
        message: `Scan this QR code to tip ${user.name}`,
        url: qrValue,
        title: 'TipQR Code',
      });
    } catch (error) {
      console.error('Error sharing QR code:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDownload = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // This would be implemented with actual download functionality
    // For now, just show a message
    alert('QR code download feature coming soon!');
  };

  const handlePrint = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    // This would be implemented with actual print functionality
    // For now, just show a message
    alert('QR code print feature coming soon!');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.qrContainer}>
        <View style={styles.profileInfo}>
          <Avatar source={user.photoUrl} name={user.name} size={60} />
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.occupation}>{(user as any).occupation || 'Service Worker'}</Text>
          </View>
        </View>
        
        <View style={styles.qrWrapper}>
          <QRCode
            value={qrValue}
            size={250}
            logo={user.photoUrl}
          />
        </View>
        
        <Text style={styles.instructions}>
          Display this QR code to receive tips from customers
        </Text>
      </Card>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleShare}
          disabled={isSharing}
        >
          <View style={[styles.actionIcon, styles.shareIcon]}>
            <Share2 size={24} color={colors.card} />
          </View>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleDownload}
        >
          <View style={[styles.actionIcon, styles.downloadIcon]}>
            <Download size={24} color={colors.card} />
          </View>
          <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handlePrint}
        >
          <View style={[styles.actionIcon, styles.printIcon]}>
            <Printer size={24} color={colors.card} />
          </View>
          <Text style={styles.actionText}>Print</Text>
        </TouchableOpacity>
      </View>
      
      <Card style={styles.tipsCard}>
        <Text style={styles.tipsTitle}>Tips for Getting More Tips</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>• Place your QR code in a visible location</Text>
          <Text style={styles.tipItem}>• Print multiple copies for different areas</Text>
          <Text style={styles.tipItem}>• Add a friendly note encouraging tips</Text>
          <Text style={styles.tipItem}>• Thank customers who leave tips</Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  qrContainer: {
    alignItems: 'center',
    padding: 24,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  nameContainer: {
    marginLeft: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  occupation: {
    fontSize: 14,
    color: colors.gray[500],
    marginTop: 4,
  },
  qrWrapper: {
    marginBottom: 24,
  },
  instructions: {
    fontSize: 14,
    color: colors.gray[600],
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 24,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareIcon: {
    backgroundColor: colors.primary,
  },
  downloadIcon: {
    backgroundColor: colors.secondary,
  },
  printIcon: {
    backgroundColor: colors.info,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
  },
  tipsCard: {
    padding: 16,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  tipsList: {
    gap: 8,
  },
  tipItem: {
    fontSize: 14,
    color: colors.gray[700],
    lineHeight: 20,
  },
});