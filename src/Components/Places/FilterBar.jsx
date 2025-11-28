import React, { useState } from 'react';
import { Stack, Chip, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CloseIcon from '@mui/icons-material/Close'; // 1. Import Close Icon
import TuneIcon from '@mui/icons-material/Tune';
import { FILTERS_CONFIG, THEME } from './constants';

const FilterBar = ({ filtersApplied, setFiltersApplied }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState(null);

  // Opens the dropdown menu
  const handleChipClick = (event, filter) => {
    setAnchorEl(event.currentTarget);
    setActiveFilter(filter);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveFilter(null);
  };

  // Selects an option from the menu
  const handleOptionClick = (value) => {
    setFiltersApplied(prev => ({
      ...prev,
      [activeFilter.stateKey]: value 
    }));
    handleClose();
  };

  // 2. NEW FUNCTION: Clears a specific filter
  const handleClearFilter = (e, stateKey) => {
    e.stopPropagation(); // Prevent the menu from opening when clicking X
    setFiltersApplied(prev => ({
      ...prev,
      [stateKey]: "" // Reset to empty string (removes filter)
    }));
  };

  return (
    <Stack direction="row" spacing={1} sx={{ mb: 3, overflowX: 'auto', pb: 1, '::-webkit-scrollbar': { display: 'none' } }}>
      
      {/* Static "All Filters" Chip (Visual only) */}
      <Chip 
          icon={<TuneIcon sx={{ fontSize: '1rem !important' }} />} 
          label="All Filters" 
          variant="outlined" 
          sx={{ borderRadius: 3, fontWeight: 600, color: THEME.DARK, borderColor: '#ccc', height: 36 }}
      />

      {FILTERS_CONFIG.map((filter) => {
        // Check if this specific filter is currently active (has a value)
        const isActive = filtersApplied[filter.stateKey] && filtersApplied[filter.stateKey] !== 0;

        return (
            <Chip 
                key={filter.label}
                label={filter.label}
                variant="outlined"
                
                // 3. DYNAMIC ICON: Show 'X' if active, 'Arrow' if inactive
                deleteIcon={isActive ? <CloseIcon sx={{ fontSize: '1rem !important' }} /> : <KeyboardArrowDownIcon />}
                
                // 4. DYNAMIC ACTION: Clear if active, Open Menu if inactive (for the icon click)
                onDelete={isActive ? (e) => handleClearFilter(e, filter.stateKey) : (e) => handleChipClick(e, filter)}
                
                // Main body click always opens menu (so user can change selection without clearing)
                onClick={(e) => handleChipClick(e, filter)}

                sx={{ 
                    borderRadius: 3, 
                    fontWeight: 500, 
                    // 5. STYLING: Grey background if active, White if inactive
                    bgcolor: isActive ? '#f0f0f0' : 'white',
                    borderColor: isActive ? THEME.DARK : '#ddd',
                    color: THEME.DARK, 
                    height: 36, 
                    '& .MuiChip-deleteIcon': { 
                        color: THEME.GREY,
                        '&:hover': { color: THEME.RED } // Red X on hover
                    } 
                }}
            />
        );
      })}

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { mt: 1, minWidth: 220, borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
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