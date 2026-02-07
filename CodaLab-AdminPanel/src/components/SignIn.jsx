import React, { useEffect, useState } from "react";
import { Admin, Subadmin } from "./firbase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // ✅ IMPORT ADD KARO

export default function SignIn({ setCurrentUser }) {
  const [isAdmin, setIsAdmin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // ✅ AuthContext se setUserRole le lo
  const { setUserRole } = useAuth();

  const toggleForm = () => {
    setIsAdmin(!isAdmin);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const authInstance = isAdmin ? Admin : Subadmin;

    signInWithEmailAndPassword(authInstance, email, password)
      .then(async (userCredential) => {
        alert("Login Successful");

        const token = await userCredential.user.getIdToken();
        console.log("Access Token:", token);

        localStorage.setItem("accessToken", token);

        const headers = new Headers();
        headers.append("Authorization", "Bearer " + token);
        
        console.log("This is come here to ho in event");
        
        setCurrentUser(userCredential);
        const userInfo = isAdmin ? "admin" : "subadmin";

        console.log(userInfo);
        
        // ✅ setUserRole function use karo
        if (setUserRole) {
          setUserRole(userInfo);
        } else {
          console.error("setUserRole function not available");
        }
        
        localStorage.setItem("userInfo", userInfo);
        navigate("/admin/dashboard"); // ✅ Correct navigation path

        console.log("This is come here to ho in event");
      })
      .catch((error) => {
        setError(error.message);
        console.log(error);
        if (setUserRole) {
          setUserRole(" ");
        }
      });
  };

  return (
    <div className="h1">
      <div
        className={`form-container ${
          isAdmin ? "signup-active" : "signin-active"
        }`}
      >
        <div className="form-content">
          <form onSubmit={handleSubmit}>
            <div className="header">
              <svg
                width="100"
                height="100"
                viewBox="0 0 24 24"
                fill="orange"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="7" r="5" />
                <path d="M12 14c-5.33 0-8 2.67-8 8h16c0-5.33-2.67-8-8-8z" />
              </svg>
              <h2>{isAdmin ? "Sign In as Admin" : "Sign In as Subadmin"}</h2>
            </div>

            <div className="form-group">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value), setError("");
                }}
                placeholder="Email"
                required
              />
            </div>
            <div className="form-group">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value), setError("");
                }}
                placeholder="Password"
                required
              />
              <span
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁"}
              </span>
            </div>
            {error && (
              <div className="error-message">
                {isAdmin ? "You are not Admin" : "You are not Subadmin"}
              </div>
            )}
            <button type="submit" className="btn">
              {isAdmin ? "Login as Admin" : "Login as Subadmin"}
            </button>
          </form>
        </div>
        <div className="image-container">
          <h1>{isAdmin ? "Welcome" : "Hello!"}</h1>
          <p style={{ width: "55%" }}>
            {isAdmin
              ? "If you are Subadmin, click here"
              : "If you are Admin, click here"}
          </p>
          <button
            onClick={() => {
              toggleForm(), setEmail(""), setPassword(""), setError("");
            }}
            className="btn image-btn"
          >
            {isAdmin ? "Login as Subadmin" : "Login as Admin"}
          </button>
        </div>
      </div>
    </div>
  );
}

// CSS styles merged into the JavaScript file
const styles = `
  .h1 {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f7f7f7;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .form-container {
    display: flex;
    width: 70%;
    max-width: 900px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow: hidden;
    position: relative;
    transition: transform 0.6s ease-in-out;
  }

  .form-container.signup-active .form-content {
    transform: translateX(0%);
  }

  .form-container.signin-active .form-content {
    transform: translateX(100%);
  }

  .form-container.signup-active .image-container {
    transform: translateX(0%);
  }

  .form-container.signin-active .image-container {
    transform: translateX(-100%);
  }

  .form-content {
    background-color: white;
    width: 50%;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: transform 0.6s ease-in-out;
  }

  .header {
    text-align: center;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 15px;
    position: relative;
  }

  .form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-sizing: border-box;
  }

  .password-toggle {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
  }

  .form-group label {
    display: flex;
    align-items: center;
  }

  .form-group label input {
    margin-left: -120px;
    position: fixed;
  }

  .btn {
    display: block;
    width: 100%;
    padding: 10px;
    background-color: #f1c40f;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s;
    color: black;
  }

  .btn:hover {
    background-color: #e1b000;
  }

  .image-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    background-color: #ffe9ba;
    padding: 40px;
    transition: transform 0.6s ease-in-out;
  }

  .image-container img {
    max-width: 100%;
    height: auto;
    margin-bottom: 20px;
  }

  .image-btn {
    background-color: #f1c40f;
    color: black;
    width: 130px;
  }

  .image-btn:hover {
    background-color: #e1b000;
  }

  .error-message {
    color: red;
    margin-bottom: 15px;
  }
`;

// Inject styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);