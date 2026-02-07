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
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
  Article as ArticleIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  Numbers as NumbersIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  School as SchoolIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Journals = () => {
  // States
  const [loading, setLoading] = useState(false);
  const [journalsData, setJournalsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [activeTab, setActiveTab] = useState("all");

  // Form state
  const [formData, setFormData] = useState({
    authors: "",
    title: "",
    journal: "",
    publishedOn: "",
    pages: "",
    DOI: "",
    additionalInfo: "",
    IF: "",
    SJR: "",
    volume: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all journals
  const fetchData = async () => {
    setLoading(true);
    try {
      const userRole = localStorage.getItem("userInfo");
      const afApi = userRole === "admin" ? "Admin" : "Subadmin";
      
      // Build URL based on searchQuery
      let url;
      
      if (searchQuery && searchQuery.trim() !== "") {
        // Search by title when there's a query
        url = `${BASE_URL}/api/${afApi}/private/getASinglePublication/Journal/${encodeURIComponent(searchQuery.trim())}`;
      } else {
        // Get ALL journals when no search query (using the new endpoint)
        url = `${BASE_URL}/api/${afApi}/private/getAllPublication/Journal`;
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
        setJournalsData(data.DataForUpdate || []);
        
        if (data.DataForUpdate?.length === 0) {
          toast.info("No journal publications found");
        } else {
          const count = data.DataForUpdate?.length || 0;
          toast.success(`Loaded ${count} journal publication${count !== 1 ? 's' : ''}`);
        }
      } else {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        
        if (response.status === 404) {
          // If endpoint doesn't exist yet, show empty
          toast.info("Search endpoint returned no results");
          setJournalsData([]);
        } else {
          toast.error(`Failed to load data: ${response.status}`);
          setJournalsData([]);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Cannot connect to backend server");
      setJournalsData([]);
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
  const handleOpenDialog = (mode, journal = null) => {
    setDialogMode(mode);
    setSelectedJournal(journal);

    if (mode === "edit" && journal) {
      setFormData({
        authors: Array.isArray(journal.authors) ? journal.authors.join(", ") : journal.authors || "",
        title: journal.title || "",
        journal: journal.journal || "",
        publishedOn: journal.publishedOn ? new Date(journal.publishedOn).toISOString().split("T")[0] : "",
        pages: journal.pages || "",
        DOI: journal.DOI || "",
        additionalInfo: journal.additionalInfo || "",
        IF: journal.IF || "",
        SJR: journal.SJR || "",
        volume: journal.volume || "",
      });
    } else if (mode === "add") {
      setFormData({
        authors: "",
        title: "",
        journal: "",
        publishedOn: "",
        pages: "",
        DOI: "",
        additionalInfo: "",
        IF: "",
        SJR: "",
        volume: "",
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
      journal: "",
      publishedOn: "",
      pages: "",
      DOI: "",
      additionalInfo: "",
      IF: "",
      SJR: "",
      volume: "",
    });
    setSelectedJournal(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const userRole = localStorage.getItem("userInfo");
      const afApi = userRole === "admin" ? "Admin" : "Subadmin";
      
      let endpoint = "";
      let method = "";
      let payload = null;

      // Prepare authors array
      const authorsArray = formData.authors.split(",").map(author => author.trim());

      if (dialogMode === "add") {
        const requiredFields = ["authors", "title", "journal", "publishedOn"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/createPublication/Journal`;
        method = "POST";
        payload = {
          ...formData,
          authors: authorsArray,
        };
      } else if (dialogMode === "edit" && selectedJournal) {
        const requiredFields = ["authors", "title", "journal", "publishedOn"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/UpdatePublication/Journal/${selectedJournal._id}`;
        method = "PUT";
        payload = {
          ...formData,
          authors: authorsArray,
        };
      } else if (dialogMode === "delete" && selectedJournal) {
        endpoint = `${BASE_URL}/api/${afApi}/private/DeletePublication/Journal/${selectedJournal._id}`;
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
        toast.success(`Journal publication ${action} successfully!`);
        handleCloseDialog();
        fetchData();
      } else {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          toast.error(errorJson.message || `Failed to ${dialogMode} publication`);
        } catch {
          toast.error(`Failed to ${dialogMode} publication: ${errorText}`);
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

  // Filter journals by search
  const filteredData = journalsData.filter((journal) => {
    const authors = Array.isArray(journal.authors) ? journal.authors.join(" ") : journal.authors || "";
    const title = journal.title || "";
    const journalName = journal.journal || "";
    const doi = journal.DOI || "";

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !authors.toLowerCase().includes(query) &&
        !title.toLowerCase().includes(query) &&
        !journalName.toLowerCase().includes(query) &&
        !doi.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Filter by tab
    if (activeTab === "highIF") {
      return journal.IF && parseFloat(journal.IF) >= 5.0;
    }
    if (activeTab === "recent") {
      const currentYear = new Date().getFullYear();
      const pubYear = new Date(journal.publishedOn).getFullYear();
      return pubYear >= currentYear - 2;
    }

    return true;
  });

  // Statistics
  const totalJournals = journalsData.length;
  
  // Calculate average Impact Factor
  const avgIF = journalsData.length > 0
    ? (journalsData.reduce((sum, j) => sum + (parseFloat(j.IF) || 0), 0) / journalsData.length).toFixed(2)
    : 0;
  
  // Count journals with high IF (>5)
  const highIFJournals = journalsData.filter(j => j.IF && parseFloat(j.IF) >= 5.0).length;

  // Recent journals (last 2 years)
  const currentYear = new Date().getFullYear();
  const recentJournals = journalsData.filter(j => {
    const pubYear = new Date(j.publishedOn).getFullYear();
    return pubYear >= currentYear - 2;
  }).length;

  // Format authors for display
  const formatAuthors = (journal) => {
    if (Array.isArray(journal.authors)) {
      return journal.authors.slice(0, 3).join(", ") + (journal.authors.length > 3 ? " et al." : "");
    }
    return journal.authors || "Unknown";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <ArticleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Journal Publications
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {filteredData.length} publication(s) found
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
              placeholder="Search by authors, title, journal, or DOI..."
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
                Add Publication
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
          <Tab label="All Publications" value="all" />
          <Tab label="High Impact (IF ≥ 5)" value="highIF" />
          <Tab label="Recent (2 Years)" value="recent" />
        </Tabs>
      </Paper>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <ArticleIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4">{totalJournals}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Publications
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <NumbersIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4">{avgIF}</Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Impact Factor
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <SchoolIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4">{highIFJournals}</Typography>
              <Typography variant="body2" color="text.secondary">
                High Impact (IF ≥ 5)
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <FilterIcon sx={{ fontSize: 40, color: "info.main", mb: 1 }} />
              <Typography variant="h4">{filteredData.length}</Typography>
              <Typography variant="body2" color="text.secondary">
                Filtered Results
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Journals Content - Table or Card View */}
      {loading ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading journal publications...
            </Typography>
          </Box>
        </Paper>
      ) : filteredData.length === 0 ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.noDataContainer}>
            <ArticleIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No publications found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? "No publications match your search criteria"
                : "No journal publications available. Add your first publication!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog("add")}
              sx={{ mt: 2 }}
            >
              ADD FIRST PUBLICATION
            </Button>
          </Box>
        </Paper>
      ) : viewMode === "card" ? (
        // Card View
        <Grid container spacing={3}>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((journal) => (
              <Grid item xs={12} sm={6} md={4} key={journal._id}>
                <Card sx={styles.journalCard}>
                  <CardContent>
                    {/* Title */}
                    <Typography variant="h6" fontWeight={600} sx={{ 
                      mb: 1,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {journal.title}
                    </Typography>

                    {/* Authors */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon fontSize="small" />
                        <span>{formatAuthors(journal)}</span>
                      </Box>
                    </Typography>

                    {/* Journal and Date */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Chip
                        label={journal.journal}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(journal.publishedOn)}
                      </Typography>
                    </Stack>

                    {/* Impact Metrics */}
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      {journal.IF && (
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Impact Factor
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {parseFloat(journal.IF).toFixed(2)}
                          </Typography>
                        </Grid>
                      )}
                      {journal.SJR && (
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            SJR
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {journal.SJR}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {/* DOI Link */}
                    {journal.DOI && (
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <LinkIcon fontSize="small" />
                        <Box sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {journal.DOI}
                        </Box>
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleOpenDialog("edit", journal)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleOpenDialog("delete", journal)}
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
                <TableCell sx={styles.tableHeader}>Title</TableCell>
                <TableCell sx={styles.tableHeader}>Authors</TableCell>
                <TableCell sx={styles.tableHeader}>Journal</TableCell>
                <TableCell sx={styles.tableHeader}>Impact Metrics</TableCell>
                <TableCell sx={styles.tableHeader} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((journal) => (
                  <TableRow key={journal._id} hover>
                    <TableCell sx={{ maxWidth: '250px' }}>
                      <Tooltip title={journal.title}>
                        <Typography variant="body2" fontWeight={500} sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {journal.title}
                        </Typography>
                      </Tooltip>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(journal.publishedOn)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '200px' }}>
                      <Tooltip title={Array.isArray(journal.authors) ? journal.authors.join(", ") : journal.authors}>
                        <Typography variant="body2" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {formatAuthors(journal)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {journal.journal}
                      </Typography>
                      {journal.volume && (
                        <Typography variant="caption" color="text.secondary">
                          Vol. {journal.volume}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {journal.IF && (
                          <Typography variant="body2">
                            <strong>IF:</strong> {parseFloat(journal.IF).toFixed(2)}
                          </Typography>
                        )}
                        {journal.SJR && (
                          <Typography variant="body2">
                            <strong>SJR:</strong> {journal.SJR}
                          </Typography>
                        )}
                        {journal.DOI && (
                          <Typography variant="caption" color="text.secondary" sx={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '150px'
                          }}>
                            {journal.DOI}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenDialog("edit", journal)}
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
                            onClick={() => handleOpenDialog("delete", journal)}
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
          {dialogMode === "add" && "Add New Journal Publication"}
          {dialogMode === "edit" && "Edit Journal Publication"}
          {dialogMode === "delete" && "Delete Journal Publication"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === "delete" ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this publication? This action cannot be undone.
                </Alert>
                {selectedJournal && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Title:</strong> {selectedJournal.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Authors:</strong> {formatAuthors(selectedJournal)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Journal:</strong> {selectedJournal.journal}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Published:</strong> {formatDate(selectedJournal.publishedOn)}
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
                    label="Title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter publication title..."
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
                    label="Journal Name"
                    name="journal"
                    value={formData.journal}
                    onChange={handleInputChange}
                    placeholder="e.g., Nature, Science, IEEE Transactions"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Published Date"
                    name="publishedOn"
                    value={formData.publishedOn}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Impact Factor (IF)"
                    name="IF"
                    value={formData.IF}
                    onChange={handleInputChange}
                    placeholder="e.g., 5.678"
                    type="number"
                    step="0.001"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="SJR"
                    name="SJR"
                    value={formData.SJR}
                    onChange={handleInputChange}
                    placeholder="e.g., Q1, Q2"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Volume"
                    name="volume"
                    value={formData.volume}
                    onChange={handleInputChange}
                    placeholder="e.g., 12, 45"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Pages"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    placeholder="e.g., 123-135"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="DOI"
                    name="DOI"
                    value={formData.DOI}
                    onChange={handleInputChange}
                    placeholder="e.g., 10.1000/xyz123"
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
                    placeholder="Any additional notes or citations..."
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
              {dialogMode === "add" && "Add Publication"}
              {dialogMode === "edit" && "Update Publication"}
              {dialogMode === "delete" && "Delete Publication"}
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
  journalCard: {
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

export default Journals;