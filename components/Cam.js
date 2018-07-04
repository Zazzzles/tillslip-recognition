import React from 'react';
import { Button,StyleSheet, Image,Text, View,TouchableOpacity } from 'react-native';
import { Camera, Constants, Permissions } from 'expo';

const API_KEY = 'AIzaSyA0WyGbEWSKI_oB9OLKsEfKmAJkF_FLy7w';

export default class Homescreen extends React.Component {

  state = {
    hasCameraPermission: null,
    snap: null,
    type: Camera.Constants.Type.back,
    imageUri: null,
    rawB64: null
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
   
  }

   takePicture = async () => {
       let snap = await this.camera.takePictureAsync({
           base64: true,
           quality: 0.2
       });
       this.setState({
            imageUri: `data:image/jpg;base64,${snap.base64}`,
            rawB64: snap.base64
       })

       this.analyzeImage(snap.base64);
   };

   analyzeImage = async (imageData) =>{
   
    let reqData ={
        "requests":[
          {
            "image":{
              "content": imageData
            },
            "features":[
              {
                "type":"TEXT_DETECTION",
                "maxResults":1
              }
            ]
          }
        ]
    }
    console.log("Submitting");
    const rawResponse = await fetch('https://vision.googleapis.com/v1/images:annotate?key='+API_KEY, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reqData)
    }).catch(err =>{
        console.log("FETCH ERROR");
        console.log(err)
    });
    const content = await rawResponse.json();
    this.getTotalPrice(content.responses[0].fullTextAnnotation.text);
    //console.log(content.responses[0].fullTextAnnotation.text);
   }

   //Wont work for more than 2 decimal places
   getTotalPrice = (data) =>{
    let lineArr = data.split("\n");
    let totals = [];
    lineArr.map(lineItem =>{
      let lineWords = lineItem.split(" ")
      lineWords.map(word =>{
        if(word.charAt(word.length-3) == "." || word.charAt(word.length-3) == "," ){
          if(!(word.charAt(0) === "-")){
            let sanitizedItem = word.replace(/\s/g, "").replace("R","").replace(",",".").replace(/[^\d.-]/g, '')
            let dec = sanitizedItem.slice(-2).replace(",","").replace(".", "");
            let num = sanitizedItem.slice(0, -3).replace(",","").replace(".", "");
            let finalNum = num + "." + dec
            let parsed = parseFloat(finalNum);
            if(!isNaN(parsed)){
              totals.push(parsed)
            }
          }
        }
      })
    })
   
    console.log("Slip total = " + Math.max(...totals));
   }

  render() {
    return (
     <View style={styles.container}>
      <Camera ref={ref => { this.camera = ref; }} type={this.state.type} style={styles.cam}>
      <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
                justifyContent: 'center'
              }}>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={() => {
                    this.takePicture()
                }}>
              </TouchableOpacity>
            </View>
          </Camera> 
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cam:{
      height: 600,
      width: 400
  },
  captureButton:{
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:50,
    height:50,
    backgroundColor:'#fff',
    borderRadius:100,
    marginBottom: 25,
    backgroundColor: 'red',
    alignSelf: 'flex-end',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d6d7da',
  }
});
