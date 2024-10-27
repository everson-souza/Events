import React from 'react';
import { Alert } from '@mui/material';

export const AlertComponent = ({
    alertStatus,
    message,
    severity    
}: {
    alertStatus:boolean;
    message: string;
    severity: string;    
}) => {

    return (
    <div className="alerta">
        {alertStatus ? 
            (
                <Alert severity={severity == "success" ? "success" : severity == "error" ? "error" : severity == "info" ? "info" : "warning"}>
                    {message}
                </Alert>
            ) : (null)
        }
    </div>
  );
};