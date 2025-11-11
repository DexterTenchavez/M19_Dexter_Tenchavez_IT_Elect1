import React, { useState } from "react";
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: "1", text: "Hello! 👋", sender: "other" },
    { id: "2", text: "Hi! How are you?", sender: "me" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (input.trim() === "") return;

    const newMessage = {
      id: Date.now().toString(),
      text: input,
      sender: "me",
    };

    setMessages([...messages, newMessage]);
    setInput("");
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        alignSelf: item.sender === "me" ? "flex-end" : "flex-start",
        backgroundColor: item.sender === "me" ? "#0084ff" : "#e5e5ea",
        borderRadius: 20,
        margin: 5,
        padding: 10,
        maxWidth: "70%",
      }}
    >
      <Text style={{ color: item.sender === "me" ? "#fff" : "#000" }}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f2f2f2" }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* Input Field */}
      <View
        style={{
          flexDirection: "row",
          padding: 10,
          borderTopWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#fff",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 20,
            paddingHorizontal: 15,
            marginRight: 10,
          }}
          placeholder="Type a message..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            backgroundColor: "#0084ff",
            borderRadius: 20,
            paddingVertical: 10,
            paddingHorizontal: 20,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}