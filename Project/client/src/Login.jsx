// Importing useState hook from React and the CSS file for styling
import Cookies from "js-cookie";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useNavigate } from "react-router-dom";
import "./Login.css";

// This is the main Login component
export default function Login() {
  // State to store the email input from the user
  const [enteredEmail, setEnteredEmail] = useState("");

  // State to store the password input from the user
  const [enteredPassword, setEnteredPassword] = useState("");

  // State to track if the form has been submitted
  const [submitted, setSubmitted] = useState(false);
  const [token, setToken] = useState(null);

  const navigate = useNavigate(); // for redirecting

  // const recaptchaRef = useRef(null);

  // Function to handle input changes for both email and password
  function handleInputChange(identifier, value) {
    if (identifier === "email") {
      setEnteredEmail(value); // Update email state if input is for email
    } else {
      setEnteredPassword(value); // Update password state otherwise
    }
  }

  // Function to handle form submission when the user clicks "Sign In"
  const handleLogin = async (e) => {
    setSubmitted(true); // Mark that the user tried to submit the form

    e.preventDefault();

    if (!token) {
      alert("Please verify that you are not a robot!");
      return;
    }

    const res = await fetch(
      import.meta.env.VITE_API_KEY + "user/verify-recaptcha",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      },
    );

    const data = await res.json();
    if (data.success) {
      alert("Verification passed!");
    } else {
      alert("Verification failed!");
    }

    // If email is not empty, show an alert with the email
    // if (enteredEmail != "") alert("Email:" + enteredEmail);

    const formBody = JSON.stringify({
      Email: enteredEmail,
      Password: enteredPassword,
    });

    // console.log(import.meta.env.VITE_API_KEY + "user/login");
    const response = await fetch(import.meta.env.VITE_API_KEY + "user/login", {
      // const response = await fetch("http://localhost:8080/user/login", {
      method: "POST", //GET , PUT
      body: formBody,
      headers: {
        "content-type": "application/json",
      },
      credentials: "include", //send cookies
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      Cookies.set("userid", result.result.u_id);
      navigate("/dashboard");
    }
  };

  // Validation: email must include '@'
  const emailNotValid = submitted && !enteredEmail.includes("@");

  // Validation: password must be at least 8 characters long
  const passwordNotValid = submitted && enteredPassword.trim().length < 8;

  return (
    <div id="login">
      <p class="text-3xl font-bold underline">Tailwind CSS</p>
      <div className="controls">
        {/* Email input field */}
        <p>
          <label className={`label ${emailNotValid ? "invalid" : " "}`}>
            Email
          </label>
          <input
            type="email"
            // Add 'invalid' class if the email is invalid after form submission
            className={emailNotValid ? "invalid" : undefined}
            // Update email state on change
            onChange={(event) => handleInputChange("email", event.target.value)}
          />
        </p>

        {/* Password input field */}
        <p>
          <label>Password</label>
          <input
            type="password"
            // Add 'invalid' class if the password is invalid after form submission
            className={passwordNotValid ? "invalid" : undefined}
            // Update password state on change
            onChange={(event) =>
              handleInputChange("password", event.target.value)
            }
          />
        </p>
      </div>

      <ReCAPTCHA
        sitekey={import.meta.env.VITE_SITE_KEY}
        onChange={(value) => setToken(value)}
      />

      {/* Buttons section */}
      <div className="actions">
        {/* Placeholder button for creating a new account */}
        <button type="button" className="button">
          Create a new account
        </button>

        {/* Button to trigger login function */}
        <button className="button" onClick={handleLogin}>
          Sign In
        </button>
      </div>
      {/* <ReCAPTCHA sitekey={import.meta.env.VITE_SITE_KEY} ref={recaptchaRef} />; */}
    </div>
  );
}
