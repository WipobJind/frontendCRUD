import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3000/api/item";

export function Items() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const nameRef = useRef();
  const categoryRef = useRef();
  const priceRef = useRef();

  async function loadItems(page = 1) {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}?page=${page}&limit=10`);
      const data = await res.json();
      setItems(data.data || []);
      setPagination(data.pagination || {
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNextPage: false,
        hasPrevPage: false
      });
    } catch (err) {
      console.log("Error:", err);
      setMessage({ type: "error", text: "Failed to load items. Make sure backend is running." });
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
          name: nameRef.current.value,
          category: categoryRef.current.value,
          price: priceRef.current.value,
        }),
      });
      if (res.ok) {
        nameRef.current.value = "";
        priceRef.current.value = "";
        setMessage({ type: "success", text: "Item created!" });
        loadItems(1);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to create item" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to create item" });
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage({ type: "success", text: "Item deleted!" });
        loadItems(pagination.currentPage);
        setTimeout(() => setMessage({ type: "", text: "" }), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to delete item" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete item" });
    }
  }

  useEffect(() => {
    loadItems(1);
  }, []);

  return (
    <div>
      {message.text && <div className={`alert ${message.type}`}>{message.text}</div>}

      <div className="card">
        <h2>Add New Item</h2>
        <form onSubmit={handleCreate} className="form-row">
          <input ref={nameRef} placeholder="Item Name" required />
          <select ref={categoryRef}>
            <option>Stationary</option>
            <option>Kitchenware</option>
            <option>Appliance</option>
            <option>Electronics</option>
          </select>
          <input ref={priceRef} type="number" step="0.01" placeholder="Price" required />
          <button type="submit" className="btn-success">Add</button>
        </form>
      </div>

      <div className="card">
        <h2>Items ({pagination.totalItems || 0})</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>No items found</td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item._id}>
                    <td>{item.itemName}</td>
                    <td>{item.itemCategory}</td>
                    <td>${parseFloat(item.itemPrice).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${item.status}`}>{item.status}</span>
                    </td>
                    <td>
                      <Link to={`/items/${item._id}`} className="btn-primary btn-sm">Edit</Link>
                      <button onClick={() => handleDelete(item._id)} className="btn-danger btn-sm">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div className="pagination">
          <button
            onClick={() => loadItems(pagination.currentPage - 1)}
            disabled={!pagination.hasPrevPage}
          >
            Prev
          </button>
          <span>Page {pagination.currentPage || 1} of {pagination.totalPages || 1}</span>
          <button
            onClick={() => loadItems(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}