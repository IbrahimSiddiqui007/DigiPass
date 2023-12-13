import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const logoImg = require("../../assets/logo.jpg");

const Login = ({ navigation }) => {
  const [fdata, setFdata] = useState({
    emiratesID: '',
    password: '',
  });

  const emiratesID = fdata.emiratesID;
  const password = fdata.password;

  const handleSuccessfulLogin = async (token, userfName,userlName, documentNames) => {
    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('firstName', userfName);
      await AsyncStorage.setItem('lastName', userlName);
      await AsyncStorage.setItem('documentNames', JSON.stringify(documentNames));
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  const SendtoBackend = () => {
    if (emiratesID === '' || password === '') {
      setErrormsg('All fields are required');
      return;
    } else {
      fetch('http://10.0.2.2:3000/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fdata),
      })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.error) {
            setErrormsg(data.error);
          } else {
            handleSuccessfulLogin(data.token, data.userfName,data.userlName, data.documentNames);
            alert('Logged in successfully');
            navigation.navigate('homepage');
          }
        });
    }
  };

  const [errormsg, setErrormsg] = useState(null);

  return (
    <View style={{ flex: 1, backgroundColor: 'black', padding: 10, alignItems: 'center' }}>
      <ScrollView>
        <KeyboardAvoidingView>
          <View style={{ marginVertical: 40, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={logoImg} style={{ width: 180, height: 180, marginBottom: 20 }} />
            <Text style={{ color: '#4A55A2', fontSize: 26, fontWeight: 'bold' }}>
              Login
            </Text>
          </View>
          {errormsg ? (
            <Text style={{ color: 'white', fontSize: 15, textAlign: 'center', backgroundColor: '#F50057', padding: 5, borderRadius: 10 }}>
              {errormsg}
            </Text>
          ) : null}
          <View style={{ marginTop: 30, alignItems: 'center' }}>
            <View style={styles.inputContainer}>
              <TextInput
                value={fdata.emiratesID}
                onPressIn={() => setErrormsg(null)}
                onChangeText={(text) => setFdata({ ...fdata, emiratesID: text })}
                placeholderTextColor={'black'}
                placeholder='Emirates ID'
                style={styles.input}
              />
            </View>
            <View style={{ marginTop: 20 }}>
              <TextInput
                value={fdata.password}
                onPressIn={() => setErrormsg(null)}
                onChangeText={(text) => setFdata({ ...fdata, password: text })}
                secureTextEntry={true}
                placeholderTextColor={'black'}
                placeholder='Password'
                style={styles.input}
              />
            </View>
            <Pressable
              style={styles.loginButton}
              onPress={()=>{SendtoBackend();}}
            >
              <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>
                Login
              </Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('signup')} style={{ marginTop: 15 }}>
              <Text style={{ textAlign: 'center', color: 'gray', fontSize: 16 }}>
                Don't have an account? Sign Up
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    fontSize: 18,
    padding: 15,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 25,
    textAlign: 'center',
  },
  loginButton: {
    width: 250,
    backgroundColor: '#4A55A2',
    padding: 15,
    marginTop: 30,
    borderRadius: 25,
  },
});

export default Login;
