import { useEffect, useState } from "react";
import axios from "axios";

const UPDATE_PROFILE_URL = `${import.meta.env.VITE_API_URL || ""}/studentapi/updateprofile`;
const DELETE_PROFILE_URL = `${import.meta.env.VITE_API_URL || ""}/studentapi/deletestudent`;

export default function UserProfile({
  profileName,
  profileUsername,
  profileEmail,
  profileContact,
  onUpdateProfile,
  onDeleteAccount,
  onBack,
}) {
  const [editName, setEditName] = useState(profileName || "");
  const [editContact, setEditContact] = useState(profileContact || "");
  const [warning, setWarning] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    setEditName(profileName || "");
  }, [profileName]);

  useEffect(() => {
    setEditContact(profileContact || "");
  }, [profileContact]);

  const handleDeleteAccount = async () => {
    if (isDeleting) {
      return;
    }

    setWarning("");
    setSuccessMessage("");

    if (!profileUsername) {
      setWarning("Unable to delete account. Username is missing.");
      return;
    }

    const shouldDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!shouldDelete) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${DELETE_PROFILE_URL}/${profileUsername}`
      );
      setSuccessMessage(
        response?.data || "Student Account Deleted Successfully"
      );
      if (onDeleteAccount) {
        onDeleteAccount();
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setWarning("Student Account Not Found");
      } else if (error.response?.data) {
        setWarning(
          typeof error.response.data === "string"
            ? error.response.data
            : "Unable to delete account. Please try again."
        );
      } else if (error.request) {
        setWarning("Network error. Please try again.");
      } else {
        setWarning("Unable to delete account. Please try again.");
      }
    } finally {
      setIsDeleting(false);
    }
  };

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
        <div className="portal-section delete-section">
          <button
            className="danger-button"
            type="button"
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </form>
    </section>
  );
}