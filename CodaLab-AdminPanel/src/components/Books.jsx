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
  Card,
  CardContent,
  CardActions,
  Tabs,
  Tab,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  MenuBook as BookIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Numbers as NumbersIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Books = () => {
  const { userRole } = useAuth();
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  
  // States - EXACT SAME AS PATENTS PAGE
  const [loading, setLoading] = useState(false);
  const [booksData, setBooksData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedBook, setSelectedBook] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [activeTab, setActiveTab] = useState("all");

  // Form state - BOOKS SPECIFIC FIELDS
  const [formData, setFormData] = useState({
    authors: "",
    title: "",
    publishingDate: "",
    ISBN: "",
    volume: "",
    pages: "",
    publisher: "",
    weblink: "",
    additionalInfo: "",
    area: "",  // Book specific field
    chapterTitle: "",
    editors: "",
    edition: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all books - MATCHING PATENTS PATTERN
  const fetchData = async () => {
    setLoading(true);
    try {
      const userInfo = localStorage.getItem("userInfo");
      const afApi = userInfo === "admin" ? "Admin" : "Subadmin";
      
      // Build URL based on searchQuery
      let url;
      
      if (searchQuery && searchQuery.trim() !== "") {
        // Search by title when there's a query
        url = `${BASE_URL}/api/${afApi}/private/getASinglePublication/Books/${encodeURIComponent(searchQuery.trim())}`;
      } else {
        // Get ALL books when no search query
        // NOTE: You need to create this endpoint in backend
        url = `${BASE_URL}/api/${afApi}/private/getAllPublication/Books`;
      }
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Handle different response structures
        if (data.DataForUpdate) {
          if (Array.isArray(data.DataForUpdate)) {
            setBooksData(data.DataForUpdate);
          } else if (typeof data.DataForUpdate === 'object' && data.DataForUpdate !== null) {
            setBooksData([data.DataForUpdate]);
          } else {
            setBooksData([]);
          }
        } else if (Array.isArray(data)) {
          setBooksData(data);
        } else {
          setBooksData([]);
        }
        
        const count = booksData?.length || 0;
        if (count === 0) {
          toast.info("No books found");
        } else {
          toast.success(`Loaded ${count} book${count !== 1 ? 's' : ''}`);
        }
      } else {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        
        if (response.status === 404) {
          toast.info("Search endpoint returned no results");
          setBooksData([]);
        } else {
          toast.error(`Failed to load data: ${response.status}`);
          setBooksData([]);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Cannot connect to backend server");
      setBooksData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open dialog for add/edit/delete
  const handleOpenDialog = (mode, book = null) => {
    setDialogMode(mode);
    setSelectedBook(book);

    if (mode === "edit" && book) {
      setFormData({
        authors: Array.isArray(book.authors) ? book.authors.join(", ") : book.authors || "",
        title: book.title || "",
        area: book.area || "",
        publishingDate: book.publishingDate ? new Date(book.publishingDate).toISOString().split("T")[0] : "",
        volume: book.volume || "",
        pages: book.pages || "",
        ISBN: book.ISBN || "",
        weblink: book.weblink || "",
        publisher: book.publisher || "",
        additionalInfo: book.additionalInfo || "",
        chapterTitle: book.chapterTitle || "",
        editors: book.editors || "",
        edition: book.edition || "",
      });
    } else if (mode === "add") {
      setFormData({
        authors: "",
        title: "",
        publishingDate: "",
        ISBN: "",
        volume: "",
        pages: "",
        publisher: "",
        weblink: "",
        additionalInfo: "",
        area: "",
        chapterTitle: "",
        editors: "",
        edition: "",
      });
    }

    setDialogOpen(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      authors: "",
      title: "",
      publishingDate: "",
      ISBN: "",
      volume: "",
      pages: "",
      publisher: "",
      weblink: "",
      additionalInfo: "",
      area: "",
      chapterTitle: "",
      editors: "",
      edition: "",
    });
    setSelectedBook(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let endpoint = "";
      let method = "";
      let payload = null;

      // Prepare authors array
      const authorsArray = formData.authors.split(",").map(author => author.trim());

      if (dialogMode === "add") {
        const requiredFields = ["authors", "title", "publishingDate"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/createPublication/Books`;
        method = "POST";
        payload = {
          ...formData,
          authors: authorsArray,
        };
      } else if (dialogMode === "edit" && selectedBook) {
        const requiredFields = ["authors", "title", "publishingDate"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/UpdatePublication/Books/${selectedBook._id}`;
        method = "PUT";
        payload = {
          ...formData,
          authors: authorsArray,
        };
      } else if (dialogMode === "delete" && selectedBook) {
        endpoint = `${BASE_URL}/api/${afApi}/private/DeletePublication/Books/${selectedBook._id}`;
        method = "DELETE";
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("accessToken"),
        },
        body: method !== "DELETE" ? JSON.stringify(payload) : undefined,
      });

      if (response.ok) {
        const action = dialogMode === "add" ? "added" : dialogMode === "edit" ? "updated" : "deleted";
        toast.success(`Book ${action} successfully!`);
        handleCloseDialog();
        fetchData();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(errorJson.message || `Failed to ${dialogMode} book`);
        } catch {
          toast.error(`Failed to ${dialogMode} book: ${errorText}`);
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

  // Clear filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setPage(0);
    fetchData();
  };

  // Filter books by search
  const filteredData = booksData.filter((book) => {
    const authors = Array.isArray(book.authors) ? book.authors.join(" ") : book.authors || "";
    const title = book.title || "";
    const isbn = book.ISBN || "";
    const publisher = book.publisher || "";
    const area = book.area || "";

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !authors.toLowerCase().includes(query) &&
        !title.toLowerCase().includes(query) &&
        !isbn.toLowerCase().includes(query) &&
        !publisher.toLowerCase().includes(query) &&
        !area.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Filter by tab
    if (activeTab === "recent") {
      const currentYear = new Date().getFullYear();
      const bookYear = new Date(book.publishingDate).getFullYear();
      return bookYear >= currentYear - 2;
    }
    if (activeTab === "chapters") {
      return book.chapterTitle && book.chapterTitle.trim() !== "";
    }
    if (activeTab === "full") {
      return !book.chapterTitle || book.chapterTitle.trim() === "";
    }

    return true;
  });

  // Statistics
  const totalBooks = booksData.length;
  
  // Recent books (last 2 years)
  const currentYear = new Date().getFullYear();
  const recentBooks = booksData.filter(b => {
    const bookYear = new Date(b.publishingDate).getFullYear();
    return bookYear >= currentYear - 2;
  }).length;

  // Count chapters vs full books
  const chapters = booksData.filter(b => 
    b.chapterTitle && b.chapterTitle.trim() !== ""
  ).length;
  const fullBooks = totalBooks - chapters;

  // Format authors for display
  const formatAuthors = (book) => {
    if (Array.isArray(book.authors)) {
      return book.authors.slice(0, 3).join(", ") + (book.authors.length > 3 ? " et al." : "");
    }
    return book.authors || "Unknown";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Get book type
  const getBookType = (book) => {
    if (book.chapterTitle && book.chapterTitle.trim() !== "") {
      return "Chapter";
    }
    return "Full Book";
  };

  // Get book type color
  const getBookTypeColor = (book) => {
    if (book.chapterTitle && book.chapterTitle.trim() !== "") {
      return "info";
    }
    return "success";
  };

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <BookIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Books & Book Chapters
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredData.length} book(s) found
          </Typography>
        </Box>
        <Box>
          <Chip
            icon={<CalendarIcon />}
            label={new Date().toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            color="primary"
            variant="outlined"
          />
        </Box>
      </Box>

      {/* Filter and Actions Bar */}
      <Paper sx={styles.actionBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by authors, title, ISBN, publisher, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchData()}
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
          <Grid item xs={12} md={6}>
            <Stack direction="row" spacing={2} justifyContent="flex-end" flexWrap="wrap">
              {searchQuery && (
                <Button variant="outlined" onClick={handleClearFilters} size="small">
                  Clear Filters
                </Button>
              )}
              <Button
                variant="outlined"
                startIcon={viewMode === "table" ? <ViewModuleIcon /> : <ViewListIcon />}
                onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
                size="small"
              >
                {viewMode === "table" ? "Card View" : "Table View"}
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpenDialog("add")}
                sx={styles.addButton}
              >
                Add Book
              </Button>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
                Refresh
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs for filtering */}
      <Paper sx={{ mb: 3, p: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="All Books" value="all" />
          <Tab label="Full Books" value="full" />
          <Tab label="Chapters" value="chapters" />
          <Tab label="Recent (2 Years)" value="recent" />
        </Tabs>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <BookIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4">{totalBooks}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Books
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CategoryIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4">{fullBooks}</Typography>
              <Typography variant="body2" color="text.secondary">
                Full Books
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <NumbersIcon sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
              <Typography variant="h4">{chapters}</Typography>
              <Typography variant="body2" color="text.secondary">
                Chapters
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <FilterIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4">{filteredData.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Filtered Results
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Books Content - Table or Card View */}
      {loading ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading books...
            </Typography>
          </Box>
        </Paper>
      ) : filteredData.length === 0 ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.noDataContainer}>
            <BookIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No books found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? "No books match your search criteria"
                : "No books available. Add your first book!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog("add")}
              sx={{ mt: 2 }}
            >
              ADD FIRST BOOK
            </Button>
          </Box>
        </Paper>
      ) : viewMode === "card" ? (
        // Card View
        <Grid container spacing={3}>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Card sx={styles.bookCard}>
                  <CardContent>
                    {/* Book Type Badge */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip
                        label={getBookType(book)}
                        color={getBookTypeColor(book)}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(book.publishingDate)}
                      </Typography>
                    </Box>

                    {/* Title */}
                    <Typography variant="h6" fontWeight={600} sx={{ 
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {book.chapterTitle ? `Chapter: ${book.chapterTitle}` : book.title}
                    </Typography>

                    {/* Book Title (for chapters) */}
                    {book.chapterTitle && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontStyle: 'italic' }}>
                        In: {book.title}
                      </Typography>
                    )}

                    {/* Authors */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon fontSize="small" />
                        <span>{formatAuthors(book)}</span>
                      </Box>
                    </Typography>

                    {/* Book Details */}
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      {book.ISBN && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">
                            ISBN
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {book.ISBN}
                          </Typography>
                        </Grid>
                      )}
                      {book.publisher && (
                        <Grid item xs={12}>
                          <Typography variant="caption" color="text.secondary">
                            Publisher
                          </Typography>
                          <Typography variant="body2">
                            {book.publisher}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {/* Volume, Pages, Edition */}
                    <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                      {book.volume && (
                        <Typography variant="caption" color="text.secondary">
                          Vol: {book.volume}
                        </Typography>
                      )}
                      {book.pages && (
                        <Typography variant="caption" color="text.secondary">
                          Pages: {book.pages}
                        </Typography>
                      )}
                      {book.edition && (
                        <Typography variant="caption" color="text.secondary">
                          Ed: {book.edition}
                        </Typography>
                      )}
                    </Stack>

                    {/* Area/Subject */}
                    {book.area && (
                      <Typography variant="caption" sx={{ 
                        display: 'inline-block',
                        backgroundColor: 'rgba(67, 97, 238, 0.1)',
                        color: 'primary.main',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                        mt: 1
                      }}>
                        {book.area}
                      </Typography>
                    )}

                    {/* Weblink */}
                    {book.weblink && (
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <LinkIcon fontSize="small" />
                        <Box sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {book.weblink}
                        </Box>
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleOpenDialog("edit", book)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleOpenDialog("delete", book)}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", justifyContent: "center" }}>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
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
                <TableCell sx={styles.tableHeader}>Title / Chapter</TableCell>
                <TableCell sx={styles.tableHeader}>Authors</TableCell>
                <TableCell sx={styles.tableHeader}>Book Details</TableCell>
                <TableCell sx={styles.tableHeader}>Date & Type</TableCell>
                <TableCell sx={styles.tableHeader} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((book) => (
                  <TableRow key={book._id} hover>
                    <TableCell sx={{ maxWidth: '250px' }}>
                      <Tooltip title={book.chapterTitle ? `Chapter: ${book.chapterTitle}\nIn: ${book.title}` : book.title}>
                        <Box>
                          <Typography variant="body2" fontWeight={500} sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {book.chapterTitle ? `Chapter: ${book.chapterTitle}` : book.title}
                          </Typography>
                          {book.chapterTitle && (
                            <Typography variant="caption" color="text.secondary">
                              In: {book.title}
                            </Typography>
                          )}
                        </Box>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '200px' }}>
                      <Tooltip title={Array.isArray(book.authors) ? book.authors.join(", ") : book.authors}>
                        <Typography variant="body2" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {formatAuthors(book)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {book.ISBN && (
                          <Typography variant="body2">
                            <strong>ISBN:</strong> {book.ISBN}
                          </Typography>
                        )}
                        {book.publisher && (
                          <Typography variant="body2">
                            <strong>Publisher:</strong> {book.publisher}
                          </Typography>
                        )}
                        {book.area && (
                          <Typography variant="body2">
                            <strong>Area:</strong> {book.area}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Chip
                          label={getBookType(book)}
                          color={getBookTypeColor(book)}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(book.publishingDate)}
                        </Typography>
                        {book.volume && (
                          <Typography variant="caption" color="text.secondary">
                            Vol. {book.volume}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenDialog("edit", book)}
                            sx={{
                              color: "primary.main",
                              "&:hover": {
                                backgroundColor: "rgba(67, 97, 238, 0.1)",
                              },
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleOpenDialog("delete", book)}
                            sx={{
                              color: "error.main",
                              "&:hover": {
                                backgroundColor: "rgba(239, 68, 68, 0.1)",
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
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {dialogMode === "add" && "Add New Book / Chapter"}
          {dialogMode === "edit" && "Edit Book / Chapter"}
          {dialogMode === "delete" && "Delete Book / Chapter"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === "delete" ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this book? This action cannot be undone.
                </Alert>
                {selectedBook && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Title:</strong> {selectedBook.title}
                    </Typography>
                    {selectedBook.chapterTitle && (
                      <Typography variant="body1" gutterBottom>
                        <strong>Chapter:</strong> {selectedBook.chapterTitle}
                      </Typography>
                    )}
                    <Typography variant="body1" gutterBottom>
                      <strong>Authors:</strong> {formatAuthors(selectedBook)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>ISBN:</strong> {selectedBook.ISBN || "N/A"}
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
                    label="Book Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter book title..."
                    helperText="For book chapters, this is the main book title"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Chapter Title (if applicable)"
                    name="chapterTitle"
                    value={formData.chapterTitle}
                    onChange={handleInputChange}
                    placeholder="Enter chapter title (leave empty for full book)..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Authors (comma separated)"
                    name="authors"
                    value={formData.authors}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe, Jane Smith, Robert Johnson"
                    helperText="Separate multiple authors with commas"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Publishing Date"
                    name="publishingDate"
                    value={formData.publishingDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="ISBN"
                    name="ISBN"
                    value={formData.ISBN}
                    onChange={handleInputChange}
                    placeholder="e.g., 978-3-16-148410-0"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Volume"
                    name="volume"
                    value={formData.volume}
                    onChange={handleInputChange}
                    placeholder="e.g., 1, 2, 3"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Edition"
                    name="edition"
                    value={formData.edition}
                    onChange={handleInputChange}
                    placeholder="e.g., 1st, 2nd, Revised"
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Pages"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    placeholder="e.g., 1-250, 300-350"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    placeholder="e.g., Springer, Elsevier, Wiley"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Area / Subject"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science, Mathematics, Physics"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Editors (for book chapters)"
                    name="editors"
                    value={formData.editors}
                    onChange={handleInputChange}
                    placeholder="e.g., Editor Name 1, Editor Name 2"
                    helperText="For book chapters only - editors of the main book"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Weblink"
                    name="weblink"
                    value={formData.weblink}
                    onChange={handleInputChange}
                    placeholder="e.g., https://link.springer.com/book/..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Information"
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                    multiline
                    rows={3}
                    placeholder="Any additional notes, citations, or description..."
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
              color={dialogMode === "delete" ? "error" : "primary"}
            >
              {dialogMode === "add" && "Add Book"}
              {dialogMode === "edit" && "Update Book"}
              {dialogMode === "delete" && "Delete Book"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

// Styles - MATCHING PATENTS PAGE
const styles = {
  container: {
    p: 3,
    backgroundColor: "background.default",
    minHeight: "100vh",
  },
  header: {
    mb: 3,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 2,
  },
  title: {
    fontWeight: 700,
    color: "primary.main",
  },
  actionBar: {
    p: 2,
    mb: 3,
    backgroundColor: "background.paper",
    borderRadius: 2,
    boxShadow: 1,
  },
  addButton: {
    backgroundColor: "primary.main",
    "&:hover": {
      backgroundColor: "primary.dark",
    },
  },
  statCard: {
    p: 3,
    borderRadius: 2,
    boxShadow: 1,
    transition: "transform 0.2s",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  statCardContent: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  tablePaper: {
    borderRadius: 2,
    boxShadow: 1,
    overflow: "hidden",
    minHeight: "400px",
  },
  tableHeader: {
    fontWeight: 600,
    backgroundColor: "grey.100",
    fontSize: "0.875rem",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    py: 10,
  },
  noDataContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    py: 8,
    textAlign: "center",
  },
  bookCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: 4,
    },
  },
};

export default Books;