import React, { useState, useEffect } from 'react';
import { cowSaleAPI } from '../../services/api';
import '../../styles/cow-sale.css';

const EditCowSale = ({ sale, userId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        date: '',
        buyerName: '',
        quantity: '',
        totalAmount: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (sale) {
            setFormData({
                date: sale.date,
                buyerName: sale.buyerName,
                quantity: sale.quantity.toString(),
                totalAmount: sale.totalAmount.toString()
            });
        }
    }, [sale]);

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
            const updatedData = {
                userId: userId,
                date: formData.date,
                buyerName: formData.buyerName,
                quantity: parseInt(formData.quantity),
                totalAmount: parseFloat(formData.totalAmount)
            };

            await cowSaleAPI.updateCowSale(sale.id, userId, updatedData);
            setMessage('Sale record updated successfully!');
            setTimeout(() => {
                onSave();
            }, 1500);
        } catch (error) {
            setMessage('Failed to update sale record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculatePricePerCow = () => {
        const quantity = parseInt(formData.quantity) || 0;
        const totalAmount = parseFloat(formData.totalAmount) || 0;
        return quantity > 0 ? totalAmount / quantity : 0;
    };

    if (!sale) {
        return null;
    }

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <div className="modal-title">
                        <i className="fas fa-edit"></i>
                        <h2>Edit Cow Sale</h2>
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
                            <label className="section-label">UPDATE SALE DETAILS</label>
                            
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
                                        Updating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check"></i>
                                        Update Sale
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

export default EditCowSale;