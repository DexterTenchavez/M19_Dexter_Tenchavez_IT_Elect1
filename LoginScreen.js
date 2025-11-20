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
  ScrollView
} from "react-native";
import { getUserByUsername } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MessageIcon = () => (
  <Text style={styles.logo}>💬</Text>
);

const UserIcon = () => (
  <Text style={styles.inputIcon}>👤</Text>
);

const LockIcon = () => (
  <Text style={styles.inputIcon}>🔒</Text>
);

const LoginIcon = () => (
  <Text style={styles.buttonIcon}>🚀</Text>
);

const RegisterIcon = () => (
  <Text style={styles.linkIcon}>✨</Text>
);

const InfoIcon = () => (
  <Text style={styles.infoIcon}>ℹ️</Text>
);

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
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.infoButton}
            onPress={() => navigation.navigate('Info')}
          >
            <InfoIcon />
          </TouchableOpacity>
        </View>

        <View style={styles.logoContainer}>
          <MessageIcon />
          <Text style={styles.title}>Messenger</Text>
          <Text style={styles.subtitle}>Connect with friends offline</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Login to Your Account</Text>
          
          <View style={styles.inputContainer}>
            <UserIcon />
            <TextInput  
              placeholder="Username"  
              style={styles.input}  
              value={username}  
              onChangeText={setUsername}  
              autoCapitalize="none"
              placeholderTextColor="#999"
            />  
          </View>

          <View style={styles.inputContainer}>
            <LockIcon />
            <TextInput  
              placeholder="Password"  
              style={styles.input}  
              value={password}  
              onChangeText={setPassword}  
              secureTextEntry  
              placeholderTextColor="#999"
            />  
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={loading}
          >  
            <LoginIcon />
            <Text style={styles.buttonText}>
              {loading ? "Logging in..." : "Login"}
            </Text>  
          </TouchableOpacity>  

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate("Register")}
          >  
            <RegisterIcon />
            <Text style={styles.linkText}>Create new account</Text>  
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
    backgroundColor: "#007AFF",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  infoButton: {
    padding: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
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
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 15,
    marginBottom: 15,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 15,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
    color: "#666",
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#333",
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
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
  buttonIcon: {
    fontSize: 18,
    marginRight: 8,
    color: "#fff",
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "600" 
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#e9ecef",
  },
  dividerText: {
    marginHorizontal: 15,
    color: "#666",
    fontSize: 14,
  },
  linkButton: {
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  linkIcon: {
    fontSize: 16,
    marginRight: 8,
    color: "#007AFF",
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
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
  },
});