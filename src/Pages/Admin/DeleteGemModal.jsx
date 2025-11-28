
const DeleteGemModal = ({ gemName, onConfirm, onCancel }) => {

  const modalStyle = {
    width: "90%",
    maxWidth: "500px",
    maxHeight: "auto",
    overflowY: "auto",
    color: "black",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  };

  return (
    <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="modal" style={modalStyle}>
        <h2 style={{ color: "black", marginTop: 0 }}>Delete Gem</h2>
        <p style={{ color: "#333", marginBottom: "20px" }}>
          Are you sure you want to delete <strong>{gemName}</strong>? This action cannot be undone.
        </p>
        <div className="modal-actions" style={{ display: 'flex', gap: '10px' }}>
          <button
            className="admin-btn admin-btn-delete"
            onClick={onConfirm}
            style={{ padding: '8px 16px', background: 'red', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Yes, Delete
          </button>
          <button
            className="admin-btn"
            onClick={onCancel}
            style={{ padding: '8px 16px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGemModal;