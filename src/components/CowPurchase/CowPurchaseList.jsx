import React, { useState, useEffect } from 'react';
import { cowPurchaseAPI } from '../../services/api';
import '../../styles/cow-purchase.css';

const CowPurchaseList = ({ userId, onAddNew, onEditPurchase }) => {
    const [purchases, setPurchases] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadPurchases();
    }, [userId]);

    const loadPurchases = async () => {
        try {
            const response = await cowPurchaseAPI.getUserPurchases(userId);
            if (Array.isArray(response.data)) {
                setPurchases(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setPurchases(response.data.data);
            } else {
                setPurchases([]);
            }
        } catch (error) {
            setMessage('Failed to load purchases');
            setPurchases([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this purchase record?')) {
            return;
        }

        try {
            await cowPurchaseAPI.deleteCowPurchase(id, userId);
            setMessage('Purchase record deleted successfully');
            loadPurchases();
        } catch (error) {
            setMessage('Failed to delete purchase record');
        }
    };

    const calculateTotals = () => {
        return {
            totalCows: purchases.reduce((sum, purchase) => sum + purchase.quantity, 0),
            totalAmount: purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0),
            avgPricePerCow: purchases.length > 0 ? 
                purchases.reduce((sum, purchase) => sum + purchase.totalAmount, 0) / 
                purchases.reduce((sum, purchase) => sum + purchase.quantity, 0) : 0,
            purchaseCount: purchases.length
        };
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <i className="fas fa-spinner fa-spin"></i>
                </div>
                <p>Loading purchase records...</p>
            </div>
        );
    }

    const totals = calculateTotals();

    return (
        <div className="dashboard-container">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="header-title">
                        <i className="fas fa-cow"></i>
                        <h1>Cow Purchase Management</h1>
                    </div>
                    <button className="btn-pr" onClick={onAddNew}>
                        {/* <i className="fas fa-plus"></i> */}
                       +  Add New Purchase
                    </button>
                </div>
            </div>

            {/* Alert Message */}
            {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
                    <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                    {message}
                </div>
            )}

            {/* Statistics Cards */}
            <div className="stats-grid">
                <div className="stat-card primary">
                    {/* <div className="stat-icon">
                        <i className="fas fa-cow"></i>
                    </div> */}
                    <div className="stat-content">
                        <h3>{totals.totalCows}</h3>
                        <p>Total Cows</p>
                    </div>
                </div>

                <div className="stat-card success">
                    {/* <div className="stat-icon">
                        <i className="fas fa-money-bill-wave"></i>
                    </div> */}
                    <div className="stat-content">
                        <h3>{totals.totalAmount.toLocaleString('en-IN')}</h3>
                        <p>Total Investment</p>
                    </div>
                </div>

                <div className="stat-card warning">
                    {/* <div className="stat-icon">
                        <i className="fas fa-calculator"></i>
                    </div> */}
                    <div className="stat-content">
                        <h3>{totals.avgPricePerCow.toLocaleString('en-IN', {maximumFractionDigits: 0})}</h3>
                        <p>Avg Price/Cow</p>
                    </div>
                </div>

                <div className="stat-card info">
                    {/* <div className="stat-icon">
                        <i className="fas fa-list"></i>
                    </div> */}
                    <div className="stat-content">
                        <h3>{totals.purchaseCount}</h3>
                        <p>Total Purchases</p>
                    </div>
                </div>
            </div>

            {/* Purchase List */}
            {purchases.length === 0 ? (
                <div className="empty-state">
                    {/* <div className="empty-icon">
                        <i className="fas fa-cow"></i>
                    </div> */}
                    <h3>No Purchase Records Found</h3>
                    <p>Start tracking your cow purchases by adding your first record</p>
                    <button className="btn btn-primary" onClick={onAddNew}>
                        Add First Purchase
                    </button>
                </div>
            ) : (
                <div className="table-container">
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Salesman</th>
                                    <th>Place</th>
                                    <th>Quantity</th>
                                    <th>Total Amount</th>
                                    <th>Price/Cow</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchases.map((purchase) => (
                                    <tr key={purchase.id}>
                                        <td>
                                            <div className="date-cell">
                                                <div className="date-main">
                                                    {new Date(purchase.date).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short'
                                                    })}
                                                </div>
                                                <div className="date-year">
                                                    {new Date(purchase.date).getFullYear()}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="salesman-cell">
                                                <i className="fas fa-user-tie"></i>
                                                {purchase.salesmanName}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="place-cell">
                                                <i className="fas fa-map-marker-alt"></i>
                                                {purchase.purchasePlace}
                                            </div>
                                        </td>
                                        <td className="number-cell">
                                            <span className="quantity-badge">
                                                {purchase.quantity}
                                            </span>
                                        </td>
                                        <td className="amount-cell">
                                            {purchase.totalAmount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="number-cell">
                                            ₹{((purchase.totalAmount / purchase.quantity)).toLocaleString('en-IN', {maximumFractionDigits: 0})}
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <button 
                                                    className="btn-action edit"
                                                    onClick={() => onEditPurchase(purchase)}
                                                    title="Edit Purchase"
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button 
                                                    className="btn-action delete"
                                                    onClick={() => handleDelete(purchase.id)}
                                                    title="Delete Purchase"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CowPurchaseList;