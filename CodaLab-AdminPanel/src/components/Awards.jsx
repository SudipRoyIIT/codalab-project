// Awards.jsx - Removed Date Column
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  EmojiEvents as TrophyIcon,
  Mic as MicIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Category as CategoryIcon,
  Info as InfoIcon,
  WorkspacePremium as AwardIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

// API Base URL
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Awards = () => {
  const [loading, setLoading] = useState(true);
  const [awardsData, setAwardsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedAward, setSelectedAward] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    field: "",
    additionalInfo: "",
  });

  // Categories - IMPORTANT: Exact match backend se
  const categories = [
    'Awards And Fellowships',
    'Invited Talks',
  ];

  // Fetch awards data
  const fetchAwardsData = async () => {
    setLoading(true);
    try {
      const endpoint = `${BASE_URL}/api/Admin/private/getSelectedAwardsAndTalks`;
      const url = `${endpoint}?_=${new Date().getTime()}`;
      
      console.log("📡 Fetching awards data from:", url);
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      console.log("📊 Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Awards data received:", data);
        
        let finalData = [];
        if (Array.isArray(data)) {
          finalData = data;
        } else if (data && typeof data === 'object') {
          if (Array.isArray(data.data)) {
            finalData = data.data;
          } else if (Array.isArray(data.awards)) {
            finalData = data.awards;
          } else if (Array.isArray(data.result)) {
            finalData = data.result;
          }
        }
        
        setAwardsData(finalData);
        setFilteredData(finalData);
        
        if (finalData.length === 0) {
          toast.info("No awards or talks found");
        } else {
          toast.success(`Loaded ${finalData.length} awards/talks`);
        }
      } else {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        toast.error("Failed to load awards data");
        setAwardsData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("💥 Network error:", error);
      toast.error("Cannot connect to server");
      setAwardsData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAwardsData();
  }, []);

  // Filter data when search or category changes
  useEffect(() => {
    let filtered = [...awardsData];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        (item.field && item.field.toLowerCase().includes(query)) ||
        (item.additionalInfo && item.additionalInfo.toLowerCase().includes(query))
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter(item => item.field === categoryFilter);
    }

    setFilteredData(filtered);
    setPage(0);
  }, [searchQuery, categoryFilter, awardsData]);

  // Handle search
  const handleSearch = () => {
    fetchAwardsData();
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("");
    fetchAwardsData();
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle category selection
  const handleCategoryChange = (event) => {
    setFormData(prev => ({ ...prev, field: event.target.value }));
  };

  // Open dialog
  const handleOpenDialog = (mode, award = null) => {
    setDialogMode(mode);
    setSelectedAward(award);
    
    if (mode === 'edit' && award) {
      setFormData({
        field: award.field || "",
        additionalInfo: award.additionalInfo || "",
      });
    } else if (mode === 'add') {
      setFormData({
        field: categories[0], // Default first category
        additionalInfo: "",
      });
    } else if (mode === 'delete' && award) {
      setFormData({
        field: award.field || "",
        additionalInfo: award.additionalInfo || "",
      });
    }
    
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      field: categories[0],
      additionalInfo: "",
    });
    setSelectedAward(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(`Submitting ${dialogMode} form:`, formData);
    
    // Validation
    if (dialogMode !== 'delete') {
      if (!formData.field || !formData.additionalInfo) {
        toast.error("Please fill in all required fields");
        return;
      }
    }

    try {
      let endpoint = '';
      let method = '';
      let payload = {};
      
      if (dialogMode === 'add') {
        endpoint = `${BASE_URL}/api/Admin/private/createAwardsAndTalks`;
        method = 'POST';
        payload = {
          field: formData.field,
          additionalInfo: formData.additionalInfo
        };
      } else if (dialogMode === 'edit' && selectedAward) {
        endpoint = `${BASE_URL}/api/Admin/private/updateAwardsAndTalks/${selectedAward._id}`;
        method = 'PUT';
        payload = {
          field: formData.field,
          additionalInfo: formData.additionalInfo
        };
      } else if (dialogMode === 'delete' && selectedAward) {
        endpoint = `${BASE_URL}/api/Admin/private/deleteAwardsAndTalks/${selectedAward._id}`;
        method = 'DELETE';
      }

      console.log(`Making ${method} request to:`, endpoint);
      console.log('Payload:', payload);

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: method !== 'DELETE' ? JSON.stringify(payload) : undefined,
      });

      console.log('Response status:', response.status);

      if (response.ok) {
        const action = dialogMode === 'add' ? 'added' : 
                     dialogMode === 'edit' ? 'updated' : 'deleted';
        toast.success(`Award/Talk ${action} successfully!`);
        handleCloseDialog();
        fetchAwardsData();
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast.error(`Failed to ${dialogMode} award/talk`);
      }
    } catch (error) {
      console.error(`${dialogMode} error:`, error);
      toast.error(`Network error: ${error.message}`);
    }
  };

  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Statistics
  const totalAwards = awardsData.filter(item => 
    item.field === 'Awards And Fellowships'
  ).length;
  
  const totalTalks = awardsData.filter(item => 
    item.field === 'Invited Talks'
  ).length;

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <AwardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Awards & Invited Talks
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredData.length} item(s) found
          </Typography>
        </Box>
      </Box>

      {/* Filter and Actions Bar */}
      <Paper sx={styles.actionBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search awards or talks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={(e) => setCategoryFilter(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <CategoryIcon />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {(searchQuery || categoryFilter) && (
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  size="small"
                >
                  Clear Filters
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
                sx={styles.addButton}
              >
                New Award/Talk
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchAwardsData}
              >
                Refresh
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <TrophyIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{totalAwards}</Typography>
              <Typography variant="body2" color="text.secondary">
                Awards & Fellowships
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <MicIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{totalTalks}</Typography>
              <Typography variant="body2" color="text.secondary">
                Invited Talks
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <FilterIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4">{filteredData.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Filtered Results
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Awards Table */}
      <TableContainer component={Paper} sx={styles.tablePaper}>
        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading awards and talks...
            </Typography>
          </Box>
        ) : filteredData.length === 0 ? (
          <Box sx={styles.noDataContainer}>
            <AwardIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No awards or talks found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery || categoryFilter
                ? `No items match your filters`
                : "No awards or talks available. Add your first item!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
              sx={{ mt: 2 }}
            >
              ADD FIRST AWARD/TALK
            </Button>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeader}>Type</TableCell>
                  <TableCell sx={styles.tableHeader}>Details</TableCell>
                  <TableCell sx={styles.tableHeader} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <Chip
                          icon={item.field === 'Invited Talks' ? <MicIcon /> : <TrophyIcon />}
                          label={item.field}
                          color={item.field === 'Invited Talks' ? 'success' : 'primary'}
                          variant="outlined"
                          sx={{ cursor: 'pointer' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body1" fontWeight={500}>
                          {item.additionalInfo}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleOpenDialog('edit', item)}
                              sx={{
                                color: 'primary.main',
                                '&:hover': {
                                  backgroundColor: 'rgba(67, 97, 238, 0.1)',
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleOpenDialog('delete', item)}
                              sx={{
                                color: 'error.main',
                                '&:hover': {
                                  backgroundColor: 'rgba(239, 68, 68, 0.1)',
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TableContainer>

      {/* Dialog for Add/Edit/Delete */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'add' && 'Add New Award/Talk'}
          {dialogMode === 'edit' && 'Edit Award/Talk'}
          {dialogMode === 'delete' && 'Delete Award/Talk'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === 'delete' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this item? This action cannot be undone.
                </Alert>
                {selectedAward && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Type:</strong> {selectedAward.field}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Details:</strong> {selectedAward.additionalInfo}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Type</InputLabel>
                    <Select
                      name="field"
                      value={formData.field}
                      onChange={handleCategoryChange}
                      label="Type"
                      startAdornment={
                        <InputAdornment position="start">
                          <CategoryIcon />
                        </InputAdornment>
                      }
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Details"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    placeholder="e.g., Best Paper Award - IEEE Conference 2024 or Guest Lecture at IIT Delhi"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <InfoIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              color={dialogMode === 'delete' ? 'error' : 'primary'}
            >
              {dialogMode === 'add' && 'Add Item'}
              {dialogMode === 'edit' && 'Update Item'}
              {dialogMode === 'delete' && 'Delete Item'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

// Styles
const styles = {
  container: {
    p: 3,
    backgroundColor: 'background.default',
    minHeight: '100vh',
  },
  header: {
    mb: 4,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 2,
  },
  title: {
    fontWeight: 700,
    color: 'var(--primary-color)',
  },
  actionBar: {
    p: 2,
    mb: 3,
    backgroundColor: 'background.paper',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
  },
  addButton: {
    backgroundColor: 'var(--primary-color)',
    '&:hover': {
      backgroundColor: 'var(--secondary-color)',
    },
  },
  statCard: {
    p: 3,
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
    },
  },
  statCardContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  tablePaper: {
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    overflow: 'hidden',
    minHeight: '400px',
  },
  tableHeader: {
    fontWeight: 600,
    backgroundColor: 'var(--header-bg)',
    color: 'var(--dark-color)',
    fontSize: '0.875rem',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 10,
  },
  noDataContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    py: 8,
    textAlign: 'center',
  },
};

export default Awards;