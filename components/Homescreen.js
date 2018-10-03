import React,{ PureComponent } from 'react';
import { Button,StyleSheet, View } from 'react-native';

export default class Homescreen extends PureComponent {

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
    backgroundColor: '#ecf0f1',
  }
});
