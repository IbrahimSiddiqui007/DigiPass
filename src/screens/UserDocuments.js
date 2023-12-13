import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserDocuments = ({navigation}) => {
  const [documentNames, setDocumentNames] = useState([]);

  useEffect(() => {
    // Fetch document names from AsyncStorage
    const fetchDocumentNames = async () => {
      try {
        const storedDocumentNames = await AsyncStorage.getItem('documentNames');
        if (storedDocumentNames) {
          setDocumentNames(JSON.parse(storedDocumentNames));
        }
      } catch (error) {
        console.error('Error fetching document names from AsyncStorage:', error);
      }
    };

    fetchDocumentNames();
  }, []);

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
    {documentNames.length > 0 ? (
      documentNames.map((documentName, index) => (
        <Pressable
          key={index}
          style={styles.documentButton}
          onPress={() => navigation.navigate('userscan', { documentName })} // Navigate to viewdoc screen with documentName as a parameter
        >
          <Text style={styles.documentButtonText}>{documentName}</Text>
        </Pressable>
      ))
    ) : (
      <Text style={styles.noDocumentsText}>No documents available</Text>
    )}
  </ScrollView>
  );
};

const styles = StyleSheet.create({
  documentButton: {
    backgroundColor: '#4A55A2',
    padding: 15,
    marginVertical: 10,
    borderRadius: 25,
  },
  documentButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  noDocumentsText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default UserDocuments;
