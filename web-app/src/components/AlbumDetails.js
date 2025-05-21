import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import StarRating from "./Star";
import "./AlbumDetails.css";

export const AlbumDetails = () => {
  const { id } = useParams(); //release.id
  const [album, setAlbum] = useState(null);
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState("");
  const [dateListened, setDateListened] = useState("");

  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const userId = decoded.id;

  const getCoverArtUrl = (releaseId) =>
    `https://coverartarchive.org/release/${releaseId}/front-250`;

  const PLACEHOLDER_URL = "https://via.placeholder.com/250?text=No+Art";

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await fetch(
          `https://musicbrainz.org/ws/2/release/${id}?inc=artist-credits+release-groups&fmt=json`
        );
        const data = await res.json();
        setAlbum(data);
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
      const res = await fetch("http://localhost:3001/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          albumId: album.id,
          rating,
          notes,
          dateListened,
        }),
      });

      if (!res.ok) throw new Error("Failed to save review");

      alert("Review saved!");
    } catch (err) {
      console.error(err);
      alert("Error saving review");
    }
  };

  return (
    <div className="AlbumReviewContainer">
      <div className="AlbumDetail">
        <img
          src={getCoverArtUrl(album.id)}
          onError={(e) => (e.target.src = PLACEHOLDER_URL)}
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
        </form>
      </div>
    </div>
  );
};
