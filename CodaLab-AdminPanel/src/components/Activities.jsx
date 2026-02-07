// Activities.jsx - Exact same styling as News.jsx
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
  Link,
  Tooltip,
  Stack,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Event as EventIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

// Activity categories
const ACTIVITY_CATEGORIES = [
  "Major Services in IIT Roorkee",
  "Outreach From Research Activities", 
  "Professional Memberships and Affiliations",
];

const Activities = () => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [category, setCategory] = useState("");

  const [formData, setFormData] = useState({
    category: "",
    details: "",
  });

  // Fetch activities
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const endpoint = `${BASE_URL}/api/Admin/private/getSelectedActivity`;
      console.log("📡 Fetching activities from:", endpoint);
      
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      console.log("📊 Response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Activities data received:", data);
        setActivities(data);
      } else {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        toast.error("Failed to load activities");
        setActivities([]);
      }
    } catch (error) {
      console.error("💥 Network error:", error);
      toast.error("Cannot connect to server");
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleSearch = () => {
    setPage(0);
  };

  const handleClearSearch = () => {
    setSearchTitle("");
    setCategory("");
    setPage(0);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(0);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenDialog = (mode, activity = null) => {
    setDialogMode(mode);
    setSelectedActivity(activity);
    
    if (mode === 'edit' && activity) {
      setFormData({
        category: activity.activity_name || "",
        details: activity.details || "",
      });
    } else if (mode === 'add') {
      setFormData({
        category: "",
        details: "",
      });
    }
    
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      category: "",
      details: "",
    });
    setSelectedActivity(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (dialogMode !== 'delete') {
      const requiredFields = ['category', 'details'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill in: ${missingFields.join(', ')}`);
        return;
      }
    }

    const payload = {
      activity_name: formData.category,
      details: formData.details,
    };

    try {
      let endpoint = '';
      let method = '';
      
      if (dialogMode === 'add') {
        endpoint = `${BASE_URL}/api/Admin/private/createActivity`;
        method = 'POST';
      } else if (dialogMode === 'edit' && selectedActivity) {
        endpoint = `${BASE_URL}/api/Admin/private/updateActivity/${selectedActivity._id}`;
        method = 'PUT';
      } else if (dialogMode === 'delete' && selectedActivity) {
        endpoint = `${BASE_URL}/api/Admin/private/deleteActivity/${selectedActivity._id}`;
        method = 'DELETE';
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: method !== 'DELETE' ? JSON.stringify(payload) : undefined,
      });

      if (response.ok) {
        const action = dialogMode === 'add' ? 'added' : 
                     dialogMode === 'edit' ? 'updated' : 'deleted';
        toast.success(`Activity ${action} successfully!`);
        handleCloseDialog();
        fetchActivities();
      } else {
        const errorText = await response.text();
        toast.error(`Failed to ${dialogMode} activity`);
      }
    } catch (error) {
      toast.error(`Network error: ${error.message}`);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredActivities = activities.filter(item => {
    if (category && item.activity_name !== category) {
      return false;
    }
    
    if (searchTitle) {
      const title = item.activity_name?.toLowerCase() || "";
      const details = item.details?.toLowerCase() || "";
      if (!title.includes(searchTitle.toLowerCase()) && !details.includes(searchTitle.toLowerCase())) {
        return false;
      }
    }
    
    return true;
  });

  const activitiesWithCategory = activities.filter(item => item.activity_name).length;
  const uniqueCategories = [...new Set(activities.map(item => item.activity_name).filter(Boolean))];

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header - Exact same as News.jsx */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <EventIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Activities Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredActivities.length} activity item(s) found
          </Typography>
        </Box>
        <Box>
          <Chip
            icon={<EventIcon />}
            label="Activities"
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Filter and Actions Bar - Same styling */}
      <Paper sx={styles.actionBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search activities..."
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
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
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={handleCategoryChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {uniqueCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {(searchTitle || category) && (
                <Button
                  variant="outlined"
                  onClick={handleClearSearch}
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
                New Activity
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchActivities}
                size="small"
              >
                Refresh
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Statistics Cards - Same styling */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <EventIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{activities.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Activities
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CategoryIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{activitiesWithCategory}</Typography>
              <Typography variant="body2" color="text.secondary">
                With Category
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <DescriptionIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{filteredActivities.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Filtered Results
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <FilterIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4">{uniqueCategories.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Categories
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Activities Table - Same styling */}
      <TableContainer component={Paper} sx={styles.tablePaper}>
        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading activities...
            </Typography>
          </Box>
        ) : filteredActivities.length === 0 ? (
          <Box sx={styles.noDataContainer}>
            <EventIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No activities found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTitle || category
                ? `No activities match your filters`
                : "No activities available. Add your first activity!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
              sx={{ mt: 2 }}
            >
              ADD FIRST ACTIVITY
            </Button>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeader}>Category</TableCell>
                  <TableCell sx={styles.tableHeader}>Details</TableCell>
                  <TableCell sx={styles.tableHeader} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredActivities
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item._id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CategoryIcon sx={{ color: 'primary.main' }} />
                          <Typography variant="body1" fontWeight={500}>
                            {item.activity_name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {item.details?.length > 150 
                            ? `${item.details.substring(0, 150)}...` 
                            : item.details}
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
              count={filteredActivities.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </TableContainer>

      {/* Dialog for Add/Edit/Delete - Same styling */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'add' && 'Add New Activity'}
          {dialogMode === 'edit' && 'Edit Activity'}
          {dialogMode === 'delete' && 'Delete Activity'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === 'delete' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this activity? This action cannot be undone.
                </Alert>
                {selectedActivity && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Category:</strong> {selectedActivity.activity_name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Details:</strong> {selectedActivity.details?.substring(0, 100)}...
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Category</InputLabel>
                    <Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      label="Category"
                    >
                      <MenuItem value="">Select Category</MenuItem>
                      {ACTIVITY_CATEGORIES.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Details"
                    name="details"
                    value={formData.details}
                    onChange={handleInputChange}
                    multiline
                    rows={8}
                    placeholder="Enter detailed information about the activity..."
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
              {dialogMode === 'add' && 'Add Activity'}
              {dialogMode === 'edit' && 'Update Activity'}
              {dialogMode === 'delete' && 'Delete Activity'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

// EXACT SAME STYLES as News.jsx
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

export default Activities;