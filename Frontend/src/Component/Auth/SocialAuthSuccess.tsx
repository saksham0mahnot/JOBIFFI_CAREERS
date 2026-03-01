import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const SocialAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = searchParams.get('token');
        const id = searchParams.get('id');
        const name = searchParams.get('name');
        const email = searchParams.get('email');
        const role = searchParams.get('role');

        if (token && id && name && email && role) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify({ id, name, email, role }));

            toast.success(`Welcome back, ${name}!`);

            // Redirect to home or dashboard after successful login
            window.location.href = '/';
        } else {
            toast.error('Authentication failed. Please try again.');
            navigate('/');
        }
    }, [searchParams, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0122c5]"></div>
            <p className="mt-4 text-gray-600 font-medium text-lg">Authenticating you...</p>
        </div>
    );
};

export default SocialAuthSuccess;
