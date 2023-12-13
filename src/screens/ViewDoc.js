import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
const logoImg = require("../../assets/uni-logo.jpg");
import AsyncStorage from '@react-native-async-storage/async-storage';


const ViewDoc = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName:'',
    studentNumber: '',
    barcode: '',
    imageUrl:null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch user details when the component mounts
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.error('Token not found. User is not logged in.');
        return;
      }

      const response = await fetch('http://10.0.2.2:3000/getname', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User Details:', data);
        setUserDetails(data);
      } else {
        console.error('Error fetching user details:', data.error);
        setError('Error fetching user details');
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching user details:', error);
      setError('Error fetching user details');
      setLoading(false);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={[styles.half, styles.redHalf]}>
        <View style={styles.centeredContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={logoImg}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.textLine}>UNIVERSITY</Text>
            <Text style={styles.textLine}>OF WOLLONGONG</Text>
            <Text style={styles.textLine}>IN DUBAI</Text>
          </View>
        </View>
      </View>
      <View style={[styles.half, styles.lowerHalf]}>
        <View style={styles.topRightText}>
          <Text style={styles.studentCardText}>Student</Text>
          <Text style={styles.studentCardText}>Card</Text>
        </View>
        <View style={styles.circleContainer}>
        {userDetails.imageUrl ? (
            <Image
              source={{ uri: `http://10.0.2.2:3000${userDetails.imageUrl}` }}
              style={styles.circleImage}
              resizeMode="cover"
            />
          ) : (
            <Text>No Image</Text>
          )}
        </View>
        <View>
          <Text style={styles.studentnametext}>{userDetails.firstName}</Text>
          <Text style={styles.studentnametext}>{userDetails.lastName}</Text>
        </View>
        <View>
          <Text style={styles.studentnotext}>Student No: <Text style={{fontWeight:'bold'}}>{userDetails.studentNumber}</Text></Text>
        </View>
        <View>
          <Text>{userDetails.barcode}</Text>
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    borderRadius: 20,
    overflow: 'hidden',
  },
  half: {
    flex: 1,
  },
  redHalf: {
    flex: 4,
    backgroundColor: '#FF0000',
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
  },
  lowerHalf: {
    flex: 6,
    backgroundColor: 'white',
    justifyContent: 'center', // Center circle vertically
    alignItems: 'center', // Center circle horizontally
    position: 'relative',
  },
  centeredContainer: {
    flexDirection: 'row', // Align elements horizontally
    alignItems: 'center', // Center content vertically
    marginBottom: 60,
  },
  logoContainer: {
    marginRight: 10,
  },
  logo: {
    width: 90,
    height: 90,
  },
  textContainer: {
    flexDirection: 'column',
    marginLeft: 10,
    justifyContent: 'center', // Center text vertically
    paddingTop: 20,
    marginBottom: 30,
  },
  textLine: {
    color: 'white',
    fontSize: 20,
    textAlign: 'left',
  },
  topRightText: {
    position: 'absolute',
    top: 10,
    right: 50,
  },
  studentCardText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'left',
  },
  circleContainer: {
    position: 'absolute',
    top: -100, // Adjust the position to move the circle higher
    left: '14%', // Adjust the left property to move the circle closer to the left
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: 'hidden',
  },
  circleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  studentnametext:{
    right: 100,
    fontSize:25,
    fontWeight:'bold',
    top: -50
  },
  studentnotext:{
    right: 60,
    top:-20
  }
});

export default ViewDoc;
