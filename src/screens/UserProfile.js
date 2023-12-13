import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable, Image } from 'react-native';
const logoImg = require("../../assets/logo.jpg");

const UserProfile = ({navigation}) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo */}
        {/* Assuming logoImg is your logo image source */}
        <Image source={logoImg} style={styles.logo} />

        {/* Hello Text */}
        <Text style={styles.helloText}>Hello</Text>

        {/* Buttons */}
        <View style={styles.buttonsContainer}>
          <Pressable onPress={()=>{navigation.navigate('userdoc')}} style={styles.button}>
            <Text style={styles.buttonText}>View Document</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Update Document</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
          <Pressable style={styles.button}>
            <Text style={styles.buttonText}>Others</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: 50, // Adjust as needed
    height: 50, // Adjust as needed
    alignSelf: 'flex-start',
  },
  helloText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  buttonsContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4A55A2',
    padding: 15,
    borderRadius: 50, // To make it round
    width: 150, // Adjust as needed
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default UserProfile;
