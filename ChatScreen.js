import React, { useState, useRef, useEffect } from "react";
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { addMessage, getMessages, initDatabase } from './database';

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const flatListRef = useRef(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDatabase();
      await loadMessages();
    } catch (error) {
      console.error('Failed to initialize app:', error);
    }
  };

  const loadMessages = async () => {
    const result = await getMessages();
    if (result.success && result.messages.length > 0) {
      setMessages(result.messages);
    } else {
      // Add initial welcome message
      const welcomeMessage = {
        id: "1",
        text: "Hello! 👋 My name is Mia Khufra",
        sender: "bot",
        timestamp: new Date().toISOString()
      };
      setMessages([welcomeMessage]);
      await addMessage(welcomeMessage.text, welcomeMessage.sender);
    }
  };

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim().length === 0) return;

    const newMessage = {  
      id: Date.now().toString(),  
      text: input,  
      sender: "me",  
      timestamp: new Date().toISOString()
    };  

    // Save user message to database
    const result = await addMessage(input, "me");
    
    if (result.success) {
      setMessages(prev => [...prev, newMessage]);  
      setInput("");  

      // Simulated bot reply  
      setTimeout(async () => {  
        const botMessage = {  
          id: (Date.now() + 1).toString(),  
          text: "Oh wow you're so handsome 😍",  
          sender: "bot",  
          timestamp: new Date().toISOString()
        };  
        
        await addMessage(botMessage.text, "bot");
        setMessages(prev => [...prev, botMessage]);  
      }, 800);
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender === "me";
    return (
      <View
        style={[
          styles.messageRow,
          { justifyContent: isMe ? "flex-end" : "flex-start" },
        ]}
      >
        {!isMe && (
          <Image
            source={require("./assets/favicon.png")}
            style={styles.avatar}
          />
        )}

        <View  
          style={[  
            styles.message,  
            isMe ? styles.myMessage : styles.botMessage,  
          ]}  
        >  
          <Text  
            style={[  
              styles.messageText,  
              isMe && { color: "#fff" },  
            ]}  
          >  
            {item.text}  
          </Text>  
        </View>  

        {isMe && (  
          <Image  
            source={require("./assets/myPicture.jpeg")}
            style={styles.avatar}  
          />  
        )}  
      </View>  
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.chatContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.chatArea}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
          />

          <View style={styles.inputWrapper}>  
            <View style={styles.inputContainer}>  
              <TextInput  
                style={styles.input}  
                placeholder="Type a message..."  
                placeholderTextColor="#aaa"  
                value={input}  
                onChangeText={setInput}  
                multiline  
                maxLength={500}  
              />  
              <TouchableOpacity   
                style={[  
                  styles.sendButton,   
                  !input.trim() && styles.sendButtonDisabled  
                ]}   
                onPress={sendMessage}  
                disabled={!input.trim()}  
              >  
                <Text style={styles.sendText}>Send</Text>  
              </TouchableOpacity>  
            </View>  
          </View>  
        </View>  
      </KeyboardAvoidingView>  
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  keyboardView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
  },
  chatArea: {
    padding: 10,
    paddingBottom: 20,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 6,
  },
  message: {
    maxWidth: "75%",
    padding: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  myMessage: {
    backgroundColor: "#0078FF",
    borderBottomRightRadius: 5,
  },
  botMessage: {
    backgroundColor: "#2C2C2E",
    borderBottomLeftRadius: 5,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
  inputWrapper: {
    backgroundColor: "#1C1C1E",
    borderTopWidth: 1,
    borderColor: "#222",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    color: "#fff",
    backgroundColor: "#2C2C2E",
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: "#0078FF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  sendButtonDisabled: {
    backgroundColor: "#555",
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
});