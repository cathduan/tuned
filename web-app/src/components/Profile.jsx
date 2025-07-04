/**
 * @file Profile.jsx
 * @description Profile page that displays a logged-in user's reviews and allows them to delete or edit their entries.
 * Fetches reviews from backend and album metadata from MusicBrainz API.
 * @authors Cathy Duan, Charlie Ney
 * @date 6/9/25
 */

import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  // State variables
  const [reviews, setReviews] = useState([]);
  const [username, setUsername] = useState("");
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Icons
  const editButton = "/edit.png";
  const deleteButton = "/delete.png";

  // Fetch and decode token on mount to get user ID and username, then fetch all reviews and related album info.
  useEffect(() => {
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      setUsername(decodedToken.username);
      // Fetch user reviews
      const fetchReviews = async () => {
        const res = await fetch(`http://localhost:3001/profiles/${userId}/reviews`);
        const data = await res.json();
        // For each review, fetch album metadata from MusicBrainz API
        const reviewsWithAlbumData = await Promise.all(
          data.map(async (review) => {
            try {
              const albumRes = await fetch(
                `https://musicbrainz.org/ws/2/release/${review.album_id}?inc=artist-credits+release-groups&fmt=json`
              );
              const albumData = await albumRes.json();
              return {
                ...review,
                albumTitle: albumData.title,
                artist: albumData["artist-credit"]?.map((a) => a.name).join(", "),
                albumInfo: albumData,
              };
            } catch (err) {
              // Fallback if MusicBrainz fetch fails
              return {
                ...review,
                albumTitle: "Unknown Title",
                artist: "Unknown Artist",
                albumInfo: null,
              };
            }
          })
        );
        setReviews(reviewsWithAlbumData);
      };

      fetchReviews();
    } catch (err) {
      console.error("Invalid token or failed to fetch reviews:", err);
    }
  }, [token]);

  /**
   * Deletes a review from the backend after confirmation.
   * @param {string} reviewId - id of the review to delete
   */
  const handleDelete = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`http://localhost:3001/reviews/${reviewId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      } else {
        alert("Failed to delete review");
      }
    } catch (err) {
      alert("Error deleting review");
    }
  };

  /**
   * Navigate to album detail page with review data for editing.
   * @param {object} review - Review chosen to edit
   */
  const handleEditClick = (review) => {
    navigate(`/album/${review.album_id}`, {
      state: {
        editReview: {
          id: review.id,
          rating: review.rating,
          notes: review.notes,
          date_listened: review.date_listened.split("T")[0],
        },
      },
    });
  };

  // Redirect if not logged in
  if (!token) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="profile-page">
      <h1>{username}'s profile</h1>
      <h2>Your Reviews</h2>

      {reviews.length === 0 ? (
        <p>You haven't reviewed any albums yet.</p>
      ) : (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.id} className="review-card">
              {/* Edit/Delete Buttons */}
              <div className="top-right-buttons">
                <button onClick={() => handleEditClick(review)}>
                  <img src={editButton} alt="edit" style={{ height: "1.5rem", width: "1.5rem" }} />
                </button>
                <button onClick={() => handleDelete(review.id)}>
                  <img src={deleteButton} alt="delete" style={{ height: "1.5rem", width: "1.5rem" }} />
                </button>
              </div>

              {/* Album Info Display */}
              <div>
                <img
                  src={`https://coverartarchive.org/release/${review.album_id}/front-250`}
                  onError={(e) => (e.target.src = "/album_notfound.png")}
                  alt="Cover Art"
                />
                <p>
                  <strong>Album:</strong>{" "}
                  <button
                    className="album-link"
                    onClick={() => setSelectedAlbum(review.albumInfo)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "black",
                      cursor: "pointer",
                      padding: 0,
                      fontSize: "inherit",
                      textDecoration: "underline",
                    }}
                  >
                    {review.albumTitle}
                  </button>
                </p>
                <p><strong>Artist:</strong> {review.artist}</p>
                <p><strong>Rating:</strong> {review.rating} ⭐</p>
                <p><strong>Notes:</strong> {review.notes}</p>
                <p>
                  <strong>Date Listened:</strong>{" "}
                  {new Date(review.date_listened).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Modal: Album Info */}
      {selectedAlbum && (
        <div className="modal-overlay" onClick={() => setSelectedAlbum(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedAlbum.title}</h2>
            <p>
              <strong>Artist(s):</strong>{" "}
              {selectedAlbum["artist-credit"]?.map((a) => a.name).join(", ")}
            </p>
            <p>
              <strong>Release Date:</strong> {selectedAlbum.date}
            </p>
            <p>
              <strong>Release Group:</strong> {selectedAlbum["release-group"]?.title}
            </p>
            <button onClick={() => setSelectedAlbum(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
