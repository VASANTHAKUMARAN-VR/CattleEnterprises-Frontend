import React, { useState } from 'react';
import { milkAPI } from '../../services/api';
import '../../styles/milk.css';

const AddMilkData = ({ userId, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        session: 'morning',
        date: new Date().toISOString().split('T')[0],
        liters: '',
        rate: '',
        fat: '',
        snf: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSessionChange = (session) => {
        setFormData({
            ...formData,
            session
        });
    };

    const calculateAmount = () => {
        const liters = parseFloat(formData.liters) || 0;
        const rate = parseFloat(formData.rate) || 0;
        return liters * rate;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        if (!formData.liters || !formData.rate) {
            setMessage('Please enter both liters and rate');
            setLoading(false);
            return;
        }

        try {
            const milkData = {
                userId: userId,
                session: formData.session,
                date: formData.date,
                liters: parseFloat(formData.liters),
                rate: parseFloat(formData.rate),
                fat: parseFloat(formData.fat) || 0,
                snf: parseFloat(formData.snf) || 0,
                amount: calculateAmount()
            };

            await milkAPI.addMilkData(milkData);
            setMessage('Milk record added successfully!');
            setTimeout(() => {
                onSave();
            }, 1500);
        } catch (error) {
            setMessage('Failed to add milk record. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <div className="modal-title">
                        <i className="fas fa-plus-circle"></i>
                        <h2>Add New Milk Record</h2>
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

                    <form onSubmit={handleSubmit} className="milk-form">
                        {/* Session Selection */}
                        <div className="form-section">
                            {/* <label className="section-label">SESSION TYPE</label> */}
                            <div className="session-toggle-group">
                                <button 
                                    type="button"
                                    className={`session-toggle-btn ${formData.session === 'morning' ? 'active' : ''}`}
                                    onClick={() => handleSessionChange('morning')}
                                >
                                    <i className="fas fa-sun"></i>
                                    <span>Morning Session</span>
                                </button>
                                <button 
                                    type="button"
                                    className={`session-toggle-btn ${formData.session === 'evening' ? 'active' : ''}`}
                                    onClick={() => handleSessionChange('evening')}
                                >
                                    <i className="fas fa-moon"></i>
                                    <span>Evening Session</span>
                                </button>
                            </div>
                        </div>

                        <div className="form-divider"></div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="date" className="form-label">
                                    <i className="fas fa-calendar-alt"></i>
                                    Date
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
                                <label htmlFor="liters" className="form-label">
                                    <i className="fas fa-wine-bottle"></i>
                                    Milk Quantity (Liters)
                                </label>
                                <input
                                    type="number"
                                    id="liters"
                                    name="liters"
                                    className="form-input"
                                    value={formData.liters}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="rate" className="form-label">
                                    <i className="fas fa-rupee-sign"></i>
                                    Rate per Liter
                                </label>
                                <input
                                    type="number"
                                    id="rate"
                                    name="rate"
                                    className="form-input"
                                    value={formData.rate}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    required
                                    placeholder="0.00"
                                />
                            </div>
                             <div className="form-group">
                                <label htmlFor="fat" className="form-label">
                                    <i className="fas fa-percentage"></i>
                                    Fat Content %
                                </label>
                                <input
                                    type="number"
                                    id="fat"
                                    name="fat"
                                    className="form-input"
                                    value={formData.fat}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    max="10"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="snf" className="form-label">
                                    <i className="fas fa-percentage"></i>
                                    SNF Content %
                                </label>
                                <input
                                    type="number"
                                    id="snf"
                                    name="snf"
                                    className="form-input"
                                    value={formData.snf}
                                    onChange={handleChange}
                                    step="0.01"
                                    min="0"
                                    max="15"
                                    placeholder="0.00"
                                />
                            </div>
                              <div className="form-group">
                                <label className="form-label">
                                    <i className="fas fa-calculator"></i>
                                    Total Amount
                                </label>
                                
                                <div className="amount-display">
                                    ₹{calculateAmount().toFixed(2)}
                                </div>
                                                                <div className="form-actions">
                                
                                    <button 
                                        type="submit" 
                                        className="btn btn-secondary" 
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
                                                Submit Record
                                            </>
                                        )}
                                    </button>
                                </div>
                                
                            </div>                        {/* Submit & Cancel Buttons */}

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddMilkData;