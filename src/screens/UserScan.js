import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useNavigation } from '@react-navigation/native';

const FingerprintScanlogin = () => {
  const [authenticationResult, setAuthenticationResult] = useState(null);
  const navigation = useNavigation();

  const authenticateAndNavigate = async () => {
    try {
      // Check if biometric authentication is available
      const isAvailable = await LocalAuthentication.hasHardwareAsync();

      if (!isAvailable) {
        throw new Error('Biometric authentication is not available on this device.');
      }

      // Attempt to authenticate using biometrics
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate using biometrics',
        fallbackLabel: 'Enter PIN', // Fallback to PIN if biometric authentication fails
      });

      // Update the state with the authentication result
      setAuthenticationResult(result.success);

      // If biometric authentication is successful, navigate to the 'viewdoc' page
      if (result.success) {
        console.log('Biometric authentication successful');
        navigation.navigate('viewdoc');
      }
    } catch (error) {
      // Update the state with the error message
      setAuthenticationResult(false);

      // Handle error
      console.error('Error during biometric authentication:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Button to initiate biometric scan */}
      <TouchableOpacity style={styles.scanButton} onPress={authenticateAndNavigate}>
        <Text style={styles.buttonText}>Scan Biometrics</Text>
      </TouchableOpacity>

      <Text>{authenticationResult === null ? 'No authentication attempt yet' : `Authentication Result: ${authenticationResult}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#4A55A2', // Color of your choice
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FingerprintScanlogin;
