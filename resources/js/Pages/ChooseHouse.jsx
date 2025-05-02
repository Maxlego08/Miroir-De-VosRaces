import {Head} from '@inertiajs/react';
import React, {useState} from 'react';
import axios from "axios";

export default function ChooseHouse({}) {

    const [form, setForm] = useState({nom: '', traits: ''});
    const [maison, setMaison] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
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

    const handleSubmit = async () => {
        setLoading(true);
        setMaison(null);
        try {
            const apiClient = axios.create({
                baseURL: import.meta.env.VITE_REACT_APP_API_URL, headers: {
                    'Content-Type': 'application/json', 'X-CSRF-TOKEN': getCsrfToken()
                }
            });
            console.log(form);
            const response = await apiClient.post('/choose-house', form);
            setMaison(response.data.message);
        } catch (error) {
            setMaison("Erreur lors de l'interrogation du miroir.");
        }
        setLoading(false);
    };

    return (
        <>
            <Head title="Miroir de VosRaces"/>
            <div className="p-4 max-w-xl mx-auto bg-white rounded shadow">
                <h1 className="text-xl font-bold mb-4">Formulaire de Répartition</h1>
                <input
                    name="nom"
                    placeholder="Nom du joueur"
                    value={form.nom}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2 rounded"
                />
                <textarea
                    name="traits"
                    placeholder="Décris ta personnalité, tes goûts, ton comportement..."
                    value={form.traits}
                    onChange={handleChange}
                    className="w-full border p-2 mb-2 rounded"
                    rows={4}
                />
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                >
                    {loading ? 'Consultation du miroir...' : 'Demander au miroir'}
                </button>
                {maison && <div className="mt-4 text-lg font-semibold text-center">{maison}</div>}
            </div>
        </>
    )
}
