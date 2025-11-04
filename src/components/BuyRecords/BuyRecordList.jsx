import React, { useState, useEffect } from 'react';
import { buyRecordAPI } from '../../services/api';
import '../../styles/components.css';

const BuyRecordList = ({ userId, onAddNew, onEditBuy }) => {
    const [buys, setBuys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadBuys();
    }, []);

    const loadBuys = async () => {
        try {
            setLoading(true);
            const response = await buyRecordAPI.getUserBuys(userId);
            console.log('🔍 Buy Records:', response.data);
            setBuys(response.data || []);
        } catch (error) {
            console.error('❌ Error loading buy records:', error);
            setMessage('Failed to load buy records');
            setBuys([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this buy record?')) {
            return;
        }

        try {
            await buyRecordAPI.deleteBuy(id, userId);
            setMessage('Buy record deleted successfully');
            loadBuys();
        } catch (error) {
            console.error('❌ Error deleting buy record:', error);
            setMessage('Failed to delete buy record');
        }
    };

    const getCategoryLabel = (productName) => {
        const labels = {
            'MAATU_SAANAM': '🐄 Organic Manure',
            'GRASS_FEED': '🌿 Cattle Feed',
            'MILK_PRODUCT': '🥛 Dairy Products', 
            'OTHER': '📦 Other Products'
        };
        return labels[productName] || productName;
    };

    if (loading) {
        return (
            <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading buy records...</p>
            </div>
        );
    }

    return (
        <div className="section-container">
            {/* Header Section */}
            <div className="section-header">
                <div className="header-content">
                    <h2><i className="fas fa-shopping-cart"></i> My Purchases</h2>
                </div>
                    
                <button className="btn-pr" onClick={onAddNew}>
                    <i className="fas fa-plus"></i> Add Purchase
                </button>
            </div>

            {/* Message Display */}
            {message && (
                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {buys.length === 0 ? (
                /* Empty State */
                <div className="empty-state">
                    {/* <i className="fas fa-shopping-cart"></i> */}
                    <h3>No Purchase Records</h3>
                    <p>You haven't recorded any purchases yet.</p>
                    <button className="btn-pr" onClick={onAddNew}>
                        + Add Your First Purchase
                    </button>
                </div>
            ) : (
                /* Records with Data */
                <>
                    {/* Summary Card */}
                    <div className="summary-card">
                        <h4>Purchase Summary</h4>
                        <div className="summary-stats">
                            <div className="stat">
                                <span className="stat-label">Total Purchases:</span>
                                <span className="stat-value">{buys.length}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Total Amount:</span>
                                <span className="stat-value">₹{buys.reduce((sum, buy) => sum + buy.price, 0).toFixed(2)}</span>
                            </div>
                            <div className="stat">
                                <span className="stat-label">Average Purchase:</span>
                                <span className="stat-value">₹{(buys.reduce((sum, buy) => sum + buy.price, 0) / buys.length).toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Purchase Records Grid */}
                    <div className="records-grid">
                        {buys.map((buy) => (
                            <div key={buy.id} className="record-card">
                                <div className="record-header">
                                    <div className="record-category">
                                        {getCategoryLabel(buy.productName)}
                                    </div>
                                    <div className="record-actions">
                                        <button 
                                            className="action-btn edit"
                                            onClick={() => onEditBuy(buy)}
                                            title="Edit Record"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="action-btn delete"
                                            onClick={() => handleDelete(buy.id)}
                                            title="Delete Record"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="record-details">
                                    <div className="record-price">
                                        <i className="fas fa-rupee-sign"></i>
                                        {buy.price.toFixed(2)}
                                    </div>
                                    <div className="record-date">
                                        <i className="fas fa-calendar"></i>
                                        {new Date(buy.date).toLocaleDateString('en-IN')}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default BuyRecordList;