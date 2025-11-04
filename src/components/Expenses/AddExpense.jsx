import React, { useState } from 'react';
import { expenseAPI } from '../../services/api';
import './../../styles/expenses.css';

const AddExpense = ({ userId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        feedCost: '',
        powderCost: '',
        labourCost: '',
        medicalCost: '',
        machineryCost: ''
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

        const total = Object.values(formData).reduce((sum, value) => sum + parseFloat(value || 0), 0);
        if (total === 0) {
            setMessage('Please enter at least one expense amount');
            setLoading(false);
            return;
        }

        try {
            const expenseData = {
                userId: userId,
                feedCost: parseFloat(formData.feedCost) || 0,
                powderCost: parseFloat(formData.powderCost) || 0,
                labourCost: parseFloat(formData.labourCost) || 0,
                medicalCost: parseFloat(formData.medicalCost) || 0,
                machineryCost: parseFloat(formData.machineryCost) || 0
            };

            await expenseAPI.addExpense(expenseData);
            setMessage('Expense added successfully!');
            setTimeout(() => {
                onSave();
            }, 1500);
        } catch (error) {
            setMessage('Failed to add expense. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const calculateTotal = () => {
        return Object.values(formData).reduce((sum, value) => sum + parseFloat(value || 0), 0);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <div className="modal-title">
                        <i className="fas fa-plus-circle"></i>
                        <h2>Add New Expense</h2>
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

                    <form onSubmit={handleSubmit} className="expense-form">
                        <div className="form-section">
                            <label className="section-label">EXPENSE CATEGORIES</label>
                            <br /><br />
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="feedCost" className="form-label">
                                        <i className="fas fa-seedling"></i>
                                        Feed Cost (₹)
                                    </label>
                                    <input
                                        type="number"
                                        id="feedCost"
                                        name="feedCost"
                                        className="form-input"
                                        value={formData.feedCost}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="powderCost" className="form-label">
                                        <i className="fas fa-powder"></i>
                                        Powder Cost (₹)
                                    </label>
                                    <input
                                        type="number"
                                        id="powderCost"
                                        name="powderCost"
                                        className="form-input"
                                        value={formData.powderCost}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="labourCost" className="form-label">
                                        <i className="fas fa-users"></i>
                                        Labour Cost (₹)
                                    </label>
                                    <input
                                        type="number"
                                        id="labourCost"
                                        name="labourCost"
                                        className="form-input"
                                        value={formData.labourCost}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="medicalCost" className="form-label">
                                        <i className="fas fa-first-aid"></i>
                                        Medical Cost (₹)
                                    </label>
                                    <input
                                        type="number"
                                        id="medicalCost"
                                        name="medicalCost"
                                        className="form-input"
                                        value={formData.medicalCost}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="machineryCost" className="form-label">
                                        <i className="fas fa-tractor"></i>
                                        Machinery Cost (₹)
                                    </label>
                                    <input
                                        type="number"
                                        id="machineryCost"
                                        name="machineryCost"
                                        className="form-input"
                                        value={formData.machineryCost}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        placeholder="0.00"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        <i className="fas fa-calculator"></i>
                                        Total Amount
                                    </label>
                                    <div className="amount-display">
                                        ₹{calculateTotal().toFixed(2)}
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
                                        Add Expense
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

export default AddExpense;