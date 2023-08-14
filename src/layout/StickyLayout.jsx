import React from 'react';
import PropTypes from 'prop-types';
import {Grid, useTheme} from "@mui/material";
import Column from "../Column";

const LeftStickyColumnLayout = ({ stickyContent, children }) => {
  const theme = useTheme()
  return (
    <Grid container columnSpacing={2} wrap="nowrap">
      <Grid item style={{ width: '375px', position: 'sticky', left: 0, mr: theme.spacing(20),}}>
        {stickyContent}
      </Grid>
      <Grid item xs>
        <div style={{ display: 'flex', direction: 'row', overflowX: 'auto', gap: theme.spacing(2) }}>
          {children}
        </div>
      </Grid>
    </Grid>
  );
};

LeftStickyColumnLayout.propTypes = {
  
};

export default LeftStickyColumnLayout;