import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = () => {
  try {
    db = SQLite.openDatabaseSync('messengerApp.db');
    
    // Create users table
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        fullName TEXT NOT NULL,
        password TEXT NOT NULL,
        profilePhoto TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Create messages table
    db.execSync(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        receiver_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_read BOOLEAN DEFAULT FALSE,
        FOREIGN KEY (sender_id) REFERENCES users (id),
        FOREIGN KEY (receiver_id) REFERENCES users (id)
      );
    `);
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.log('Database init error:', error);
    return false;
  }
};

// Migration to add profilePhoto column if it doesn't exist
export const runMigrations = async () => {
  try {
    // Check if profilePhoto column exists
    const tableInfo = db.getAllSync('PRAGMA table_info(users);', []);
    const hasProfilePhoto = tableInfo.some(column => column.name === 'profilePhoto');
    
    if (!hasProfilePhoto) {
      db.execSync('ALTER TABLE users ADD COLUMN profilePhoto TEXT;');
      console.log('Added profilePhoto column to users table');
    }
    
    return true;
  } catch (error) {
    console.log('Migration error:', error);
    return false;
  }
};

// User functions
export const addUser = (username, fullName, password, profilePhoto = null) => {
  try {
    if (!db) initDatabase();
    
    const result = db.runSync(
      'INSERT INTO users (username, fullName, password, profilePhoto) VALUES (?, ?, ?, ?);',
      [username, fullName, password, profilePhoto]
    );
    return { success: true, userId: result.lastInsertRowId };
  } catch (error) {
    console.log('Add user error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserByUsername = (username) => {
  try {
    if (!db) initDatabase();
    
    const user = db.getFirstSync(
      'SELECT * FROM users WHERE username = ?;',
      [username]
    );
    return { success: true, user };
  } catch (error) {
    console.log('Get user error:', error);
    return { success: false, error: error.message };
  }
};

export const getAllUsers = (excludeUserId = null) => {
  try {
    if (!db) initDatabase();
    
    let query = 'SELECT * FROM users';
    let params = [];
    
    if (excludeUserId) {
      query += ' WHERE id != ?';
      params = [excludeUserId];
    }
    
    query += ' ORDER BY fullName;';
    
    const users = db.getAllSync(query, params);
    return { success: true, users: users || [] };
  } catch (error) {
    console.log('Get all users error:', error);
    return { success: false, error: error.message, users: [] };
  }
};

// Message functions
export const addMessage = (senderId, receiverId, message) => {
  try {
    if (!db) initDatabase();
    
    const result = db.runSync(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?);',
      [senderId, receiverId, message]
    );
    return { success: true, messageId: result.lastInsertRowId };
  } catch (error) {
    console.log('Add message error:', error);
    return { success: false, error: error.message };
  }
};

export const getMessagesBetweenUsers = (userId1, userId2) => {
  try {
    if (!db) initDatabase();
    
    const messages = db.getAllSync(
      `SELECT m.*, u1.username as sender_username, u1.fullName as sender_fullName, u1.profilePhoto as sender_photo,
              u2.username as receiver_username, u2.fullName as receiver_fullName, u2.profilePhoto as receiver_photo
       FROM messages m
       JOIN users u1 ON m.sender_id = u1.id
       JOIN users u2 ON m.receiver_id = u2.id
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.timestamp ASC;`,
      [userId1, userId2, userId2, userId1]
    );
    
    return { success: true, messages: messages || [] };
  } catch (error) {
    console.log('Get messages error:', error);
    return { success: false, error: error.message, messages: [] };
  }
};

export const getLastMessageBetweenUsers = (userId1, userId2) => {
  try {
    if (!db) initDatabase();
    
    const message = db.getFirstSync(
      `SELECT m.* 
       FROM messages m
       WHERE (m.sender_id = ? AND m.receiver_id = ?) OR (m.sender_id = ? AND m.receiver_id = ?)
       ORDER BY m.timestamp DESC
       LIMIT 1;`,
      [userId1, userId2, userId2, userId1]
    );
    
    return { success: true, message };
  } catch (error) {
    console.log('Get last message error:', error);
    return { success: false, error: error.message };
  }
};

export const getUnreadMessageCount = (userId, senderId) => {
  try {
    if (!db) initDatabase();
    
    const result = db.getFirstSync(
      'SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND sender_id = ? AND is_read = FALSE;',
      [userId, senderId]
    );
    
    return { success: true, count: result?.count || 0 };
  } catch (error) {
    console.log('Get unread count error:', error);
    return { success: false, error: error.message, count: 0 };
  }
};

export const markMessagesAsRead = (userId, senderId) => {
  try {
    if (!db) initDatabase();
    
    db.runSync(
      'UPDATE messages SET is_read = TRUE WHERE receiver_id = ? AND sender_id = ?;',
      [userId, senderId]
    );
    
    return { success: true };
  } catch (error) {
    console.log('Mark messages as read error:', error);
    return { success: false, error: error.message };
  }
};

export default db;