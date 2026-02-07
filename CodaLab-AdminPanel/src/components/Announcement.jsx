// Announcement.jsx - Complete Working Code
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
  CalendarToday as CalendarIcon,
  Announcement as AnnouncementIcon,
  Link as LinkIcon,
  DateRange as DateRangeIcon,
  Refresh as RefreshIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

// API Base URL
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Announcement = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    date: "",
    priority: "normal",
  });

  // Fetch announcements - CORRECT ENDPOINT
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      // CORRECT ENDPOINT: getselectedannouncements (plural)
      const endpoint = `${BASE_URL}/api/Admin/private/getselectedannouncements`;
      console.log("📡 Fetching announcements from:", endpoint);
      
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
        console.log("✅ Announcements data:", data);
        
        if (Array.isArray(data)) {
          setAnnouncements(data);
          if (data.length === 0) {
            toast.info("No announcements found");
          } else {
            toast.success(`Loaded ${data.length} announcements`);
          }
        } else {
          console.warn("⚠️ Unexpected data format:", data);
          setAnnouncements([]);
          toast.error("Invalid data format from server");
        }
      } else {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        toast.error(`Failed to load announcements: ${response.status}`);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("💥 Network error:", error);
      toast.error("Cannot connect to backend server");
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Handle search
  const handleSearch = () => {
    // Client-side filtering
    setPage(0);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTitle("");
    setPage(0);
  };

  // Handle date filter
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    setPage(0);
  };

  // Clear date filter
  const handleClearDateFilter = () => {
    setSelectedDate("");
    setPage(0);
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open dialog for add/edit/delete
  const handleOpenDialog = (mode, announcement = null) => {
    console.log(`Opening ${mode} dialog for:`, announcement);
    
    setDialogMode(mode);
    setSelectedAnnouncement(announcement);
    
    if (mode === 'edit' && announcement) {
      setFormData({
        title: announcement.topicOfAnnouncement || "",
        description: announcement.description || "",
        link: announcement.readMore || "",
        date: announcement.announcementDate
          ? new Date(announcement.announcementDate).toISOString().split('T')[0]
          : "",
        priority: announcement.priority || "normal",
      });
    } else if (mode === 'add') {
      setFormData({
        title: "",
        description: "",
        link: "",
        date: new Date().toISOString().split('T')[0],
        priority: "normal",
      });
    } else if (mode === 'delete' && announcement) {
      setFormData({
        title: announcement.topicOfAnnouncement || "",
        description: announcement.description || "",
        link: announcement.readMore || "",
        date: "",
        priority: announcement.priority || "normal",
      });
    }
    
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      title: "",
      description: "",
      link: "",
      date: "",
      priority: "normal",
    });
    setSelectedAnnouncement(null);
  };

  // Handle form submission - FIXED for delete operation
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(`Submitting ${dialogMode} form:`, formData);
    
    try {
      let endpoint = '';
      let method = '';
      let payload = null;
      
      // Handle different dialog modes
      if (dialogMode === 'add') {
        // Validation for add
        const requiredFields = ['title', 'description', 'date'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(', ')}`);
          return;
        }
        
        endpoint = `${BASE_URL}/api/Admin/private/createAnnouncement`;
        method = 'POST';
        payload = {
          topicOfAnnouncement: formData.title,
          description: formData.description,
          readMore: formData.link,
          announcementDate: new Date(formData.date).toISOString(),
          priority: formData.priority,
        };
      } 
      else if (dialogMode === 'edit' && selectedAnnouncement) {
        // Validation for edit
        const requiredFields = ['title', 'description', 'date'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(', ')}`);
          return;
        }
        
        endpoint = `${BASE_URL}/api/Admin/private/updateAnnouncement/${selectedAnnouncement._id}`;
        method = 'PUT';
        payload = {
          topicOfAnnouncement: formData.title,
          description: formData.description,
          readMore: formData.link,
          announcementDate: new Date(formData.date).toISOString(),
          priority: formData.priority,
        };
      } 
      else if (dialogMode === 'delete' && selectedAnnouncement) {
        endpoint = `${BASE_URL}/api/Admin/private/deleteAnnouncement/${selectedAnnouncement._id}`;
        method = 'DELETE';
        // No payload needed for delete
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
        const action = dialogMode === 'add' ? 'created' : 
                     dialogMode === 'edit' ? 'updated' : 'deleted';
        toast.success(`Announcement ${action} successfully!`);
        handleCloseDialog();
        fetchAnnouncements();
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        toast.error(`Failed to ${dialogMode} announcement: ${errorText.substring(0, 100)}`);
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Get priority chip color
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'default';
    }
  };

  // Filter announcements by date and search
  const filteredAnnouncements = announcements.filter(announcement => {
    const title = announcement.topicOfAnnouncement || "";
    const date = announcement.announcementDate;
    
    if (selectedDate && date) {
      try {
        const announcementDate = new Date(date).toISOString().split('T')[0];
        if (announcementDate !== selectedDate) return false;
      } catch {
        return false;
      }
    }
    
    if (searchTitle) {
      if (!title.toLowerCase().includes(searchTitle.toLowerCase())) return false;
    }
    
    return true;
  });

  // Statistics
  const totalAnnouncements = announcements.length;
  const todayAnnouncements = announcements.filter(a => {
    const date = a.announcementDate;
    if (!date) return false;
    
    try {
      const announcementDate = new Date(date).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      return announcementDate === today;
    } catch {
      return false;
    }
  }).length;

  const highPriorityCount = announcements.filter(a => {
    return a.priority?.toLowerCase() === 'high';
  }).length;

  const upcomingAnnouncements = announcements.filter(a => {
    const date = a.announcementDate;
    if (!date) return false;
    
    try {
      const announcementDate = new Date(date);
      const today = new Date();
      return announcementDate > today;
    } catch {
      return false;
    }
  }).length;

  return (
    <Box sx={styles.container}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      {/* Header */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <AnnouncementIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Announcements
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredAnnouncements.length} announcement(s) found
          </Typography>
        </Box>
        <Box>
          <Chip
            icon={<CalendarIcon />}
            label={formatDate(new Date().toISOString())}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Filter and Actions Bar */}
      <Paper sx={styles.actionBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by title..."
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
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Filter by Date"
              value={selectedDate}
              onChange={handleDateChange}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DateRangeIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              size="small"
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {(searchTitle || selectedDate) && (
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleClearSearch();
                    handleClearDateFilter();
                  }}
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
                New Announcement
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={fetchAnnouncements}
              >
                Refresh
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
              <AnnouncementIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{totalAnnouncements}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Announcements
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CalendarIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{todayAnnouncements}</Typography>
              <Typography variant="body2" color="text.secondary">
                Today's Announcements
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <VisibilityIcon sx={{ fontSize: 40, color: 'error.main', mb: 1 }} />
              <Typography variant="h4">{highPriorityCount}</Typography>
              <Typography variant="body2" color="text.secondary">
                High Priority
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <FilterIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{upcomingAnnouncements}</Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Announcements Table */}
      <TableContainer component={Paper} sx={styles.tablePaper}>
        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading announcements...
            </Typography>
          </Box>
        ) : filteredAnnouncements.length === 0 ? (
          <Box sx={styles.noDataContainer}>
            <AnnouncementIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No announcements found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchTitle || selectedDate
                ? `No announcements match your filters`
                : "No announcements available. Create your first announcement!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
              sx={{ mt: 2 }}
            >
              ADD FIRST ANNOUNCEMENT
            </Button>
          </Box>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={styles.tableHeader}>Title</TableCell>
                  <TableCell sx={styles.tableHeader}>Description</TableCell>
                  <TableCell sx={styles.tableHeader}>Date & Priority</TableCell>
                  <TableCell sx={styles.tableHeader}>Link</TableCell>
                  <TableCell sx={styles.tableHeader} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAnnouncements
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((announcement) => (
                    <TableRow key={announcement._id} hover>
                      <TableCell>
                        <Typography variant="body1" fontWeight={500}>
                          {announcement.topicOfAnnouncement}
                        </Typography>
                        {announcement.createdAt && (
                          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                            Created: {formatDate(announcement.createdAt)}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {announcement.description}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={1}>
                          <Chip
                            icon={<CalendarIcon />}
                            label={formatDate(announcement.announcementDate)}
                            size="small"
                            variant="outlined"
                            sx={{ cursor: 'pointer' }}
                          />
                          <Chip
                            label={announcement.priority || 'normal'}
                            color={getPriorityColor(announcement.priority)}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {announcement.readMore ? (
                          <Link
                            href={announcement.readMore}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                          >
                            <LinkIcon fontSize="small" />
                            View Link
                          </Link>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No link provided
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleOpenDialog('edit', announcement)}
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
                              onClick={() => handleOpenDialog('delete', announcement)}
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
              count={filteredAnnouncements.length}
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
          {dialogMode === 'add' && 'Add New Announcement'}
          {dialogMode === 'edit' && 'Edit Announcement'}
          {dialogMode === 'delete' && 'Delete Announcement'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === 'delete' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this announcement? This action cannot be undone.
                </Alert>
                {selectedAnnouncement && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Title:</strong> {selectedAnnouncement.topicOfAnnouncement}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Date:</strong> {formatDate(selectedAnnouncement.announcementDate)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Priority:</strong> {selectedAnnouncement.priority || 'normal'}
                    </Typography>
                  </Box>
                )}
              </Box>
            ) : (
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Announcement Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., University Holiday, Exam Schedule"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      label="Priority"
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="normal">Normal</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    placeholder="Enter announcement details..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Link (Optional)"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    type="url"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon />
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
              {dialogMode === 'add' && 'Add Announcement'}
              {dialogMode === 'edit' && 'Update Announcement'}
              {dialogMode === 'delete' && 'Delete Announcement'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

// Styles (Achievements ke same)
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

export default Announcement;