import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Card from './ui/Card';
import Button from './ui/Button';

const Profile: React.FC = () => {
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [saved, setSaved] = useState(false);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Profile Saved:', { name, location });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000); // Hide message after 3 seconds
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            <div className="max-w-2xl mx-auto">
                <Card>
                    <h2 className="text-3xl font-bold mb-6 text-center gradient-text">Your Profile</h2>
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Enter your name"
                                className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-red-500 outline-none bg-gray-800 text-white"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-2">
                                Location (City)
                            </label>
                            <input
                                type="text"
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder="Enter your city"
                                className="w-full p-3 rounded-lg border-none focus:ring-2 focus:ring-red-500 outline-none bg-gray-800 text-white"
                                required
                            />
                        </div>
                        <div className="text-center pt-4">
                            <Button type="submit">
                                Save Profile
                            </Button>
                        </div>
                    </form>
                    {saved && (
                        <p className="mt-4 text-center text-green-300 bg-green-800/50 p-3 rounded-lg">
                            Profile saved successfully!
                        </p>
                    )}
                </Card>
            </div>
        </motion.div>
    );
};

export default Profile;