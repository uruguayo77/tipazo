import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { router, useRootNavigationState } from 'expo-router';
import { colors } from '@/constants/colors';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { ArrowLeft, ScanLine, FlipHorizontal } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const rootNavigationState = useRootNavigationState();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    
    setScanned(true);
    
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.log('Haptics error:', error);
      }
    }
    
    // Parse the QR code data
    try {
      // For demo purposes, we'll just extract worker ID from URL
      // In a real app, you'd parse the URL properly
      const url = new URL(data);
      const pathParts = url.pathname.split('/');
      const workerId = pathParts[pathParts.length - 1];
      
      // Extract name and occupation from query params if available
      const params = url.searchParams;
      const name = params.get('name') || 'Worker';
      const occupation = params.get('occupation') || '';
      
      // Use setTimeout to ensure any ongoing touch events are completed
      setTimeout(() => {
        if (rootNavigationState?.key) {
          // Navigate to worker profile
          router.push({
            pathname: '/(client)/worker-profile',
            params: { workerId, name, occupation }
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error parsing QR code:', error);
      alert('Invalid QR code. Please try again.');
      setScanned(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const handleBack = () => {
    // Use setTimeout to avoid touch event conflicts
    setTimeout(() => {
      if (rootNavigationState?.key) {
        router.back();
      }
    }, 50);
  };

  // Mock scan for web or when camera is not available
  const handleMockScan = () => {
    if (Platform.OS === 'web') {
      handleBarCodeScanned({ data: 'https://tipqr.app/tip/1?name=John%20Doe&occupation=Barista' });
    }
  };

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            We need camera permission to scan QR codes. Please grant permission to continue.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
            activeOpacity={0.7}
          >
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      >
        <SafeAreaView style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={colors.card} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Scan QR Code</Text>
            <TouchableOpacity 
              style={styles.flipButton} 
              onPress={toggleCameraFacing}
              activeOpacity={0.7}
            >
              <FlipHorizontal size={24} color={colors.card} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scanArea}>
            <View style={styles.scanFrame}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
            <ScanLine size={240} color={colors.primary} style={styles.scanLine} />
          </View>
          
          <View style={styles.instructions}>
            <Text style={styles.instructionsText}>
              Align the QR code within the frame to scan
            </Text>
            
            {Platform.OS === 'web' && (
              <TouchableOpacity
                style={styles.mockScanButton}
                onPress={handleMockScan}
                activeOpacity={0.7}
              >
                <Text style={styles.mockScanButtonText}>Simulate Scan (Web Demo)</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.card,
    fontSize: 18,
    fontWeight: '600',
  },
  flipButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.card,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.card,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: colors.card,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: colors.card,
  },
  scanLine: {
    position: 'absolute',
  },
  instructions: {
    padding: 24,
    alignItems: 'center',
  },
  instructionsText: {
    color: colors.card,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.background,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: colors.gray[600],
    textAlign: 'center',
    marginBottom: 24,
  },
  permissionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  mockScanButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 16,
  },
  mockScanButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
});