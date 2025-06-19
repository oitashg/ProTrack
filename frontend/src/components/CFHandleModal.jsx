import { useState } from 'react';
import { addStudent, editStudent } from '../services/operations/studentAPI.js';

export default function CFHandleModal({ isOpen, onClose, isAddMode, setIsAdd, id, onSuccess}) {
  const [cfHandle, setCfHandle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleCancel = () => {
    setCfHandle('');
    setEmail('');
    setPhone('');
    setIsAdd(false)
    onClose();
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-xl p-6 shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-4">{(isAddMode === true) ? "Add" : "Edit"} Codeforces Handle</h2>

        <input
          type="text"
          placeholder="Enter Codeforces handle"
          value={cfHandle}
          onChange={(e) => setCfHandle(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="text"
          placeholder="Enter email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <input
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        />

        <div className="flex justify-end space-x-3">
          {
            (isAddMode === true) ? (
              <button
              onClick={async () => {
                await addStudent({cfHandle,email,phone})
                handleCancel()
                onSuccess()}
              }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
            ) : (
              <button
              onClick={async () => {
                await editStudent({cfHandle,email,phone,id})
                handleCancel()
                onSuccess()}
            }
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
            )
          }

          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}