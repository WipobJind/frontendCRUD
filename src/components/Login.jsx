import { useRef, useState } from "react";
import { useUser } from "../contexts/UserProvider";
import { Navigate } from "react-router-dom";

export default function Login() {
  const [controlState, setControlState] = useState({
    isLoggingIn: false,
    isLoginError: false,
  });

  const emailRef = useRef();
  const passRef = useRef();
  const { user, login } = useUser();

  async function onLogin(e) {
    e.preventDefault();

    setControlState({ isLoggingIn: true, isLoginError: false });

    const email = emailRef.current.value;
    const pass = passRef.current.value;

    const result = await login(email, pass);

    setControlState({
      isLoggingIn: false,
      isLoginError: !result,
    });
  }

  if (user.isLoggedIn) {
    return <Navigate to="/profile" replace />;
  }

  return (
    <div className="card" style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Login</h2>
      <form onSubmit={onLogin}>
        <div className="form-group">
          <label>Email</label>
          <input type="email" ref={emailRef} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" ref={passRef} required />
        </div>
        <button
          type="submit"
          className="btn-success"
          disabled={controlState.isLoggingIn}
          style={{ width: "100%" }}
        >
          {controlState.isLoggingIn ? "Logging in..." : "Login"}
        </button>
        {controlState.isLoginError && (
          <div className="alert error" style={{ marginTop: "1rem" }}>
            Invalid email or password
          </div>
        )}
      </form>
    </div>
  );
}