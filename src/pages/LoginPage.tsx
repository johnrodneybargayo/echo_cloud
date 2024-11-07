import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/loader/Loader";
import verbivibeLogo from "../assets/verbivibe_logo.png";
import googleLogo from "../assets/google-logo.png";
import { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, set, ref } from "../firebase/firebaseConfig"; // Firebase imports
import { FirebaseError } from "firebase/app"; // Import FirebaseError
import './LoginPage.css';  // Import the CSS file here

const LoginPage: React.FC = () => {
  const { loginWithGoogle, user, role } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false); // Toggle between login and register form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // Name for registration
  const [errorMessage, setErrorMessage] = useState(""); // State for error messages

  // Helper function to validate email format
  const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "participant") {
        navigate("/waiting");
      }
      setLoading(false);
    }
  }, [user, role, navigate]);

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const handleEmailPasswordLogin = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            setErrorMessage("No user found with this email.");
            break;
          case "auth/wrong-password":
            setErrorMessage("Incorrect password.");
            break;
          default:
            setErrorMessage("Login failed. Please try again.");
        }
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);

    // Validate email format
    if (!isValidEmail(email)) {
      setErrorMessage("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Store additional user information in the Firebase Realtime Database
      await set(ref(db, 'users/' + uid), {
        fullname: name,
        email: email,
        role: "admin", // Set the role as "admin"
        createdAt: new Date().toISOString(),
      });

      // After successful registration, log the user in automatically
      await signInWithEmailAndPassword(auth, email, password); // Log the user in

      // After successful login, navigate to the dashboard
      navigate("/dashboard");

    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            setErrorMessage("This email is already in use. Please log in or reset your password.");
            break;
          default:
            setErrorMessage("Registration failed. Please try again.");
        }
      } else {
        setErrorMessage("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="login-page-container flex flex-col items-center justify-center min-h-screen bg-blue-500">
      <div className="login-container w-full max-w-sm p-8 bg-white rounded-lg shadow-md text-center">
        <img src={verbivibeLogo} alt="VerbiVibe Logo" className="login-logo w-24 h-24 mx-auto mb-4 rounded-full" />
        
        <h2 className="login-heading text-2xl font-bold mb-4">{isRegister ? "Register" : "Login"}</h2>
        
        <form className="login-form space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login-input w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-400"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-400"
          />

          <button
            type="button"
            onClick={isRegister ? handleRegister : handleEmailPasswordLogin}
            className="login-btn w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        {errorMessage && <div className="error-message text-red-500 mt-4">{errorMessage}</div>}
        
        <div className="relative flex items-center justify-center my-4">
          <hr className="w-full border-t border-gray-300" />
          <span className="absolute bg-white px-4 text-gray-500">OR</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="google-login-btn w-full px-4 py-2 bg-gray-100 border rounded flex items-center justify-center text-gray-800 hover:bg-gray-200 transition"
        >
          <img src={googleLogo} alt="Google" className="google-logo w-6 h-6 mr-2" />
          Login with Google
        </button>

        <div className="mt-4">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-blue-500 hover:underline"
          >
            {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
