import React, { useState, useEffect } from 'react';
import { cowPurchaseAPI } from '../../services/api';
import '../../styles/cow-purchase.css';

const EditCowPurchase = ({ purchase, userId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        date: '',
        salesmanName: '',
        quantity: '',
        totalAmount: '',
        purchasePlace: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (purchase) {
            setFormData({
                date: purchase.date,
                salesmanName: purchase.salesmanName,
                quantity: purchase.quantity.toString(),
                totalAmount: purchase.totalAmount.toString(),
                purchasePlace: purchase.purchasePlace
            });
        }
    }, [purchase]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!formData.salesmanName || !formData.quantity || !formData.totalAmount || !formData.purchasePlace) {
            setMessage('Please fill all required fields');
            setLoading(false);
            return;
        }

        try {
            const updatedData = {
                userId: userId,
                date: formData.date,
                salesmanName: formData.salesmanName,
                quantity: parseInt(formData.quantity),
                totalAmount: parseFloat(formData.totalAmount),
                purchasePlace: formData.purchasePlace
            };

            await cowPurchaseAPI.updateCowPurchase(purchase.id, userId, updatedData);
            setMessage('Purchase record updated successfully!');
            setTimeout(() => {
                onSave();
            }, 1500);
        } catch (error) {
            setMessage('Failed to update purchase record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculatePricePerCow = () => {
        const quantity = parseInt(formData.quantity) || 0;
        const totalAmount = parseFloat(formData.totalAmount) || 0;
        return quantity > 0 ? totalAmount / quantity : 0;
    };

    if (!purchase) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <div className="modal-title">
                        <i className="fas fa-edit"></i>
                        <h2>Edit Cow Purchase</h2>
                    </div>
                    <button className="modal-close" onClick={onCancel}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="modal-body">
                    {message && (
                        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-error'}`}>
                            <i className={`fas ${message.includes('successfully') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="cow-purchase-form">
                        <div className="form-section">
                            <label className="section-label">UPDATE PURCHASE DETAILS</label>
                            
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date" className="form-label">
                                        <i className="fas fa-calendar-alt"></i>
                                        Purchase Date
                                    </label>
                                    <input
                                        type="date"
                                        id="date"
                                        name="date"
                                        className="form-input"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="salesmanName" className="form-label">
                                        <i className="fas fa-user-tie"></i>
                                        Salesman Name
                                    </label>
                                    <input
                                        type="text"
                                        id="salesmanName"
                                        name="salesmanName"
                                        className="form-input"
                                        value={formData.salesmanName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter salesman name"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="quantity" className="form-label">
                                        <i className="fas fa-cow"></i>
                                        Number of Cows
                                    </label>
                                    <input
                                        type="number"
                                        id="quantity"
                                        name="quantity"
                                        className="form-input"
                                        value={formData.quantity}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                        placeholder="0"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="totalAmount" className="form-label">
                                        <i className="fas fa-rupee-sign"></i>
                                        Total Amount (₹)
                                    </label>
                                    <input
                                        type="number"
                                        id="totalAmount"
                                        name="totalAmount"
                                        className="form-input"
                                        value={formData.totalAmount}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        required
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="purchasePlace" className="form-label">
                                        <i className="fas fa-map-marker-alt"></i>
                                        Purchase Place
                                    </label>
                                    <input
                                        type="text"
                                        id="purchasePlace"
                                        name="purchasePlace"
                                        className="form-input"
                                        value={formData.purchasePlace}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter purchase location"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="fas fa-calculator"></i>
                                        Price per Cow
                                    </label>
                                    <div className="amount-display">
                                        ₹{calculatePricePerCow().toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit & Cancel Buttons */}
                        <div className="form-actions">
                            <button 
                                type="button" 
                                className="btn btn-outline" 
                                onClick={onCancel} 
                                disabled={loading}
                            >
                                <i className="fas fa-times"></i>
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                className="btn btn-primary" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check"></i>
                                        Update Purchase
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditCowPurchase;