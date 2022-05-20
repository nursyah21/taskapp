import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useRef, useState} from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, StatusBar as RNStatusBar,
  FlatList, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform,
BackHandler, SafeAreaView, Animated,
PanResponder } from 'react-native';
import Task from "./components/Task"
import Addtask, {Tasktext} from "./components/AddTask"

import AsyncStorage from "@react-native-async-storage/async-storage"
async function data(){
  try{
    const DATA = await AsyncStorage.getItem("@data")
      return DATA != null ? JSON.parse(DATA) : []
    }catch(e) {}
}

const DATA = data()
  
export default function App() {

  const [task, setTask] = useState([]) //initial taske
  const [completeTask, setCompleteTask] = useState(false)
  const [displayDescription, setDisplayDescription] = useState("flex")
   

  // task item
  const renderItem = ({item}) => {
    function Task(props){
      const [complete, setComplete] = useState({
        status:false,
        colorBox: "#A9DBE2",
        colorCirle: "#fff"
      })
      

      async function deleteTask(){
        try {
          var newtask = task
          task.forEach((i,idx)=>{
            if(i.key == item.key){
              newtask.splice(idx,1)   
              return
            }
          })
          

          setTask(newtask)  
          await AsyncStorage.setItem("@data", JSON.stringify(newtask))

          setCompleteTask(true);
          if(task.length == 0){setDisplayDescription("flex")}

        } catch (error) {
          console.log(error)
        }
        
      }
  
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
            setCompleteTask(false)
            if(pan.x._value > 150 || pan.x._value < -150){
              setOpacity(.5)
              if(pan.x._value > 210 || pan.x._value < -210)deleteTask()
              
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
    return (
    <>
    <Task text={item.text} />
    </>
    )
  }

  // fix hidden keyboard
  useEffect(() => {
    if(task == []){
      setDisplayDescription("flex")
    }
    AsyncStorage.getItem("@data").then(e=>{
        if(e != null && JSON.parse(e).length > 0) {
          setDisplayDescription("none")
          setTask(JSON.parse(e))
        }
        else {
          setTask([])
          setDisplayDescription("flex")
        }
      }
    )

    // setTask({})
    Keyboard.addListener("keyboardDidHide",
    ()=>{
      Keyboard.dismiss()
    })
    
  }, []) //must write this [] to be work even though i don't know what is this for

  const [text, setText] = useState("");
    
  const newTask = async () =>{
    Keyboard.dismiss()
    if(text == "") return;
    //const value = await AsyncStorage.getItem("@data")
    try {
    
      var key = (task.length == 0) ? 1 : task[task.length-1]["key"] + 1
      var newtask = task
      newtask.push({"text":text, "key": key})
      await AsyncStorage.setItem("@data", JSON.stringify(newtask))

      setTask(newtask)  
      setDisplayDescription("none")
    } catch (error) {
      console.log(error)
    }
    setText("")
  }



  return (
    <View style={styles.container}>
      <View style={styles.a1}>

        <Text style={styles.banner}>Task's Today </Text>

        <Text style={{display:displayDescription}}>Write your task today</Text>

        <View style={[styles.a5 ]} >
          <FlatList data={task} renderItem={renderItem}  extraData={completeTask}/>
        </View>
        {/* update flatlist */}

        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={stylesWriteTask.a1}
        >
          <View style={stylesWriteTask.input}>
            <TextInput placeholder='write something' value={text} onChangeText={setText} onSubmitEditing={newTask} style={stylesWriteTask.a3}/>
          </View>
          <TouchableOpacity style={stylesWriteTask.a4} onPress={newTask}>
                <Text style={stylesWriteTask.a6}>+</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>

        {/* <Addtask /> */}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const stylesWriteTask = StyleSheet.create({
  input:{
    height: 40,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderRadius: 10,
    width: "80%",
  },
  a1: {
    position:"absolute", bottom: 30,
    paddingTop: 20,
    width: "100%", flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#E8E8E8",
  },
  a3: {
    flex: 1,
    marginHorizontal: 10
  },
  a4:{
    width: 40, height: 40,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent:"center",
    borderRadius: 60
  },
  a6: {
    fontSize: 20,
    color: "#aaa"
  }
})

const styles = StyleSheet.create({
  a5: {
    marginVertical: 0,
    marginTop: 40,
    paddingBottom: 40,
    
    position:"absolute",
    height: "80%",
    width: "100%"
  },
  a1:{
    top:20,
    height: "100%"
  },
  a2:{
    marginHorizontal: 20
  },
  a3:{
    bottom: 30
  },
  banner:{
    fontWeight: "bold",
    fontSize: 24,
  },
  container: {
    flex: 1,
    backgroundColor: '#E8E8E8',
    paddingTop: RNStatusBar.currentHeight,
    paddingHorizontal: 15,
  },
});
