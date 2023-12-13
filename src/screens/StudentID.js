import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentID = ({ navigation }) => {
  const [studentID, setStudentID] = useState('');

  const handleSubmit = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem('token');

      // Make the API request to update student ID and create related entries
      const response = await fetch('http://10.0.2.2:3000/updateStudentID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Include the token in the headers
        },
        body: JSON.stringify({ studentID }), // Include the student ID in the request body
      });

      const data = await response.json();

      if (response.ok) {
        // Handle success, you may navigate to the next page or perform other actions
        console.log('Student ID updated successfully');
        Alert.alert('Success', 'Data fetched');
        //navigation.navigate('NextPage'); // Replace 'NextPage' with your actual page name
      } else {
        // Handle error
        console.error('Error updating student ID:', data.message);
      }
    } catch (error) {
      // Handle fetch or other errors
      console.error('Error updating student ID:', error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Student ID:</Text>
      <TextInput
        style={styles.input}
        placeholder="Student ID"
        onChangeText={(text) => setStudentID(text)}
        value={studentID}
      />
      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>
      <Pressable style={styles.navigationButton} onPress={() => navigation.navigate('loginselector')}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </Pressable>
    </View>
  );
};
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  navigationButton: {
    marginTop: 20,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default StudentID;
