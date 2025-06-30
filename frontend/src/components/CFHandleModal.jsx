import { useState, useEffect } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addStudent, editStudent } from '../services/operations/studentAPI.js';

export default function CFHandleModal({ isOpen, onClose, isAddMode, setIsAdd, id, onSuccess }) {
  const [cfHandle, setCfHandle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Reset fields when opening/closing
  useEffect(() => {
    if (!isOpen) {
      setCfHandle('');
      setEmail('');
      setPhone('');
      setIsAdd(false);
    }
  }, [isOpen, setIsAdd]);

  const title = isAddMode ? 'Add Student' : 'Edit Student';

  const handleConfirm = async () => {
    if (isAddMode) {
      await addStudent({ cfHandle, email, phone });
    } else {
      await editStudent({ cfHandle, email, phone, id });
    }
    onClose();
    onSuccess();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) onClose(); }}>
      {/* Optionally use DialogTrigger elsewhere if needed */}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="block text-sm font-medium mb-1">Codeforces Handle</label>
            <Input
              placeholder="Enter handle"
              value={cfHandle}
              onChange={e => setCfHandle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <Input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <Input
              placeholder="Enter phone"
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter className="space-x-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm}>{isAddMode ? 'Add' : 'Save'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}