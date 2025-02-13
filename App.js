import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Dimensions, TextInput, Text, View, ScrollView,TouchableHighlight, ActivityIndicator, TouchableOpacity } from 'react-native';
import {Fontisto} from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {theme} from './colors';

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const[toDos, setToDos] = useState({});
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  //event나 target이 없음
  const onChangeText = (payload) => setText(payload);
  const addToDo =() =>{
    if(text === ""){
      return;
    }
    const newToDos = Object.assign(
      {},
      toDos,
      {
        [Date.now()]: {text, work: working},
      });
    setToDos(newToDos)
    setText("");
    
  }
  console.log(toDos)


  return (
    <View style={styles.container}>
     <StatusBar style="auto"/>
      <View style={styles.header}>
        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color: working ? "white" : theme.grey}}>Work</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={travel}>
          <Text style={{...styles.btnText, color: !working ? "white" : theme.grey}}>Travel</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput 
          // secureTextEntry : 비밀번호 입력 사용 암호화
          // multiline : 말그대로 멀티라인 한줄 이상 텍스트 입력
          onSubmitEditing={addToDo}
          onChangeText={onChangeText}
          returnKeyType="done"
          value={text}
          placeholder={"Search..."}
          style={styles.input} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header:{
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 100,
  },
  btnText:{
    fontSize: 38,
    fontWeight: '600',
    color: "white",
  },
  input:{
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 20,
    fontSize: 18,
  }
 
});