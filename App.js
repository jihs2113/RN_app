import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { StyleSheet, Dimensions, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import {Fontisto} from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

const SCREEN_WIDTH = Dimensions.get("window").width;

const API_KEY = "784ab24ff2ed5d94d4288abed9e25d13";

const icons ={
  Clear: "day-sunny",
  Clouds: "cloudy",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
}

//openweathermap.org/api
export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok,setOk] = useState(true);
  const getWeather = async() =>{
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
      return;
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accurancy:5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude},
      {useGoogleMaps: false}
    );
    setCity(location[0].street);
    // const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`);
    // const json = await response.json();
    // setDays(json.daily);
    const { list } = await (
    await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`)
    ).json();
    const filteredList = list.filter(({ dt_txt }) => dt_txt.endsWith("00:00:00"));
    setDays(filteredList);
  };

  useEffect(() => {
      getWeather();
  }, []);



  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.weather}>
        {days?.length === 0 ? (
          <View style={{...styles.day, alignItems: 'center'}}>
            <ActivityIndicator color="white" style={{marginTop: 10}} size="large"/>
          </View>
        ) : (
          days.map((day) => (
            <View key={day.dt} style={styles.day}>
              <Text style={styles.date}>
                {new Date(day.dt * 1000).toString().substring(0, 10)}
              </Text>
              <View style={{flexDirection: 'row', alignItems: 'center', width:"100%", justifyContent: 'space-between'}}>
                <Text style={styles.temp}>
                  {parseFloat(day.main.temp).toFixed(1)}
                  <Text style={styles.unit}>°C</Text>
                </Text>
                <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
              </View>
              
              <Text style={styles.description}>{day.weather[0].main}</Text>
              {/* <Text style={styles.tinyText}>{day.weather[0].description}</Text> */}
            </View>
          ))
          )
        }
         
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city:{
    flex:1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName:{
    fontSize: 48,
    fontWeight: '500',
    color: 'white',
  },
  weather:{},
  day:{
    width: SCREEN_WIDTH,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  date:{
    fontSize: 30,
    fontWeight: '600',
    marginTop: 100,
    color: 'white',
  },
  temp:{
    marginTop: 50,
    fontWeight: '600',
    fontSize: 80,
    color: 'white',
  },
  unit: {
    fontSize: 70, // °C 부분의 글자 크기를 줄임
    // 필요에 따라 다른 스타일을 추가
  },
  description:{
    marginTop: -10,
    fontSize: 30,
    color: 'white',
    fontWeight: '400',
  },
  tinyText:{
    fontSize: 24,
  }
});