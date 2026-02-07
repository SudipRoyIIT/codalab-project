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
  Card,
  CardContent,
  CardMedia,
  CardActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Article as NewsIcon,
  Refresh as RefreshIcon,
  DateRange as DateRangeIcon,
  Link as LinkIcon,
  FilterList as FilterIcon,
  Image as ImageIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

// API Base URL
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const News = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [newsData, setNewsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // "table" or "card"
  
  // Form state
  const [formData, setFormData] = useState({
    newsTopic: "",
    newsDescription: "",
    url: "",
    urlToImage: "",
    date: new Date().toISOString().split('T')[0],
  });

  // ✅ Format date for API (YYYY-MM-DD)
  const formatDateForAPI = (dateString) => {
    try {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Date formatting error:", error);
      return "";
    }
  };

  // ✅ Fetch ALL news using the new endpoint
  const fetchAllNews = async () => {
    setLoading(true);
    
    try {
      const url = `${BASE_URL}/api/Admin/private/getallnews?_=${Date.now()}`;
      console.log("📡 Fetching all news from:", url);
      
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
        console.log("✅ News data received:", data);
        
        if (Array.isArray(data)) {
          setNewsData(data);
          if (data.length === 0) {
            toast.info("No news found in database");
          } else {
            toast.success(`Loaded ${data.length} news item${data.length > 1 ? 's' : ''}`);
          }
        } else {
          console.warn("⚠️ Unexpected data format:", data);
          setNewsData([]);
          toast.error("Invalid data format from server");
        }
      } else {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        toast.error(`Failed to load news: ${response.status}`);
        setNewsData([]);
      }
    } catch (error) {
      console.error("💥 Network error:", error);
      toast.error("Cannot connect to backend server");
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch news by specific date using the old endpoint
  const fetchNewsByDate = async (date) => {
    setLoading(true);
    
    try {
      const formattedDate = formatDateForAPI(date);
      if (!formattedDate) {
        toast.error("Invalid date format");
        setLoading(false);
        return;
      }
      
      const url = `${BASE_URL}/api/Admin/private/getselectnews?date=${formattedDate}&_=${Date.now()}`;
      console.log("📡 Fetching news for date:", url);
      
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
        console.log("✅ News data received:", data);
        
        if (Array.isArray(data)) {
          setNewsData(data);
          if (data.length === 0) {
            toast.info(`No news found for ${formatDisplayDate(date)}`);
          } else {
            toast.success(`Loaded ${data.length} news item${data.length > 1 ? 's' : ''} for ${formatDisplayDate(date)}`);
          }
        } else {
          console.warn("⚠️ Unexpected data format:", data);
          setNewsData([]);
          toast.error("Invalid data format from server");
        }
      } else if (response.status === 404) {
        console.log("ℹ️ No news found for this date");
        setNewsData([]);
        toast.info(`No news found for ${formatDisplayDate(date)}`);
      } else {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        toast.error(`Failed to load news: ${response.status}`);
        setNewsData([]);
      }
    } catch (error) {
      console.error("💥 Network error:", error);
      toast.error("Cannot connect to backend server");
      setNewsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch - load ALL news
  useEffect(() => {
    fetchAllNews();
  }, []);

  // Handle date filter change
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setPage(0);
    
    if (date) {
      fetchNewsByDate(date);
    } else {
      fetchAllNews();
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSelectedDate("");
    setSearchQuery("");
    setPage(0);
    fetchAllNews();
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, urlToImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Open dialog for add/edit/delete
  const handleOpenDialog = (mode, news = null) => {
    console.log(`Opening ${mode} dialog for:`, news);
    
    setDialogMode(mode);
    setSelectedNews(news);
    
    if (mode === 'edit' && news) {
      setFormData({
        newsTopic: news.newsTopic || "",
        newsDescription: news.newsDescription || "",
        url: news.url || "",
        urlToImage: news.urlToImage || "",
        date: news.createdAt ? formatDateForAPI(news.createdAt) : new Date().toISOString().split('T')[0],
      });
    } else if (mode === 'add') {
      setFormData({
        newsTopic: "",
        newsDescription: "",
        url: "",
        urlToImage: "",
        date: new Date().toISOString().split('T')[0],
      });
    } else if (mode === 'delete' && news) {
      setFormData({
        newsTopic: news.newsTopic || "",
        newsDescription: news.newsDescription || "",
        url: news.url || "",
        urlToImage: news.urlToImage || "",
        date: news.createdAt ? formatDateForAPI(news.createdAt) : "",
      });
    }
    
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      newsTopic: "",
      newsDescription: "",
      url: "",
      urlToImage: "",
      date: new Date().toISOString().split('T')[0],
    });
    setSelectedNews(null);
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(`Submitting ${dialogMode} form:`, formData);
    
    try {
      let endpoint = '';
      let method = '';
      let payload = null;
      
      if (dialogMode === 'add') {
        // Validation for add
        const requiredFields = ['newsTopic', 'newsDescription', 'url', 'date'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(', ')}`);
          return;
        }
        
        endpoint = `${BASE_URL}/api/Admin/private/createNews`;
        method = 'POST';
        
        const formattedDate = formatDateForAPI(formData.date);
        if (!formattedDate) {
          toast.error("Invalid date format");
          return;
        }
        
        payload = {
          newsTopic: formData.newsTopic,
          newsDescription: formData.newsDescription,
          url: formData.url,
          date: formattedDate,
          ...(formData.urlToImage && { urlToImage: formData.urlToImage })
        };
      } else if (dialogMode === 'edit' && selectedNews) {
        // Validation for edit
        const requiredFields = ['newsTopic', 'newsDescription', 'url'];
        const missingFields = requiredFields.filter(field => !formData[field]);
        
        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(', ')}`);
          return;
        }
        
        endpoint = `${BASE_URL}/api/Admin/private/updateNews/${selectedNews._id}`;
        method = 'PUT';
        payload = {
          newsTopic: formData.newsTopic,
          newsDescription: formData.newsDescription,
          url: formData.url,
          ...(formData.urlToImage && { urlToImage: formData.urlToImage })
        };
      } else if (dialogMode === 'delete' && selectedNews) {
        endpoint = `${BASE_URL}/api/Admin/private/deleteNews/${selectedNews._id}`;
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
        toast.success(`News item ${action} successfully!`);
        handleCloseDialog();
        
        // Refresh data based on current filter
        if (selectedDate) {
          fetchNewsByDate(selectedDate);
        } else {
          fetchAllNews();
        }
      } else {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(errorJson.message || `Failed to ${dialogMode} news item`);
        } catch {
          toast.error(`Failed to ${dialogMode} news item`);
        }
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

  // Format date for display
  const formatDisplayDate = (dateString) => {
    try {
      if (!dateString) return "No date";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  // ✅ Filter news by search (CLIENT-SIDE filtering)
  const filteredData = newsData.filter(news => {
    const title = news.newsTopic || "";
    const description = news.newsDescription || "";
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!title.toLowerCase().includes(query) && 
          !description.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    return true;
  });

  // Statistics
  const totalNews = newsData.length;
  
  const todayNews = newsData.filter(news => {
    try {
      if (!news.createdAt) return false;
      const newsDate = new Date(news.createdAt).toISOString().split('T')[0];
      const today = new Date().toISOString().split('T')[0];
      return newsDate === today;
    } catch {
      return false;
    }
  }).length;

  const newsWithImages = newsData.filter(news => news.urlToImage).length;

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <NewsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            News Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredData.length} news item(s) {selectedDate ? `for ${formatDisplayDate(selectedDate)}` : 'found'}
          </Typography>
        </Box>
        <Box>
          <Chip
            icon={<CalendarIcon />}
            label={formatDisplayDate(new Date().toISOString())}
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
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap">
              {(searchQuery || selectedDate) && (
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  size="small"
                >
                  Clear Filters
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={viewMode === 'table' ? <ViewModuleIcon /> : <ViewListIcon />}
                onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}
                size="small"
              >
                {viewMode === 'table' ? 'Card View' : 'Table View'}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
                sx={styles.addButton}
              >
                New News
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => selectedDate ? fetchNewsByDate(selectedDate) : fetchAllNews()}
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
              <NewsIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{totalNews}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total News
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CalendarIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{todayNews}</Typography>
              <Typography variant="body2" color="text.secondary">
                Today's News
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <ImageIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{newsWithImages}</Typography>
              <Typography variant="body2" color="text.secondary">
                With Images
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
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

      {/* News Content - Table or Card View */}
      {loading ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading news...
            </Typography>
          </Box>
        </Paper>
      ) : filteredData.length === 0 ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.noDataContainer}>
            <NewsIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No news found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery || selectedDate
                ? `No news items match your filters`
                : "No news available. Add your first news item!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
              sx={{ mt: 2 }}
            >
              ADD FIRST NEWS
            </Button>
          </Box>
        </Paper>
      ) : viewMode === 'card' ? (
        // Card View
        <Grid container spacing={3}>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((news) => (
              <Grid item xs={12} sm={6} md={4} key={news._id}>
                <Card sx={styles.newsCard}>
                  {news.urlToImage && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={news.urlToImage}
                      alt={news.newsTopic}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                      {news.newsTopic}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {news.newsDescription?.length > 150 
                        ? `${news.newsDescription.substring(0, 150)}...` 
                        : news.newsDescription}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <CalendarIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {formatDisplayDate(news.createdAt)}
                      </Typography>
                    </Stack>
                    {news.url && (
                      <Link
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}
                      >
                        <LinkIcon fontSize="small" />
                        <Typography variant="body2">Read More</Typography>
                      </Link>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleOpenDialog('edit', news)}
                        sx={{ color: 'primary.main' }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleOpenDialog('delete', news)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          {/* Pagination for Card View */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <TablePagination
                rowsPerPageOptions={[6, 12, 24]}
                component="div"
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Grid>
        </Grid>
      ) : (
        // Table View
        <TableContainer component={Paper} sx={styles.tablePaper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeader}>Image</TableCell>
                <TableCell sx={styles.tableHeader}>Title</TableCell>
                <TableCell sx={styles.tableHeader}>Description</TableCell>
                <TableCell sx={styles.tableHeader}>Date</TableCell>
                <TableCell sx={styles.tableHeader}>Link</TableCell>
                <TableCell sx={styles.tableHeader} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((news) => (
                  <TableRow key={news._id} hover>
                    <TableCell>
                      {news.urlToImage ? (
                        <Avatar
                          src={news.urlToImage}
                          variant="rounded"
                          sx={{ width: 60, height: 60 }}
                        />
                      ) : (
                        <Avatar
                          variant="rounded"
                          sx={{ width: 60, height: 60, bgcolor: 'grey.200' }}
                        >
                          <ImageIcon />
                        </Avatar>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight={500}>
                        {news.newsTopic}
                      </Typography>
                      {news.createdAt && (
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                          Added: {formatDisplayDate(news.createdAt)}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {news.newsDescription?.length > 100 
                          ? `${news.newsDescription.substring(0, 100)}...` 
                          : news.newsDescription}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<CalendarIcon />}
                        label={formatDisplayDate(news.createdAt)}
                        size="small"
                        variant="outlined"
                        sx={{ cursor: 'pointer' }}
                      />
                    </TableCell>
                    <TableCell>
                      {news.url ? (
                        <Link
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                        >
                          <LinkIcon fontSize="small" />
                          View
                        </Link>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No link
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenDialog('edit', news)}
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
                            onClick={() => handleOpenDialog('delete', news)}
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
        </TableContainer>
      )}

      {/* Dialog for Add/Edit/Delete */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'add' && 'Add New News'}
          {dialogMode === 'edit' && 'Edit News'}
          {dialogMode === 'delete' && 'Delete News'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === 'delete' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this news item? This action cannot be undone.
                </Alert>
                {selectedNews && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Title:</strong> {selectedNews.newsTopic}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Description:</strong> {selectedNews.newsDescription?.substring(0, 100)}...
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Date:</strong> {formatDisplayDate(selectedNews.createdAt)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Link:</strong>{" "}
                      <Link
                        href={selectedNews.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedNews.url}
                      </Link>
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
                    label="News Title"
                    name="newsTopic"
                    value={formData.newsTopic}
                    onChange={handleInputChange}
                    placeholder="Enter news headline..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <TitleIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="News Description"
                    name="newsDescription"
                    value={formData.newsDescription}
                    onChange={handleInputChange}
                    multiline
                    rows={4}
                    placeholder="Enter detailed news description..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <DescriptionIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="News Link (URL)"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    type="url"
                    placeholder="https://example.com/news"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LinkIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="date"
                    label="News Date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
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
                <Grid item xs={12}>
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      News Image (Optional)
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<ImageIcon />}
                      fullWidth
                    >
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </Button>
                    {formData.urlToImage && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" display="block" gutterBottom>
                          Selected Image Preview:
                        </Typography>
                        <Avatar
                          src={formData.urlToImage}
                          variant="rounded"
                          sx={{ width: 100, height: 100 }}
                        />
                        <Button
                          size="small"
                          color="error"
                          onClick={() => setFormData(prev => ({ ...prev, urlToImage: "" }))}
                          sx={{ mt: 1 }}
                        >
                          Remove Image
                        </Button>
                      </Box>
                    )}
                  </Box>
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
              {dialogMode === 'add' && 'Add News'}
              {dialogMode === 'edit' && 'Update News'}
              {dialogMode === 'delete' && 'Delete News'}
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
  newsCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 'var(--shadow-lg)',
    },
  },
};

export default News;