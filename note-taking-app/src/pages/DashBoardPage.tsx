


import * as React from "react";
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Button } from "@mui/material";
import { BarChart, PieChart, LineChart } from "@mui/x-charts";
import { useGetNotesQuery } from "../services/noteApi";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import { useNavigate } from "react-router-dom";

export const DashBoardPage: React.FC = () => {
  const { 
    data: notes = [], 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetNotesQuery();

   const navigate = useNavigate();


   //DashboardPage
   React.useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('Dashboard - Token:', token ? 'Present' :'Missing');
    if(!token) {
      console.log('Dashboard - No token, redirecting to login' );
      navigate('/login');
    }
   },[navigate]);

   //Error state
   React.useEffect(() => {
    if(error) {
      console.log('Error from API', error);
    }
   },[error])

  // --- STATS SUMMARY CALCULATION ---
  const stats = React.useMemo(() => {
    const total = notes.length;
    const completed = notes.filter((n) => n.task === "Complete").length;
    const inProgress = notes.filter((n) => n.task === "In Progress").length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, completionRate };
  }, [notes]);

  // Status (Pie Chart)
  const statusChartData = React.useMemo(() => {
    const counts: Record<string, number> = { 
      "Todo": 0, 
      "In Progress": 0, 
      "Complete": 0, 
      "Not Started": 0 
    };
    
    notes.forEach((note) => {
      const status = note.task || "Todo";
      if (counts[status] !== undefined) counts[status]++;
    });

    const colors = ["#2b5c8f", "#d95f02", "#7570b3", "#e7298a"];
    const keys = Object.keys(counts);

    return keys
      .map((key, index) => ({
        id: index,
        value: notes.length > 0 ? counts[key] : 1,
        label: `${key} (${notes.length > 0 ? counts[key] : 0})`,
        color: colors[index % colors.length],
      }))
      .filter((item) => notes.length === 0 || item.value > 0);
  }, [notes]);

  // Category (Bar Chart)
  const categoryChartData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    
    notes.forEach((note) => {
      const cat = (note.category || "General").trim();
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const hasData = Object.keys(counts).length > 0;
    
    const categoryColors: Record<string, string> = {
      "Study": "#2b5c8f",
      "My Note": "#973aa8",
      "Company Note": "#d95f02",
      "Family": "#10b981",
      "Fitness": "#e7298a",
      "General": "#7570b3",
    };

    const defaultColors = ["#f59e0b", "#6366f1", "#06b6d4", "#ec4899"];

   
    const dataset = hasData 
      ? Object.keys(counts).map((cat, index) => ({
          category: cat,
          frequency: counts[cat],
          color: categoryColors[cat] || defaultColors[index % defaultColors.length]
        }))
      : [{ category: "General", frequency: 0, color: "#7570b3" }];

    return dataset;
  }, [notes]);

  // Priority (Line Chart)
  const priorityChartData = React.useMemo(() => {
    const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0 };
    
    notes.forEach((note) => {
      const priority = note.priority || "Low";
      if (counts[priority] !== undefined) counts[priority]++;
    });

    const values = [counts["Low"], counts["Medium"], counts["High"]];

    return {
      xAxis: [{ 
        scaleType: "point" as const, 
        data: ["Low", "Medium", "High"] 
      }],
      series: [{ 
        data: values, 
        label: "Priority Frequency", 
        color: "#a01a58" 
      }],
    };
  }, [notes]);

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <Box sx={{ 
        display: "flex", 
        flexDirection: "column",
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "80vh" 
      }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2, color: "text.secondary" }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }



  if (isError) {
    // Error message 
    let errorMessage = "Please try again later";
    let errorDetails = "";
    
    if (error && typeof error === 'object') {
     
      if ('status' in error) {
        const fetchError = error as { status: number; data?: any };
        if (fetchError.status === 401) {
          errorMessage = "Your session has expired. Please login again.";
          errorDetails = "Unauthorized access";
        } else if (fetchError.status === 404) {
          errorMessage = "Notes data not found.";
          errorDetails = "API endpoint not found";
        } else if (fetchError.status === 500) {
          errorMessage = "Server error. Please try again later.";
          errorDetails = "Internal server error";
        } else if (fetchError.status === 0) {
          errorMessage = "Cannot connect to server. Please check your internet connection.";
          errorDetails = "Network error";
        } else {
          errorMessage = fetchError.data?.message || errorMessage;
          errorDetails = `Status: ${fetchError.status}`;
        }
      } else if ('message' in error) {
        // Generic error
        errorMessage = (error as Error).message || errorMessage;
      }
    }

    return (
      <Box sx={{ 
        p: 4, 
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh"
      }}>
        <ErrorOutlinedIcon sx={{ fontSize: 64, color: "error.main", mb: 2 }} />
        <Typography color="error" variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
          Failed to load dashboard data
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ mb: 1 }}>
          {errorMessage}
        </Typography>
        {errorDetails && (
          <Typography color="text.secondary" variant="caption" sx={{ display: 'block', mb: 2 }}>
            {errorDetails}
          </Typography>
        )}
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={() => refetch()}
          sx={{ 
            mt: 2,
            textTransform: "none",
            bgcolor: "#973aa8",
            "&:hover": { bgcolor: "#7a2d8a" }
          }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  // CHART STYLES
  const axisArrowStyles = {
    "& .MuiChartsAxis-bottom .MuiChartsAxis-line": { 
      strokeWidth: 2, 
      stroke: "#1a1a1a" 
    },
    "& .MuiChartsAxis-left .MuiChartsAxis-line": { 
      strokeWidth: 2, 
      stroke: "#1a1a1a" 
    },
    "& .MuiChartsGrid-line": { 
      strokeDasharray: "3 3", 
      stroke: "#e0e0e0" 
    },
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Tasks</Typography>
                <Typography variant="h4" sx={{ mt: 0.5, fontWeight: "bold" }}>
                  {stats.total}
                </Typography>
              </Box>
              <AssignmentIcon sx={{ fontSize: 40, color: "#973aa8", opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Completed</Typography>
                <Typography variant="h4" sx={{ mt: 0.5, color: "#10b981", fontWeight: "bold" }}>
                  {stats.completed}
                </Typography>
              </Box>
              <CheckCircleOutlined sx={{ fontSize: 40, color: "#10b981", opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">In Progress</Typography>
                <Typography variant="h4" sx={{ mt: 0.5, color: "#f59e0b", fontWeight: "bold" }}>
                  {stats.inProgress}
                </Typography>
              </Box>
              <PendingActionsIcon sx={{ fontSize: 40, color: "#f59e0b", opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Completion Rate</Typography>
                <Typography variant="h4" sx={{ mt: 0.5, color: "#6366f1", fontSize: '24px', fontWeight: 'bold' }}>
                  {stats.completionRate}%
                </Typography>
              </Box>
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress 
                  variant="determinate" 
                  value={stats.completionRate} 
                  size={45} 
                  thickness={5} 
                  sx={{ color: "#6366f1", opacity: 0.8 }} 
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ 
            boxShadow: "none", 
            bgcolor: "background.default", 
            p: 2, 
            borderRadius: 3, 
            border: "1px solid #e2e8f0" 
          }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
                Tasks by Category
              </Typography>
              <Box sx={{ width: "100%", height: 300, ...axisArrowStyles }}>
                <BarChart
                  dataset={categoryChartData}
                  xAxis={[{ 
                    scaleType: "band", 
                    dataKey: "category",
                    colorMap: {
                      type: 'ordinal',
                      colors: categoryChartData.map(d => d.color),
                    }
                  }]}
                  series={[{ 
                    dataKey: "frequency", 
                    label: "Category Frequency",
                  }]}
                  height={280}
                  grid={{ horizontal: true }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ 
            boxShadow: "none", 
            bgcolor: "background.default", 
            p: 2, 
            borderRadius: 3, 
            border: "1px solid #e2e8f0" 
          }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>
                Tasks by Priority
              </Typography>
              <Box sx={{ width: "100%", height: 300, ...axisArrowStyles }}>
                <LineChart
                  xAxis={priorityChartData.xAxis}
                  series={priorityChartData.series}
                  height={280}
                  grid={{ vertical: true, horizontal: true }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }} sx={{ margin: "0 auto" }}>
          <Card sx={{ 
            boxShadow: "none", 
            bgcolor: "background.default", 
            p: 2, 
            borderRadius: 3, 
            border: "1px solid #e2e8f0" 
          }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}>
                Task Status Distribution
              </Typography>
              <Box sx={{ width: "100%", height: 280, display: "flex", justifyContent: "center" }}>
                <PieChart
                  series={[{
                    data: statusChartData,
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 3,
                  }]}
                  height={260}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};