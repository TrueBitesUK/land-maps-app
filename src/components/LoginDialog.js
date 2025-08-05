// src/components/LoginDialog.js

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LoginForm from './LoginForm';

export default function LoginDialog({ open, onClose, onLoginSuccess }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Login
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <LoginForm
          onLoginSuccess={(email) => {
            onLoginSuccess(email);
            onClose();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
