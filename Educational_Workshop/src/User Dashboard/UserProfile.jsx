import { useEffect, useState } from "react";
import axios from "axios";

const UPDATE_PROFILE_URL = `${import.meta.env.VITE_API_URL || ""}/studentapi/updateprofile`;

export default function UserProfile({
  profileName,
  profileUsername,
  profileEmail,
  profileContact,
  onUpdateProfile,
  onBack,
}) {
  const [editName, setEditName] = useState(profileName || "");
  const [editContact, setEditContact] = useState(profileContact || "");
  const [warning, setWarning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setEditName(profileName || "");
  }, [profileName]);

  useEffect(() => {
    setEditContact(profileContact || "");
  }, [profileContact]);

  return (
    <section className="section">
      <div className="section-header">
        <h3>User Settings</h3>
      </div>
      <div className="resource-grid">
        <div className="resource-card">
          <p className="muted">Username</p>
          <h4>{profileUsername || "Not set"}</h4>
        </div>
        <div className="resource-card">
          <p className="muted">Email</p>
          <h4>{profileEmail || "Not set"}</h4>
        </div>
        <div className="resource-card">
          <p className="muted">Name</p>
          <h4>{profileName || "Student"}</h4>
        </div>
        <div className="resource-card">
          <p className="muted">Contact</p>
          <h4>{profileContact || "Not set"}</h4>
        </div>
      </div>
      <form
        className="auth-form"
        onSubmit={(event) => {
          event.preventDefault();
          if (isSubmitting) {
            return;
          }
          setWarning("");
          setSuccessMessage("");
          const payload = {
            username: profileUsername,
            name: editName,
            contact: editContact,
          };
          setIsSubmitting(true);
          axios
            .post(UPDATE_PROFILE_URL, payload)
            .then(() => {
              if (onUpdateProfile) {
                onUpdateProfile({
                  name: editName,
                  contact: editContact,
                });
              }
              setSuccessMessage("Profile updated successfully.");
            })
            .catch(() => {
              setWarning("Unable to update profile. Please try again.");
            })
            .finally(() => {
              setIsSubmitting(false);
            });
        }}
      >
        <label className="field">
          <span>Update Name</span>
          <input
            type="text"
            placeholder="Your name"
            value={editName}
            onChange={(event) => setEditName(event.target.value)}
            required
          />
        </label>
        <label className="field">
          <span>Update Contact</span>
          <input
            type="tel"
            placeholder="Your contact number"
            value={editContact}
            onChange={(event) => setEditContact(event.target.value)}
            required
          />
        </label>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        {warning && <div className="error-message">{warning}</div>}
        <div className="portal-section">
          <button className="primary" type="submit">
            {isSubmitting ? "Saving..." : "Save Changes"}
            <span className="arrow">→</span>
          </button>
          <button className="change-btn" type="button" onClick={onBack}>
            Back
          </button>
        </div>
      </form>
    </section>
  );
}