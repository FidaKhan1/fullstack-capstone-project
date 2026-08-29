import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {urlConfig} from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGifts = async () => {
            const response = await fetch(`${urlConfig.backendUrl}/api/gifts`);
            if (!response.ok) throw new Error('Unable to load gifts');
            setGifts(await response.json());
        };
        fetchGifts().catch(console.error);
    }, []);

    const goToDetailsPage = (productId) => {
        navigate(`/app/gifts/${productId}`);
    };

    const formatDate = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const getConditionClass = (condition) => {
        return condition === "New" ? "list-group-item-success" : "list-group-item-warning";
    };

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-end mb-4">
                <div>
                    <p className="text-uppercase text-primary fw-bold mb-1">Community sharing</p>
                    <h1>Available gifts</h1>
                    <p className="text-muted mb-0">Find something useful and give it a second life.</p>
                </div>
                <button className="btn btn-outline-primary" onClick={() => navigate('/app/search')}>Search gifts</button>
            </div>
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card product-card">

                            <div className="image-placeholder">
                                {gift.image ? <img src={gift.image} alt={gift.name} /> : <div className="no-image-available">No image available</div>}
                            </div>

                            <div className="card-body">
                                <h2 className="h5 card-title">{gift.name}</h2>
                                <p className="text-muted">{gift.category}</p>

                                <p className={`card-text ${getConditionClass(gift.condition)}`}>
                                    {gift.condition}
                                </p>
                                <p className="card-text">{gift.description}</p>
                                <p className="date-added text-muted">Added {formatDate(gift.date_added)}</p>

                                <button onClick={() => goToDetailsPage(gift.id)} className="btn btn-primary">
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;
