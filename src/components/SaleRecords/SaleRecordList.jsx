import React, { useState, useEffect } from 'react';
import { saleRecordAPI } from '../../services/api';
import '../../styles/sales.css';

const SaleRecordList = ({ userId, onAddNew, onEditSale }) => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadSales();
    }, [userId]);

    const loadSales = async () => {
        try {
            setLoading(true);
            const response = await saleRecordAPI.getSalesByUser(userId);
            console.log('🔍 Sale Records:', response.data);
            setSales(response.data || []);
        } catch (error) {
            console.error('❌ Error loading sale records:', error);
            setMessage('Failed to load sale records');
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this sale record?')) {
            return;
        }

        try {
            await saleRecordAPI.deleteSale(id);
            setMessage('Sale record deleted successfully');
            loadSales();
        } catch (error) {
            console.error('❌ Error deleting sale record:', error);
            setMessage('Failed to delete sale record');
        }
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'MAATU_SAANAM': 'Organic Manure',
            'GRASS_FEED': 'Cattle Feed',
            'MILK_PRODUCT': 'Dairy Products', 
            'OTHER': 'Other Products'
        };
        return labels[category] || category;
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'MAATU_SAANAM': '🐄',
            'GRASS_FEED': '🌿',
            'MILK_PRODUCT': '🥛',
            'OTHER': '📦'
        };
        return icons[category] || '📊';
    };

    const getCategoryColor = (category) => {
        const colors = {
            'MAATU_SAANAM': '#4f46e5',
            'GRASS_FEED': '#10b981',
            'MILK_PRODUCT': '#f59e0b',
            'OTHER': '#6b7280'
        };
        return colors[category] || '#6b7280';
    };

    const filteredSales = filter === 'ALL' ? sales : sales.filter(sale => sale.category === filter);

    // Calculate stats
    const totalSales = filteredSales.length;
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.price, 0);
    const avgSale = totalSales > 0 ? totalRevenue / totalSales : 0;

    if (loading) {
        return (
            <div className="loading">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Loading sale records...</p>
            </div>
        );
    }

    return (
        <div className="sale-records-container">
            {/* Header */}
            <div className="sale-header">
                <h1><i className="fas fa-chart-line"></i> My Purchases</h1>
                <p>Track and manage your farm product sales</p>
            </div>

            {message && (
                <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* Stats Cards */}
            <div className="sales-stats-grid">
                <div className="stat-card total-sales">
                    <div className="stat-value">{totalSales}</div>
                    <div className="stat-label">Total Purchases</div>
                </div>
                
                <div className="stat-card total-revenue">
                    <div className="stat-value">₹{totalRevenue.toFixed(2)}</div>
                    <div className="stat-label">Total Amount</div>
                </div>
                
                <div className="stat-card avg-sale">
                    <div className="stat-value">₹{avgSale.toFixed(2)}</div>
                    <div className="stat-label">Average Purchase</div>
                </div>
            </div>

            {/* Category Filter */}
            <div className="session-filter">
                <div className="filter-label">Category Filter:</div>
                <div className="filter-options">
                    <button 
                        className={`filter-option ${filter === 'ALL' ? 'active' : ''}`}
                        onClick={() => setFilter('ALL')}
                    >
                        All Categories
                    </button>
                    <button 
                        className={`filter-option ${filter === 'MAATU_SAANAM' ? 'active' : ''}`}
                        onClick={() => setFilter('MAATU_SAANAM')}
                    >
                        🐄 Organic Manure
                    </button>
                    <button 
                        className={`filter-option ${filter === 'GRASS_FEED' ? 'active' : ''}`}
                        onClick={() => setFilter('GRASS_FEED')}
                    >
                        🌿 Cattle Feed
                    </button>
                    <button 
                        className={`filter-option ${filter === 'MILK_PRODUCT' ? 'active' : ''}`}
                        onClick={() => setFilter('MILK_PRODUCT')}
                    >
                        🥛 Dairy Products
                    </button>
                    <button 
                        className={`filter-option ${filter === 'OTHER' ? 'active' : ''}`}
                        onClick={() => setFilter('OTHER')}
                    >
                        📦 Other Products
                    </button>
                </div>
            </div>

            {/* Purchase Cards Section */}
            {filteredSales.length === 0 ? (
                <div className="empty-state">
                    <h3>No Purchase Records Found</h3>
                    <p>
                        {filter === 'ALL' 
                            ? "You haven't recorded any purchases yet. Start by adding your first purchase record." 
                            : `No purchases found in the ${getCategoryLabel(filter)} category.`}
                    </p>
                    <button className="btn btn-primary add-sale-btn" onClick={onAddNew}>
                       Add Purchase
                    </button>
                </div>
            ) : (
                <div className="purchase-cards-container">
                    <div className="purchase-cards-header">
                        <h3>Purchase Summary</h3>
                        <div className="purchase-summary-stats">
                            <span>Total Purchases: {filteredSales.length}</span>
                            <span>Total Amount: ₹{totalRevenue.toFixed(2)}</span>
                            <span>Average Purchase: ₹{avgSale.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <div className="purchase-cards-grid">
                        {filteredSales.map((sale) => (
                            <div 
                                key={sale.id} 
                                className="purchase-card"
                                style={{ borderTopColor: getCategoryColor(sale.category) }}
                            >
                                <div className="purchase-card-header">
                                    <div className="purchase-category">
                                        <span className="category-icon">{getCategoryIcon(sale.category)}</span>
                                        <span className="category-name">{getCategoryLabel(sale.category)}</span>
                                    </div>
                                    <div className="purchase-actions">
                                        <button 
                                            className="action-btn edit"
                                            onClick={() => onEditSale(sale)}
                                            title="Edit Purchase"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button 
                                            className="action-btn delete"
                                            onClick={() => handleDelete(sale.id)}
                                            title="Delete Purchase"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="purchase-card-body">
                                    <div className="purchase-amount">
                                        ₹{sale.price.toFixed(2)}
                                    </div>
                                    <div className="purchase-date">
                                        {new Date(sale.date).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </div>
                                </div>
                                
                                <div className="purchase-card-footer">
                                    <div className="purchase-status">
                                        <span className="status-dot"></span>
                                        Completed
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add Purchase Button */}
            {filteredSales.length > 0 && (
                <div className="add-purchase-section">
                    <button className="btn btn-primary add-purchase-btn" onClick={onAddNew}>
                        <i className="fas fa-plus"></i> Add Purchase
                    </button>
                </div>
            )}
        </div>
    );
};

export default SaleRecordList;