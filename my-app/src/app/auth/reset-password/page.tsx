'use client';

import { useState } from 'react';
import { supabase } from '../../../lib/supabase'; // Adjust the import path as necessary


const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage('Password reset email sent!');
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleResetPassword}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;