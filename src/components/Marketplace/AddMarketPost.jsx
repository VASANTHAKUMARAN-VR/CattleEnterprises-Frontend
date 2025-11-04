import React, { useState, useRef } from 'react';
import { marketPostAPI } from '../../services/api';
import '../../styles/marketplace.css';

const AddMarketPost = ({ userEmail, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        userName: '',
        description: '',
        location: '',
        category: 'MAATU_SAANAM',
        image: null
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const fileInputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);

    const userId = userEmail;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setMessage('Please select a valid image file');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setMessage('Image size should be less than 5MB');
                return;
            }

            setFormData(prev => ({ ...prev, image: file }));
            
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setFormData(prev => ({ ...prev, image: null }));
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragOver(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                handleImageChange({ target: { files: [file] } });
            } else {
                setMessage('Please drop a valid image file');
            }
        }
    };

    const getCategoryLabel = (category) => {
        const labels = {
            'MAATU_SAANAM': '🐄 மாட்டு சாணம் (Organic Manure)',
            'GRASS_FEED': '🌿 Grass & Cattle Feed',
            'MILK_PRODUCT': '🥛 Milk & Dairy Products', 
            'OTHER': '📦 Other Farm Products'
        };
        return labels[category] || category;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.userName.trim() || !formData.description.trim() || !formData.location.trim()) {
            setMessage('Please fill in all required fields');
            return;
        }

        if (formData.description.length < 10) {
            setMessage('Description should be at least 10 characters long');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const submitData = new FormData();
            submitData.append('userName', formData.userName.trim());
            submitData.append('mobileNumber', userId);
            submitData.append('description', formData.description.trim());
            submitData.append('location', formData.location.trim());
            submitData.append('category', formData.category);
            
            if (formData.image) {
                submitData.append('image', formData.image);
            }

            console.log('🚀 Creating market post...');
            const response = await marketPostAPI.addPost(submitData);
            console.log('✅ Post created:', response.data);

            setMessage('Post created successfully!');
            
            // Reset form
            setFormData({
                userName: '',
                description: '',
                location: '',
                category: 'MAATU_SAANAM',
                image: null
            });
            setPreviewImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }

            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(response.data);
                }
            }, 1000);

        } catch (error) {
            console.error('❌ Error creating post:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to create post';
            setMessage('Error: ' + errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="cow-sale-post-form-container">
            <div className="cow-sale-post-form-box">
                <div className="cow-sale-post-form-header">
                    <h2><i className="fas fa-plus-circle"></i> Create Market Post</h2>
                    <p>Sell your farm products to local community</p>
                </div>

                {message && (
                    <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="userName">
                            <i className="fas fa-user"></i> Your Name *
                        </label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            className="form-control"
                            value={formData.userName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="mobileNumber">
                            <i className="fas fa-phone"></i> Mobile Number
                        </label>
                        <input
                            type="text"
                            id="mobileNumber"
                            className="form-control"
                            value={userId}
                            disabled
                            style={{background: '#f7fafc', color: '#718096'}}
                        />
                        <small style={{color: '#718096', fontSize: '0.8rem'}}>
                            This will be visible to potential buyers
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="location">
                            <i className="fas fa-map-marker-alt"></i> Location *
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            className="form-control"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Enter your city/town/village"
                            required
                            disabled={loading}
                        />
                    </div>

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
                        <small style={{color: '#718096', fontSize: '0.8rem'}}>
                            Select the category that best describes your product
                        </small>
                    </div>

                    <div className="form-group">
                        <label>
                            <i className="fas fa-image"></i> Product Photo (Optional)
                        </label>
                        
                        <div 
                            className={`image-upload-container ${dragOver ? 'drag-over' : ''}`}
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <div className="image-upload-icon">
                                <i className="fas fa-cloud-upload-alt"></i>
                            </div>
                            <div className="image-upload-text">
                                {previewImage ? 'Click to change photo' : 'Click to upload or drag & drop'}
                            </div>
                            <div className="image-upload-hint">
                                PNG, JPG, JPEG (Max 5MB)
                            </div>
                            
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                disabled={loading}
                            />
                        </div>

                        {previewImage && (
                            <div className="image-preview">
                                <img src={previewImage} alt="Preview" />
                                <button 
                                    type="button"
                                    className="remove-image-btn"
                                    onClick={handleRemoveImage}
                                    disabled={loading}
                                >
                                    <i className="fas fa-times"></i> Remove Photo
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">
                            <i className="fas fa-align-left"></i> Product Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-control"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe your product in detail (quality, quantity, price, delivery options, etc.)"
                            required
                            disabled={loading}
                            rows="5"
                        />
                        <small style={{color: '#718096', fontSize: '0.8rem'}}>
                            {formData.description.length}/500 characters • Minimum 10 characters required
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
                            disabled={loading || !formData.userName.trim() || !formData.description.trim() || !formData.location.trim() || formData.description.length < 10}
                        >
                            {loading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Creating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check"></i> Create Post
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddMarketPost;