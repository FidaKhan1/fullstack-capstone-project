import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import './DetailsPage.css';

function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGift = async () => {
            try {
                const response = await fetch(`${urlConfig.backendUrl}/api/gifts/${productId}`);
                if (!response.ok) throw new Error('Gift not found');
                setGift(await response.json());
            } catch (requestError) {
                setError(requestError.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();
        window.scrollTo(0, 0);
    }, [productId]);

    const comments = [
        { author: 'Jordan', comment: 'Is this still available?' },
        { author: 'Sam', comment: 'This would be useful in our community room.' },
        { author: 'Taylor', comment: 'Thanks for giving this item a second life!' },
    ];

    if (loading) return <div className="container mt-5">Loading...</div>;
    if (error) return <div className="container mt-5">Error: {error}</div>;

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>Back</button>
            <div className="card product-details-card">
                <div className="card-header text-white"><h1 className="details-title h2">{gift.name}</h1></div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                        {gift.image ? <img src={gift.image} alt={gift.name} /> : <div className="no-image-available-large">No image available</div>}
                    </div>
                    <p><strong>Category:</strong> {gift.category}</p>
                    <p><strong>Condition:</strong> {gift.condition}</p>
                    <p><strong>Date Added:</strong> {new Date(gift.date_added * 1000).toLocaleDateString()}</p>
                    <p><strong>Age:</strong> {gift.age_years} years</p>
                    <p><strong>Description:</strong> {gift.description}</p>
                    <p><strong>Pickup ZIP code:</strong> {gift.zipcode}</p>
                </div>
            </div>
            <section className="comments-section mt-4">
                <h2 className="h3 mb-3">Comments</h2>
                {comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <p className="comment-author"><strong>{comment.author}:</strong></p>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default DetailsPage;
