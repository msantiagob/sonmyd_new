
import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Loader2, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const { error } = await supabase
                .from('contacts')
                .insert([formData]);

            if (error) throw error;

            setStatus('success');
            setFormData({ name: '', email: '', phone: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
            setErrorMessage('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg mx-auto bg-white/80 p-8 rounded-2xl border border-white/40 backdrop-blur-md shadow-2xl shadow-slate-200/50">
            <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-800">Contáctanos</h3>
                <p className="text-slate-500 text-sm">Cuéntanos sobre tu proyecto.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-slate-900 placeholder-slate-400 transition-all font-medium"
                        placeholder="Tu nombre"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-slate-900 placeholder-slate-400 transition-all font-medium"
                        placeholder="tu@email.com"
                    />
                </div>

                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Teléfono (Opcional)</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-slate-900 placeholder-slate-400 transition-all font-medium"
                        placeholder="+123 456 7890"
                    />
                </div>

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Mensaje</label>
                    <textarea
                        id="message"
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none text-slate-900 placeholder-slate-400 transition-all resize-none font-medium"
                        placeholder="¿Cómo podemos ayudarte?"
                    ></textarea>
                </div>
            </div>

            <button
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                className={`w-full py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300
          ${status === 'success'
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : status === 'error'
                            ? 'bg-red-500 hover:bg-red-600 text-white'
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25'
                    }
        `}
            >
                {status === 'submitting' && (
                    <Loader2 className="w-5 h-5 animate-spin" />
                )}
                {status === 'success' && (
                    <>
                        <CheckCircle2 className="w-5 h-5" />
                        ¡Mensaje Enviado!
                    </>
                )}
                {status === 'error' && (
                    <>
                        <AlertCircle className="w-5 h-5" />
                        Error - Intenta de nuevo
                    </>
                )}
                {status === 'idle' && (
                    <>
                        Enviar Mensaje
                        <Send className="w-5 h-5" />
                    </>
                )}
            </button>

            {status === 'error' && (
                <p className="text-red-400 text-sm text-center mt-2">{errorMessage}</p>
            )}
        </form>
    );
}
