import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <h1>Create an account</h1>
      <p>You can register as a Customer or Admin.</p>
      <RegisterForm onSuccess={() => navigate('/')} />
    </div>
  );
}
