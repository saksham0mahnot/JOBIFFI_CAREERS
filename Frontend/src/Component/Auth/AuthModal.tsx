import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import Login from './Login/Login';
import Register from './Register/Register';
import EmployerLogin from './EmployerLogin/EmployerLogin';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register' | 'employer';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState<'login' | 'register' | 'employer'>(initialMode);

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[460px] relative overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-800 bg-gray-100/50 hover:bg-gray-100 rounded-full transition-colors z-10 border-none outline-none focus:outline-none focus:ring-0"
                >
                    <FiX size={20} />
                </button>

                {mode === 'login' && <Login onToggleMode={setMode} />}
                {mode === 'register' && <Register onToggleMode={setMode} />}
                {mode === 'employer' && <EmployerLogin onToggleMode={setMode} />}
            </div>
        </div>
    );
};

export default AuthModal;
