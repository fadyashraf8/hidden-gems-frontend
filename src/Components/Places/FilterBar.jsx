
import React, { useState } from 'react';
import { Stack, Chip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TuneIcon from '@mui/icons-material/Tune';
import { FILTERS_CONFIG, THEME } from './constants';

const FilterBar = ({ filtersApplied, setFiltersApplied }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  const handleChipClick = (event, filter) => {
    console.log("Filter clicked:", filter);
    setAnchorEl(event.currentTarget);
    setActiveFilter(filter);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveFilter(null);
  };

  const handleOptionClick = (value) => {
    setFiltersApplied(prev => ({
      ...prev,
      [activeFilter.stateKey]: value 
    }));
    
    handleClose();
  };

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1, '::-webkit-scrollbar': { display: 'none' } }}>
      <Chip 
          icon={<TuneIcon sx={{ fontSize: '1rem !important' }} />} 
          label="All Filters" 
          variant="outlined" 
          sx={{ borderRadius: 2, fontWeight: 600, color: THEME.DARK, borderColor: '#ccc', height: 36 }}
      />

      {FILTERS_CONFIG.map((filter) => (
        <Chip 
            key={filter.label}
            label={filter.label}
            variant="outlined"
            deleteIcon={<KeyboardArrowDownIcon />}
            onDelete={(e) => handleChipClick(e, filter)} 
            onClick={(e) => handleChipClick(e, filter)}
            sx={{ 
                borderRadius: 2, 
                fontWeight: 500, 
                bgcolor: filtersApplied[filter.stateKey] ? '#f0f0f0' : 'white',
                borderColor: filtersApplied[filter.stateKey] ? THEME.DARK : '#ddd',
                color: THEME.DARK, 
                height: 36, 
                '& .MuiChip-deleteIcon': { color: THEME.GREY } 
            }}
        />
      ))}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { mt: 1, minWidth: 220, borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
      >
        {activeFilter && activeFilter.options.map((option) => (
          <MenuItem 
            key={option.value} 
            onClick={() => handleOptionClick(option.value)}
            selected={filtersApplied[activeFilter.stateKey] === option.value}
          >
             {option.icon && (
               <ListItemIcon sx={{minWidth: '36px !important'}}>
                  {option.icon}
               </ListItemIcon>
             )}
             <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

export default FilterBar;