// src/contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.REACT_APP_SUPABASE_URL,
    process.env.REACT_APP_SUPABASE_ANON_KEY
);

const UserContext = createContext();

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [uploadStatus, setUploadStatus] = useState({
        documentsUploaded: false,
        aadharUploaded: false,
        companyUploaded: false,
        loading: true
    });

    // Fetch upload status from Supabase
    const fetchUploadStatus = async (userId) => {
        if (!userId) {
            setUploadStatus(prev => ({ ...prev, loading: false }));
            return;
        }

        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('documents_uploaded, aadhar_uploaded, company_uploaded, upload_completed_at')
                .eq('id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // Not found is ok for new users
                console.error('Error fetching upload status:', error);
                return;
            }

            if (data) {
                setUploadStatus({
                    documentsUploaded: data.documents_uploaded || false,
                    aadharUploaded: data.aadhar_uploaded || false,
                    companyUploaded: data.company_uploaded || false,
                    uploadCompletedAt: data.upload_completed_at,
                    loading: false
                });
            } else {
                setUploadStatus({
                    documentsUploaded: false,
                    aadharUploaded: false,
                    companyUploaded: false,
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error in fetchUploadStatus:', error);
            setUploadStatus(prev => ({ ...prev, loading: false }));
        }
    };

    // Update upload status
    const updateUploadStatus = async (userId, updates) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .upsert({
                    id: userId,
                    ...updates,
                    updated_at: new Date().toISOString()
                });

            if (error) {
                console.error('Error updating upload status:', error);
                return;
            }

            // Update local state
            setUploadStatus(prev => ({
                ...prev,
                ...updates
            }));
        } catch (error) {
            console.error('Error in updateUploadStatus:', error);
        }
    };

    return (
        <UserContext.Provider value={{
            uploadStatus,
            fetchUploadStatus,
            updateUploadStatus
        }}>
            {children}
        </UserContext.Provider>
    );
};
