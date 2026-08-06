import { useEffect, useState } from "react";
import "./App.css";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

function App() {
  const [authMode, setAuthMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [token, setToken] = useState(
    localStorage.getItem("smarterp_token") || "",
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("smarterp_user") || "null"),
  );
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const endpoint =
        authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        authMode === "login"
          ? { email: form.email, password: form.password }
          : { name: form.name, email: form.email, password: form.password };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      if (authMode === "login") {
        localStorage.setItem("smarterp_token", data.token);
        localStorage.setItem("smarterp_user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        setMessage("Login successful");
      } else {
        setMessage("Account created successfully. Please login now.");
        setAuthMode("login");
        setForm({ ...initialForm, email: form.email, password: "" });
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    if (!token) return;

    try {
      const response = await fetch("/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load products");
      }

      setProducts(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("smarterp_token");
    localStorage.removeItem("smarterp_user");
    setToken("");
    setUser(null);
    setProducts([]);
    setMessage("You have been logged out");
  };

  return (
    <div className="app-shell">
      <header className="hero-card">
        <div>
          <p className="eyebrow">React ERP Dashboard</p>
          <h1>SmartERP</h1>
          <p className="subtitle">
            Connect your backend with a modern React interface.
          </p>
        </div>
        {user ? (
          <button className="secondary-btn" onClick={handleLogout}>
            Logout
          </button>
        ) : null}
      </header>

      {message ? <div className="message">{message}</div> : null}

      <div className="content-grid">
        <section className="panel">
          <div className="panel-header">
            <h2>{user ? "Welcome back" : "Access your workspace"}</h2>
            {!user ? (
              <button
                className="link-btn"
                onClick={() =>
                  setAuthMode(authMode === "login" ? "register" : "login")
                }
              >
                {authMode === "login" ? "Create account" : "Back to login"}
              </button>
            ) : null}
          </div>

          {!user ? (
            <form onSubmit={handleAuth} className="auth-form">
              {authMode === "register" ? (
                <input
                  name="name"
                  placeholder="Full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              ) : null}
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button type="submit" disabled={loading}>
                {loading
                  ? "Please wait..."
                  : authMode === "login"
                    ? "Login"
                    : "Register"}
              </button>
            </form>
          ) : (
            <div className="welcome-card">
              <p>
                <strong>{user.name}</strong> is signed in as{" "}
                <strong>{user.role}</strong>.
              </p>
              <p>Your React app is now talking to the backend API.</p>
            </div>
          )}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Products</h2>
            {user ? (
              <span className="pill">{products.length} items</span>
            ) : null}
          </div>

          {!token ? (
            <p className="empty-state">Log in to load products from the API.</p>
          ) : products.length === 0 ? (
            <p className="empty-state">No products found yet.</p>
          ) : (
            <div className="product-list">
              {products.map((product) => (
                <article key={product.id} className="product-card">
                  <h3>{product.name}</h3>
                  <p>{product.category || "Uncategorized"}</p>
                  <p>{product.description || "No description provided."}</p>
                  <div className="product-meta">
                    <span>${Number(product.price).toFixed(2)}</span>
                    <span>Stock: {product.stock}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
