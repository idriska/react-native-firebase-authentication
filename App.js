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
  StatusBar,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const {width, height} = Dimensions.get('window');
const usersCollection = firestore().collection('Users');

const App = () => {
  const [screen, setScreen] = useState('Login');

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
        <Text style={styles.header}>{screen}</Text>
        {screen == 'Login' ? (
          <Login callback={data => setScreen(data)} />
        ) : (
          <Register callback={data => setScreen(data)} />
        )}
      </View>
    </SafeAreaView>
  );
};

const Login = ({callback}) => {
  const setCallback = value => {
    callback(value);
  };
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState();

  return (
    <>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="Phone"></TextInput>
      <TouchableOpacity style={[styles.button, styles.btnFill]}>
        {!loading ? (
          <Text>Login</Text>
        ) : (
          <ActivityIndicator size="large" color="#fff"></ActivityIndicator>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.btnOutline]}
        onPress={() => setCallback('Register')}>
        <Text>Register</Text>
      </TouchableOpacity>
    </>
  );
};

const Register = ({callback}) => {
  const setCallback = value => {
    callback(value);
  };
  const [user, setUser] = useState({
    fullName: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const register = async() => {
    setLoading(true);
    await usersCollection
      .add(user)
      .then(() => {
        ToastAndroid.showWithGravity(
          'Register successfully.',
          ToastAndroid.LONG,
        );
        console.log("TRUEE")
        setLoading(false);
        setCallback('Login')
      })
      .catch(err => {
        console.log(err);
        ToastAndroid.showWithGravity(
          'Error. Please try latter!',
          ToastAndroid.LONG,
        );
        setLoading(false);
      });
  };

  return (
    <>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        onChangeText={value => setUser({...user, fullName: value})}></TextInput>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="Phone"
        onChangeText={value => setUser({...user, phone: value})}></TextInput>

      <TouchableOpacity
        style={[styles.button, styles.btnFill]}
        onPress={() => {
          register();
        }}>
        {!loading ? (
          <Text>Register</Text>
        ) : (
          <ActivityIndicator size="large" color="#fff"></ActivityIndicator>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.btnOutline]}
        onPress={() => setCallback('Login')}>
        <Text>Login</Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  image: {
    marginTop: 50,
    width: width,
    height: width * 0.5,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(118, 118, 118)',
    marginVertical: 10,
  },
  viewContainer: {
    width: width * 0.85,
    marginTop: 30,
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
  button: {
    width: '100%',
    height: 45,
    borderRadius: 10,
    marginVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnFill: {
    marginTop: 30,
    backgroundColor: 'rgb(255, 168, 21)',
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: 'rgb(255, 168, 21)',
  },
});

export default App;
