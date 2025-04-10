// src/components/AlertMessage.tsx
import React from "react";
import { Alert, Collapse, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface AlertMessageProps {
  message: string;
  severity: "error" | "warning" | "info" | "success";
  onClose: () => void;
}

const AlertMessage: React.FC<AlertMessageProps> = ({ message, severity, onClose }) => {
  return (
    <Collapse in={!!message}>
      <Alert
        severity={severity}
        variant="filled"
        sx={{
          mt: 2,
          fontWeight: "bold",
          fontSize: "1rem",
          borderRadius: 2,
        }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Collapse>
  );
};

export default AlertMessage;
