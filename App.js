import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator} from 'react-navigation';
import Homescreen from './components/Homescreen'
import Cam from './components/Cam'
import { Provider } from 'unstated';

const RootStack = createStackNavigator({
  HomePage: Homescreen,
  CamPage: Cam
  
},
{
  initialRouteName: 'HomePage'
}
);

export default class App extends React.Component {
  render() {
    return (
      <Provider>
         <RootStack/>
      </Provider>
     
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
