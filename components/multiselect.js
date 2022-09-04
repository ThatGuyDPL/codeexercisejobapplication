import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, value, theme) {
  return {
    fontWeight:
    value?.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export default function MultipleSelect({value, options, onChange, label}) {
  const theme = useTheme();

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="multiselect">{label}</InputLabel>
        <Select
          labelId="multiselect"
          id="multiselect"
          multiple
          value={value}
          onChange={onChange}
          input={<OutlinedInput label={label} />}
          MenuProps={MenuProps}
        >
          {options.map((option) => (
            <MenuItem
              key={option.Key}
              value={option.Key}
              style={getStyles(option.displayName, value, theme)}
            >
              {option.displayName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
