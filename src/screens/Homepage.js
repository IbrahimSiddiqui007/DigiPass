import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Homepage = ({navigation}) => {
  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10, alignItems: 'center' }}>
      <ScrollView>
        <View style={{ margin: 100, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#4A55A2", fontSize: 17, fontWeight: "600" }}>
            Welcome to the Home 

          </Text>
          <Pressable style={{width:200,backgroundColor:"#4A55A2",padding:15,marginTop:400,marginLeft:"auto",marginRight:"auto",borderRadius:6}}>
            <Text onPress={()=>{navigation.navigate('profile')}} style={{color:"white",fontSize:16,fontWeight:"bold",textAlign:"center"}}>
              Profile
            </Text>

          </Pressable>
          <Pressable style={{width:200,backgroundColor:"#4A55A2",padding:15,marginTop:10,marginLeft:"auto",marginRight:"auto",borderRadius:6}}>
            <Text onPress={()=>{navigation.navigate('welcome')}} style={{color:"white",fontSize:16,fontWeight:"bold",textAlign:"center"}}>
              Log Out
            </Text>

          </Pressable>     
      </View>
      </ScrollView>

      
      
      




    </View>
    
  )
}

export default Homepage

const styles = StyleSheet.create({})