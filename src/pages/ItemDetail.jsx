import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000/api/item";

export function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loading, setLoading] = useState(true);

  const nameRef = useRef();
  const categoryRef = useRef();
  const priceRef = useRef();
  const statusRef = useRef();

  async function loadItem() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/${id}`);
      const data = await res.json();
      if (nameRef.current) nameRef.current.value = data.itemName || "";
      if (categoryRef.current) categoryRef.current.value = data.itemCategory || "Stationary";
      if (priceRef.current) priceRef.current.value = data.itemPrice || "";
      if (statusRef.current) statusRef.current.value = data.status || "ACTIVE";
    } catch (err) {
      setMessage({ type: "error", text: "Failed to load item" });
    }
    setLoading(false);
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: nameRef.current.value,
          category: categoryRef.current.value,
          price: priceRef.current.value,
          status: statusRef.current.value,
        }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Item updated!" });
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to update" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update" });
    }
  }

  useEffect(() => {
    loadItem();
  }, [id]);

  if (loading) {
    return <div className="card"><p>Loading...</p></div>;
  }

  return (
    <div className="card">
      <h2>Edit Item</h2>
      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}
      <form onSubmit={handleUpdate}>
        <div className="form-group">
          <label>Name</label>
          <input ref={nameRef} required />
        </div>
        <div className="form-group">
          <label>Category</label>
          <select ref={categoryRef}>
            <option>Stationary</option>
            <option>Kitchenware</option>
            <option>Appliance</option>
            <option>Electronics</option>
          </select>
        </div>
        <div className="form-group">
          <label>Price</label>
          <input ref={priceRef} type="number" step="0.01" required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select ref={statusRef}>
            <option>ACTIVE</option>
            <option>INACTIVE</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn-success">Update</button>
          <button type="button" onClick={() => navigate("/")} className="btn-secondary">Back</button>
        </div>
      </form>
    </div>
  );
}
