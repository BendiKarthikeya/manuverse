// src/components/Upload/DocumentUploadPage.js
import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import Header from '../LandingPage/Header';

const DocumentUploadPage = ({ user, onPageChange, onLogout }) => {
    const [uploadStatus, setUploadStatus] = useState(null);
    const [loading, setLoading] = useState(false);

    // Step management - KEY ADDITION
    const [currentStep, setCurrentStep] = useState(1); // 1: Aadhar, 2: Company, 3: Completed
    const [aadharCompleted, setAadharCompleted] = useState(false);
    const [companyCompleted, setCompanyCompleted] = useState(false);

    // Aadhar Upload Function - MODIFIED
    const handleAadharUpload = async (file) => {
        setLoading(true);
        setUploadStatus('uploading');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user_id', user.id);
            formData.append('user_email', user.email);
            formData.append('document_type', 'aadhar');
            formData.append('upload_timestamp', new Date().toISOString());

            const webhookUrl = process.env.REACT_APP_N8N_AADHAR_WEBHOOK_URL || 'https://mock-webhook.com/aadhar';

            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('success');
                setAadharCompleted(true);
                console.log('Aadhar uploaded successfully');

                // Move to next step after 2 seconds
                setTimeout(() => {
                    setCurrentStep(2);
                    setUploadStatus(null);
                }, 2000);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
        } finally {
            setLoading(false);
        }
    };

    // Company Document Upload Function - MODIFIED
    const handleCompanyUpload = async (file) => {
        setLoading(true);
        setUploadStatus('uploading');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('user_id', user.id);
            formData.append('user_email', user.email);
            formData.append('document_type', 'company');
            formData.append('upload_timestamp', new Date().toISOString());

            const webhookUrl = process.env.REACT_APP_N8N_COMPANY_WEBHOOK_URL || 'https://mock-webhook.com/company';

            const response = await fetch(webhookUrl, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                setUploadStatus('success');
                setCompanyCompleted(true);
                console.log('Company document uploaded successfully');

                // Move to completed step after 2 seconds
                setTimeout(() => {
                    setCurrentStep(3);
                    setUploadStatus(null);
                }, 2000);
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
        } finally {
            setLoading(false);
        }
    };

    // If both documents completed, redirect to landing
    if (currentStep === 3) {
        setTimeout(() => {
            onPageChange('landing');
        }, 3000);
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} onPageChange={onPageChange} onLogout={onLogout} />

            <div className="pt-16">
                <div className="max-w-4xl mx-auto px-4 py-8">

                    {/* Back Button */}
                    <button
                        onClick={() => onPageChange('landing')}
                        className="flex items-center text-manu-green hover:text-green-600 mb-6"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Home
                    </button>

                    {/* Progress Indicator - NEW */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-4">
                            <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${aadharCompleted ? 'bg-green-500 text-white' : currentStep === 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                                    {aadharCompleted ? '✓' : '1'}
                                </div>
                                <span className="text-sm font-medium">Aadhar Card</span>
                            </div>
                            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${companyCompleted ? 'bg-green-500 text-white' : currentStep === 2 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                    {companyCompleted ? '✓' : '2'}
                                </div>
                                <span className="text-sm font-medium">Company Document</span>
                            </div>
                            <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-green-600' : 'text-gray-400'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}>
                                    {currentStep >= 3 ? '✓' : '3'}
                                </div>
                                <span className="text-sm font-medium">Completed</span>
                            </div>
                        </div>
                    </div>

                    {/* Page Header - DYNAMIC */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">
                            {currentStep === 1 && "Upload Aadhar Card"}
                            {currentStep === 2 && "Upload Company Document"}
                            {currentStep === 3 && "Upload Completed!"}
                        </h1>
                        <p className="text-gray-600 mt-2">
                            {currentStep === 1 && "Please upload your Aadhar card for identity verification"}
                            {currentStep === 2 && "Now upload your company registration certificate"}
                            {currentStep === 3 && "All documents uploaded successfully! Redirecting..."}
                        </p>
                    </div>

                    {/* Upload Sections - CONDITIONAL RENDERING */}
                    <div className="space-y-8">

                        {/* Step 1: Aadhar Card Upload */}
                        {currentStep === 1 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    📄 Aadhar Card Upload
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Upload your Aadhar card for identity verification
                                </p>

                                <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                                    <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                    <input
                                        type="file"
                                        id="aadhar-upload"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                handleAadharUpload(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="aadhar-upload"
                                        className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                        Choose Aadhar File
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Supports JPG, PNG, PDF (max 10MB)
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 2: Company Registration Upload */}
                        {currentStep === 2 && (
                            <div className="bg-white rounded-lg border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                    🏢 Company Registration Certificate
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Upload your company registration document for business verification
                                </p>

                                <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center">
                                    <FileText className="w-12 h-12 text-green-400 mx-auto mb-4" />
                                    <input
                                        type="file"
                                        id="company-upload"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        onChange={(e) => {
                                            if (e.target.files[0]) {
                                                handleCompanyUpload(e.target.files[0]);
                                            }
                                        }}
                                    />
                                    <label
                                        htmlFor="company-upload"
                                        className="cursor-pointer bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        Choose Company Document
                                    </label>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Supports JPG, PNG, PDF (max 10MB)
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Completion Message */}
                        {currentStep === 3 && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                <h2 className="text-2xl font-bold text-green-800 mb-4">
                                    All Documents Uploaded Successfully!
                                </h2>
                                <p className="text-green-600 mb-6">
                                    Your documents are being processed. You will be redirected to the dashboard shortly.
                                </p>
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent mx-auto"></div>
                            </div>
                        )}

                        {/* Upload Status */}
                        {uploadStatus && currentStep < 3 && (
                            <div className={`p-4 rounded-lg flex items-center space-x-3 ${uploadStatus === 'success' ? 'bg-green-100 border border-green-200' :
                                uploadStatus === 'error' ? 'bg-red-100 border border-red-200' :
                                    'bg-blue-100 border border-blue-200'
                                }`}>
                                {uploadStatus === 'uploading' && (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                                        <span className="text-blue-800">Uploading and processing...</span>
                                    </>
                                )}
                                {uploadStatus === 'success' && (
                                    <>
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <span className="text-green-800">Document uploaded successfully! Moving to next step...</span>
                                    </>
                                )}
                                {uploadStatus === 'error' && (
                                    <>
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        <span className="text-red-800">Upload failed. Please try again.</span>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Debug Info (Development only) */}
                        {process.env.NODE_ENV === 'development' && (
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Info:</h3>
                                <div className="text-xs text-gray-600 space-y-1">
                                    <div>User ID: {user.id}</div>
                                    <div>Email: {user.email}</div>
                                    <div>Current Step: {currentStep}</div>
                                    <div>Aadhar Completed: {aadharCompleted ? 'Yes' : 'No'}</div>
                                    <div>Company Completed: {companyCompleted ? 'Yes' : 'No'}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentUploadPage;
