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
  Article as ArticleIcon,
  Refresh as RefreshIcon,
  Person as PersonIcon,
  Link as LinkIcon,
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Numbers as NumbersIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Patents = () => {
  const { userRole } = useAuth();
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  
  // States - EXACT SAME AS CONFERENCE PAGE
  const [loading, setLoading] = useState(false);
  const [patentsData, setPatentsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedPatent, setSelectedPatent] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [activeTab, setActiveTab] = useState("all");

  // Form state - PATENTS SPECIFIC FIELDS
  const [formData, setFormData] = useState({
    authors: "",
    title: "",
    date: "",
    patent_number: "",
    application_number: "",
    weblink: "",
    additionalInfo: "",
    status: "Granted",
    publisher: "",
    pages: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all patents - IMPROVED TO MATCH CONFERENCE PAGE EXACTLY
  const fetchData = async () => {
    setLoading(true);
    try {
      const userRole = localStorage.getItem("userInfo");
      const afApi = userRole === "admin" ? "Admin" : "Subadmin";
      
      // Build URL based on searchQuery - SAME LOGIC AS CONFERENCE
      let url;
      
      if (searchQuery && searchQuery.trim() !== "") {
        // Search by title when there's a query
        url = `${BASE_URL}/api/${afApi}/private/getASinglePublication/Patent/${encodeURIComponent(searchQuery.trim())}`;
      } else {
        // Get ALL patents when no search query
        url = `${BASE_URL}/api/${afApi}/private/getAllPublication/Patent`;
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
        setPatentsData(data.DataForUpdate || []);
        
        if (data.DataForUpdate?.length === 0) {
          toast.info("No patent publications found");
        } else {
          const count = data.DataForUpdate?.length || 0;
          toast.success(`Loaded ${count} patent publication${count !== 1 ? 's' : ''}`);
        }
      } else {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        
        if (response.status === 404) {
          toast.info("Search endpoint returned no results");
          setPatentsData([]);
        } else {
          toast.error(`Failed to load data: ${response.status}`);
          setPatentsData([]);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Cannot connect to backend server");
      setPatentsData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open dialog for add/edit/delete - SAME AS CONFERENCE
  const handleOpenDialog = (mode, patent = null) => {
    setDialogMode(mode);
    setSelectedPatent(patent);

    if (mode === "edit" && patent) {
      setFormData({
        authors: Array.isArray(patent.authors) ? patent.authors.join(", ") : patent.authors || "",
        title: patent.title || "",
        date: patent.date ? new Date(patent.date).toISOString().split("T")[0] : "",
        patent_number: patent.patent_number || "",
        application_number: patent.application_number || "",
        weblink: patent.weblink || "",
        additionalInfo: patent.additionalInfo || "",
        status: patent.status || "Granted",
        publisher: patent.publisher || "",
        pages: patent.pages || "",
      });
    } else if (mode === "add") {
      setFormData({
        authors: "",
        title: "",
        date: "",
        patent_number: "",
        application_number: "",
        weblink: "",
        additionalInfo: "",
        status: "Granted",
        publisher: "",
        pages: "",
      });
    }

    setDialogOpen(true);
  };

  // Close dialog - SAME AS CONFERENCE
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      authors: "",
      title: "",
      date: "",
      patent_number: "",
      application_number: "",
      weblink: "",
      additionalInfo: "",
      status: "Granted",
      publisher: "",
      pages: "",
    });
    setSelectedPatent(null);
  };

  // Handle form submission - SAME PATTERN AS CONFERENCE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let endpoint = "";
      let method = "";
      let payload = null;

      // Prepare authors array
      const authorsArray = formData.authors.split(",").map(author => author.trim());

      if (dialogMode === "add") {
        const requiredFields = ["authors", "title", "date", "patent_number", "status"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/createPublication/Patent`;
        method = "POST";
        payload = {
          ...formData,
          authors: authorsArray,
        };
      } else if (dialogMode === "edit" && selectedPatent) {
        const requiredFields = ["authors", "title", "date", "patent_number", "status"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/UpdatePublication/Patent/${selectedPatent._id}`;
        method = "PUT";
        payload = {
          ...formData,
          authors: authorsArray,
        };
      } else if (dialogMode === "delete" && selectedPatent) {
        endpoint = `${BASE_URL}/api/${afApi}/private/DeletePublication/Patent/${selectedPatent._id}`;
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
        toast.success(`Patent publication ${action} successfully!`);
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

  // Pagination handlers - SAME AS CONFERENCE
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Clear filters - SAME AS CONFERENCE
  const handleClearFilters = () => {
    setSearchQuery("");
    setPage(0);
    fetchData();
  };

  // Filter patents by search - SAME LOGIC AS CONFERENCE
  const filteredData = patentsData.filter((patent) => {
    const authors = Array.isArray(patent.authors) ? patent.authors.join(" ") : patent.authors || "";
    const title = patent.title || "";
    const patentNumber = patent.patent_number || "";
    const status = patent.status || "";
    const publisher = patent.publisher || "";

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !authors.toLowerCase().includes(query) &&
        !title.toLowerCase().includes(query) &&
        !patentNumber.toLowerCase().includes(query) &&
        !status.toLowerCase().includes(query) &&
        !publisher.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Filter by tab - SIMILAR TO CONFERENCE
    if (activeTab === "granted") {
      return patent.status && patent.status.toLowerCase() === "granted";
    }
    if (activeTab === "filed") {
      return patent.status && patent.status.toLowerCase() === "filed";
    }
    if (activeTab === "recent") {
      const currentYear = new Date().getFullYear();
      const patentYear = new Date(patent.date).getFullYear();
      return patentYear >= currentYear - 2;
    }

    return true;
  });

  // Statistics - SIMILAR TO CONFERENCE
  const totalPatents = patentsData.length;
  
  // Count granted patents
  const grantedPatents = patentsData.filter(p => 
    p.status && p.status.toLowerCase() === "granted"
  ).length;

  // Count filed patents
  const filedPatents = patentsData.filter(p => 
    p.status && p.status.toLowerCase() === "filed"
  ).length;

  // Recent patents (last 2 years)
  const currentYear = new Date().getFullYear();
  const recentPatents = patentsData.filter(p => {
    const patentYear = new Date(p.date).getFullYear();
    return patentYear >= currentYear - 2;
  }).length;

  // Format authors for display - SAME AS CONFERENCE
  const formatAuthors = (patent) => {
    if (Array.isArray(patent.authors)) {
      return patent.authors.slice(0, 3).join(", ") + (patent.authors.length > 3 ? " et al." : "");
    }
    return patent.authors || "Unknown";
  };

  // Format date for display - SAME AS CONFERENCE
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "granted": return "success";
      case "filed": return "warning";
      default: return "default";
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "granted": return <CheckCircleIcon />;
      case "filed": return <PendingIcon />;
      default: return null;
    }
  };

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header - SAME DESIGN AS CONFERENCE */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <ArticleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Patent Publications
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

      {/* Filter and Actions Bar - SAME AS CONFERENCE */}
      <Paper sx={styles.actionBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by authors, title, patent number, or status..."
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
                Add Patent
              </Button>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchData}>
                Refresh
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs for filtering - SAME AS CONFERENCE */}
      <Paper sx={{ mb: 3, p: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="All Patents" value="all" />
          <Tab label="Granted" value="granted" />
          <Tab label="Filed" value="filed" />
          <Tab label="Recent (2 Years)" value="recent" />
        </Tabs>
      </Paper>

      {/* Statistics Cards - SAME DESIGN AS CONFERENCE */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <ArticleIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4">{totalPatents}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Patents
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CheckCircleIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4">{grantedPatents}</Typography>
              <Typography variant="body2" color="text.secondary">
                Granted
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <PendingIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4">{filedPatents}</Typography>
              <Typography variant="body2" color="text.secondary">
                Filed
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

      {/* Patents Content - Table or Card View - SAME AS CONFERENCE */}
      {loading ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading patent publications...
            </Typography>
          </Box>
        </Paper>
      ) : filteredData.length === 0 ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.noDataContainer}>
            <ArticleIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No patents found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? "No patents match your search criteria"
                : "No patent publications available. Add your first patent!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog("add")}
              sx={{ mt: 2 }}
            >
              ADD FIRST PATENT
            </Button>
          </Box>
        </Paper>
      ) : viewMode === "card" ? (
        // Card View - SAME DESIGN AS CONFERENCE
        <Grid container spacing={3}>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((patent) => (
              <Grid item xs={12} sm={6} md={4} key={patent._id}>
                <Card sx={styles.patentCard}>
                  <CardContent>
                    {/* Status Badge */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Chip
                        icon={getStatusIcon(patent.status)}
                        label={patent.status || "Unknown"}
                        color={getStatusColor(patent.status)}
                        size="small"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(patent.date)}
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
                      {patent.title}
                    </Typography>

                    {/* Authors */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon fontSize="small" />
                        <span>{formatAuthors(patent)}</span>
                      </Box>
                    </Typography>

                    {/* Patent Numbers */}
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      {patent.patent_number && (
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Patent No.
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {patent.patent_number}
                          </Typography>
                        </Grid>
                      )}
                      {patent.application_number && (
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Appl. No.
                          </Typography>
                          <Typography variant="body2" fontWeight={600}>
                            {patent.application_number}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {/* Publisher and Pages */}
                    <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                      {patent.publisher && (
                        <Typography variant="caption" color="text.secondary">
                          Pub: {patent.publisher}
                        </Typography>
                      )}
                      {patent.pages && (
                        <Typography variant="caption" color="text.secondary">
                          Pages: {patent.pages}
                        </Typography>
                      )}
                    </Stack>

                    {/* Weblink */}
                    {patent.weblink && (
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <LinkIcon fontSize="small" />
                        <Box sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {patent.weblink}
                        </Box>
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleOpenDialog("edit", patent)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleOpenDialog("delete", patent)}
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
        // Table View - SAME AS CONFERENCE
        <TableContainer component={Paper} sx={styles.tablePaper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeader}>Title</TableCell>
                <TableCell sx={styles.tableHeader}>Authors</TableCell>
                <TableCell sx={styles.tableHeader}>Patent Details</TableCell>
                <TableCell sx={styles.tableHeader}>Status & Date</TableCell>
                <TableCell sx={styles.tableHeader} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patent) => (
                  <TableRow key={patent._id} hover>
                    <TableCell sx={{ maxWidth: '250px' }}>
                      <Tooltip title={patent.title}>
                        <Typography variant="body2" fontWeight={500} sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {patent.title}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '200px' }}>
                      <Tooltip title={Array.isArray(patent.authors) ? patent.authors.join(", ") : patent.authors}>
                        <Typography variant="body2" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {formatAuthors(patent)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {patent.patent_number && (
                          <Typography variant="body2">
                            <strong>Patent No:</strong> {patent.patent_number}
                          </Typography>
                        )}
                        {patent.application_number && (
                          <Typography variant="body2">
                            <strong>Appl. No:</strong> {patent.application_number}
                          </Typography>
                        )}
                        {patent.publisher && (
                          <Typography variant="body2">
                            <strong>Publisher:</strong> {patent.publisher}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Chip
                          icon={getStatusIcon(patent.status)}
                          label={patent.status || "Unknown"}
                          color={getStatusColor(patent.status)}
                          size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(patent.date)}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenDialog("edit", patent)}
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
                            onClick={() => handleOpenDialog("delete", patent)}
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

      {/* Dialog for Add/Edit/Delete - SAME AS CONFERENCE */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {dialogMode === "add" && "Add New Patent Publication"}
          {dialogMode === "edit" && "Edit Patent Publication"}
          {dialogMode === "delete" && "Delete Patent Publication"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === "delete" ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this patent publication? This action cannot be undone.
                </Alert>
                {selectedPatent && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Title:</strong> {selectedPatent.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Authors:</strong> {formatAuthors(selectedPatent)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Patent Number:</strong> {selectedPatent.patent_number}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Status:</strong> {selectedPatent.status}
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
                    placeholder="Enter patent title..."
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
                    label="Date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl component="fieldset" sx={{ width: '100%' }}>
                    <FormLabel component="legend">Status *</FormLabel>
                    <RadioGroup
                      row
                      name="status"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                    >
                      <FormControlLabel value="Granted" control={<Radio />} label="Granted" />
                      <FormControlLabel value="Filed" control={<Radio />} label="Filed" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Patent Number"
                    name="patent_number"
                    value={formData.patent_number}
                    onChange={handleInputChange}
                    placeholder="e.g., US1234567B2"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Application Number"
                    name="application_number"
                    value={formData.application_number}
                    onChange={handleInputChange}
                    placeholder="e.g., US15/123,456"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    placeholder="e.g., USPTO, EPO, WIPO"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Pages"
                    name="pages"
                    value={formData.pages}
                    onChange={handleInputChange}
                    placeholder="e.g., 1-15"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Weblink"
                    name="weblink"
                    value={formData.weblink}
                    onChange={handleInputChange}
                    placeholder="e.g., https://patents.google.com/patent/US1234567"
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
              {dialogMode === "add" && "Add Patent"}
              {dialogMode === "edit" && "Update Patent"}
              {dialogMode === "delete" && "Delete Patent"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

// Styles - EXACT SAME AS CONFERENCE PAGE
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
  patentCard: {
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

export default Patents;