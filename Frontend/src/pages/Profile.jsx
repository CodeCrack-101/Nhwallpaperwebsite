/**
 * Profile Page Component File
 * Location: frontend/src/pages/Profile.jsx
 * Description: Fetches and displays user profile details. Handles edit mode and updates
 *              profile data (name, email, and address info) in the backend.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile as apiUpdateProfile } from '../services/userService';
import './Profile.css';

const Profile = () => {
    const { user, updateProfile } = useAuth();
    
    // Toggleable edit mode
    const [isEditMode, setIsEditMode] = useState(false);
    
    // Profile form state
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        streetAddress: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);

    // Initialize form fields when user object changes
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                streetAddress: user.address?.streetAddress || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                pincode: user.address?.pincode || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    /**
     * Submit profile modifications
     */
    const handleSave = async (e) => {
        e.preventDefault();
        setMessage({ text: '', type: '' });
        setLoading(true);

        try {
            const data = await apiUpdateProfile(profileData);
            if (data.success) {
                // Update Context state so changes render immediately
                updateProfile(data.user);
                setIsEditMode(false);
                setMessage({ text: 'Profile changes saved successfully!', type: 'success' });
            }
        } catch (error) {
            console.error('[PROFILE ERROR] Update failed:', error);
            setMessage({ 
                text: error.response?.data?.message || 'Failed to update profile. Please verify your entries.', 
                type: 'error' 
            });
        } finally {
            loading(false);
        }
    };

    if (!user) {
        return (
            <div className="profile-container">
                <p>Loading profile details...</p>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-card">
                
                {/* Profile Header Banner */}
                <div className="profile-header">
                    <div className="avatar-wrapper">
                        {/* Default stylish typography-based avatar */}
                        <div className="profile-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                    </div>
                    <h2>{user.name}</h2>
                    <p className="joined-date">Member since: {new Date(user.joinedAt || user.createdAt).toLocaleDateString()}</p>
                </div>

                {message.text && (
                    <div className={`profile-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSave} className="profile-form">
                    
                    <div className="section-title">
                        <h3>Personal Credentials</h3>
                        <hr />
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                name="name" 
                                value={profileData.name} 
                                onChange={handleInputChange} 
                                disabled={!isEditMode || loading} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Mobile Number (Log in Identifier)</label>
                            {/* Disabled always - mobile is primary auth key */}
                            <input 
                                type="text" 
                                name="phone" 
                                value={user.phone} 
                                disabled 
                                className="disabled-input" 
                            />
                        </div>

                        <div className="form-group full-width">
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={profileData.email} 
                                onChange={handleInputChange} 
                                disabled={!isEditMode || loading} 
                                required 
                            />
                        </div>
                    </div>

                    <div className="section-title" style={{ marginTop: '20px' }}>
                        <h3>Primary Shipping Address</h3>
                        <hr />
                    </div>

                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Street Address</label>
                            <input 
                                type="text" 
                                name="streetAddress" 
                                value={profileData.streetAddress} 
                                onChange={handleInputChange} 
                                disabled={!isEditMode || loading} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input 
                                type="text" 
                                name="city" 
                                value={profileData.city} 
                                onChange={handleInputChange} 
                                disabled={!isEditMode || loading} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>State</label>
                            <input 
                                type="text" 
                                name="state" 
                                value={profileData.state} 
                                onChange={handleInputChange} 
                                disabled={!isEditMode || loading} 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Pincode</label>
                            <input 
                                type="text" 
                                name="pincode" 
                                value={profileData.pincode} 
                                onChange={handleInputChange} 
                                disabled={!isEditMode || loading} 
                                required 
                                pattern="[0-9]{6}"
                            />
                        </div>
                    </div>

                    <div className="profile-actions">
                        {!isEditMode ? (
                            <button 
                                type="button" 
                                className="edit-btn" 
                                onClick={() => setIsEditMode(true)}
                            >
                                Edit Profile
                            </button>
                        ) : (
                            <div className="action-buttons">
                                <button 
                                    type="submit" 
                                    className="save-btn" 
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-btn" 
                                    onClick={() => {
                                        setIsEditMode(false);
                                        // Reset fields back to user state
                                        setProfileData({
                                            name: user.name || '',
                                            email: user.email || '',
                                            streetAddress: user.address?.streetAddress || '',
                                            city: user.address?.city || '',
                                            state: user.address?.state || '',
                                            pincode: user.address?.pincode || ''
                                        });
                                        setMessage({ text: '', type: '' });
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                </form>

            </div>
        </div>
    );
};

export default Profile;