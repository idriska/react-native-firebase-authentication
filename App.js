import React, {useState} from 'react';
import {
  SafeAreaView,
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StatusBar
} from 'react-native';

const {width, height} = Dimensions.get('window');

const App = () => {
  return (
    <SafeAreaView style={styles.sectionContainer}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content"></StatusBar>
      <Image
        source={{
          uri: 'https://miro.medium.com/max/401/1*gyY2rWWROFNuJu04e_dA8w.png',
        }}
        style={styles.image}
      />

      <View style={styles.viewContainer}>
        <TextInput style={styles.input} keyboardType="phone-pad" placeholder="Phone"></TextInput>
        <TextInput style={styles.input} placeholder="Password"></TextInput>
        <TouchableOpacity style={[styles.button, styles.btnLogin]}><Text>Login</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.btnRegister]}><Text>Register</Text></TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  image: {
    marginTop: 70,
    width: width,
    height: width * 0.5,
  },
  viewContainer: {
    width: width * 0.85,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 45,
    borderBottomWidth: 1,
    borderColor: 'black',
    marginVertical: 5,
  },
  button:{
    width: '100%',
    height: 45,
    borderRadius: 10,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnLogin:{
    marginTop: 30,
    backgroundColor: 'rgb(255, 168, 21)',
  },
  btnRegister:{
    borderWidth: 1,
    borderColor: 'rgb(255, 168, 21)',
  },
});

export default App;
