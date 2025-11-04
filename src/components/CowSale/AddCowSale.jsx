import React, { useState } from 'react';
import { cowSaleAPI } from '../../services/api';
import '../../styles/cow-sale.css';

const AddCowSale = ({ userId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        buyerName: '',
        quantity: '',
        totalAmount: ''
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

        if (!formData.buyerName || !formData.quantity || !formData.totalAmount) {
            setMessage('Please fill all required fields');
            setLoading(false);
            return;
        }

        try {
            const saleData = {
                userId: userId,
                date: formData.date,
                buyerName: formData.buyerName,
                quantity: parseInt(formData.quantity),
                totalAmount: parseFloat(formData.totalAmount)
            };

            await cowSaleAPI.addCowSale(saleData);
            setMessage('Sale record added successfully!');
            setTimeout(() => {
                onSave();
            }, 1500);
        } catch (error) {
            setMessage('Failed to add sale record. Please try again.');
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
                        <i className="fas fa-money-bill-wave"></i>
                        <h2>Add Cow Sale</h2>
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

                    <form onSubmit={handleSubmit} className="cow-sale-form">
                        <div className="form-section">
                            <label className="section-label">SALE DETAILS</label>
                            <br /><br />
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="date" className="form-label">
                                        <i className="fas fa-calendar-alt"></i>
                                        Sale Date
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
                                    <label htmlFor="buyerName" className="form-label">
                                        <i className="fas fa-user"></i>
                                        Buyer Name
                                    </label>
                                    <input
                                        type="text"
                                        id="buyerName"
                                        name="buyerName"
                                        className="form-input"
                                        value={formData.buyerName}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter buyer name"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="quantity" className="form-label">
                                        <i className="fas fa-cow"></i>
                                        Number of Cows Sold
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
                                        Total Sale Amount (₹)
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
                                        Add Sale
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

export default AddCowSale;