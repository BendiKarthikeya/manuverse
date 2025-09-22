import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-manu-dark text-white py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* Logo and Description */}
                    <div className="col-span-1 md:col-span-2">
                        <img
                            src="/logos/manudocs_logo.jpg"
                            alt="MANUDOCS"
                            className="h-12 w-auto mb-4"
                        />
                        <p className="text-gray-400 max-w-md mb-4">
                            AI-Powered Export Documentation platform for global trade.
                            Streamline your import-export processes with intelligent automation.
                        </p>
                        <div className="flex space-x-4">
                            <button className="text-manu-green hover:text-green-400 transition-colors">
                                <Mail size={20} />
                            </button>
                            <button className="text-manu-green hover:text-green-400 transition-colors">
                                <Phone size={20} />
                            </button>
                            <button className="text-manu-green hover:text-green-400 transition-colors">
                                <MapPin size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-manu-green">Services</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Import Documentation</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Export Documentation</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">AI Document Processing</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Compliance Check</a></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-manu-green">Company</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p className="text-gray-400">
                        © 2025 MANUDOCS. All rights reserved. Powered by AI Innovation.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
