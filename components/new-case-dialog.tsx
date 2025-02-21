'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AICaseOnboarding } from '@/components/ai-case-onboarding';

interface NewCaseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewCaseDialog({ open, onOpenChange }: NewCaseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New Case</DialogTitle>
        </DialogHeader>
        <AICaseOnboarding />
      </DialogContent>
    </Dialog>
  );
}