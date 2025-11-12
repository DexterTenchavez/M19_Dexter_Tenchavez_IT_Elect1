import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = () => {
  try {
    db = SQLite.openDatabaseSync('chat.db');
    
    // Create tables using simple execSync with string commands
    db.execSync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
    
    db.execSync(`
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        sender TEXT NOT NULL
      );
    `);
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.log('Database init error:', error);
    return false;
  }
};

export const addUser = (name, email, password) => {
  try {
    if (!db) initDatabase();
    
    const result = db.runSync(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?);',
      [name, email, password]
    );
    return { success: true, result };
  } catch (error) {
    console.log('Add user error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserByEmail = (email) => {
  try {
    if (!db) initDatabase();
    
    const user = db.getFirstSync(
      'SELECT * FROM users WHERE email = ?;',
      [email]
    );
    return { success: true, user };
  } catch (error) {
    console.log('Get user error:', error);
    return { success: false, error: error.message };
  }
};

export const addMessage = (text, sender) => {
  try {
    if (!db) initDatabase();
    
    const result = db.runSync(
      'INSERT INTO messages (text, sender) VALUES (?, ?);',
      [text, sender]
    );
    return { success: true, result };
  } catch (error) {
    console.log('Add message error:', error);
    return { success: false, error: error.message };
  }
};

export const getMessages = () => {
  try {
    if (!db) initDatabase();
    
    const messages = db.getAllSync('SELECT * FROM messages;', []);
    return { success: true, messages: messages || [] };
  } catch (error) {
    console.log('Get messages error:', error);
    return { success: false, error: error.message, messages: [] };
  }
};

export default db;