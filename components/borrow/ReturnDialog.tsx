"use client"

import { FC, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useReturnOrder } from '@/hooks/orders/useReturnOrder';

interface ReturnDialogProps {
  orderId: number;
  isOpen: boolean;
  onClose: () => void;
}

const ReturnDialog: FC<ReturnDialogProps> = ({ orderId, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const returnOrderMutation = useReturnOrder();

  const handleReturn = async () => {
    setLoading(true);
    try {
      await returnOrderMutation.mutateAsync(orderId);
      onClose();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent asChild>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl p-6 max-w-md mx-auto shadow-lg"
        >
          <DialogHeader>
            <DialogTitle>Return Order</DialogTitle>
          </DialogHeader>
          <p className="my-4 text-sm text-gray-600">
            Are you sure you want to return this order? This action will set its status back to <strong>Pending</strong>.
          </p>
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleReturn}>
              Return
            </Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default ReturnDialog;