import { useState } from "react";
import CreateGemForm from "./CreateGem";
import RateGemForm from "./RateGem";

const AddPlace = () => {
  const [createdGemId, setCreatedGemId] = useState(null);
  const [gemName, setGemName] = useState(""); // Optional: pass name to step 2 for better UX

  // Callback when Step 1 finishes
  const handleGemCreated = (id, name) => {
    setCreatedGemId(id);
    setGemName(name);
  };

  return (
    <div className="footer-page-wrapper">
      <div className="footer-page-container">
        {/* Dynamic Title based on step */}
        <h1 className="footer-page-title">
          {!createdGemId ? "Add Your Place" : "Rate this Place"}
        </h1>

        <div className="footer-page-content">
          {!createdGemId ? (
            // --- STEP 1 ---
            <>
              <p className="mb-6">
                Is your business missing from Gemsy? Add it now to start connecting with customers.
              </p>
              <CreateGemForm onGemCreated={handleGemCreated} />
            </>
          ) : (
            // --- STEP 2 ---
            <>
              <p className="mb-6">
                How would you rate your experience at <strong>{gemName}</strong>?
              </p>
              <RateGemForm gemId={createdGemId} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddPlace;