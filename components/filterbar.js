import { Search } from "@mui/icons-material";
import { Grid, IconButton, Popover, TextField } from "@mui/material";
import { Box } from "@mui/system";
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState } from "react";

export default function FilterBar({ keyWordChange, keyword, children }) {
  const [anchorEL, setAnchorEL] = useState(null);
  const [key, setKey] = useState(null);
  const open = Boolean(anchorEL);

  return (
    <Grid
      container
      direction="row"
      alignItems="end"
      justifyContent="end"
      spacing={1}
    >
      <Grid item>
        <Box component='form' onSubmit={(e)=>{e.preventDefault(); keyWordChange(key)}} sx={{ display: "flex", alignItems: "flex-end" }}>
          <Search sx={{ mr: 1 }} />
          <TextField
            fullWidth
            label="Search Product"
            defaultValue={keyword}
            variant="standard"
            onChange={(e)=>{setKey(e.target.value)}}
          />
        </Box>
      </Grid>
      <Grid item>
        <IconButton onClick={(e) => setAnchorEL(e.target)}>
          <FilterListIcon />
        </IconButton>
        <Popover
          anchorEl={anchorEL}
          onClose={() => setAnchorEL(null)}
          open={open}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {children}
        </Popover>
      </Grid>
    </Grid>
  );
}
