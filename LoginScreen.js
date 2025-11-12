import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { getUserByEmail } from './database';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    const result = await getUserByEmail(email);
    
    if (result.success && result.user && result.user.password === password) {
      navigation.navigate("Chat");
    } else {
      Alert.alert("Error", "Invalid email or password");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back 👋</Text>

      <TextInput  
        placeholder="Email"  
        style={styles.input}  
        value={email}  
        onChangeText={setEmail}  
        autoCapitalize="none"
        keyboardType="email-address"
      />  
      <TextInput  
        placeholder="Password"  
        style={styles.input}  
        value={password}  
        onChangeText={setPassword}  
        secureTextEntry  
      />  

      <TouchableOpacity style={styles.button} onPress={handleLogin}>  
        <Text style={styles.buttonText}>Login</Text>  
      </TouchableOpacity>  

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>  
        <Text style={styles.link}>Don't have an account? Register</Text>  
      </TouchableOpacity>  
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 26, fontWeight: "700", textAlign: "center", marginBottom: 30 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { color: "#007bff", textAlign: "center", marginTop: 20 },
});