import React, {useState, useRef} from 'react';
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
import OTPTextInput from 'react-native-otp-textinput'

const {width, height} = Dimensions.get('window');
const usersCollection = firestore().collection('Users');
let confirmation = "";
let userData = {};

const App = () => {
  const [screen, setScreen] = useState('Login');
  const [loading, setLoading] = useState(false);

  return (
    <SafeAreaView style={styles.sectionContainer}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content"></StatusBar>
      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color='rgb(255, 168, 21)'></ActivityIndicator>
        </View>) : undefined}
      <Image
        source={{
          uri: 'https://miro.medium.com/max/401/1*gyY2rWWROFNuJu04e_dA8w.png',
        }}
        style={styles.image}
      />

      <View style={styles.viewContainer}>
        <Text style={styles.header}>{screen}</Text>
        {screen == 'Login' ? (
          <Login callback={data => {setScreen(data.screen), setLoading(data.loading)}} />
        ) : screen == 'Register' ? (
          <Register callback={data => {setScreen(data.screen), setLoading(data.loading)}}/>
        ) : (
          <Verification callback={data => {setScreen(data.screen), setLoading(data.loading)}}/>
        )}
      </View>
    </SafeAreaView>
  );
};

const Login = ({callback}) => {
  const setCallback = value => {
    callback(value);
  };
  const [user, setUser] = useState({
    phone: '',
    password: ''
  });

  const login = () => {
    usersCollection
    .where('phone', '==', user.phone)
    .where('password', '==', user.password)
    .get().then((res) => {
      if(res.docs.length > 0) {
        ToastAndroid.showWithGravity(
          'Login successfully',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      }
      else {
        ToastAndroid.showWithGravity(
          'User not exists',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      }
    })
  }

  return (
    <>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        placeholder="Phone"
        onChangeText={value => setUser({...user, phone: value})}
        maxLength={13}
        ></TextInput>
      <TextInput
        secureTextEntry={true}
        style={styles.input}
        placeholder="Password"
        onChangeText={value => setUser({...user, password: value})}></TextInput>

      <TouchableOpacity style={[styles.button, styles.btnFill, 
          user.phone.length == 13 & user.password.length > 4 ? {} 
          : {backgroundColor: 'rgba(255, 168, 21, 0.3)'}]}
          onPress={() => {
            user.phone.length == 13 & user.password.length > 4 ?
            login() : undefined }
          }>
        <Text>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.btnOutline]}
        onPress={() => setCallback({screen: 'Register'})}>
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
    password: ''
  });
 
  const checkUser = () => {
    setCallback({loading: true})
    usersCollection.where('phone', '==', user.phone).get().then((res) => {
      if(res.docs.length == 0) {
        sendOTP()
      }
      else {
        setCallback({loading: false})
        ToastAndroid.showWithGravity(
          'Such a user exists',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      }
    })
  }

  const sendOTP = () => {
    auth().signInWithPhoneNumber(user.phone).then((res) => {
      confirmation = res;
      userData = user;
      setCallback({loading: false, screen: 'Verification'})
    }).catch(err => {
      setCallback({loading: false})
      console.log(err)
    })
  }

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
        maxLength={13}
        onChangeText={value => setUser({...user, phone: value})}></TextInput>
      <TextInput
        secureTextEntry={true}
        style={styles.input}
        placeholder="Password"
        onChangeText={value => setUser({...user, password: value})}></TextInput>

      <TouchableOpacity
        style={[styles.button, styles.btnFill, 
          user.fullName.length > 2 && user.phone.length == 13 && user.password.length > 4 ? {} 
          : {backgroundColor: 'rgba(255, 168, 21, 0.3)'}]}
        onPress={() => {
          if(user.fullName.length > 2 && user.phone.length == 13 && user.password.length > 4)
            checkUser();
        }}>
        <Text>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.btnOutline]}
        onPress={() => setCallback({screen: 'Login'})}>
        <Text>Login</Text>
      </TouchableOpacity>
    </>
  );
};

const Verification = ({callback}) => {
  const setCallback = value => {
    callback(value);
  };
  const [otp, setOTP] = useState(false);

  const confirmOTP = () => {
    setCallback({loading: true})
    confirmation.confirm(otp).then(() => {
        register()
    }).catch(() => {
      setCallback({loading: false})
      ToastAndroid.showWithGravity(
        'OTP is not correct',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM
      );
    })
  }

  const register = () => {
    usersCollection
      .add(userData)
      .then(() => {
        setCallback({loading: false})
        ToastAndroid.showWithGravity(
          'Register successfully',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
        setCallback({screen: 'Login'})
      })
      .catch(err => {
        console.log(err);
        setCallback({loading: false})
        ToastAndroid.showWithGravity(
          'Error. Please try latter!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM
        );
      });
  };

  return (
    <>
    <OTPTextInput inputCount={6} 
      containerStyle={{marginTop: 20}}
      textInputStyle={{width: 35}}
      tintColor={'rgb(255, 168, 21)'}
      handleTextChange={value => setOTP(value)}
      ></OTPTextInput>
     
      <TouchableOpacity style={[styles.button, styles.btnFill]}
         onPress={() => confirmOTP()}>
        <Text>Confirm</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.btnOutline]}
        onPress={() => setCallback({screen: 'Login'})}>
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
  overlay:{
    width: '100%',
    height: '100%',
    position: 'absolute',
    zIndex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  }
});

export default App;
