import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  RefreshControl,
  SafeAreaView,
  StatusBar
} from "react-native";
import { getAllUsers, getLastMessageBetweenUsers, getUnreadMessageCount } from './database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [lastMessages, setLastMessages] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({});

  useEffect(() => {
    loadCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadUsers();
    }
  }, [currentUser]);

  const loadCurrentUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem('currentUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
      } else {
        // Not logged in, go back to login
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadUsers = async () => {
    if (!currentUser) return;
    
    try {
      const result = await getAllUsers(currentUser.id);
      if (result.success) {
        setUsers(result.users);
        
        // Load last messages and unread counts for each user
        const messages = {};
        const counts = {};
        
        for (const user of result.users) {
          // Get last message
          const messageResult = await getLastMessageBetweenUsers(currentUser.id, user.id);
          if (messageResult.success && messageResult.message) {
            messages[user.id] = messageResult.message;
          }
          
          // Get unread count
          const countResult = await getUnreadMessageCount(currentUser.id, user.id);
          if (countResult.success) {
            counts[user.id] = countResult.count;
          }
        }
        
        setLastMessages(messages);
        setUnreadCounts(counts);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleUserPress = async (user) => {
    navigation.navigate('Chat', { 
      otherUser: user,
      currentUser: currentUser 
    });
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('currentUser');
            navigation.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            });
          }
        }
      ]
    );
  };

  const getInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : '?';
  };

  const formatMessage = (message) => {
    if (!message) return 'No messages yet';
    
    const text = message.message;
    return text.length > 35 ? text.substring(0, 35) + '...' : text;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 24 * 60 * 60 * 1000) {
      // Less than 24 hours
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderUserItem = ({ item: user }) => {
    const lastMessage = lastMessages[user.id];
    const unreadCount = unreadCounts[user.id] || 0;
    
    return (
      <TouchableOpacity 
        style={styles.userItem}
        onPress={() => handleUserPress(user)}
      >
        <View style={styles.avatarContainer}>
          {user.profilePhoto ? (
            <Image source={{ uri: user.profilePhoto }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {getInitials(user.fullName)}
              </Text>
            </View>
          )}
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.fullName}</Text>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {formatMessage(lastMessage)}
          </Text>
        </View>
        
        <View style={styles.messageMeta}>
          <Text style={styles.timeText}>
            {formatTime(lastMessage?.timestamp)}
          </Text>
          {unreadCount > 0 && (
            <View style={styles.unreadDot} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!currentUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <Text style={styles.welcomeText}>Welcome,</Text>
          <Text style={styles.userNameHeader}>{currentUser.fullName}</Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Users List */}
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
            <Text style={styles.emptySubtext}>
              Create another account to start chatting
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerInfo: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: "#666",
  },
  userNameHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginTop: 2,
  },
  logoutButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  logoutText: {
    color: "#666",
    fontWeight: "500",
  },
  listContainer: {
    flexGrow: 1,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f9fa",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  unreadBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  unreadText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: "#666",
  },
  messageMeta: {
    alignItems: "flex-end",
  },
  timeText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#007AFF",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
});