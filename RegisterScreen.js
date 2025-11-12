import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { addUser } from './database';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert("Password should be at least 6 characters");
      return;
    }

    setLoading(true);

    const result = await addUser(name, email, password);
    
    setLoading(false);
    
    if (result.success) {
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } else {
      if (result.error && result.error.includes('UNIQUE')) {
        Alert.alert("Error", "Email already exists");
      } else {
        Alert.alert("Error", result.error || "Failed to create account");
      }
      console.log("Registration error:", result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account ✨</Text>

      <TextInput  
        placeholder="Full Name"  
        style={styles.input}  
        value={name}  
        onChangeText={setName}  
      />  
      <TextInput  
        placeholder="Email"  
        style={styles.input}  
        value={email}  
        onChangeText={setEmail}  
        autoCapitalize="none"
        keyboardType="email-address"
      />  
      <TextInput  
        placeholder="Password (min 6 characters)"  
        style={styles.input}  
        value={password}  
        onChangeText={setPassword}  
        secureTextEntry  
      />  

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleRegister}
        disabled={loading}
      >  
        <Text style={styles.buttonText}>
          {loading ? "Creating..." : "Register"}
        </Text>  
      </TouchableOpacity>  

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>  
        <Text style={styles.link}>Already have an account? Login</Text>  
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
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "600" },
  link: { color: "#007bff", textAlign: "center", marginTop: 20 },
});