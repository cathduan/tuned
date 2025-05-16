import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {jwtDecode} from 'jwt-decode';
import StarRating from "./Star"
import "./AlbumDetails.css";

export const AlbumDetails = () => {
    const { id } = useParams();
    const [album, setAlbum] = useState(null);
    const [rating, setRating] = useState(0)
    const [notes, setNotes] = useState('');
    const [dateListened, setDateListened] = useState('');

    // const userId = localStorage.getItem("userId"); 
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userId = decoded.id;
    


    useEffect(() => {
        const fetchAlbum = async () => {
        try {
            const res = await fetch(
            `https://musicbrainz.org/ws/2/release-group/${id}?inc=artist-credits+releases&fmt=json`
            );
            const data = await res.json();
            setAlbum(data);
        } catch (err) {
            console.error("Failed to fetch album details!!!!", err);
        }
        };

        fetchAlbum();
    }, [id]);

    if (!album) return <p>Loading album info...</p>;

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const res = await fetch('http://localhost:3001/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId,
                    albumId: album.id,
                    rating,
                    notes,
                    dateListened
                })
            });
    
            if (!res.ok) throw new Error('Failed to save review');
    
            alert('Review saved!');
        } catch (err) {
            console.error(err);
            alert('Error saving review');
        }
    };
    

    return (
        <div className="AlbumReviewContainer">
            <div className="AlbumDetail">
                <h2>{album.title}</h2>
                <p><strong>Artist:</strong> {album["artist-credit"]?.map(a => a.name).join(", ")}</p>
                <p><strong>First Release Date:</strong> {album["first-release-date"]}</p>
                <p><strong>Number of Releases:</strong> {album.releases?.length}</p>
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
                    type="date" className="date-input"
                    value={dateListened}
                    onChange={(e) => setDateListened(e.target.value)}
                    />
                </section>

                <button type="submit">Save Review</button>
                </form>
            </div>
        </div>

    );
};
