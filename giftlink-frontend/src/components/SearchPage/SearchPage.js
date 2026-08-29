import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import {urlConfig} from '../../config';

function SearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState('');
    const [ageYears, setAgeYears] = useState(5);
    const [searchResults, setSearchResults] = useState([]);
    const categories = ['Living', 'Living Room', 'Bedroom', 'Kitchen', 'Office', 'Office Furniture'];
    const conditions = ['New', 'Like New', 'Older'];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = `${urlConfig.backendUrl}/api/gifts`;
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
                setSearchResults(await response.json());
            } catch (error) {
                console.error('Fetch error: ' + error.message);
            }
        };
        fetchProducts();
    }, []);

    const runSearch = async () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('name', searchQuery);
        if (category) params.set('category', category);
        if (condition) params.set('condition', condition);
        if (ageYears) params.set('age_years', ageYears);
        const response = await fetch(`${urlConfig.backendUrl}/api/search?${params.toString()}`);
        if (!response.ok) throw new Error('Search request failed');
        setSearchResults(await response.json());
    };

    const navigate = useNavigate();
    const goToDetailsPage = (productId) => {
        navigate(`/app/gifts/${productId}`);
    };

    return (
        <div className="container mt-5">
            <h1>Search gifts</h1>
            <p className="text-muted">Filter community items by name, category, condition, and age.</p>
            <div className="row justify-content-center">
                <div className="col-md-10">
                    <div className="filter-section mb-3 p-3 border rounded">
                        <h5>Filters</h5>
                        <div className="row g-3">
                            <div className="col-md-4">
                                <label className="form-label" htmlFor="gift-name">Gift name</label>
                                <input id="gift-name" className="form-control" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="e.g. table" />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label" htmlFor="category">Category</label>
                                <select id="category" className="form-select" value={category} onChange={(event) => setCategory(event.target.value)}>
                                    <option value="">All categories</option>
                                    {categories.map((value) => <option key={value}>{value}</option>)}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label" htmlFor="condition">Condition</label>
                                <select id="condition" className="form-select" value={condition} onChange={(event) => setCondition(event.target.value)}>
                                    <option value="">Any condition</option>
                                    {conditions.map((value) => <option key={value}>{value}</option>)}
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label" htmlFor="age">Maximum age: {ageYears} years</label>
                                <input id="age" className="form-range" type="range" min="1" max="10" value={ageYears} onChange={(event) => setAgeYears(event.target.value)} />
                            </div>
                        </div>
                        <button className="btn btn-primary mt-3" onClick={() => runSearch().catch(console.error)}>Search</button>
                    </div>
                    {searchResults.length === 0 ? <p>No gifts matched your search.</p> : (
                        <div className="list-group">
                            {searchResults.map((gift) => (
                                <button key={gift.id} className="list-group-item list-group-item-action" onClick={() => goToDetailsPage(gift.id)}>
                                    <strong>{gift.name}</strong> · {gift.category} · {gift.condition}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
