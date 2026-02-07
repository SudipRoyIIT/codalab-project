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
  FilterList as FilterIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  LocationOn as LocationIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Conference = () => {
  const { userRole } = useAuth();
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  
  // States - EXACT SAME AS JOURNALS PAGE
  const [loading, setLoading] = useState(false);
  const [conferencesData, setConferencesData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedConference, setSelectedConference] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [activeTab, setActiveTab] = useState("all");

  // Form state - CONFERENCE SPECIFIC FIELDS
  const [formData, setFormData] = useState({
    authors: "",
    title: "",
    conference: "",
    date: "",
    location: "",
    pages: "",
    ranking: "",
    DOI: "",
    additionalInfo: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all conferences - SAME PATTERN AS JOURNALS
  const fetchData = async () => {
    setLoading(true);
    try {
      const userRole = localStorage.getItem("userInfo");
      const afApi = userRole === "admin" ? "Admin" : "Subadmin";
      
      // Build URL based on searchQuery - SAME LOGIC AS JOURNALS
      let url;
      
      if (searchQuery && searchQuery.trim() !== "") {
        // Search by title when there's a query
        url = `${BASE_URL}/api/${afApi}/private/getASinglePublication/Conference/${encodeURIComponent(searchQuery.trim())}`;
      } else {
        // Get ALL conferences when no search query
        url = `${BASE_URL}/api/${afApi}/private/getAllPublication/Conference`;
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
        setConferencesData(data.DataForUpdate || []);
        
        if (data.DataForUpdate?.length === 0) {
          toast.info("No conference publications found");
        } else {
          const count = data.DataForUpdate?.length || 0;
          toast.success(`Loaded ${count} conference publication${count !== 1 ? 's' : ''}`);
        }
      } else {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        
        if (response.status === 404) {
          toast.info("Search endpoint returned no results");
          setConferencesData([]);
        } else {
          toast.error(`Failed to load data: ${response.status}`);
          setConferencesData([]);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Cannot connect to backend server");
      setConferencesData([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Open dialog for add/edit/delete - SAME AS JOURNALS
  const handleOpenDialog = (mode, conference = null) => {
    setDialogMode(mode);
    setSelectedConference(conference);

    if (mode === "edit" && conference) {
      setFormData({
        authors: Array.isArray(conference.authors) ? conference.authors.join(", ") : conference.authors || "",
        title: conference.title || "",
        conference: conference.conference || "",
        date: conference.date ? new Date(conference.date).toISOString().split("T")[0] : "",
        location: conference.location || "",
        pages: conference.pages || "",
        ranking: conference.ranking || "",
        DOI: conference.DOI || "",
        additionalInfo: conference.additionalInfo || "",
      });
    } else if (mode === "add") {
      setFormData({
        authors: "",
        title: "",
        conference: "",
        date: "",
        location: "",
        pages: "",
        ranking: "",
        DOI: "",
        additionalInfo: "",
      });
    }

    setDialogOpen(true);
  };

  // Close dialog - SAME AS JOURNALS
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      authors: "",
      title: "",
      conference: "",
      date: "",
      location: "",
      pages: "",
      ranking: "",
      DOI: "",
      additionalInfo: "",
    });
    setSelectedConference(null);
  };

  // Handle form submission - SAME PATTERN AS JOURNALS
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let endpoint = "";
      let method = "";
      let payload = null;

      // Prepare authors array
      const authorsArray = formData.authors.split(",").map(author => author.trim());

      if (dialogMode === "add") {
        const requiredFields = ["authors", "title", "conference", "date"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/createPublication/Conference`;
        method = "POST";
        payload = {
          ...formData,
          authors: authorsArray,
        };
      } else if (dialogMode === "edit" && selectedConference) {
        const requiredFields = ["authors", "title", "conference", "date"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/UpdatePublication/Conference/${selectedConference._id}`;
        method = "PUT";
        payload = {
          ...formData,
          authors: authorsArray,
        };
      } else if (dialogMode === "delete" && selectedConference) {
        endpoint = `${BASE_URL}/api/${afApi}/private/DeletePublication/Conference/${selectedConference._id}`;
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
        toast.success(`Conference publication ${action} successfully!`);
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

  // Pagination handlers - SAME AS JOURNALS
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Clear filters - SAME AS JOURNALS
  const handleClearFilters = () => {
    setSearchQuery("");
    setPage(0);
    fetchData();
  };

  // Filter conferences by search - SAME LOGIC AS JOURNALS
  const filteredData = conferencesData.filter((conference) => {
    const authors = Array.isArray(conference.authors) ? conference.authors.join(" ") : conference.authors || "";
    const title = conference.title || "";
    const conferenceName = conference.conference || "";
    const location = conference.location || "";
    const doi = conference.DOI || "";

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !authors.toLowerCase().includes(query) &&
        !title.toLowerCase().includes(query) &&
        !conferenceName.toLowerCase().includes(query) &&
        !location.toLowerCase().includes(query) &&
        !doi.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Filter by tab - SIMILAR TO JOURNALS
    if (activeTab === "highRanking") {
      return conference.ranking && conference.ranking.toLowerCase().includes("a");
    }
    if (activeTab === "recent") {
      const currentYear = new Date().getFullYear();
      const confYear = new Date(conference.date).getFullYear();
      return confYear >= currentYear - 2;
    }

    return true;
  });

  // Statistics - SIMILAR TO JOURNALS
  const totalConferences = conferencesData.length;
  
  // Count conferences with high ranking (A or A*)
  const highRankingConferences = conferencesData.filter(c => 
    c.ranking && (c.ranking.toLowerCase().includes("a") || c.ranking.toLowerCase().includes("a*"))
  ).length;

  // Recent conferences (last 2 years)
  const currentYear = new Date().getFullYear();
  const recentConferences = conferencesData.filter(c => {
    const confYear = new Date(c.date).getFullYear();
    return confYear >= currentYear - 2;
  }).length;

  // Format authors for display - SAME AS JOURNALS
  const formatAuthors = (conference) => {
    if (Array.isArray(conference.authors)) {
      return conference.authors.slice(0, 3).join(", ") + (conference.authors.length > 3 ? " et al." : "");
    }
    return conference.authors || "Unknown";
  };

  // Format date for display - SAME AS JOURNALS
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

      {/* Header - SAME DESIGN AS JOURNALS */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <ArticleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Conference Publications
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

      {/* Filter and Actions Bar - SAME AS JOURNALS */}
      <Paper sx={styles.actionBar}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by authors, title, conference, or location..."
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

      {/* Tabs for filtering - SAME AS JOURNALS */}
      <Paper sx={{ mb: 3, p: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="All Publications" value="all" />
          <Tab label="High Ranking (A/A*)" value="highRanking" />
          <Tab label="Recent (2 Years)" value="recent" />
        </Tabs>
      </Paper>

      {/* Statistics Cards - SAME DESIGN AS JOURNALS */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <ArticleIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4">{totalConferences}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Publications
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <StarIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4">{highRankingConferences}</Typography>
              <Typography variant="body2" color="text.secondary">
                High Ranking
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <CalendarIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4">{recentConferences}</Typography>
              <Typography variant="body2" color="text.secondary">
                Recent (2 Years)
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

      {/* Conferences Content - Table or Card View - SAME AS JOURNALS */}
      {loading ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading conference publications...
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
                : "No conference publications available. Add your first publication!"}
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
        // Card View - SAME DESIGN AS JOURNALS
        <Grid container spacing={3}>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((conference) => (
              <Grid item xs={12} sm={6} md={4} key={conference._id}>
                <Card sx={styles.conferenceCard}>
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
                      {conference.title}
                    </Typography>

                    {/* Authors */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon fontSize="small" />
                        <span>{formatAuthors(conference)}</span>
                      </Box>
                    </Typography>

                    {/* Conference and Date */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Chip
                        label={conference.conference}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(conference.date)}
                      </Typography>
                    </Stack>

                    {/* Location */}
                    {conference.location && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <LocationIcon fontSize="small" />
                        <span>{conference.location}</span>
                      </Typography>
                    )}

                    {/* Ranking and Pages */}
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      {conference.ranking && (
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Ranking
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {conference.ranking}
                          </Typography>
                        </Grid>
                      )}
                      {conference.pages && (
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text-secondary">
                            Pages
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {conference.pages}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {/* DOI Link */}
                    {conference.DOI && (
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <LinkIcon fontSize="small" />
                        <Box sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {conference.DOI}
                        </Box>
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleOpenDialog("edit", conference)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleOpenDialog("delete", conference)}
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
        // Table View - SAME AS JOURNALS
        <TableContainer component={Paper} sx={styles.tablePaper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.tableHeader}>Title</TableCell>
                <TableCell sx={styles.tableHeader}>Authors</TableCell>
                <TableCell sx={styles.tableHeader}>Conference</TableCell>
                <TableCell sx={styles.tableHeader}>Details</TableCell>
                <TableCell sx={styles.tableHeader} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((conference) => (
                  <TableRow key={conference._id} hover>
                    <TableCell sx={{ maxWidth: '250px' }}>
                      <Tooltip title={conference.title}>
                        <Typography variant="body2" fontWeight={500} sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {conference.title}
                        </Typography>
                      </Tooltip>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(conference.date)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '200px' }}>
                      <Tooltip title={Array.isArray(conference.authors) ? conference.authors.join(", ") : conference.authors}>
                        <Typography variant="body2" sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {formatAuthors(conference)}
                        </Typography>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {conference.conference}
                      </Typography>
                      {conference.location && (
                        <Typography variant="caption" color="text.secondary">
                          {conference.location}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {conference.ranking && (
                          <Typography variant="body2">
                            <strong>Ranking:</strong> {conference.ranking}
                          </Typography>
                        )}
                        {conference.pages && (
                          <Typography variant="body2">
                            <strong>Pages:</strong> {conference.pages}
                          </Typography>
                        )}
                        {conference.DOI && (
                          <Typography variant="caption" color="text.secondary" sx={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            maxWidth: '150px'
                          }}>
                            {conference.DOI}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenDialog("edit", conference)}
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
                            onClick={() => handleOpenDialog("delete", conference)}
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

      {/* Dialog for Add/Edit/Delete - SAME AS JOURNALS */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {dialogMode === "add" && "Add New Conference Publication"}
          {dialogMode === "edit" && "Edit Conference Publication"}
          {dialogMode === "delete" && "Delete Conference Publication"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === "delete" ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this publication? This action cannot be undone.
                </Alert>
                {selectedConference && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Title:</strong> {selectedConference.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Authors:</strong> {formatAuthors(selectedConference)}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Conference:</strong> {selectedConference.conference}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Date:</strong> {formatDate(selectedConference.date)}
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
                    label="Conference Name"
                    name="conference"
                    value={formData.conference}
                    onChange={handleInputChange}
                    placeholder="e.g., IEEE Conference, ACM Symposium"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Conference Date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g., San Francisco, CA, USA"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Ranking"
                    name="ranking"
                    value={formData.ranking}
                    onChange={handleInputChange}
                    placeholder="e.g., A, A*, B, C"
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
                <Grid item xs={12} md={6}>
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

// Styles - EXACT SAME AS JOURNALS PAGE
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
  conferenceCard: {
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

export default Conference;