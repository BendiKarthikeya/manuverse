import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Header from '../LandingPage/Header';
import TemplateChatbot from './TemplateChatbot';

const AIAgentPage = ({ user, onPageChange, onLogout }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header user={user} onPageChange={onPageChange} onLogout={onLogout} />
            
            <div className="pt-16">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    {/* Back Button */}
                    <button
                        onClick={() => onPageChange('landing')}
                        className="flex items-center text-manu-green hover:text-green-600 mb-4"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Home
                    </button>

                    {/* Page Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-900">
                            E-CHA AI Agent
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Your intelligent assistant for document processing and template generation
                        </p>
                    </div>

                    {/* Template Chatbot Component */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <TemplateChatbot user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAgentPage;