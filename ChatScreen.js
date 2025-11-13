import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  Alert,
  Keyboard,
  Dimensions
} from "react-native";
import { 
  getMessagesBetweenUsers, 
  addMessage, 
  markMessagesAsRead 
} from './database';

const { height: screenHeight } = Dimensions.get('window');

export default function ChatScreen({ route, navigation }) {
  const { otherUser, currentUser } = route.params;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const flatListRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: otherUser.fullName,
      headerBackTitle: "Back",
    });
    
    loadMessages();
    markMessagesAsReadFunc();

    // Keyboard listeners for Android
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, [otherUser, currentUser]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    const result = await getMessagesBetweenUsers(currentUser.id, otherUser.id);
    setLoading(false);
    
    if (result.success) {
      setMessages(result.messages);
    } else {
      Alert.alert("Error", "Failed to load messages");
    }
  };

  const markMessagesAsReadFunc = async () => {
    await markMessagesAsRead(currentUser.id, otherUser.id);
  };

  const sendMessage = async () => {
    if (input.trim().length === 0) return;

    const messageText = input.trim();
    setInput("");
    Keyboard.dismiss(); // Dismiss keyboard after sending

    // Optimistically add message to UI
    const tempMessage = {
      id: `temp-${Date.now()}`,
      message: messageText,
      sender_id: currentUser.id,
      receiver_id: otherUser.id,
      timestamp: new Date().toISOString(),
      sender_fullName: currentUser.fullName,
      sender_photo: currentUser.profilePhoto,
      is_temp: true
    };

    setMessages(prev => [...prev, tempMessage]);

    // Save to database
    const result = await addMessage(currentUser.id, otherUser.id, messageText);
    
    if (result.success) {
      // Reload messages to get the real one from database
      loadMessages();
    } else {
      Alert.alert("Error", "Failed to send message");
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => !msg.is_temp));
    }
  };

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : '?';
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item, index }) => {
    const isMe = item.sender_id === currentUser.id;
    const showAvatar = index === 0 || messages[index - 1]?.sender_id !== item.sender_id;
    
    return (
      <View style={[
        styles.messageRow,
        { justifyContent: isMe ? "flex-end" : "flex-start" }
      ]}>
        {!isMe && showAvatar && (
          <View style={styles.avatarContainer}>
            {otherUser.profilePhoto ? (
              <Image 
                source={{ uri: otherUser.profilePhoto }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {getInitials(otherUser.fullName)}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={[
          styles.messageBubble,
          isMe ? styles.myMessage : styles.theirMessage,
          !showAvatar && (isMe ? styles.myMessageCompact : styles.theirMessageCompact)
        ]}>
          <Text style={[
            styles.messageText,
            isMe && styles.myMessageText
          ]}>
            {item.message}
          </Text>
          <Text style={[
            styles.timestamp,
            isMe ? styles.myTimestamp : styles.theirTimestamp
          ]}>
            {formatTime(item.timestamp)}
          </Text>
        </View>

        {isMe && showAvatar && (
          <View style={styles.avatarContainer}>
            {currentUser.profilePhoto ? (
              <Image 
                source={{ uri: currentUser.profilePhoto }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={[styles.avatarPlaceholder, styles.myAvatar]}>
                <Text style={styles.avatarText}>
                  {getInitials(currentUser.fullName)}
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      {/* Messages Area - Shrinks when keyboard is open */}
      <View style={[styles.messagesContainer, { 
        height: keyboardHeight > 0 ? screenHeight - keyboardHeight - 120 : screenHeight - 120 
      }]}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No messages yet. Start the conversation!
              </Text>
            </View>
          }
        />
      </View>

      {/* Input Area - Always stays above keyboard */}
      <View style={[styles.inputContainer, { 
        bottom: keyboardHeight > 0 ? keyboardHeight : 0 
      }]}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !input.trim() && styles.sendButtonDisabled
          ]} 
          onPress={sendMessage}
          disabled={!input.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  messagesContainer: {
    // Height is calculated dynamically based on keyboard
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  inputContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  avatarContainer: {
    marginHorizontal: 5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  myAvatar: {
    backgroundColor: "#34C759",
  },
  avatarText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 12,
    borderRadius: 18,
    marginHorizontal: 5,
  },
  myMessage: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  theirMessage: {
    backgroundColor: "#F2F2F7",
    borderBottomLeftRadius: 4,
  },
  myMessageCompact: {
    borderBottomRightRadius: 8,
  },
  theirMessageCompact: {
    borderBottomLeftRadius: 8,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    color: "#000",
  },
  myMessageText: {
    color: "#fff",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
    opacity: 0.7,
  },
  myTimestamp: {
    color: "rgba(255,255,255,0.8)",
    textAlign: "right",
  },
  theirTimestamp: {
    color: "rgba(0,0,0,0.5)",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    maxHeight: 100,
    fontSize: 16,
    marginRight: 10,
    backgroundColor: "#F2F2F7",
  },
  sendButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  sendButtonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
});