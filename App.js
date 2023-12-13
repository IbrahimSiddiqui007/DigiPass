import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './src/screens/Welcome';
import Login from './src/screens/Login';
import Signup from './src/screens/Signup';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Homepage from './src/screens/Homepage';
import LoginSelector from './src/screens/LoginSelector';
import LoginPhone from './src/screens/LoginPhone';
import LoginMeta from './src/screens/LoginMeta';
import UserProfile from './src/screens/UserProfile';
import ViewDoc from './src/screens/ViewDoc';
import StudentID from './src/screens/StudentID';
import BiometricAuthentication from './src/screens/Fingerprintcomp';
import UserDocuments from './src/screens/UserDocuments';
import FingerprintScanlogin from './src/screens/UserScan';


const Stack = createNativeStackNavigator();


export default function App() {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          
          <Stack.Screen name="welcome" component={Welcome} options={{headerShown:false}}/>
          <Stack.Screen name="loginselector" component={LoginSelector} options={{headerShown:false}}/>
          <Stack.Screen name="login" component={Login} options={{headerShown:false}} />
          <Stack.Screen name="loginphone" component={LoginPhone} options={{headerShown:false}} />
          <Stack.Screen name="loginmeta" component={LoginMeta} options={{headerShown:false}} />
          <Stack.Screen name="signup" component={Signup}  options={{headerShown:false}}/>
          <Stack.Screen name="homepage" component={Homepage}  options={{headerShown:false}}/>
          <Stack.Screen name="profile" component={UserProfile}  options={{headerShown:false}}/>
          <Stack.Screen name="userdoc" component={UserDocuments} options={{headerShown:false}}/>
          <Stack.Screen name="viewdoc" component={ViewDoc}  options={{headerShown:false}}/>
          <Stack.Screen name="studentid" component={StudentID}  options={{headerShown:false}}/>
          <Stack.Screen name="fingerprint" component={BiometricAuthentication} options={{headerShown:false}}/>
          <Stack.Screen name="userscan" component={FingerprintScanlogin} options={{headerShown:false}}/>
          


        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
