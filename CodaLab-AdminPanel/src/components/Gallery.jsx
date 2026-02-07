// Gallery.jsx - Fixed Date Display
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
  Avatar,
  FormControl,
  InputLabel,
  MenuItem,
  Card,
  CardMedia,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CloudUpload as CloudUploadIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Gallery = () => {
  // States
  const [loading, setLoading] = useState(true);
  const [gallery, setGallery] = useState([]);
  const [searchCaption, setSearchCaption] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(9);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewMode, setViewMode] = useState("grid");

  // Form state
  const [formData, setFormData] = useState({
    caption: "",
    image: null,
    imagePreview: "",
    imageFile: null,
  });

  // Fetch gallery data
  const fetchGallery = async (searchTerm = "") => {
    setLoading(true);
    try {
      const endpoint = `${BASE_URL}/api/Admin/private/getSelectedGallery${
        searchTerm ? `?photo_caption=${searchTerm}` : ""
      }`;
      
      console.log("📡 Fetching gallery from:", endpoint);
      
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
        console.log("✅ Gallery data received:", data);
        setGallery(data);
      } else {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        toast.error("Failed to load gallery");
        setGallery([]);
      }
    } catch (error) {
      console.error("💥 Network error:", error);
      toast.error("Cannot connect to server");
      setGallery([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchGallery();
  }, []);

  // Handle search
  const handleSearch = () => {
    fetchGallery(searchCaption);
    setPage(0);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchCaption("");
    fetchGallery();
    setPage(0);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          imageFile: file,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open dialog
  const handleOpenDialog = (mode, item = null) => {
    console.log(`Opening ${mode} dialog for:`, item);
    
    setDialogMode(mode);
    setSelectedItem(item);
    
    if (mode === 'edit' && item) {
      setFormData({
        caption: item.photo_caption || "",
        image: item.urlToImage || "",
        imagePreview: item.urlToImage || "",
        imageFile: null,
      });
    } else if (mode === 'add') {
      setFormData({
        caption: "",
        image: "",
        imagePreview: "",
        imageFile: null,
      });
    }
    
    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      caption: "",
      image: "",
      imagePreview: "",
      imageFile: null,
    });
    setSelectedItem(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log(`Submitting ${dialogMode} form:`, formData);
    
    // Validation
    if (dialogMode !== 'delete') {
      if (!formData.caption.trim()) {
        toast.error("Please enter a caption");
        return;
      }
      if (dialogMode === 'add' && !formData.imageFile && !formData.image) {
        toast.error("Please select an image");
        return;
      }
    }

    try {
      let endpoint = '';
      let method = '';
      let payload = {};

      if (dialogMode === 'add' || dialogMode === 'edit') {
        if (formData.imageFile) {
          const base64Image = formData.imagePreview;
          payload = {
            photo_caption: formData.caption,
            urlToImage: base64Image,
          };
        } else if (formData.image) {
          payload = {
            photo_caption: formData.caption,
            urlToImage: formData.image,
          };
        }

        if (dialogMode === 'add') {
          endpoint = `${BASE_URL}/api/Admin/private/createMemory`;
          method = 'POST';
        } else if (dialogMode === 'edit' && selectedItem) {
          endpoint = `${BASE_URL}/api/Admin/private/updateMemory/${selectedItem._id}`;
          method = 'PUT';
        }
      } else if (dialogMode === 'delete' && selectedItem) {
        endpoint = `${BASE_URL}/api/Admin/private/deleteMemory/${selectedItem._id}`;
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
        toast.success(`Gallery item ${action} successfully!`);
        handleCloseDialog();
        fetchGallery(searchCaption);
      } else {
        const errorText = await response.text();
        toast.error(`Failed to ${dialogMode} gallery item`);
      }
    } catch (error) {
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

  // Format date - FIXED: Shows nothing if no date
  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return null;
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return null;
    }
  };

  // Filter gallery by search
  const filteredGallery = gallery.filter(item => {
    if (searchCaption) {
      const caption = item.photo_caption?.toLowerCase() || "";
      if (!caption.includes(searchCaption.toLowerCase())) return false;
    }
    return true;
  });

  // Statistics
  const totalImages = gallery.length;
  const todayImages = gallery.filter(item => {
    if (!item.createdAt) return false;
    const itemDate = new Date(item.createdAt);
    const today = new Date();
    return itemDate.toDateString() === today.toDateString();
  }).length;

  const imagesWithBase64 = gallery.filter(item => item.urlToImage?.startsWith('data:image')).length;

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
            <ImageIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Gallery Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredGallery.length} gallery item(s) found
          </Typography>
        </Box>
        <Box>
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
        </Box>
      </Box>

      {/* Filter and Actions Bar */}
      <Paper sx={styles.actionBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search by caption..."
              value={searchCaption}
              onChange={(e) => setSearchCaption(e.target.value)}
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
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('grid')}
                size="small"
              >
                Grid View
              </Button>
              <Button
                variant={viewMode === 'table' ? 'contained' : 'outlined'}
                onClick={() => setViewMode('table')}
                size="small"
              >
                Table View
              </Button>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              {searchCaption && (
                <Button
                  variant="outlined"
                  onClick={handleClearSearch}
                  size="small"
                >
                  Clear Search
                </Button>
              )}
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog('add')}
                sx={styles.addButton}
              >
                Upload Image
              </Button>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => fetchGallery(searchCaption)}
                size="small"
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
              <ImageIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4">{totalImages}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Images
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CalendarIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h4">{todayImages}</Typography>
              <Typography variant="body2" color="text.secondary">
                Today's Uploads
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CloudUploadIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h4">{imagesWithBase64}</Typography>
              <Typography variant="body2" color="text.secondary">
                Images
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <FilterIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h4">{filteredGallery.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Filtered Results
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Gallery Content */}
      <Paper sx={styles.tablePaper}>
        {loading ? (
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading gallery...
            </Typography>
          </Box>
        ) : filteredGallery.length === 0 ? (
          <Box sx={styles.noDataContainer}>
            <ImageIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No gallery items found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchCaption
                ? `No items match your search`
                : "No gallery items available. Upload your first image!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog('add')}
              sx={{ mt: 2 }}
            >
              UPLOAD FIRST IMAGE
            </Button>
          </Box>
        ) : viewMode === 'grid' ? (
          // Grid View
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {filteredGallery
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item._id}>
                    <Card sx={styles.galleryCard}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.urlToImage || '/placeholder-image.jpg'}
                        alt={item.photo_caption}
                        sx={styles.cardImage}
                      />
                      <CardContent>
                        <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                          {item.photo_caption}
                        </Typography>
                        {/* FIXED: Show date only if exists */}
                        {item.createdAt && formatDate(item.createdAt) && (
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(item.createdAt)}
                          </Typography>
                        )}
                      </CardContent>
                      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleOpenDialog('edit', item)}
                              size="small"
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
                              size="small"
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
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
            </Grid>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
              <TablePagination
                rowsPerPageOptions={[9, 18, 27]}
                component="div"
                count={filteredGallery.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Box>
          </Box>
        ) : (
          // Table View with FIXED date display
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={styles.tableHeader}>Image</TableCell>
                    <TableCell sx={styles.tableHeader}>Caption</TableCell>
                    <TableCell sx={styles.tableHeader}>Date</TableCell>
                    <TableCell sx={styles.tableHeader} align="center">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredGallery
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item) => (
                      <TableRow key={item._id} hover>
                        <TableCell>
                          <Avatar
                            src={item.urlToImage}
                            variant="rounded"
                            sx={styles.tableImage}
                          >
                            <ImageIcon />
                          </Avatar>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body1" fontWeight={500}>
                            {item.photo_caption}
                          </Typography>
                        </TableCell>
                        {/* FIXED: Show date chip only if date exists */}
                        <TableCell>
                          {item.createdAt && formatDate(item.createdAt) ? (
                            <Chip
                              icon={<CalendarIcon />}
                              label={formatDate(item.createdAt)}
                              size="small"
                              variant="outlined"
                            />
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              {/* Empty - shows nothing */}
                            </Typography>
                          )}
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
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[9, 18, 27]}
              component="div"
              count={filteredGallery.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      {/* Dialog for Add/Edit/Delete */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'add' && 'Upload New Image'}
          {dialogMode === 'edit' && 'Edit Gallery Item'}
          {dialogMode === 'delete' && 'Delete Gallery Item'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === 'delete' ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this gallery item? This action cannot be undone.
                </Alert>
                {selectedItem && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Caption:</strong> {selectedItem.photo_caption}
                    </Typography>
                    {selectedItem.urlToImage && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Avatar
                          src={selectedItem.urlToImage}
                          variant="rounded"
                          sx={{ width: 200, height: 150, mx: 'auto' }}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            ) : (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Image Caption"
                    name="caption"
                    value={formData.caption}
                    onChange={handleInputChange}
                    placeholder="Enter caption for the image"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ border: '2px dashed #ccc', p: 3, borderRadius: 2, textAlign: 'center' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="image-upload"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="image-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 2 }}
                      >
                        Choose Image
                      </Button>
                    </label>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {formData.imageFile ? formData.imageFile.name : 'Select an image file'}
                    </Typography>
                    
                    {formData.imagePreview && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                          Image Preview:
                        </Typography>
                        <Avatar
                          src={formData.imagePreview}
                          variant="rounded"
                          sx={{ width: 200, height: 150, mx: 'auto' }}
                        />
                      </Box>
                    )}
                    
                    {dialogMode === 'edit' && !formData.imageFile && formData.image && (
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                          Current Image:
                        </Typography>
                        <Avatar
                          src={formData.image}
                          variant="rounded"
                          sx={{ width: 200, height: 150, mx: 'auto' }}
                        />
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
              {dialogMode === 'add' && 'Upload Image'}
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
  galleryCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 'var(--border-radius-md)',
    boxShadow: 'var(--shadow-sm)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: 'var(--shadow-md)',
    },
  },
  cardImage: {
    objectFit: 'cover',
  },
  tableImage: {
    width: 80,
    height: 60,
    bgcolor: 'grey.200',
  },
};

export default Gallery;