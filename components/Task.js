import React, {useState, useRef} from "react"
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, StatusBar as RNStatusBar, FlatList, Animated,
PanResponder } from 'react-native';


export default function Task(props){
    const [complete, setComplete] = useState({
      status:false,
      colorBox: "#A9DBE2",
      colorCirle: "#fff"
    })
    

  // animation swipe
  const pan = useRef(new Animated.ValueXY()).current;
  const [opacity, setOpacity] = useState(1);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: (e, gestureState) =>{ 
        if(pan.x._value > 100 || pan.x._value < -100){
          setOpacity(.7)
        }
        Animated.event([
          null,
          { dx: pan.x, dy: pan.y }],
          {useNativeDriver: false},
        )(e, gestureState)
      }
      ,
      onPanResponderRelease: () => {
        setOpacity(1);
        Animated.spring(
          pan, // Auto-multiplexed
          { toValue: { x: 0, y: 0 },
          useNativeDriver: false  }, // Back to zero
          
        ).start();
        pan.flattenOffset();
      },
    })
  ).current;

  const Press = () => {
    if (complete.status == false){
      setComplete({
        status:true,
        colorBox: "#0ABFD8",
        colorCirle: "#0ABFD8"
      })
    }else{
      setComplete({
        status:false,
        colorBox: "#A9DBE2",
        colorCirle: "#fff"
      })
    }
  }


    return (

      <Animated.View style={{transform: [{ translateX: pan.x },], opacity: opacity}} {...panResponder.panHandlers} >
        <TouchableOpacity style={styles.a1} delayLongPress={500} onLongPress={Press} >
          <View style={[styles.a2, {backgroundColor: complete.colorBox}]}/>
          <Text style={styles.a4}>{props.text}  </Text>
          <View style={[styles.a3, {backgroundColor: complete.colorCirle}]} />      
        </TouchableOpacity>
      </Animated.View>

    )
  }

  const styles = StyleSheet.create({
    a6:{
      marginVertical: 5,
      flexDirection: "row"
    },
    a1:{
      backgroundColor: "#fff",
      paddingVertical: 10,
      marginVertical: 5,
      borderRadius: 10,
      width: "100%",
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around"
    },
    a2:{
      width: 20, height: 20,
      backgroundColor: "#A9DBE2",
    },
    a4: {
      width: "80%",
    },
    a3:{
      width: 10, height: 10,
      borderColor: "#0ABFD8",
      borderRadius: 10,
      borderWidth: 1,
    }
  })
