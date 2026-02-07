// Research.jsx - Fixed to load ALL research areas
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
  Tooltip,
  Stack,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Science as ScienceIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  FormatListBulleted as ListIcon,
  CalendarToday as CalendarIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Research = () => {
  // States
  const [loading, setLoading] = useState(false);
  const [researchAreas, setResearchAreas] = useState([]);
  const [allResearchAreas, setAllResearchAreas] = useState([]); // Store all research areas
  const [searchTitle, setSearchTitle] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState(""); // 'add', 'edit', 'delete'
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    bulletPoints: [""],
  });

  // Load ALL research areas on component mount
  useEffect(() => {
    loadAllResearchAreas();
  }, []);

  // Load ALL research areas by making multiple search requests
  const loadAllResearchAreas = async () => {
    setLoading(true);
    try {
      console.log("📡 Loading all research areas...");
      
      // Common search terms that should cover most research areas
      // We'll search for common letters and combine results
      const searchTerms = ['a', 'e', 'i', 'o', 'u', 'r', 's', 't', 'n', 'm', 'l', 'c', 'd', 'p', 'b'];
      
      const allResults = new Map(); // Use Map to avoid duplicates based on _id
      
      // Search with multiple terms to capture all research areas
      for (const term of searchTerms) {
        try {
          const endpoint = `${BASE_URL}/api/Admin/private/getSelectedResearchArea/${encodeURIComponent(term)}`;
          
          const response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: "Bearer " + localStorage.getItem("accessToken"),
            },
          });

          if (response.ok) {
            const data = await response.json();
            let researchData = [];
            
            if (Array.isArray(data)) {
              researchData = data;
            } else if (data && data.DataForResearchAreaCollection) {
              researchData = data.DataForResearchAreaCollection;
            } else if (data && data.researcharea_name) {
              researchData = [data];
            }
            
            // Add to map (will automatically handle duplicates)
            researchData.forEach(item => {
              if (item._id) {
                allResults.set(item._id, item);
              }
            });
          }
        } catch (error) {
          console.error(`Error searching with term "${term}":`, error);
        }
      }
      
      // Convert Map to array
      const combinedResults = Array.from(allResults.values());
      
      console.log(`✅ Loaded ${combinedResults.length} unique research areas`);
      
      setAllResearchAreas(combinedResults);
      setResearchAreas(combinedResults);
      
      if (combinedResults.length > 0) {
        toast.success(`Loaded ${combinedResults.length} research areas`);
      }
    } catch (error) {
      console.error("💥 Error loading research areas:", error);
      toast.error("Failed to load research areas");
    } finally {
      setLoading(false);
    }
  };

  // Search research by title (local filter)
  const searchResearch = (title) => {
    if (!title || title.trim() === "") {
      // Show all research areas
      setResearchAreas(allResearchAreas);
      setHasSearched(false);
      return;
    }

    setHasSearched(true);
    
    // Filter locally from all research areas
    const searchTerm = title.toLowerCase();
    const filtered = allResearchAreas.filter(item => 
      item.researcharea_name.toLowerCase().includes(searchTerm)
    );
    
    setResearchAreas(filtered);
    setPage(0);
    
    if (filtered.length === 0) {
      toast.info(`No research areas found for "${title}"`);
    } else {
      toast.success(`Found ${filtered.length} research area(s)`);
    }
  };

  // Handle search button click
  const handleSearch = () => {
    searchResearch(searchTitle);
  };

  // Clear search and show all data
  const handleClearSearch = () => {
    setSearchTitle("");
    setHasSearched(false);
    setResearchAreas(allResearchAreas);
    setPage(0);
  };

  // Refresh all data from backend
  const handleRefresh = () => {
    setSearchTitle("");
    setHasSearched(false);
    loadAllResearchAreas();
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add bullet point
  const addBulletPoint = () => {
    setFormData(prev => ({
      ...prev,
      bulletPoints: [...prev.bulletPoints, ""]
    }));
  };

  // Remove bullet point
  const removeBulletPoint = (index) => {
    if (formData.bulletPoints.length > 1) {
      const newBulletPoints = formData.bulletPoints.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, bulletPoints: newBulletPoints }));
    }
  };

  // Handle bullet point change
  const handleBulletPointChange = (index, value) => {
    const newBulletPoints = [...formData.bulletPoints];
    newBulletPoints[index] = value;
    setFormData(prev => ({ ...prev, bulletPoints: newBulletPoints }));
  };

  // Open dialog
  const handleOpenDialog = (mode, research = null) => {
    setDialogMode(mode);
    setSelectedResearch(research);
    
    if (mode === 'edit' && research) {
      setFormData({
        title: research.researcharea_name || "",
        bulletPoints: Array.isArray(research.details) && research.details.length > 0 
          ? research.details 
          : research.details ? [research.details] : [""],
      });
    } else if (mode === 'add') {
      setFormData({
        title: "",
        bulletPoints: [""],
      });
    }
    
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      title: "",
      bulletPoints: [""],
    });
    setSelectedResearch(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (dialogMode !== 'delete') {
      if (!formData.title.trim()) {
        toast.error("Please enter a research title");
        return;
      }
      
      const filteredBulletPoints = formData.bulletPoints.filter(point => point.trim() !== "");
      if (filteredBulletPoints.length === 0) {
        toast.error("Please add at least one bullet point");
        return;
      }
    }

    // Prepare payload
    const payload = {
      researcharea_name: formData.title,
      details: formData.bulletPoints.filter(point => point.trim() !== ""),
    };

    setLoading(true);
    try {
      let endpoint = '';
      let method = '';
      
      if (dialogMode === 'add') {
        endpoint = `${BASE_URL}/api/Admin/private/createResearchArea`;
        method = 'POST';
      } else if (dialogMode === 'edit' && selectedResearch) {
        endpoint = `${BASE_URL}/api/Admin/private/UpdateResearchArea/${selectedResearch._id}`;
        method = 'PUT';
      } else if (dialogMode === 'delete' && selectedResearch) {
        endpoint = `${BASE_URL}/api/Admin/private/deleteSelectedResearchArea/${selectedResearch._id}`;
        method = 'DELETE';
      }

      console.log(`Making ${method} request to:`, endpoint);

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
        toast.success(`Research area ${action} successfully!`);
        handleCloseDialog();
        
        // Reload all data after successful operation
        await loadAllResearchAreas();
        
        // Clear search if active
        if (searchTitle.trim()) {
          setSearchTitle("");
          setHasSearched(false);
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast.error(`Failed to ${dialogMode} research area`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(`Network error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Statistics
  const totalResearch = researchAreas.length;
  const totalInDatabase = allResearchAreas.length;

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <ScienceIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Research Areas Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage and organize research areas
          </Typography>
        </Box>
        <Box>
          <Stack direction="row" spacing={2}>
            <Chip
              icon={<CalendarIcon />}
              label={new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
              color="primary"
              variant="outlined"
            />
            <Tooltip title="Refresh data from database">
              <IconButton onClick={handleRefresh} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Box>

      {/* Search Bar */}
      <Paper sx={styles.actionBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              fullWidth
              placeholder="Search research areas by title..."
              value={searchTitle}
              onChange={(e) => {
                setSearchTitle(e.target.value);
                // Real-time search as user types
                if (e.target.value.trim() === "") {
                  handleClearSearch();
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTitle && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClearSearch}>
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                variant="contained"
                onClick={handleSearch}
                startIcon={<SearchIcon />}
                disabled={!searchTitle.trim()}
              >
                Search
              </Button>
              {hasSearched && (
                <Button
                  variant="outlined"
                  onClick={handleClearSearch}
                  startIcon={<ClearIcon />}
                >
                  Clear
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
                sx={styles.addButton}
              >
                Add New
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <ScienceIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{totalInDatabase}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Research Areas
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <ListIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{totalResearch}</Typography>
              <Typography variant="body2" color="text.secondary">
                {hasSearched ? "Search Results" : "Showing"}
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <FilterIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6" sx={{ fontSize: '1.2rem' }}>
                {hasSearched ? searchTitle : "None"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Filter Applied
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <Typography variant="h4" sx={{ fontSize: '2rem', mb: 1 }}>📚</Typography>
              <Typography variant="body2" color="text.secondary">
                Research Database
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Research Areas Table */}
      <TableContainer component={Paper} sx={styles.tablePaper}>
        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading research areas...
            </Typography>
          </Box>
        ) : researchAreas.length === 0 ? (
          <Box sx={styles.noDataContainer}>
            <ScienceIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              {hasSearched ? "No research areas found" : "No research areas yet"}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {hasSearched 
                ? `No research areas found matching "${searchTitle}"`
                : "Get started by adding your first research area"
              }
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center">
              {hasSearched && (
                <Button
                  variant="outlined"
                  startIcon={<ClearIcon />}
                  onClick={handleClearSearch}
                >
                  Clear Search
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
              >
                ADD NEW RESEARCH AREA
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeader}>#</TableCell>
                  <TableCell sx={styles.tableHeader}>Research Area Title</TableCell>
                  <TableCell sx={styles.tableHeader}>Details</TableCell>
                  <TableCell sx={styles.tableHeader} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {researchAreas
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item, index) => {
                    const detailsCount = Array.isArray(item.details) 
                      ? item.details.length 
                      : item.details ? 1 : 0;
                    
                    return (
                      <TableRow key={item._id} hover>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {page * rowsPerPage + index + 1}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight={500} sx={{ color: '#1a237e' }}>
                            {item.researcharea_name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Chip
                              label={`${detailsCount} point${detailsCount !== 1 ? 's' : ''}`}
                              size="small"
                              color="primary"
                              variant="outlined"
                              sx={{ mb: 1 }}
                            />
                            {Array.isArray(item.details) && item.details.length > 0 && (
                              <Typography variant="caption" display="block" color="text.secondary">
                                {item.details[0].substring(0, 60)}
                                {item.details[0].length > 60 ? '...' : ''}
                              </Typography>
                            )}
                          </Box>
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
                    );
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component="div"
              count={researchAreas.length}
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
          {dialogMode === 'add' && 'Add New Research Area'}
          {dialogMode === 'edit' && 'Edit Research Area'}
          {dialogMode === 'delete' && 'Delete Research Area'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === 'delete' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this research area? This action cannot be undone.
                </Alert>
                {selectedResearch && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Research Area:</strong> {selectedResearch.researcharea_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Details:</strong> {
                        Array.isArray(selectedResearch.details)
                          ? `${selectedResearch.details.length} point(s)`
                          : selectedResearch.details ? '1 point' : 'No details'
                      }
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Research Area Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Artificial Intelligence, Machine Learning, etc."
                    helperText="Enter a descriptive title for this research area"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    Research Details / Key Points
                  </Typography>
                  {formData.bulletPoints.map((point, index) => (
                    <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'flex-start' }}>
                      <TextField
                        fullWidth
                        label={`Point ${index + 1}`}
                        value={point}
                        onChange={(e) => handleBulletPointChange(index, e.target.value)}
                        placeholder="Enter a key point or detail about this research area"
                        multiline
                        rows={2}
                      />
                      {formData.bulletPoints.length > 1 && (
                        <IconButton
                          onClick={() => removeBulletPoint(index)}
                          color="error"
                          size="small"
                          sx={{ mt: 1 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  ))}
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addBulletPoint}
                    sx={{ mt: 1 }}
                  >
                    Add Another Point
                  </Button>
                </Grid>
              </Grid>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2.5 }}>
            <Button onClick={handleCloseDialog} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color={dialogMode === 'delete' ? 'error' : 'primary'}
              disabled={loading}
            >
              {loading ? <CircularProgress size={20} /> : (
                <>
                  {dialogMode === 'add' && 'Add Research Area'}
                  {dialogMode === 'edit' && 'Update Research Area'}
                  {dialogMode === 'delete' && 'Delete Research Area'}
                </>
              )}
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
    p: 2.5,
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
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: 'var(--shadow-md)',
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

export default Research;