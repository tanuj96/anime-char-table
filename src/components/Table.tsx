import React, { useState, useCallback } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  Checkbox,
  Menu,
  MenuItem,
  FormControlLabel,
  IconButton,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import type { Character } from "../App";

type TableProps = {
  data: Character[];
  onSelectionChange: (selected: Character[]) => void;
};

export const DataTable = ({ data, onSelectionChange }: TableProps) => {
  const [selectAll, setSelectAll] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  const handleSelectionChange = useCallback(
    (newSelected: string[]) => {
      setSelectedRows(newSelected);
      const selectedData = data.filter((row) => newSelected.includes(row.id));
      onSelectionChange(selectedData);
    },
    [data, onSelectionChange]
  );

  const handleRowSelect = useCallback(
    (id: string, checked: boolean) => {
      const newSelected = checked
        ? [...selectedRows, id]
        : selectedRows.filter((rowId) => rowId !== id);
      handleSelectionChange(newSelected);
      setSelectAll(newSelected.length === data.length);
    },
    [selectedRows, data.length, handleSelectionChange]
  );

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const newSelected = checked ? data.map((row) => row.id) : [];
      handleSelectionChange(newSelected);
      setSelectAll(checked);
    },
    [data, handleSelectionChange]
  );

  const handleFilterToggle = useCallback((value: string) => {
    const newFilters = selectedFilters.includes(value)
      ? selectedFilters.filter((f) => f !== value)
      : [...selectedFilters, value];
    setSelectedFilters(newFilters);
  }, [selectedFilters]);

  const handleFilterClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleFilterClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleSort = useCallback(() => {
    setSortDirection((prev) => (prev === "asc" ? "desc" : prev === "desc" ? null : "asc"));
  }, []);

  const sortedData = React.useMemo(() => {
    if (!sortDirection) return data;
    return [...data].sort((a, b) =>
      sortDirection === "asc" ? a.power - b.power : b.power - a.power
    );
  }, [data, sortDirection]);

  const filteredData = React.useMemo(() => {
    if (selectedFilters.length === 0) return sortedData;
    return sortedData.filter((char) => selectedFilters.includes(char.health.toLowerCase()));
  }, [sortedData, selectedFilters]);

  const renderHealthCell = useCallback((health: string) => {
    const healthLower = health.toLowerCase();
    const color =
      healthLower === "critical"
        ? "#f44336"
        : healthLower === "injured"
        ? "#ff9800"
        : "#4caf50";

    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: color,
          }}
        />
        <span style={{ color }}>{health}</span>
      </Box>
    );
  }, []);

  return (
    <TableContainer component={Paper} aria-label="Character data table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Checkbox
                checked={selectAll}
                indeterminate={selectedRows.length > 0 && !selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
                aria-label="Select all rows"
              />
            </TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Health
                <IconButton size="small" onClick={handleFilterClick} aria-label="Filter by health">
                  <FilterListIcon fontSize="small" />
                </IconButton>
              </Box>
            </TableCell>
            <TableCell>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                Power
                <IconButton size="small" onClick={handleSort} aria-label="Sort by power">
                  {sortDirection === "asc" ? (
                    <KeyboardArrowUpIcon fontSize="small" />
                  ) : sortDirection === "desc" ? (
                    <KeyboardArrowDownIcon fontSize="small" />
                  ) : (
                    <KeyboardArrowUpIcon fontSize="small" style={{ opacity: 0.3 }} />
                  )}
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredData.map((row) => (
            <TableRow key={row.id}>
              <TableCell>
                <Checkbox
                  checked={selectedRows.includes(row.id)}
                  onChange={(e) => handleRowSelect(row.id, e.target.checked)}
                  aria-label={`Select ${row.name}`}
                />
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.location}</TableCell>
              <TableCell>{renderHealthCell(row.health)}</TableCell>
              <TableCell>{row.power}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Box sx={{ mb: 1 }}>
            <strong>Filter by Health</strong>
          </Box>
          {["healthy", "injured", "critical"].map((option) => (
            <MenuItem key={option} sx={{ py: 0.5 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    size="small"
                    checked={selectedFilters.includes(option)}
                    onChange={() => handleFilterToggle(option)}
                  />
                }
                label={option.charAt(0).toUpperCase() + option.slice(1)}
                sx={{ width: "100%" }}
              />
            </MenuItem>
          ))}
        </Box>
      </Menu>
    </TableContainer>
  );
};