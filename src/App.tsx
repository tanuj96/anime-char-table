import { useEffect, useState, useMemo } from "react";
import { DataTable } from "./components/Table";
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";

export interface Character {
  id: string;
  name: string;
  location: string;
  health: "Healthy" | "Injured" | "Critical";
  power: number;
  selected: boolean;

}

function App() {
  const [charData, setCharData] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const URL = "https://anime-char-table-production.up.railway.app/characters";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(URL);
        const data = await response.json();
        setCharData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return charData;
    const term = searchTerm.toLowerCase();
    return charData.filter(
      (char) =>
        char.name.toLowerCase().includes(term) ||
        char.location.toLowerCase().includes(term)
    );
  }, [charData, searchTerm]);

  const handleSelectionChange = (selected: Character[]) => {
    setSelectedRows(selected);
  };

  const handleToggleViewed = () => {
    const selectedChars = selectedRows.map((row) => ({
      id: row.id,
      name: row.name,
    }));
    console.log("Selected Characters:", selectedChars);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "grey.50",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", mb: 4 }}
        style={{color: "#000000"}}
      >
        Character Dashboard
      </Typography>

      <Box
        sx={{
          mb: 3,
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
          p: 2,
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 1,
        }}
      >
        <TextField
          placeholder="Search by name or location..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          aria-label="Search characters by name or location"
        />

        <Tooltip title="Mark selected as viewed">
          <IconButton
            color="primary"
            onClick={handleToggleViewed}
            disabled={selectedRows.length === 0}
            aria-label="Mark selected characters as viewed"
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>

        <Button
          variant="contained"
          onClick={handleToggleViewed}
          disabled={selectedRows.length === 0}
          startIcon={<VisibilityIcon />}
          aria-label={`Mark ${selectedRows.length} selected characters as viewed`}
        >
          Mark Viewed ({selectedRows.length})
        </Button>
      </Box>

      <Box sx={{ backgroundColor: "white", borderRadius: 2, p: 2, boxShadow: 1 }}>
        <DataTable
          data={filteredData}
          onSelectionChange={handleSelectionChange}
        />
      </Box>
    </Box>
  );
}

export default App;
