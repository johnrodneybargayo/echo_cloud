// AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "../firebase/firebaseConfig";
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from "firebase/auth";
import { ref, set, get, remove } from "firebase/database";
import Loader from "../components/loader/Loader"; // Import your loader component

type Role = "admin" | "participant";
type AuthContextType = {
  user: User | null;
  role: Role | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  clearDatabase: () => Promise<void>;
  isLoading: boolean; // Loader state
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as loading

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");

    if (storedUser && storedRole) {
      // If user and role are stored in localStorage, set them
      setUser(JSON.parse(storedUser));
      setRole(storedRole as Role);
      setIsLoading(false); // Finished loading
    } else {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        setUser(currentUser);
        if (currentUser) {
          const roleRef = ref(db, `users/${currentUser.uid}/role`);
          const snapshot = await get(roleRef);
          if (snapshot.exists()) {
            setRole(snapshot.val() as Role);
          } else {
            const newRole: Role = "admin";
            await set(roleRef, newRole);
            setRole(newRole);
          }
          // Store user data in localStorage
          localStorage.setItem("user", JSON.stringify(currentUser));
          localStorage.setItem("role", snapshot.exists() ? snapshot.val() : "admin");
        } else {
          setRole(null);
          localStorage.removeItem("user");
          localStorage.removeItem("role");
        }
        setIsLoading(false); // Finished loading
      });
      return unsubscribe;
    }
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const loggedInUser = result.user;
      const userRef = ref(db, `users/${loggedInUser.uid}`);
      const snapshot = await get(userRef);

      // If displayName is missing, use 'User' as fallback
      const fullName = loggedInUser.displayName || "User";

      // Check if user data exists in Firebase
      if (!snapshot.exists()) {
        const userRole: Role = "admin"; // Set role to admin

        // Save user data with fullName (displayName) instead of username
        await set(userRef, {
          uid: loggedInUser.uid,
          fullName: fullName, // Store displayName as fullName
          email: loggedInUser.email,
          photoURL: loggedInUser.photoURL,
          role: userRole,
        });
        setRole(userRole);
        localStorage.setItem("role", userRole); // Store role in localStorage
      } else {
        setRole(snapshot.val().role as Role);
        localStorage.setItem("role", snapshot.val().role); // Store role in localStorage
      }

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser)); // Store user in localStorage
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setRole(null);
      localStorage.removeItem("user");
      localStorage.removeItem("role");
    });
  };

  const clearDatabase = async () => {
    if (role !== "admin") {
      console.error("User does not have permission to clear the database");
      return;
    }

    try {
      setIsLoading(true); // Start the loader
      await remove(ref(db)); // Clear the database
      console.log("Database cleared successfully");
    } catch (error) {
      console.error("Error clearing the database:", error);
    } finally {
      setIsLoading(false); // Stop the loader
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loginWithGoogle, logout, clearDatabase, isLoading }}>
      {isLoading ? <Loader /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
