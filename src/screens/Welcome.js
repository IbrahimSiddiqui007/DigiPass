import { Pressable, ScrollView, StyleSheet, Text, View, Image } from 'react-native';
import React from 'react';

const logoImg = require("../../assets/logo.jpg");

const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Image source={logoImg} style={styles.logo} />
        <Pressable
          style={styles.loginButton}
          onPress={() => navigation.navigate('loginselector')}
        >
          <Text style={styles.buttonText}>
            Login
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 70,

  },
  loginButton: {
    width: 200,
    backgroundColor: "#4A55A2",
    padding: 15,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Welcome;
