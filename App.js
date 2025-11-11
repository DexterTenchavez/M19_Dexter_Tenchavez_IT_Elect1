import React,{useState} from "react";
import {SafeAreaView,StyleSheet,Button,View
} from 'react-native';
import ChatScreen from "./ChatScreen.js";
import CommentInput from "./CommentInput.js";


export default function App() {
  const [ page,setPage]=useState("chat");


  return (
 <SafeAreaView style={styles.container}>
 {page === "chat" &&<ChatScreen/>}
 {page === "comment"&&<CommentInput/>}
  <View style={styles.buttons}>
  <Button title="Go to Chat"
  onPress={()=>setPage("chat")}/>
  <Button title="Go to Comment"
  onPress={()=>setPage("comment")}/>

  
  </View>
 </SafeAreaView>
   )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  buttons:{
    flex:1
  }
  
});