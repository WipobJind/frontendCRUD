import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/user";

export function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();
  const statusRef = useRef();

  async function loadUser() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();

      if (usernameRef.current) usernameRef.current.value = data.username || "";
      if (emailRef.current) emailRef.current.value = data.email || "";
      if (firstnameRef.current) firstnameRef.current.value = data.firstname || "";
      if (lastnameRef.current) lastnameRef.current.value = data.lastname || "";
      if (statusRef.current) statusRef.current.value = data.status || "ACTIVE";
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load user" });
    }
    setLoading(false);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const updateData = {
        username: usernameRef.current.value,
        email: emailRef.current.value,
        firstname: firstnameRef.current.value,
        lastname: lastnameRef.current.value,
        status: statusRef.current.value,
      };

      // Only include password if provided
      if (passwordRef.current.value.trim() !== "") {
        updateData.password = passwordRef.current.value;
      }

      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "User updated!" });
        passwordRef.current.value = "";
      } else {
        setMessage({ type: "error", text: data.message || "Failed to update" });
      }

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update" });
    }
  }

  useEffect(() => {
    loadUser();
  }, [id]);

  if (loading) {
    return <div className="card"><p>Loading...</p></div>;
  }

  return (
    <div className="card">
      <h2>Edit User</h2>
      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Username *</label>
          <input ref={usernameRef} required />
        </div>
        <div className="form-group">
          <label>Email *</label>
          <input ref={emailRef} type="email" required />
        </div>
        <div className="form-group">
          <label>Password (leave blank to keep current)</label>
          <input ref={passwordRef} type="password" placeholder="Enter new password" />
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input ref={firstnameRef} />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input ref={lastnameRef} />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select ref={statusRef}>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
            <option value="DELETED">DELETED</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-success">Update</button>
          <button type="button" onClick={() => navigate("/users")} className="btn-secondary">Back</button>
        </div>
      </form>
    </div>
  );
}