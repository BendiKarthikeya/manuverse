import React from 'react';
import { motion } from 'framer-motion';

const BackedBySection = () => {
    const partners = [
        {
            name: 'BITS Pilani',
            logo: '/logos/BITS-Pilani-Logo.png',
            description: 'Premier Engineering Institute'
        },
        {
            name: 'PIEDS',
            logo: '/logos/pieds logo.jpeg',
            description: 'Incubation Program'
        },
        {
            name: 'RKIC',
            logo: '/logos/rkic-placeholder.png',
            description: 'Research & Innovation'
        }
    ];

    return (
        <section className="py-16 bg-manu-light">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-manu-dark mb-4">
                        Backed By
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Supported by leading institutions and innovation programs
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {partners.map((partner, index) => (
                        <motion.div
                            key={partner.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.05 }}
                            className="bg-white rounded-lg p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
                        >
                            <div className="mb-6">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="h-16 w-auto mx-auto object-contain"
                                    onError={(e) => {
                                        // Fallback for missing images
                                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJncmFkIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzEwYjk4MSI+PC9zdG9wPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzA1OWY2OSI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgZmlsbD0idXJsKCNncmFkKSIgcng9IjgiPjwvcmVjdD48L3N2Zz4=';
                                    }}
                                />
                            </div>
                            <h3 className="text-xl font-semibold text-manu-dark mb-2">
                                {partner.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {partner.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BackedBySection;
