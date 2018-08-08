import { Container } from 'unstated';

const API_KEY = 'AIzaSyA0WyGbEWSKI_oB9OLKsEfKmAJkF_FLy7w';

class SlipAnalysis extends Container {

    constructor(props = {}) {
        super();
        this.state = {
            success: false,
            loading: false,
            total: 0,
            snapped: false
        }
    }

    //Wont work for more than 2 decimal places
    getTotalPrice = async(imageData_b46) =>{
        this.setState({loading: true})
        try{     
        let data = await this.getData(imageData_b46)
       // console.log(JSON.stringify(data));    
        let lineArr = data.responses[0].fullTextAnnotation.text.split("\n");
        let totals = [];
        lineArr.map(lineItem =>{
          let lineWords = lineItem.split(" ")
          lineWords.map(word =>{
            if(word.charAt(word.length-3) == "." || word.charAt(word.length-3) == ","){
              if(!(word.charAt(word.length-2) == ":")){
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
            }
          })
        })
        console.log("/////////////");
        console.log(totals);
        console.log("/////////////");
        console.log("Total price is estimated at :" + Math.max(...totals) );
        this.setState({
            success: true,
            loading: false,
            total: Math.max(...totals)
        })
    }catch(e){
        console.log("Error");
        console.log(e);
        this.setState({loading: false})
    }
       
       
    }

    getData = async (imageData) =>{
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
        console.log("Requesting....");
        const res = await fetch('https://vision.googleapis.com/v1/images:annotate?key='+API_KEY, {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(reqData)
        }).catch((e) =>{
            console.log("FETCH ERROR");
            console.log(e);
        });
       
        return res.json();
        
    }

    

}

export default new SlipAnalysis();




