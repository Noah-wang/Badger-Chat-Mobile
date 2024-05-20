import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';

import CS571 from '@cs571/mobile-client';
import BadgerChatroomScreen from './screens/BadgerChatroomScreen';
import BadgerConversionScreen from './screens/BadgerConversionScreen';
import BadgerLandingScreen from './screens/BadgerLandingScreen';
import BadgerLoginScreen from './screens/BadgerLoginScreen';
import BadgerLogoutScreen from './screens/BadgerLogoutScreen';
import BadgerRegisterScreen from './screens/BadgerRegisterScreen';

const ChatDrawer = createDrawerNavigator();

export default function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false);
  const [chatrooms, setChatrooms] = useState([]);
  const [isGuest, setIsGuest] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsGuest(false);
  };

  const handleGuest = () => {
    setIsGuest(true);
    setIsLoggedIn(false);
  };

  async function getToken() {
    return await SecureStore.getItemAsync('jwt').catch(error => {
      console.error('Error storing the JWT:', error);
    });
  }

  useEffect(() => {
    if (isGuest && !isLoggedIn) {
      fetch('https://cs571.org/api/s24/hw9/chatrooms', {
        method: 'GET',
        headers: {
          'X-CS571-ID': `bid_e5c17fa842e9e34246e0da9d18c22b2ea6fe5d66d8ed25f597bd150ed148f8b6`
        },
      }).then(response => response.json()).then(data => {
        if (Array.isArray(data)) {
          setChatrooms(data);
        } else {
          console.error('Invalid response format:', data);
        }
      }).catch(error => {
        console.error('API request failed:', error);
      });
    } else if (isLoggedIn) {
      getToken().then(token => {
        if (token) {
          fetch('https://cs571.org/api/s24/hw9/chatrooms', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-CS571-ID': `bid_e5c17fa842e9e34246e0da9d18c22b2ea6fe5d66d8ed25f597bd150ed148f8b6`
            },
          }).then(response => response.json()).then(data => {
            if (Array.isArray(data))
              setChatrooms(data);

          })
        }
      });
    }
  }, [isLoggedIn, isGuest]);

  const handleLogin = async (username, password) => {
    const response = await fetch('https://cs571.org/api/s24/hw9/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CS571-ID':  `bid_e5c17fa842e9e34246e0da9d18c22b2ea6fe5d66d8ed25f597bd150ed148f8b6`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    try {
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Incorrect login, please try again.');
      }
      await SecureStore.setItemAsync('jwt', data.token);
      setIsLoggedIn(true);
    } catch (error) {
      Alert.alert('Login Error', error.message);
    }
  };

  function handleSignup(username, password) {
    fetch('https://cs571.org/api/s24/hw9/register', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CS571-ID': `bid_e5c17fa842e9e34246e0da9d18c22b2ea6fe5d66d8ed25f597bd150ed148f8b6`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => {
        return response.json().then(data => {
          return { status: response.status, body: data };
        });
      })
      .then(({ status, body }) => {
        if (status !== 200) {
          throw new Error(body.message || 'User already exists or another registration error occurred.');
        }
        SecureStore.setItemAsync('jwt', body.token)
        setIsLoggedIn(true);
      })
  }

  if (isLoggedIn) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} />}
              </ChatDrawer.Screen>
            })
          }
          <ChatDrawer.Screen name="Logout">
            {() => <BadgerLogoutScreen onLogout={handleLogout} />}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else if (isRegistering) {
    return <BadgerRegisterScreen handleSignup={handleSignup} setIsRegistering={setIsRegistering} />
  } else if (isGuest) {
    return (
      <NavigationContainer>
        <ChatDrawer.Navigator>
          <ChatDrawer.Screen name="Landing" component={BadgerLandingScreen} />
          {
            chatrooms.map(chatroom => {
              return <ChatDrawer.Screen key={chatroom} name={chatroom}>
                {(props) => <BadgerChatroomScreen name={chatroom} />}
              </ChatDrawer.Screen>
            })
          }
          <ChatDrawer.Screen name="Sign Up">
            {() => <BadgerConversionScreen setIsRegistering={setIsRegistering} />}
          </ChatDrawer.Screen>
        </ChatDrawer.Navigator>
      </NavigationContainer>
    );
  } else {
    return <BadgerLoginScreen handleLogin={handleLogin} setIsRegistering={setIsRegistering} handleGuest={handleGuest} />
  }
}