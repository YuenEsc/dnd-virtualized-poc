import React from 'react';
import {AppBar, Box, Toolbar, Typography, useTheme} from "@mui/material";


const FixedAppbarLayout = ({ children }) => {
  const theme = useTheme()
  return (
    <Box sx={{ height: '100vh',  maxHeight: '100vh', overflow: 'hidden', display: 'flex' }}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div">
            Route manager POC
          </Typography>
        </Toolbar>
      </AppBar>
      <Box  sx={{ flex: 1, mt: theme.spacing(9)}}>
        {children}
      </Box>
    </Box>
  );
};

FixedAppbarLayout.propTypes = {

};

export default FixedAppbarLayout;