import React, { useState } from 'react';
import { saleRecordAPI } from '../../services/api';
import '../../styles/sales.css';

const AddSaleRecord = ({ userId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        category: 'MAATU_SAANAM',
        price: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.category.trim() || !formData.price) {
            setMessage('Please fill in all required fields');
            return;
        }

        const price = parseFloat(formData.price);
        if (isNaN(price) || price <= 0) {
            setMessage('Please enter a valid price');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const saleData = {
                userId: userId,
                category: formData.category,
                price: price
            };

            console.log('💰 Adding sale record:', saleData);
            const response = await saleRecordAPI.addSale(saleData);
            console.log('✅ Sale record added:', response.data);

            setMessage('Sale recorded successfully!');
            
            // Reset form
            setFormData({
                category: 'MAATU_SAANAM',
                price: ''
            });

            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(response.data);
                }
            }, 1500);

        } catch (error) {
            console.error('❌ Error adding sale record:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to record sale';
            setMessage('Error: ' + errorMessage);
        } finally {
            setLoading(false);
        }
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

    return (
        <div className="form-container">
            <div className="form-box">
                <div className="form-header">
                    <h2><i className="fas fa-money-bill-wave"></i> Record Sale</h2>
                    <p>Add your farm product sale details</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="category">
                            <i className="fas fa-tags"></i> Product Category *
                        </label>
                        <select
                            id="category"
                            name="category"
                            className="form-control"
                            value={formData.category}
                            onChange={handleInputChange}
                            required
                            disabled={loading}
                        >
                            <option value="MAATU_SAANAM">🐄 மாட்டு சாணம் (Organic Manure)</option>
                            <option value="GRASS_FEED">🌿 Grass & Cattle Feed</option>
                            <option value="MILK_PRODUCT">🥛 Milk & Dairy Products</option>
                            <option value="OTHER">📦 Other Farm Products</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="price">
                            <i className="fas fa-rupee-sign"></i> Sale Price *
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            className="form-control"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter sale price"
                            required
                            disabled={loading}
                            step="0.01"
                            min="0"
                        />
                        <small style={{color: '#718096', fontSize: '0.85rem', marginTop: '5px', display: 'block'}}>
                            Enter the total amount received for this sale
                        </small>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            <i className="fas fa-arrow-left"></i> Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={loading || !formData.category.trim() || !formData.price}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Recording...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check"></i> Record Sale
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSaleRecord;