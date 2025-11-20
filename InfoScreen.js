import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Linking
} from "react-native";

// Replace these with your actual information
const DEVELOPER_INFO = {
  fullName: "Dexter Tenchavez", // Replace with your full name
  submittedTo: "Jay Ian Camelotes",
  bio: "A passionate React Native developer who loves turning ideas into functional mobile applications. Always eager to learn new technologies and create innovative solutions.", // Replace with your bio
  address: "Gabi, Ubay, Bohol", // Optional - replace with your address
  email: "dextertenchavez@gmail.com", // Optional
  studentId: "23-016838" // Optional
};

export default function InfoScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('./assets/myPicture.png')} 
              style={styles.avatar}
              defaultSource={require('./assets/myPicture.png')}
            />
          </View>
          <Text style={styles.developerName}>{DEVELOPER_INFO.fullName}</Text>
          <Text style={styles.developerTitle}>Mobile App Developer</Text>
        </View>

        {/* Info Cards */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Submission Details</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Author/Submitted by:</Text>
            <Text style={styles.infoValue}>{DEVELOPER_INFO.fullName}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Submitted To:</Text>
            <Text style={styles.infoValue}>{DEVELOPER_INFO.submittedTo}</Text>
          </View>
          {DEVELOPER_INFO.studentId && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Student ID:</Text>
              <Text style={styles.infoValue}>{DEVELOPER_INFO.studentId}</Text>
            </View>
          )}
        </View>

        {/* Bio Section */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>About Me</Text>
          <Text style={styles.bioText}>{DEVELOPER_INFO.bio}</Text>
        </View>

        {/* Contact Section */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          {DEVELOPER_INFO.address && (
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>📍 Address:</Text>
              <Text style={styles.infoValue}>{DEVELOPER_INFO.address}</Text>
            </View>
          )}
          {DEVELOPER_INFO.email && (
            <TouchableOpacity 
              style={styles.infoItem}
              onPress={() => Linking.openURL(`mailto:${DEVELOPER_INFO.email}`)}
            >
              <Text style={styles.infoLabel}>📧 Email:</Text>
              <Text style={[styles.infoValue, styles.link]}>
                {DEVELOPER_INFO.email}
              </Text>
            </TouchableOpacity>
          )}
        </View>

      

        {/* Submission Instructions */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Project Submission</Text>
          <Text style={styles.submissionText}>
            This app was developed as the final individual project for the React Native course.
          </Text>
         
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} {DEVELOPER_INFO.fullName}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 4,
    borderColor: '#0056b3',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  developerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textAlign: 'center',
  },
  developerTitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
    flex: 1.5,
    textAlign: 'right',
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    textAlign: 'justify',
  },
  submissionText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#444',
    marginBottom: 10,
    textAlign: 'justify',
  },
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});