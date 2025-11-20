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
  Image,
  ActivityIndicator
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { addUser } from './database';

// SVG Icons as components
const CameraIcon = () => (
  <Text style={styles.icon}>📸</Text>
);

const GalleryIcon = () => (
  <Text style={styles.icon}>🖼️</Text>
);

const UserIcon = () => (
  <Text style={styles.inputIcon}>👤</Text>
);

const LockIcon = () => (
  <Text style={styles.inputIcon}>🔒</Text>
);

const RegisterIcon = () => (
  <Text style={styles.buttonIcon}>✨</Text>
);

const LoginIcon = () => (
  <Text style={styles.linkIcon}>🔑</Text>
);

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);

  const pickImage = async (source) => {
    try {
      setPhotoLoading(true);
      
      let result;
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera permissions to make this work!');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need gallery permissions to make this work!');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.5,
        });
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        setProfilePhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image picker error:', error);
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!fullName || !username || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password.length < 4) {
      Alert.alert("Error", "Password should be at least 4 characters");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords don't match");
      return;
    }

    setLoading(true);

    const result = await addUser(username, fullName, password, profilePhoto);
    
    setLoading(false);
    
    if (result.success) {
      Alert.alert("Success", "Account created successfully!");
      navigation.navigate("Login");
    } else {
      if (result.error && result.error.includes('UNIQUE')) {
        Alert.alert("Error", "Username already exists");
      } else {
        Alert.alert("Error", result.error || "Failed to create account");
      }
    }
  };

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : '?';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the offline community</Text>
        </View>

        <View style={styles.formContainer}>
          {/* Profile Photo Section */}
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Profile Photo (Optional)</Text>
            
            <View style={styles.photoContainer}>
              <View style={styles.photoCircle}>
                {photoLoading ? (
                  <ActivityIndicator size="large" color="#007AFF" />
                ) : profilePhoto ? (
                  <Image source={{ uri: profilePhoto }} style={styles.photoImage} />
                ) : (
                  <Text style={styles.photoInitials}>
                    {getInitials(fullName)}
                  </Text>
                )}
              </View>
              
              <View style={styles.photoButtons}>
                <TouchableOpacity 
                  style={styles.photoButton}
                  onPress={() => pickImage('camera')}
                >
                  <CameraIcon />
                  <Text style={styles.photoButtonText}>Selfie</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.photoButton}
                  onPress={() => pickImage('gallery')}
                >
                  <GalleryIcon />
                  <Text style={styles.photoButtonText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.inputContainer}>
            <UserIcon />
            <TextInput  
              placeholder="Full Name"  
              style={styles.input}  
              value={fullName}  
              onChangeText={setFullName}  
              placeholderTextColor="#999"
            />  
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>@</Text>
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
              placeholder="Password (min 4 characters)"  
              style={styles.input}  
              value={password}  
              onChangeText={setPassword}  
              secureTextEntry  
              placeholderTextColor="#999"
            />  
          </View>

          <View style={styles.inputContainer}>
            <LockIcon />
            <TextInput  
              placeholder="Confirm Password"  
              style={styles.input}  
              value={confirmPassword}  
              onChangeText={setConfirmPassword}  
              secureTextEntry  
              placeholderTextColor="#999"
            />  
          </View>

          <TouchableOpacity 
            style={[styles.button, loading && styles.buttonDisabled]} 
            onPress={handleRegister}
            disabled={loading}
          >  
            <RegisterIcon />
            <Text style={styles.buttonText}>
              {loading ? "Creating Account..." : "Create Account"}
            </Text>  
          </TouchableOpacity>  

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate("Login")}
          >  
            <LoginIcon />
            <Text style={styles.linkText}>Already have an account? Login</Text>  
          </TouchableOpacity>  
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
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "black",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
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
  photoSection: {
    marginBottom: 25,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  photoContainer: {
    alignItems: "center",
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 3,
    borderColor: "#007AFF",
    overflow: "hidden",
  },
  photoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  photoInitials: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  photoButtons: {
    flexDirection: "row",
    gap: 10,
  },
  photoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 100,
    justifyContent: "center",
  },
  photoButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
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
    backgroundColor: "#28a745",
    padding: 16,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#28a745",
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
  icon: {
    fontSize: 16,
  },
});