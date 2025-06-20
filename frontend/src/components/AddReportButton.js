import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircleIcon } from '@heroicons/react/24/solid';

const AddReportButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/user/new-report')}
      className="fixed bottom-8 right-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-full shadow-lg flex items-center transition-all duration-300 transform hover:scale-105"
    >
      <PlusCircleIcon className="h-6 w-6 mr-2" />
      Add Report
    </button>
  );
};

export default AddReportButton;