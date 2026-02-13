import { useUser } from "../contexts/UserProvider";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  async function fetchProfile() {
    const result = await fetch(`${API_URL}/api/user/profile`, {
      credentials: "include",
    });

    if (result.status === 401) {
      logout();
    } else {
      const data = await result.json();
      setIsLoading(false);
      setData(data);
    }
  }

  async function onUpdateImage() {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      alert("Please select a file.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("Image updated successfully!");
        fileInputRef.current.value = "";
        fetchProfile();
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update image.");
      }
    } catch (err) {
      alert("Error uploading image.");
    }

    setUploading(false);
  }

  async function onDeleteImage() {
    if (!confirm("Delete profile image?")) return;

    try {
      const response = await fetch(`${API_URL}/api/user/profile/image`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        alert("Image deleted!");
        fetchProfile();
      }
    } catch (err) {
      alert("Error deleting image.");
    }
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  if (isLoading) {
    return <div className="card"><p>Loading...</p></div>;
  }

  return (
    <div className="card">
      <h2>My Profile</h2>

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        {/* Profile Image */}
        <div style={{ textAlign: "center" }}>
          {data.profileImage ? (
            <img
              src={`${API_URL}${data.profileImage}`}
              alt="Profile"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #667eea",
              }}
            />
          ) : (
            <div
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background: "#ddd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "3rem",
                color: "#999",
              }}
            >
              👤
            </div>
          )}

          <div style={{ marginTop: "1rem" }}>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/gif,image/webp"
              style={{ marginBottom: "0.5rem" }}
            />
            <br />
            <button
              onClick={onUpdateImage}
              className="btn-success btn-sm"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>
            {data.profileImage && (
              <button
                onClick={onDeleteImage}
                className="btn-danger btn-sm"
                style={{ marginLeft: "0.5rem" }}
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div>
          <table>
            <tbody>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>ID:</th>
                <td style={{ padding: "0.5rem" }}>{data._id}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Email:</th>
                <td style={{ padding: "0.5rem" }}>{data.email}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>First Name:</th>
                <td style={{ padding: "0.5rem" }}>{data.firstname || "-"}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Last Name:</th>
                <td style={{ padding: "0.5rem" }}>{data.lastname || "-"}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem" }}>Status:</th>
                <td style={{ padding: "0.5rem" }}>
                  <span className={`badge ${data.status}`}>{data.status}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <hr style={{ margin: "1.5rem 0" }} />

      <Link to="/logout" className="btn-secondary">Logout</Link>
    </div>
  );
}