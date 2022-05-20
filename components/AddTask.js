import React, {useEffect, useRef, useState} from 'react'
import { TouchableOpacity, ScrollView, StyleSheet, Text, View, StatusBar as RNStatusBar,
  FlatList, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform,
BackHandler, SafeAreaView, } from 'react-native';

export var Tasktext = {}

export default function Addtask(props){
    const styles = StyleSheet.create({
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
  
    const [text, setText] = useState("");
    
    const newTask = async () =>{
      Keyboard.dismiss()
      if(text == "") return;
      //const value = await AsyncStorage.getItem("@data")
      props.
      setText("")
    }
  
  
  
    return (
  
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.a1}
        >
          <View style={styles.input}>
            <TextInput placeholder='write something' value={text} onChangeText={setText} onSubmitEditing={newTask} style={styles.a3}/>
          </View>
          <TouchableOpacity style={styles.a4} onPress={newTask}>
                <Text style={styles.a6}>+</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
    )
  }
  