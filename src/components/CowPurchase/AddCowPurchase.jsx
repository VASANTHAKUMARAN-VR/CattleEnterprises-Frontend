import React, { useState } from 'react';
import { cowPurchaseAPI } from '../../services/api';
import '../../styles/cow-purchase.css';

const AddCowPurchase = ({ userId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        salesmanName: '',
        quantity: '',
        totalAmount: '',
        purchasePlace: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

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
            const purchaseData = {
                userId: userId,
                date: formData.date,
                salesmanName: formData.salesmanName,
                quantity: parseInt(formData.quantity),
                totalAmount: parseFloat(formData.totalAmount),
                purchasePlace: formData.purchasePlace
            };

            await cowPurchaseAPI.addCowPurchase(purchaseData);
            setMessage('Purchase record added successfully!');
            setTimeout(() => {
                onSave();
            }, 1500);
        } catch (error) {
            setMessage('Failed to add purchase record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculatePricePerCow = () => {
        const quantity = parseInt(formData.quantity) || 0;
        const totalAmount = parseFloat(formData.totalAmount) || 0;
        return quantity > 0 ? totalAmount / quantity : 0;
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <div className="modal-title">
                        <i className="fas fa-cow"></i>
                        <h2>Add Cow Purchase</h2>
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
                            <label className="section-label">PURCHASE DETAILS</label>
                            <br /><br />
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
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check"></i>
                                        Add Purchase
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

export default AddCowPurchase;