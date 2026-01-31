import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000/api/user";

export function Users() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const firstnameRef = useRef();
  const lastnameRef = useRef();

  async function loadUsers(page = 1) {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?page=${page}&limit=10`);
      const data = await res.json();
      setUsers(data.data || []);
      setPagination(data.pagination || {});
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load users" });
    }
    setLoading(false);
  }

  async function handleCreate(e) {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
          firstname: firstnameRef.current.value,
          lastname: lastnameRef.current.value,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        usernameRef.current.value = "";
        emailRef.current.value = "";
        passwordRef.current.value = "";
        firstnameRef.current.value = "";
        lastnameRef.current.value = "";
        setMessage({ type: "success", text: "User created!" });
        loadUsers(1);
      } else {
        setMessage({ type: "error", text: data.message || "Failed to create user" });
      }

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      setMessage({ type: "error", text: "Failed to create user" });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage({ type: "success", text: "User deleted!" });
        loadUsers(pagination.currentPage);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete user" });
    }
  }

  useEffect(() => {
    loadUsers(1);
  }, []);

  return (
    <div>
      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

      <div className="card">
        <h2>Add New User</h2>
        <form onSubmit={handleCreate}>
          <div className="form-row">
            <input ref={usernameRef} placeholder="Username *" required />
            <input ref={emailRef} type="email" placeholder="Email *" required />
            <input ref={passwordRef} type="password" placeholder="Password *" required />
          </div>
          <div className="form-row" style={{ marginTop: "0.5rem" }}>
            <input ref={firstnameRef} placeholder="First Name" />
            <input ref={lastnameRef} placeholder="Last Name" />
            <button type="submit" className="btn-success">Add User</button>
          </div>
        </form>
      </div>

      <div className="card">
        <h2>Users ({pagination.totalItems || 0})</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No users found</td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.firstname} {user.lastname}</td>
                    <td>
                      <span className={`badge ${user.status}`}>{user.status}</span>
                    </td>
                    <td>
                      <Link to={`/users/${user._id}`} className="btn-primary btn-sm">Edit</Link>
                      <button onClick={() => handleDelete(user._id)} className="btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <button onClick={() => loadUsers(pagination.currentPage - 1)} disabled={!pagination.hasPrevPage}>
            Prev
          </button>
          <span>Page {pagination.currentPage || 1} of {pagination.totalPages || 1}</span>
          <button onClick={() => loadUsers(pagination.currentPage + 1)} disabled={!pagination.hasNextPage}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}