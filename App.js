import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Dimensions, TextInput, Text, View, ScrollView,TouchableHighlight, ActivityIndicator, TouchableOpacity,Alert } from 'react-native';
import {Fontisto} from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import {theme} from './colors';
import Checkbox from 'expo-checkbox';

const SCREEN_WIDTH = Dimensions.get("window").width;

const STORAGE_KEY = "@toDos";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const [isChecked, setChecked] = useState(false);

  useEffect(() => {
    loadToDos();
  },[])
  
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  //event나 target이 없음
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async(toSave) =>{
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(toSave))
  }
  const loadToDos = async() =>{
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    setToDos(JSON.parse(s))
  }

  const toggleChecked =(key) =>{
    setToDos((prev) => ({
      ...prev,
      [key]:{
        ...prev[key],
        isChecked: !prev[key].isChecked,
      }
    }))
  }

  const addToDo =() =>{
    if(text === ""){
      return;
    }
    const newToDos = {
      ...toDos,
      [Date.now()]: {text, working, isChecked},
    }
    setToDos(newToDos)
    saveToDos(newToDos)
    setText("");
    console.log(newToDos)
  }

  console.log(toDos)

  const deleteToDo =(key) =>{
    Alert.alert(
      "Delete To Do",
      "Are you sure?",[
        {text: "Cancel"},
        {text: "I'm Sure", 
          style: "destructive",
          onPress: () => {
          const newToDos = {...toDos};
          delete newToDos[key]
          setToDos(newToDos)
          saveToDos(newToDos)
        },
        },
      ]);
    return;
  }

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
          placeholder={working ? "Add a To Do" : "Where do you want to go?"}
          style={styles.input} />
      </View>
      <ScrollView>
        {Object.keys(toDos).map((key) => 
          toDos[key].working === working ? (
          <View key={key} style={styles.toDo}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
            <View key={key} style={styles.icons}>
              <TouchableOpacity >
                <Checkbox style={styles.checkbox} value={toDos[key].isChecked}
                  onValueChange={() => toggleChecked(key)}
                  color={toDos[key].isChecked ? '#4630EB' : undefined} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteToDo(key)}>
                <Fontisto name="trash" size={26} color="black"/>
              </TouchableOpacity>
            </View>
          </View>
        ) : null
      )}
      </ScrollView>
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
    marginVertical: 20,
    fontSize: 18,
  },
  toDo:{
    backgroundColor: theme.grey,
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText:{
    color: "white",
    fontSize: 16,
    fontWeight: '500',
  },
  icons:{
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
  },
  toDelete:{
    fontSize: 20,
    fontWeight: '600',
  },
  checkbox: {
    marginRight: 20,
  },
 
});