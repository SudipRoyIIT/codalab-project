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
  EmojiEvents as AwardIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./AuthContext";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

const Workshops = () => {
  const { userRole } = useAuth();
  const afApi = userRole === "admin" ? "Admin" : "Subadmin";
  
  // States - SAME AS CONFERENCE PAGE
  const [loading, setLoading] = useState(false);
  const [workshopsData, setWorkshopsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("");
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [viewMode, setViewMode] = useState("table");
  const [activeTab, setActiveTab] = useState("all");

  // Form state - WORKSHOPS SPECIFIC FIELDS
  const [formData, setFormData] = useState({
    names: "",
    title: "",
    workshop: "",
    pages: "",
    location: "",
    year: "",
    weblink: "",
    awardedBy: "",
    ranking: "",
    additionalInfo: "",
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch all workshops - SAME PATTERN AS CONFERENCE
  const fetchData = async () => {
    setLoading(true);
    try {
      const userRole = localStorage.getItem("userInfo");
      const afApi = userRole === "admin" ? "Admin" : "Subadmin";
      
      // Build URL based on searchQuery - SAME LOGIC AS CONFERENCE
      let url;
      
      if (searchQuery && searchQuery.trim() !== "") {
        // Search by title when there's a query
        url = `${BASE_URL}/api/${afApi}/private/getASinglePublication/Workshops/${encodeURIComponent(searchQuery.trim())}`;
      } else {
        // Get ALL workshops when no search query
        // NOTE: You'll need to add this route to your backend (see CHANGES_REQUIRED.md)
        url = `${BASE_URL}/api/${afApi}/private/getAllPublication/Workshops`;
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
        setWorkshopsData(data.DataForUpdate || []);
        
        if (data.DataForUpdate?.length === 0) {
          toast.info("No workshop publications found");
        } else {
          const count = data.DataForUpdate?.length || 0;
          toast.success(`Loaded ${count} workshop publication${count !== 1 ? 's' : ''}`);
        }
      } else {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        
        if (response.status === 404) {
          toast.info("Search endpoint returned no results");
          setWorkshopsData([]);
        } else {
          toast.error(`Failed to load data: ${response.status}`);
          setWorkshopsData([]);
        }
      }
    } catch (error) {
      console.error("Network error:", error);
      toast.error("Cannot connect to backend server");
      setWorkshopsData([]);
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
  const handleOpenDialog = (mode, workshop = null) => {
    setDialogMode(mode);
    setSelectedWorkshop(workshop);

    if (mode === "edit" && workshop) {
      setFormData({
        names: workshop.names || "",
        title: workshop.title || "",
        workshop: workshop.workshop || "",
        pages: workshop.pages || "",
        location: workshop.location || "",
        year: workshop.year || "",
        weblink: workshop.weblink || "",
        awardedBy: workshop.awardedBy || "",
        ranking: workshop.ranking || "",
        additionalInfo: workshop.additionalInfo || "",
      });
    } else if (mode === "add") {
      setFormData({
        names: "",
        title: "",
        workshop: "",
        pages: "",
        location: "",
        year: "",
        weblink: "",
        awardedBy: "",
        ranking: "",
        additionalInfo: "",
      });
    }

    setDialogOpen(true);
  };

  // Close dialog - SAME AS CONFERENCE
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({
      names: "",
      title: "",
      workshop: "",
      pages: "",
      location: "",
      year: "",
      weblink: "",
      awardedBy: "",
      ranking: "",
      additionalInfo: "",
    });
    setSelectedWorkshop(null);
  };

  // Handle form submission - SAME PATTERN AS CONFERENCE
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let endpoint = "";
      let method = "";
      let payload = null;

      if (dialogMode === "add") {
        const requiredFields = ["names", "title", "workshop", "year", "weblink"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/createPublication/Workshops`;
        method = "POST";
        payload = formData;
      } else if (dialogMode === "edit" && selectedWorkshop) {
        const requiredFields = ["names", "title", "workshop", "year", "weblink"];
        const missingFields = requiredFields.filter((field) => !formData[field]);

        if (missingFields.length > 0) {
          toast.error(`Please fill in: ${missingFields.join(", ")}`);
          return;
        }

        endpoint = `${BASE_URL}/api/${afApi}/private/UpdatePublication/Workshops/${selectedWorkshop._id}`;
        method = "PUT";
        payload = formData;
      } else if (dialogMode === "delete" && selectedWorkshop) {
        endpoint = `${BASE_URL}/api/${afApi}/private/DeletePublication/Workshops/${selectedWorkshop._id}`;
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
        toast.success(`Workshop publication ${action} successfully!`);
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

  // Filter workshops by search - SAME LOGIC AS CONFERENCE
  const filteredData = workshopsData.filter((workshop) => {
    const names = workshop.names || "";
    const title = workshop.title || "";
    const workshopName = workshop.workshop || "";
    const location = workshop.location || "";
    const awardedBy = workshop.awardedBy || "";
    const ranking = workshop.ranking || "";

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !names.toLowerCase().includes(query) &&
        !title.toLowerCase().includes(query) &&
        !workshopName.toLowerCase().includes(query) &&
        !location.toLowerCase().includes(query) &&
        !awardedBy.toLowerCase().includes(query) &&
        !ranking.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    // Filter by tab - SIMILAR TO CONFERENCE
    if (activeTab === "highRanking") {
      return workshop.ranking && workshop.ranking.toLowerCase().includes("a");
    }
    if (activeTab === "awarded") {
      return workshop.awardedBy && workshop.awardedBy.trim() !== "";
    }
    if (activeTab === "recent") {
      const currentYear = new Date().getFullYear();
      const workshopYear = parseInt(workshop.year);
      return workshopYear >= currentYear - 2;
    }

    return true;
  });

  // Statistics - SIMILAR TO CONFERENCE
  const totalWorkshops = workshopsData.length;
  
  // Count workshops with high ranking (A or A*)
  const highRankingWorkshops = workshopsData.filter(w => 
    w.ranking && (w.ranking.toLowerCase().includes("a") || w.ranking.toLowerCase().includes("a*"))
  ).length;

  // Count awarded workshops
  const awardedWorkshops = workshopsData.filter(w => 
    w.awardedBy && w.awardedBy.trim() !== ""
  ).length;

  // Recent workshops (last 2 years)
  const currentYear = new Date().getFullYear();
  const recentWorkshops = workshopsData.filter(w => {
    const workshopYear = parseInt(w.year);
    return workshopYear >= currentYear - 2;
  }).length;

  // Format date/year for display
  const formatYear = (year) => {
    if (!year) return "N/A";
    return year;
  };

  return (
    <Box sx={styles.container}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Header - SAME DESIGN AS CONFERENCE */}
      <Box sx={styles.header}>
        <Box>
          <Typography variant="h4" sx={styles.title}>
            <ArticleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Workshop Publications
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
              placeholder="Search by names, title, workshop, location, or ranking..."
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
                Add Workshop
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
          <Tab label="All Workshops" value="all" />
          <Tab label="High Ranking (A/A*)" value="highRanking" />
          <Tab label="Awarded" value="awarded" />
          <Tab label="Recent (2 Years)" value="recent" />
        </Tabs>
      </Paper>

      {/* Statistics Cards - SAME DESIGN AS CONFERENCE */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <ArticleIcon sx={{ fontSize: 40, color: "primary.main", mb: 1 }} />
              <Typography variant="h4">{totalWorkshops}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Workshops
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <StarIcon sx={{ fontSize: 40, color: "warning.main", mb: 1 }} />
              <Typography variant="h4">{highRankingWorkshops}</Typography>
              <Typography variant="body2" color="text.secondary">
                High Ranking
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={styles.statCard}>
            <Box sx={styles.statCardContent}>
              <AwardIcon sx={{ fontSize: 40, color: "success.main", mb: 1 }} />
              <Typography variant="h4">{awardedWorkshops}</Typography>
              <Typography variant="body2" color="text.secondary">
                Awarded
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

      {/* Workshops Content - Table or Card View - SAME AS CONFERENCE */}
      {loading ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.loadingContainer}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Loading workshop publications...
            </Typography>
          </Box>
        </Paper>
      ) : filteredData.length === 0 ? (
        <Paper sx={styles.tablePaper}>
          <Box sx={styles.noDataContainer}>
            <ArticleIcon sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No workshops found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              {searchQuery
                ? "No workshops match your search criteria"
                : "No workshop publications available. Add your first workshop!"}
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog("add")}
              sx={{ mt: 2 }}
            >
              ADD FIRST WORKSHOP
            </Button>
          </Box>
        </Paper>
      ) : viewMode === "card" ? (
        // Card View - SAME DESIGN AS CONFERENCE
        <Grid container spacing={3}>
          {filteredData
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((workshop) => (
              <Grid item xs={12} sm={6} md={4} key={workshop._id}>
                <Card sx={styles.workshopCard}>
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
                      {workshop.title}
                    </Typography>

                    {/* Names */}
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon fontSize="small" />
                        <span>{workshop.names}</span>
                      </Box>
                    </Typography>

                    {/* Workshop and Year */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                      <Chip
                        label={workshop.workshop}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatYear(workshop.year)}
                      </Typography>
                    </Stack>

                    {/* Location */}
                    {workshop.location && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <LocationIcon fontSize="small" />
                        <span>{workshop.location}</span>
                      </Typography>
                    )}

                    {/* Ranking and Pages */}
                    <Grid container spacing={1} sx={{ mb: 1 }}>
                      {workshop.ranking && (
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Ranking
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {workshop.ranking}
                          </Typography>
                        </Grid>
                      )}
                      {workshop.pages && (
                        <Grid item xs={6}>
                          <Typography variant="caption" color="text.secondary">
                            Pages
                          </Typography>
                          <Typography variant="body1" fontWeight={600}>
                            {workshop.pages}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>

                    {/* Awarded By */}
                    {workshop.awardedBy && (
                      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <AwardIcon fontSize="small" color="success" />
                        <span><strong>Awarded by:</strong> {workshop.awardedBy}</span>
                      </Typography>
                    )}

                    {/* Weblink */}
                    {workshop.weblink && (
                      <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1 }}>
                        <LinkIcon fontSize="small" />
                        <Box sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {workshop.weblink}
                        </Box>
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                    <Tooltip title="Edit">
                      <IconButton
                        onClick={() => handleOpenDialog("edit", workshop)}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => handleOpenDialog("delete", workshop)}
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
                <TableCell sx={styles.tableHeader}>Names</TableCell>
                <TableCell sx={styles.tableHeader}>Workshop</TableCell>
                <TableCell sx={styles.tableHeader}>Details</TableCell>
                <TableCell sx={styles.tableHeader} align="center">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((workshop) => (
                  <TableRow key={workshop._id} hover>
                    <TableCell sx={{ maxWidth: '250px' }}>
                      <Tooltip title={workshop.title}>
                        <Typography variant="body2" fontWeight={500} sx={{
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {workshop.title}
                        </Typography>
                      </Tooltip>
                      <Typography variant="caption" color="text.secondary">
                        {formatYear(workshop.year)}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: '200px' }}>
                      <Typography variant="body2">
                        {workshop.names}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {workshop.workshop}
                      </Typography>
                      {workshop.location && (
                        <Typography variant="caption" color="text.secondary">
                          {workshop.location}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        {workshop.ranking && (
                          <Typography variant="body2">
                            <strong>Ranking:</strong> {workshop.ranking}
                          </Typography>
                        )}
                        {workshop.pages && (
                          <Typography variant="body2">
                            <strong>Pages:</strong> {workshop.pages}
                          </Typography>
                        )}
                        {workshop.awardedBy && (
                          <Typography variant="body2">
                            <strong>Awarded by:</strong> {workshop.awardedBy}
                          </Typography>
                        )}
                      </Stack>
                    </TableCell>
                    <TableCell align="center">
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="Edit">
                          <IconButton
                            onClick={() => handleOpenDialog("edit", workshop)}
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
                            onClick={() => handleOpenDialog("delete", workshop)}
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
          {dialogMode === "add" && "Add New Workshop Publication"}
          {dialogMode === "edit" && "Edit Workshop Publication"}
          {dialogMode === "delete" && "Delete Workshop Publication"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {dialogMode === "delete" ? (
              <Box>
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Are you sure you want to delete this workshop publication? This action cannot be undone.
                </Alert>
                {selectedWorkshop && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Title:</strong> {selectedWorkshop.title}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Names:</strong> {selectedWorkshop.names}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Workshop:</strong> {selectedWorkshop.workshop}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Year:</strong> {selectedWorkshop.year}
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
                    placeholder="Enter workshop title..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Names"
                    name="names"
                    value={formData.names}
                    onChange={handleInputChange}
                    placeholder="e.g., John Doe, Jane Smith"
                    helperText="Enter participant names"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Workshop Name"
                    name="workshop"
                    value={formData.workshop}
                    onChange={handleInputChange}
                    placeholder="e.g., IEEE Workshop, ACM Workshop"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2024"
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
                    label="Awarded By"
                    name="awardedBy"
                    value={formData.awardedBy}
                    onChange={handleInputChange}
                    placeholder="e.g., IEEE, ACM"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Weblink"
                    name="weblink"
                    value={formData.weblink}
                    onChange={handleInputChange}
                    placeholder="e.g., https://example.com/workshop"
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
                    placeholder="Any additional notes or details..."
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
              {dialogMode === "add" && "Add Workshop"}
              {dialogMode === "edit" && "Update Workshop"}
              {dialogMode === "delete" && "Delete Workshop"}
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
  workshopCard: {
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

export default Workshops;