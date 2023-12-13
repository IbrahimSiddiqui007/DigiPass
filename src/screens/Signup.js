import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const handleSuccessfulLogin = async (token, userName) => {
  try {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('userName', userName);
  } catch (error) {
    console.error('Error saving data to AsyncStorage:', error);
  }
};

const Signup = ({ navigation }) => {
  const [fdata, setFdata] = useState({
    firstName: '',
    lastName: '',
    emiratesID: '',
    phoneNumber: '',
    metaID: '',
    password: '',
    cpassword: '',
    dob: '',
  });

  const firstName = fdata.firstName;
  const lastName = fdata.lastName;
  const emiratesID = fdata.emiratesID;
  const phoneNumber = fdata.phoneNumber;
  const metaID = fdata.metaID;
  const password = fdata.password;
  const cpassword = fdata.cpassword;
  const dob = fdata.dob;

  const SendtoBackend = async () => {
    if (firstName === ''||lastName === '' || emiratesID === '' || phoneNumber === '' || metaID === '' || password === '' || cpassword === '' || dob === '') {
      setErrormsg('All fields are required');
      return;
    } else {
      if (password !== cpassword) {
        setErrormsg('Password and Confirm Password must be the same');
        return;
      } else {
        try {
          // Make your sign-up API request
          const response = await fetch('http://10.0.2.2:3000/signup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fdata),
          });

          const data = await response.json();

          if (data.error) {
            setErrormsg(data.error);
          } else {
            // Store the token in AsyncStorage
            await AsyncStorage.setItem('token', data.token);

            // Navigate to the fingerprint page
            navigation.navigate('fingerprint'); // Replace 'FingerprintScan' with your actual page name
          }
        } catch (error) {
          console.error('Error during sign-up:', error);
          // Handle sign-up error
        }
      }
    }
  };

  const [errormsg, setErrormsg] = useState(null);

  return (
    <View style={styles.container}>
      <ScrollView>
        <KeyboardAvoidingView>
          <View style={styles.centerContent}>
            <Image source={require('../../assets/logo.jpg')} style={styles.logo} />
            <Text style={styles.title}>Sign Up</Text>
            <Text style={styles.subtitle}>Create your account</Text>
          </View>

          {errormsg ? (
            <Text style={styles.errorText}>{errormsg}</Text>
          ) : null}

          <View style={styles.formContainer}>
            <View>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                value={firstName}
                onPressIn={() => setErrormsg(null)}
                onChangeText={(text) => setFdata({ ...fdata, firstName: text })}
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder='Enter your name'
              />
            </View>
            <View>
              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                value={lastName}
                onPressIn={() => setErrormsg(null)}
                onChangeText={(text) => setFdata({ ...fdata, lastName: text })}
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder='Enter your name'
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>National ID</Text>
              <TextInput
                value={emiratesID}
                onPressIn={() => setErrormsg(null)}
                onChangeText={(text) => setFdata({ ...fdata, emiratesID: text })}
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder='Enter your National ID'
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                value={phoneNumber}
                onPressIn={() => setErrormsg(null)}
                onChangeText={(text) => setFdata({ ...fdata, phoneNumber: text })}
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder='Enter your Phone Number'
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Meta Mask Wallet</Text>
              <TextInput
                value={metaID}
                onPressIn={() => setErrormsg(null)}
                onChangeText={(text) => setFdata({ ...fdata, metaID: text })}
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder='Enter your meta mask wallet ID'
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                value={password}
                onPressIn={() => setErrormsg(null)}
                onChangeText={(text) => setFdata({ ...fdata, password: text })}
                secureTextEntry={true}
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder='Enter your password'
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                value={cpassword}
                onPressIn={() => setErrormsg(null)}
                onChangeText={(text) => setFdata({ ...fdata, cpassword: text })}
                secureTextEntry={true}
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder='Enter your password'
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Date Of Birth</Text>
              <TextInput
                value={dob}
                onPressIn={() => setErrormsg(null)}
                onChangeText={(text) => setFdata({ ...fdata, dob: text })}
                style={styles.input}
                placeholderTextColor={'black'}
                placeholder='Enter your Date of Birth'
              />
            </View>
            <Pressable onPress={() => SendtoBackend()} style={styles.signupButton}>
              <Text style={styles.signupButtonText}>Register</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('login')} style={styles.signInLink}>
              <Text style={styles.signInText}>Already have an account? Sign in</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },
  centerContent: {
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  title: {
    color: '#4A55A2',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 20,
  },
  errorText: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    backgroundColor: '#F50057',
    padding: 5,
    borderRadius: 10,
    marginBottom: 20,
  },
  formContainer: {
    alignItems: 'center',
  },
  inputContainer: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: 'gray',
  },
  input: {
    fontSize: 18,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    marginVertical: 10,
    width: 300,
    color:"white",
  },
  signupButton: {
    width: 200,
    backgroundColor: '#4A55A2',
    padding: 15,
    marginTop: 30,
    borderRadius: 6,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signInLink: {
    marginTop: 15,
  },
  signInText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
  },
});

export default Signup;
