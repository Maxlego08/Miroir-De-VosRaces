import { Head } from '@inertiajs/react';
import React, { useState } from 'react';
import axios from "axios";

export default function ChooseHouse({}) {

    const [form, setForm] = useState({
        name: '',
        origin: '',
        personality: '',
        ambitions: ''
    });
    const [errors, setErrors] = useState({});
    const [house, setHouse] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if ((name === "origin" || name === "personality" || name === "ambitions") && value.length > 1000) return;
        setForm({ ...form, [name]: value });
        setErrors({ ...errors, [name]: '' });
    };

    const getCsrfToken = () => {
        const tokenElement = document.querySelector('meta[name="csrf-token"]');
        if (tokenElement) {
            return tokenElement.getAttribute('content');
        } else {
            console.error('CSRF token not found');
            return '';
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (form.name.trim().length < 3) {
            newErrors.name = 'Name must be at least 3 characters long';
        }
        if (form.origin.trim().length < 50) {
            newErrors.origin = 'Origin must be at least 50 characters long';
        }
        if (form.personality.trim().length < 50) {
            newErrors.personality = 'Personality must be at least 50 characters long';
        }
        if (form.ambitions.trim().length < 50) {
            newErrors.ambitions = 'Ambitions must be at least 50 characters long';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setHouse(null);
        try {
            const apiClient = axios.create({
                baseURL: import.meta.env.VITE_REACT_APP_API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                }
            });

            const response = await apiClient.post('/choose-house', form);
            setHouse(response.data.message);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                setHouse(error.response?.data?.message || 'An error occurred.');
            }
        }
        setIsLoading(false);
    };

    return (
        <>
            <Head title="Sorting Mirror" />
            <div className="p-4 max-w-xl mx-auto bg-white rounded shadow">
                <h1 className="text-xl font-bold mb-4">Sorting Form</h1>
                <input
                    name="name"
                    placeholder="Player name"
                    value={form.name}
                    onChange={handleInputChange}
                    className={`w-full border p-2 mb-1 rounded ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

                <textarea
                    name="origin"
                    placeholder="Character's origin (birthplace, family background...)"
                    value={form.origin}
                    onChange={handleInputChange}
                    className={`w-full border p-2 mb-1 rounded ${errors.origin ? 'border-red-500' : ''}`}
                    rows={4}
                    maxLength={1000}
                />
                {errors.origin && <p className="text-red-500 text-sm mb-2">{errors.origin}</p>}
                <div className="text-right text-sm text-gray-500 mb-1">
                    {form.origin.length} / 1000 characters
                </div>

                <textarea
                    name="personality"
                    placeholder="Character's personality (traits, flaws, behavior at school...)"
                    value={form.personality}
                    onChange={handleInputChange}
                    className={`w-full border p-2 mb-1 rounded ${errors.personality ? 'border-red-500' : ''}`}
                    rows={4}
                    maxLength={1000}
                />
                {errors.personality && <p className="text-red-500 text-sm mb-2">{errors.personality}</p>}
                <div className="text-right text-sm text-gray-500 mb-1">
                    {form.personality.length} / 1000 characters
                </div>

                <textarea
                    name="ambitions"
                    placeholder="Character's ambitions or dreams"
                    value={form.ambitions}
                    onChange={handleInputChange}
                    className={`w-full border p-2 mb-1 rounded ${errors.ambitions ? 'border-red-500' : ''}`}
                    rows={4}
                    maxLength={1000}
                />
                {errors.ambitions && <p className="text-red-500 text-sm mb-2">{errors.ambitions}</p>}
                <div className="text-right text-sm text-gray-500 mb-1">
                    {form.ambitions.length} / 1000 characters
                </div>

                <button
                    onClick={handleFormSubmit}
                    disabled={isLoading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                    {isLoading ? 'Consulting the mirror...' : 'Ask the mirror'}
                </button>

                {house && <div className="mt-4 text-lg font-semibold text-center">{house}</div>}
            </div>
        </>
    )
}
