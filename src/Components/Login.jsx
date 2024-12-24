import { View, Text, TextInput, Button, StyleSheet, Image } from 'react-native';
import React, { useState } from 'react';

const Login = () => {
  const [uname, setUname] = useState('');
  const [pwd, setPwd] = useState('');
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to get initial captcha
  const getCaptcha = async () => {
    if (!uname || !pwd) {
      alert('Please enter both username and password');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:5000/get_captcha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: uname,
          password: pwd
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        setCaptchaImage(data.captcha_image);
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Error connecting to the server.');
    }
  };

  const handleLogin = async () => {
    if (!uname || !pwd || !captchaInput) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('http://10.0.2.2:5000/verify_login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: uname,
          password: pwd,
          captcha: captchaInput
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        alert('Login successful!');
        // Handle successful login (navigation, storing tokens, etc.)
      } else {
        alert(data.message);
        // Refresh captcha on failure
        getCaptcha();
        setCaptchaInput('');
      }
    } catch (error) {
      alert('Error connecting to the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get initial captcha when credentials are entered
  React.useEffect(() => {
    if (uname && pwd) {
      getCaptcha();
    }
  }, [uname, pwd]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <Text style={styles.label}>Username:</Text>
      <TextInput
        value={uname}
        placeholder="Enter Username"
        style={styles.input}
        onChangeText={setUname}
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        value={pwd}
        placeholder="Enter Password"
        style={styles.input}
        secureTextEntry
        onChangeText={setPwd}
      />

      {captchaImage ? (
        <View style={styles.captchaContainer}>
          <Image
            source={{ uri: `data:image/png;base64,${captchaImage}` }}
            style={styles.captchaImage}
            resizeMode="contain"
          />
          <TextInput
            value={captchaInput}
            placeholder="Enter Captcha"
            style={styles.input}
            onChangeText={setCaptchaInput}
          />
          <Button 
            title="Refresh Captcha"
            onPress={getCaptcha}
          />
        </View>
      ) : null}

      <Button 
        title={isSubmitting ? "Logging in..." : "Login"}
        onPress={handleLogin}
        disabled={isSubmitting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333'
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333'
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    width: '100%'
  },
  captchaContainer: {
    marginBottom: 20,
    alignItems: 'center'
  },
  captchaImage: {
    width: 200,
    height: 80,
    marginBottom: 10
  }
});

export default Login;