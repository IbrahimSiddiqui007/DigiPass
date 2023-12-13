// LoginTypeSelection.js
import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const logoImg = require("../../assets/logo.jpg");

const LoginTypeSelection = ({ navigation }) => {
  const goToNationalIDLogin = () => {
    navigation.navigate('login');
  };

  const goToPhoneNumberLogin = () => {
    navigation.navigate('loginphone');
  };

  const goToMetaMaskLogin = () => {
    navigation.navigate('loginmeta');
  };

  const goToSignUp = () => {
    navigation.navigate('signup');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={logoImg} style={styles.logo} />
        <Text style={styles.title}>Login Using:</Text>
        <Pressable onPress={goToNationalIDLogin} style={styles.loginTypeButton}>
          <Text style={styles.buttonText}>National ID</Text>
        </Pressable>
        <Pressable onPress={goToPhoneNumberLogin} style={styles.loginTypeButton}>
          <Text style={styles.buttonText}>Phone Number</Text>
        </Pressable>
        <Pressable onPress={goToMetaMaskLogin} style={styles.loginTypeButton}>
          <Text style={styles.buttonText}>MetaMask Wallet ID</Text>
        </Pressable>
        <Text style={styles.signupText} onPress={goToSignUp}>
          Don't have an account? Sign Up
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 10,
    marginTop: 30,
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  loginTypeButton: {
    width: 200,
    backgroundColor: '#4A55A2',
    padding: 15,
    marginTop: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupText: {
    color: 'gray',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  },
});

export default LoginTypeSelection;
