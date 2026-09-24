import { useEffect, useEffectEvent, useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:5002";

function App() {
  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("authToken") || ""
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Handle input changes
  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    setError("");
    setMessage("");
  }

  // Register
  async function handleRegister() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed"
        );
      }

      localStorage.setItem("authToken", data.token);

      setToken(data.token);
      setUser(data.user);

      setMessage("Account created successfully.");

      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Login
  async function handleLogin() {
    try {
      setLoading(true);
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_BASE}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: form.email.trim(),
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed"
        );
      }

      localStorage.setItem("authToken", data.token);

      setToken(data.token);
      setUser(data.user);

      setMessage("Login successful.");

      setForm({
        name: "",
        email: "",
        password: "",
      });
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  // Protected profile request
  async function loadProfile(currentToken) {
    try {
      const response = await fetch(
        `${API_BASE}/api/profile`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Session expired"
        );
      }

      setUser(data.user);
    } catch (error) {
      console.error("PROFILE ERROR:", error);

      localStorage.removeItem("authToken");
      setToken("");
      setUser(null);
    }
  }

  const restoreProfile = useEffectEvent(loadProfile);

  // Check existing login and refresh the profile after authentication.
  useEffect(() => {
    if (!token) {
      return undefined;
    }

    const restoreTask = window.setTimeout(() => {
      restoreProfile(token);
    }, 0);

    return () => window.clearTimeout(restoreTask);
  }, [token]);

  // Submit form
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    if (mode === "register" && !form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (mode === "register") {
      await handleRegister();
    } else {
      await handleLogin();
    }
  }

  // Logout
  function handleLogout() {
    localStorage.removeItem("authToken");

    setToken("");
    setUser(null);
    setMessage("");
    setError("");

    setForm({
      name: "",
      email: "",
      password: "",
    });

    setMode("login");
  }

  // Switch Login/Register
  function switchMode(nextMode) {
    setMode(nextMode);

    setError("");
    setMessage("");

    setForm({
      name: "",
      email: "",
      password: "",
    });
  }

  // Logged-in dashboard
  if (user) {
    return (
      <div className="auth-app">
        <div className="dashboard-shell">
          <header className="dashboard-header">
            <div className="brand">
              <div className="brand-mark">
                <img src="/aryonixlogo.png" alt="ARYONIX Logo" />
              </div>

              <div>
                <strong>ARYONIX</strong>
                <span>Authentication System</span>
              </div>
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </header>

          <main className="dashboard-content">
            <div className="welcome-card">
              <div className="welcome-icon">
                <img src="/aryonixlogo.png" alt="ARYONIX Logo" />
              </div>

              <div>
                <p className="label">
                  AUTHENTICATED USER
                </p>

                <h1>
                  Welcome, {user.name}
                </h1>

                <p>
                  Your account is authenticated using
                  JWT-based authentication.
                </p>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="info-card">
                <span>Name</span>
                <strong>{user.name}</strong>
              </div>

              <div className="info-card">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>

              <div className="info-card">
                <span>Authentication</span>
                <strong>JWT</strong>
              </div>

              <div className="info-card">
                <span>Database</span>
                <strong>MongoDB</strong>
              </div>
            </div>

            <div className="security-card">
              <div className="security-icon">
                ✓
              </div>

              <div>
                <h3>
                  Protected session active
                </h3>

                <p>
                  This dashboard is only accessible
                  after successful authentication.
                  Your password is never stored in
                  plain text.
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Login / Register
  return (
    <div className="auth-app">
      <div className="auth-background" />

      <main className="auth-container">

        <section className="auth-brand-section">
          <div className="large-brand-mark">
            <img src="/aryonixlogo.png" alt="ARYONIX Logo" />
          </div>

          <p className="brand-name">
            ARYONIX
          </p>

          <h1>
            Secure access.
            <br />
            Built for modern products.
          </h1>

          <p className="brand-description">
            A secure authentication system built
            with React, Node.js, Express, MongoDB
            and JWT.
          </p>

          <div className="feature-list">
            <div>
              <span>✓</span>
              Secure password hashing
            </div>

            <div>
              <span>✓</span>
              JWT authentication
            </div>

            <div>
              <span>✓</span>
              Protected API routes
            </div>
          </div>
        </section>

        <section className="auth-card">

          <div className="auth-card-header">
            <p className="eyebrow">
              AUTHENTICATION
            </p>

            <h2>
              {mode === "login"
                ? "Welcome back"
                : "Create your account"}
            </h2>

            <p>
              {mode === "login"
                ? "Sign in to access your secure dashboard."
                : "Create an account to get started."}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={
                mode === "login" ? "active" : ""
              }
              onClick={() => switchMode("login")}
            >
              Login
            </button>

            <button
              type="button"
              className={
                mode === "register" ? "active" : ""
              }
              onClick={() =>
                switchMode("register")
              }
            >
              Register
            </button>
          </div>

          {error && (
            <div className="message error">
              {error}
            </div>
          )}

          {message && (
            <div className="message success">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {mode === "register" && (
              <label>
                Full Name

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Aryan Mandavgode"
                  autoComplete="name"
                />
              </label>
            )}

            <label>
              Email Address

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </label>

            <label>
              Password

              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                autoComplete={
                  mode === "login"
                    ? "current-password"
                    : "new-password"
                }
              />
            </label>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </button>

          </form>

          <div className="auth-footer">
            {mode === "login" ? (
              <p>
                Don't have an account?

                <button
                  type="button"
                  onClick={() =>
                    switchMode("register")
                  }
                >
                  Create one
                </button>
              </p>
            ) : (
              <p>
                Already have an account?

                <button
                  type="button"
                  onClick={() =>
                    switchMode("login")
                  }
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          <div className="tech-stack">
            <span>React</span>
            <span>Express</span>
            <span>MongoDB</span>
            <span>JWT</span>
          </div>

        </section>

      </main>
    </div>
  );
}

export default App;