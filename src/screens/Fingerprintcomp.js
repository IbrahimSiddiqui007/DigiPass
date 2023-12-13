import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

const BiometricAuthentication = ({ navigation }) => {
  const [authenticationResult, setAuthenticationResult] = useState(null);

  const authenticateAndStoreData = async () => {
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

      // If biometric authentication is successful, call the API to store data
      if (result.success) {
        // Retrieve the token from AsyncStorage
        const token = await AsyncStorage.getItem('token');

        // Make the fingerprint API request with the token in the headers
        const response = await fetch('http://10.0.2.2:3000/fingerprint', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          // Add other necessary configurations for the fingerprint API request
        });

        const data = await response.json();

        // Handle the response data as needed
        console.log('Biometric Scan Response:', data);

        // After handling the biometric scan, navigate to the next page
        // Replace 'NextPage' with your actual page name
        if (data.success) {
          // Biometric registration successful
        } else {
          // Biometric registration failed
          console.error('Biometric registration failed');
        }
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
      <TouchableOpacity style={styles.scanButton} onPress={() => authenticateAndStoreData()}>
        <Text style={styles.buttonText}>Scan Biometrics</Text>
      </TouchableOpacity>

      {/* Button to navigate to login page */}
      <TouchableOpacity style={styles.loginButton} onPress={() => navigation.navigate('studentid')}>
        <Text style={styles.buttonText}>Student ID</Text>
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
  loginButton: {
    backgroundColor: 'green', // Color of your choice
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

export default BiometricAuthentication;
