import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {createStackNavigator} from 'react-navigation';

import Homescreen from './components/Homescreen'
import Cam from './components/Cam'
import Result from './components/Result'

const RootStack = createStackNavigator({
  HomePage: Homescreen,
  CamPage: Cam,
  Result
},
{
  initialRouteName: 'HomePage',
  headerMode: 'none'
}
);

export default class App extends React.Component {
  render() {
    return (
         <RootStack/>
     
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
