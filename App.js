import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import CounterApp from './CounterApp';
import ColorChangerApp from './ColorChangerApp';
import ChatScreen from "./ChatScreen.js";
import CommentInput from "./CommentInput.js";

const App = () => {
  const [ page,setPage]=useState("chat");
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <CounterApp />
        <ColorChangerApp />
      </ScrollView>
      
      {page === "chat" &&<ChatScreen/>}
 {page === "comment"&&<CommentInput/>}
  <View style={styles.buttons}>
  <Button title="Go to Chat"
  onPress={()=>setPage("chat")}/>
  <Button title="Go to Comment"
  onPress={()=>setPage("comment")}/>

  
  </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40
  }
});

export default App;