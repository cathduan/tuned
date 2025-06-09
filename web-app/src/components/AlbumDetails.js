/**
 * @file AlbumDetails.js
 * @description Fetches the logged-in user's reviews and displays them with options to edit and delete them. 
 * @authors Cathy, Charlie
 * @date 6/8/25
 */
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import StarRating from "./Star";
import "./AlbumDetails.css";

export const AlbumDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const editReview = location.state?.editReview; 
  const previousSearchState = location.state?.previousSearchState;  // Save previous search state if present

  const [album, setAlbum] = useState(null);
  const [rating, setRating] = useState(editReview ? Number(editReview.rating) : 0);
  const [notes, setNotes] = useState(editReview ? editReview.notes : "");
  const [dateListened, setDateListened] = useState(editReview ? editReview.date_listened : "");
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  const getCoverArtUrl = (releaseId) =>
    `https://coverartarchive.org/release/${releaseId}/front-250`;

  const PLACEHOLDER_IMG = "/album_notfound.png";

   /**
  * Fetches the album information
  * @param {Integer} id - the release id of the album
  * @return {String} album details
  */
  useEffect(() => {
  const fetchAlbum = async () => {
    try {
      // First try as release ID
      let res = await fetch(
        `https://musicbrainz.org/ws/2/release/${id}?inc=artist-credits+release-groups&fmt=json`
      );
      
      // If 404, try as release-group ID
      if (!res.ok) {
        const rgRes = await fetch(
          `https://musicbrainz.org/ws/2/release-group/${id}?inc=artists&fmt=json`
        );
        const rgData = await rgRes.json();
        
        // Get first release in this group
        const releasesRes = await fetch(
          `https://musicbrainz.org/ws/2/release?release-group=${id}&fmt=json&limit=1`
        );
        const releasesData = await releasesRes.json();
        
        if (releasesData.releases?.length > 0) {
          const releaseRes = await fetch(
            `https://musicbrainz.org/ws/2/release/${releasesData.releases[0].id}?inc=artist-credits+release-groups&fmt=json`
          );
          setAlbum(await releaseRes.json());
          return;
        }
      }
      
      setAlbum(await res.json());
    } catch (err) {
      console.error("Failed to fetch album details:", err);
    }
  };

  fetchAlbum();
}, [id]);

  if (!album) return <p>Loading album info...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (editReview) {
        // Update existing review
        res = await fetch(`http://localhost:3001/reviews/${editReview.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            notes,
            date_listened: dateListened,
          }),
        });
      } else {
        // Create new review
        res = await fetch("http://localhost:3001/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            albumId: album.id,
            rating,
            notes,
            dateListened,
          }),
        });
      }

      if (!res.ok) throw new Error("Failed to save review");
      navigate('/');
      setMessage("Review saved!");
    } catch (err) {
      console.error(err);
      setMessage("Error saving review");
    }
  };

  // Back button handler
  const handleBack = () => {
    navigate("/", { state: previousSearchState });
  };

  const backbutton = "/backbutton.png";

  return (
    <div className="AlbumDetailsCenter">
      <div className="AlbumReviewContainer">
        <button
          onClick={handleBack}
          style={{
            alignSelf: "flex-start",
            marginBottom: "1rem",
            background: "#b8c0ff",
            color: "#22223b",
            border: "none",
            borderRadius: "12px",
            padding: "0.5rem 1.2rem",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <img
        src={backbutton}
        alt="Back"
        style={{ height: "2rem", width: "2rem" }}
          />
        </button>
        <div className="AlbumDetail">
          <img
            src={getCoverArtUrl(album.id)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = PLACEHOLDER_IMG;
            }}
            alt="Cover Art"
          />
          <h2>{album.title}</h2>
          <p>
            <strong>Artist:</strong>{" "}
            {album["artist-credit"]?.map((a) => a.name).join(", ") ||
              "Unknown Artist"}
          </p>
          <p>
            <strong>Release Date:</strong> {album.date || "Unknown Date"}
          </p>
          <p>
            <strong>Release Type:</strong>{" "}
            {album["release-group"]?.["primary-type"] || "Unknown Type"}
          </p>
        </div>

        <div className="ReviewSection">
          <section className="Rating">
            <h2>Star Rating</h2>
            <StarRating rating={rating} setRating={setRating} />
          </section>

          <form onSubmit={handleSubmit}>
            <section className="Notes">
              <h2>Notes about the album</h2>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your notes..."
              />
            </section>

            <section className="DateListened">
              <h2>Date Listened</h2>
              <input
                type="date"
                className="date-input"
                value={dateListened}
                onChange={(e) => setDateListened(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
              />
            </section>

            <button type="submit">Save Review</button>
            {message && (
              <div className={`review-message ${message === "Review saved!" ? "success" : "error"}`}>
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
