/**
 * @file AlbumDetails.js
 * @description Album's metadata is fetched from Musicbrainz API and selected metadata is displayed.
 * Users can review the album with stars, notes, and document a time of listen. 
 * @authors Cathy, Charlie
 * @date 6/9/25
 */
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import StarRating from "./Star";
import "./AlbumDetails.css";

export const AlbumDetails = () => {
  const { id } = useParams(); // Release id of an album
  const location = useLocation();
  const navigate = useNavigate();
  const editReview = location.state?.editReview; 
  const previousSearchState = location.state?.previousSearchState;  // Save previous search state if present

  const [album, setAlbum] = useState(null);
  const [rating, setRating] = useState(editReview ? Number(editReview.rating) : 0);
  const [notes, setNotes] = useState(editReview ? editReview.notes : "");
  const [dateListened, setDateListened] = useState(editReview ? editReview.date_listened : "");
  const [message, setMessage] = useState("");

  // Decodes the retrieved JWT token from localStorage to extract the user id
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.id;

  /**
  * Creates the cover art url for the given release id. Uses the Cover Art Archive.
  * @param {String} releaseId - The MusicBrainz release id of the album.
  * @returns {String} - The cover art image url.
  */
  const getCoverArtUrl = (releaseId) =>
    `https://coverartarchive.org/release/${releaseId}/front-250`;

  const PLACEHOLDER_IMG = "/album_notfound.png";

  /**
  * Fetches the album metadata.
  * @param {String} id - The release id of the album.
  * @return {String} Album details.
  */
  useEffect(() => {
  const fetchAlbum = async () => {
    try {
      let res = await fetch( // First try as release ID
        `https://musicbrainz.org/ws/2/release/${id}?inc=artist-credits+release-groups&fmt=json`
      );
      if (!res.ok) { // If 404, try as release-group ID
        const rgRes = await fetch(
          `https://musicbrainz.org/ws/2/release-group/${id}?inc=artists&fmt=json`
        );
        const rgData = await rgRes.json();
        const releasesRes = await fetch( // Get first release in this group
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

  /**
   * When submit button is clicked, posts a review in the backend database or updates an existing review.
   * @param {Event} e - The form submission event click.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let res;
      if (editReview) { // Update existing review by sending a PUT request to update
        res = await fetch(`http://localhost:3001/reviews/${editReview.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rating,
            notes,
            date_listened: dateListened,
          }),
        });
      } else { // Create new review by sending a POST request
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
      setMessage("Review saved!");
    } catch (err) {
      console.error(err);
      setMessage("Error saving review");
    }
  };

  // Back button handler. Navigates back to the home page.
  const handleBack = () => {
    navigate("/", { state: previousSearchState });
  };

  const backbutton = "/backbutton.png";

  return (
    <div className="AlbumDetailsCenter">
      <div className="AlbumReviewContainer">
        <button onClick={handleBack} className="back-button">
          <img src={backbutton} 
            alt="Back" 
            className = "back-button-icon"/>
        </button>
        <div className="album-detail">
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
          <section className="rating">
            <h2>Star Rating</h2>
            <StarRating rating={rating} setRating={setRating} />
          </section>

          <form onSubmit={handleSubmit}>
            <section className="notes">
              <h2>Notes about the album</h2>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter your notes..."
              />
            </section>

            <section className="date-listened">
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

export default AlbumDetails;