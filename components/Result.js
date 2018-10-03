import React, { PureComponent } from 'react';
import { View, Text, StyleSheet,Dimensions, Button } from 'react-native';

const { width, height } = Dimensions.get("window");
export default class Result extends PureComponent {

  render() {
      const { result } = this.props.navigation.state.params
      const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={{fontSize: 25, marginBottom: 20}}>Slip total estimated at:</Text>
        <Text style={{fontSize: 30, fontWeight: "600",  marginBottom: 20}}> R{result} </Text>
        <Button onPress={ () => navigate('CamPage')} title="Try again" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        width,
        height,
        justifyContent: 'center',
        alignItems: 'center',
    }
})