import {Head} from '@inertiajs/react';
import React, {useEffect, useRef, useState} from 'react';
import axios from "axios";

export default function ChooseHouse({}) {

    const [form, setForm] = useState({
        name: '',
        origin: '',
        personality: '',
        ambitions: ''
    });
    const [errors, setErrors] = useState({});
    const [houseMessage, setHouseMessage] = useState(null);
    const [house, setHouse] = useState(null);
    const [displayedText, setDisplayedText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [textSpeed, setTextSpeed] = useState(1);
    const [showHouseImage, setShowHouseImage] = useState(false);

    const indexRef = useRef(0);
    const timeoutRef = useRef(null);
    const houseRef = useRef('');

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        if ((name === "origin" || name === "personality" || name === "ambitions") && value.length > 1000) return;
        setForm({...form, [name]: value});
        setErrors({...errors, [name]: ''});
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
            newErrors.name = 'Le nom doit comporter au moins 3 caractères';
        }
        if (form.origin.trim().length < 50) {
            newErrors.origin = 'L’origine doit comporter au moins 50 caractères';
        }
        if (form.personality.trim().length < 50) {
            newErrors.personality = 'La personnalité doit comporter au moins 50 caractères';
        }
        if (form.ambitions.trim().length < 50) {
            newErrors.ambitions = 'Les ambitions doivent comporter au moins 50 caractères';
        }
        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            setIsSubmitted(false);
            return false;
        }

        return true;
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) return;

        setIsSubmitted(true);
        setIsLoading(true);
        setHouseMessage(null);
        setDisplayedText('');
        setShowHouseImage(false);
        indexRef.current = 0;
        try {
            const apiClient = axios.create({
                baseURL: import.meta.env.VITE_REACT_APP_API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': getCsrfToken()
                }
            });

            const response = await apiClient.post('/choose-house', form);
            houseRef.current = response.data.message;
            setHouseMessage(response.data.message);
            setHouse(response.data.house);
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
                setIsSubmitted(false);
            } else {
                setHouseMessage(error.response?.data?.message || 'An error occurred.');
            }
        }
        setIsLoading(false);
    };

    const revealText = () => {
        clearTimeout(timeoutRef.current);
        if (indexRef.current < houseRef.current.length) {
            const char = houseRef.current.charAt(indexRef.current);
            setDisplayedText((prev) => prev + char);

            // Déclenche l'affichage progressif de l'image dans la dernière phrase
            if (!showHouseImage && houseRef.current.length - indexRef.current < 60) {
                setShowHouseImage(true);
            }

            indexRef.current++;
            let delay = 40 / textSpeed;
            if (char === '.' || char === '!' || char === '?') delay = 500 / textSpeed;
            else if (char === ',') delay = 250 / textSpeed;
            if (indexRef.current > houseRef.current.length - 20 && /[A-Za-z]/.test(char)) {
                delay += 100 / textSpeed;
            }

            timeoutRef.current = setTimeout(revealText, delay);
        }
    };

    useEffect(() => {
        if (houseMessage) {
            clearTimeout(timeoutRef.current);
            setDisplayedText('');
            indexRef.current = 0;
            revealText();
        }
        return () => clearTimeout(timeoutRef.current);
    }, [houseMessage]);

    useEffect(() => {
        if (houseMessage && indexRef.current < houseRef.current.length) {
            revealText();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [textSpeed]);

    return (
        <>
            <Head title="Rejoindre une maison"/>
            <div className="p-4 mt-4 max-w-xl mx-auto bg-white rounded shadow">
                <div className="text-center mb-4">
                    <h1 className="text-xl font-bold">Miroir de VosRaces</h1>
                    <small>Ouvrez votre coeur et laissez le miroir pénétrer votre âme</small>
                </div>

                {!isSubmitted ? (
                    <>
                        <input
                            name="name"
                            placeholder="Nom/Prénom du personnage"
                            value={form.name}
                            onChange={handleInputChange}
                            className={`w-full border p-2 mb-1 rounded ${errors.name ? 'border-red-500' : ''}`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mb-2">{errors.name}</p>}

                        <textarea
                            name="origin"
                            placeholder="Origine de ton personnage (lieu de naissance, milieu familial)"
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
                            placeholder="Caractère du personnage (qualités, défauts, comportement à l’école)"
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
                            placeholder="Ambitions/rêves du personnage"
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
                            {isLoading ? 'Le miroir pense...' : 'Questionner le miroir'}
                        </button>
                    </>
                ) : (
                    <div className="text-center text-lg font-medium min-h-[4rem]">
                        {isLoading && <p>Le miroir pense...</p>}
                        {!isLoading && (
                            <>
                                <p>{displayedText}</p>
                                <img
                                    src={`/images/${house}.webp`}
                                    alt={house}
                                    style={{ transition: '5s -webkit-filter linear' }}
                                    className={`mx-auto mt-4 ${showHouseImage ? 'blur-0' : 'blur-2xl'}`}
                                />
                                <div className="mt-4 flex justify-center gap-2">
                                    <button
                                        onClick={() => setTextSpeed((s) => Math.max(s - 0.5, 0.5))}
                                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                                    >
                                        Ralentir
                                    </button>
                                    <button
                                        onClick={() => setTextSpeed((s) => Math.min(s + 0.5, 5))}
                                        className="px-3 py-1 bg-green-500 text-white rounded"
                                    >
                                        Accélérer
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    )
}
