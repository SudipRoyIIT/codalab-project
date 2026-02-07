// src/components/NotificationContext.jsx
import React, { createContext, useState, useContext, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState({
    open: false,
    message: "",
    severity: "info", // 'success', 'error', 'warning', 'info'
  });

  const showNotification = useCallback((message, severity = "info") => {
    setNotification({
      open: true,
      message,
      severity,
    });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const value = {
    showNotification,
    hideNotification,
    showSuccess: (message) => showNotification(message, "success"),
    showError: (message) => showNotification(message, "error"),
    showWarning: (message) => showNotification(message, "warning"),
    showInfo: (message) => showNotification(message, "info"),
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={hideNotification}
          severity={notification.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};