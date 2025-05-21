import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import "./Profile.css";

function Profile() {
  const [reviews, setReviews] = useState([]);
  const [username, setUsername] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
  
    try {
      const decoded = jwtDecode(token);
    //   console.log(decoded.id);
      const userId = decoded.id;
      setUsername(decoded.username);
  
      const fetchReviews = async () => {
        const res = await fetch(`http://localhost:3001/profiles/${userId}/reviews`);
        const data = await res.json();
  
        // Fetch album info from MusicBrainz for each review
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
              };
            } catch (err) {
              console.error("Failed to fetch album info:", err);
              return {
                ...review,
                albumTitle: "Unknown Title",
                artist: "Unknown Artist",
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
  

  if (!token) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className="ProfilePage">
      <h1>{username}'s profile</h1>
      <h2>Your Reviews</h2>
      {reviews.length === 0 ? (
        <p>You haven't reviewed any albums yet.</p>
      ) : (
        <ul className="ReviewList">
          {reviews.map((review) => (
            <li key={review.id} className="ReviewCard">
              <img
                src={`https://coverartarchive.org/release/${review.album_id}/front-250`}
                onError={(e) =>
                  (e.target.src = "https://via.placeholder.com/250?text=No+Art")
                }
                alt="Cover Art"
              />
              <div>
                <p><strong>Album:</strong> {review.albumTitle}</p>
                <p><strong>Artist:</strong> {review.artist}</p>
                <p><strong>Rating:</strong> {review.rating} ⭐</p>
                <p><strong>Notes:</strong> {review.notes}</p>
                {/* <p><strong>Date Listened:</strong> {review.date_listened.split("T")[0]}</p> */}
                <p><strong>Date Listened:</strong>{" "}
                    {new Date(review.date_listened).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}</p>

              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Profile;
