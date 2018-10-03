import React from "react";
import {
  Button,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { Camera, Constants, Permissions } from "expo";

const API_KEY = "AIzaSyA0WyGbEWSKI_oB9OLKsEfKmAJkF_FLy7w";
const { width, height } = Dimensions.get("window");
export default class Homescreen extends React.Component {
  state = {
    hasCameraPermission: null,
    snap: null,
    type: Camera.Constants.Type.back,
    imageUri: null,
    rawB64: null,
    loading: false
  };

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === "granted" });
  }

  takePicture = async () => {
    let snap = await this.camera.takePictureAsync({
      base64: true,
      quality: 0.2
    });
    this.setState({
      imageUri: `data:image/jpg;base64,${snap.base64}`,
      rawB64: snap.base64
    });

    this.getTotalPrice(snap.base64);
  };

  getTotalPrice = async imageData_b46 => {
    this.setState({ loading: true });
    try {
      let data = await this.getData(imageData_b46);
      let lineArr = data.responses[0].fullTextAnnotation.text.split("\n");
      let totals = [];
      lineArr.map(lineItem => {
        let lineWords = lineItem.split(" ");
        lineWords.map(word => {
          if (
            word.charAt(word.length - 3) == "." ||
            word.charAt(word.length - 3) == ","
          ) {
            if (!(word.charAt(word.length - 2) == ":")) {
              if (!(word.charAt(0) === "-")) {
                let sanitizedItem = word
                  .replace(/\s/g, "")
                  .replace("R", "")
                  .replace(",", ".")
                  .replace(/[^\d.-]/g, "");
                let dec = sanitizedItem
                  .slice(-2)
                  .replace(",", "")
                  .replace(".", "");
                let num = sanitizedItem
                  .slice(0, -3)
                  .replace(",", "")
                  .replace(".", "");
                let finalNum = num + "." + dec;
                let parsed = parseFloat(finalNum);
                if (!isNaN(parsed)) {
                  totals.push(parsed);
                }
              }
            }
          }
        });
      });
      this.setState({
        loading: false
      }, () =>  this.props.navigation.navigate("Result", { result: Math.max(...totals)}))
     
    } catch (e) {
      console.log("Error");
      console.log(e);
    }
  };

  getData = async imageData => {
    let reqData = {
      requests: [
        {
          image: {
            content: imageData
          },
          features: [
            {
              type: "TEXT_DETECTION",
              maxResults: 1
            }
          ]
        }
      ]
    };
    console.log("Requesting....");
    const res = await fetch(
      "https://vision.googleapis.com/v1/images:annotate?key=" + API_KEY,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(reqData)
      }
    ).catch(e => {
      console.log("FETCH ERROR");
      console.log(e);
    });

    return res.json();
  };

  render() {
    const { loading } = this.state;
    return loading ? (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    ) : (
      <View style={styles.container}>
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          type={this.state.type}
          style={styles.cam}
        >
          <View style={styles.controls}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={() => {
                this.takePicture();
              }}
            />
          </View>
        </Camera>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cam: {
    height,
    width
  },
  captureButton: {
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 100,
    marginBottom: 25,
    backgroundColor: "red",
    alignSelf: "flex-end",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#d6d7da"
  },
  loaderContainer: {
    height,
    width,
    justifyContent: "center",
    alignItems: "center"
  },
  controls: {
    width,
    bottom: 0,
    position: 'absolute',
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "center"
  }
});
