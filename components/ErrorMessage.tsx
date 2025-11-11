
import React from 'react';

interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="max-w-2xl mx-auto my-10 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
      <p className="font-bold">An error occurred</p>
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default ErrorMessage;
