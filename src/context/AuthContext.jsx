import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
  } from "firebase/auth";
  import { useState, useEffect, useContext, createContext } from "react";
  import { auth, db } from "../../firebase";
  import { doc, getDoc } from "firebase/firestore";
  
  const AuthContext = createContext();
  
  export function useAuth() {
    return useContext(AuthContext);
  }
  
  export function AuthProvider({ children }) {
    const [globalUser, setGlobalUser] = useState(null);
    const [globalData, setGlobalData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    function signup(email, password) {
      return createUserWithEmailAndPassword(auth, email, password);
    }
  
    function login(email, password) {
      return signInWithEmailAndPassword(auth, email, password);
    }
  
    function resetPassword(email) {
      return sendPasswordResetEmail(auth, email);
    }
  
    function logout() {
      setGlobalUser(null);
      setGlobalData(null);
      return signOut(auth);
    }
  
    const value = { globalUser, globalData, setGlobalData, isLoading, signup, login, logout, resetPassword };
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('CURRENT USER:', user);
        setGlobalUser(user);
        if (!user) {
            console.log("No user found");
          setGlobalUser(null);
          setGlobalData(null);
          return;
        }
        try {
          setIsLoading(true);
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          let firebaseData = {};
          if (docSnap.exists()) {

            firebaseData = docSnap.data();
            console.log("Found user data:",firebaseData, docSnap.data());
          }
          setGlobalData(firebaseData);
          setGlobalUser(user);
        } catch (error) {
          console.error("Error fetching user data:", error.message);
        } finally {
          setIsLoading(false);
        }
      });
      return () => unsubscribe(); // This ensures clean up on unmount
    }, []);
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }
  
