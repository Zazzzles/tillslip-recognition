import React from 'react';
import { Button,StyleSheet, Image,Text, View,TouchableOpacity } from 'react-native';
import {StackNavigator} from 'react-navigation'
import { Camera, Constants } from 'expo';

export default class Homescreen extends React.Component {

  state = {
    snap: null,
  };


  componentDidMount(){
   
  }

  openCamera = () =>{

  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      
      <View style={styles.container}>
      
        <Button onPress={ () => navigate('CamPage')} title="Open Camera" />
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  }
});
