import { NextPage } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

const RegisterPage: NextPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
            <RegisterForm />
        </div>
    );
};

export default RegisterPage;
