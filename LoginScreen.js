import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from "react-native";
import { getUserByUsername } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter username and password");
      return;
    }

    setLoading(true);

    const result = await getUserByUsername(username);
    
    setLoading(false);
    
    if (result.success && result.user) {
      if (result.user.password === password) {
        // Save user to AsyncStorage
        await AsyncStorage.setItem('currentUser', JSON.stringify(result.user));
        Alert.alert("Success", `Welcome back, ${result.user.fullName}!`);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } else {
        Alert.alert("Error", "Invalid password");
      }
    } else {
      Alert.alert("Error", "User not found");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>💬</Text>
          <Text style={styles.title}>Offline Messenger</Text>
          <Text style={styles.subtitle}>Connect without internet</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login</Text>
          
          <TextInput  
            placeholder="Username"  
            style={styles.input}  
            value={username}  
            onChangeText={setUsername}  
            autoCapitalize="none"
            placeholderTextColor="#999"
          />  
          <TextInput  
            placeholder="Password"  
            style={styles.input}  
            value={password}  
            onChangeText={setPassword}  
            secureTextEntry  
            placeholderTextColor="#999"
          />  

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >  
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>  
          </TouchableOpacity>  

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate("Register")}
          >  
            <Text style={styles.linkText}>Don't have an account? Register</Text>  
          </TouchableOpacity>  
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>All data stored locally on your device</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 50,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#333",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 25,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#6c757d",
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
  linkButton: {
    padding: 15,
    alignItems: "center",
    marginTop: 15,
  },
  linkText: { 
    color: "#007AFF", 
    fontSize: 16,
    fontWeight: "500"
  },
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    color: "#999",
    fontSize: 12,
  },
});