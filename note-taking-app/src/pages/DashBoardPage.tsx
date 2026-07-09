
import * as React from "react";
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from "@mui/material";
import { BarChart, PieChart, LineChart } from "@mui/x-charts";
import { useGetNotesQuery } from "../services/noteApi";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleOutlined from "@mui/icons-material/CheckCircleOutlined";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import { MainLayout } from "../components/layout/MainLayout";

export const DashBoardPage: React.FC = () => {
  const { data: notes = [], isLoading, isError } = useGetNotesQuery();

  // --- 1. STATS SUMMARY CALCULATION ---
  const stats = React.useMemo(() => {
    const total = notes.length;
    const completed = notes.filter((n) => n.task === "Complete").length;
    const inProgress = notes.filter((n) => n.task === "In Progress").length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, inProgress, completionRate };
  }, [notes]);

 // data processing for chart
  
  //  Status (Pie Chart) - Count 
  const statusChartData = React.useMemo(() => {
    const counts: Record<string, number> = { Todo: 0, "In Progress": 0, Complete: 0, "Not Started": 0 };
    
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
      .filter((item) => notes.length === 0 || item.value > 0); // if count 0 it don't play
  }, [notes]);

  // split color for category
  const categoryChartData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    
    notes.forEach((note) => {
      const cat = (note.category || "General").trim();
      counts[cat] = (counts[cat] || 0) + 1;
    });

    const hasData = Object.keys(counts).length > 0;
    
    //for category
    const categoryColors: Record<string, string> = {
      "Study": "#2b5c8f",         // Dark Blue
      "My Note": "#973aa8",       // Purple
      "Company Note": "#d95f02",  // Orange
      "Family": "#10b981",        // Green
      "Fitness": "#e7298a",       // Pink
      "General": "#7570b3",       // Lavender
    };

    // 
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

  // . Priority (Line Chart) - Low, Medium, High Count 
  const priorityChartData = React.useMemo(() => {
    const counts: Record<string, number> = { Low: 0, Medium: 0, High: 0 };
    
    notes.forEach((note) => {
      const priority = note.priority || "Low";
      if (counts[priority] !== undefined) counts[priority]++;
    });

    const values = [counts["Low"], counts["Medium"], counts["High"]];

    return {
      xAxis: [{ scaleType: "point" as const, data: ["Low", "Medium", "High"] }],
      series: [{ data: values, label: "Priority Frequency", color: "#a01a58" }],
    };
  }, [notes]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Typography color="error" sx={{ textAlign: "center", mt: 5 }}>
        Failed to load dashboard data.
      </Typography>
    );
  }


  const axisArrowStyles = {
    "& .MuiChartsAxis-bottom .MuiChartsAxis-line": { strokeWidth: 2, stroke: "#1a1a1a" },
    "& .MuiChartsAxis-left .MuiChartsAxis-line": { strokeWidth: 2, stroke: "#1a1a1a" },
    "& .MuiChartsGrid-line": { strokeDasharray: "3 3", stroke: "#e0e0e0" },
  };

  return (
   <MainLayout>
     <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "background.default", minHeight: "100vh" }}>
      
    {/* summary card section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid  size={{xs:12,sm:6,md:3}}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Tasks</Typography>
                <Typography variant="h4" sx={{ mt: 0.5, fontWeight: "bold" }}>{stats.total}</Typography>
              </Box>
              <AssignmentIcon sx={{ fontSize: 40, color: "#973aa8", opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid  size={{xs:12,sm:6,md:3}}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Completed</Typography>
                <Typography variant="h4" sx={{ mt: 0.5, color: "#10b981", fontWeight: "bold" }}>{stats.completed}</Typography>
              </Box>
              <CheckCircleOutlined sx={{ fontSize: 40, color: "#10b981", opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12,sm:6,md:3}}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2" color="text.secondary">In Progress</Typography>
                <Typography variant="h4" sx={{ mt: 0.5, color: "#f59e0b", fontWeight: "bold" }}>{stats.inProgress}</Typography>
              </Box>
              <PendingActionsIcon sx={{ fontSize: 40, color: "#f59e0b", opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{xs:12,sm:6,md:3}}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)" , }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Box>
                <Typography variant="body2"  color="text.secondary" sx={{height:30}}>Completion Rate</Typography>
                <Typography variant="h4" sx={{ mt: 0.5, color: "#6366f1", fontSize: '24px', fontWeight: 'bold' }}>{stats.completionRate}%</Typography>
              </Box>
              <Box sx={{ position: "relative", display: "inline-flex" }} color="text.secondary">
                <CircularProgress variant="determinate" value={stats.completionRate } size={45} thickness={5} sx={{ color: "#6366f1" ,opacity:0.8}} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* --- 2. MAIN VISUALIZATIONS CHARTS --- */}
      <Grid container spacing={4}>
        
        <Grid  size={{xs:12,md:6}}>
          <Card sx={{ boxShadow: "none", bgcolor: "background.default", p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>Tasks by Category</Typography>
              <Box sx={{ width: "100%", height: 300, ...axisArrowStyles }}>
                <BarChart
                  dataset={categoryChartData}
                  xAxis={[{ scaleType: "band", dataKey: "category" , colorMap: {
                        type: 'ordinal',
                        colors: categoryChartData.map(d => d.color),
                        
                      }}]}
                  series={[
                    { 
                      dataKey: "frequency", 
                      label: "Category Frequency",
                  
                     
                    }
                  ]}
                  height={280}
                  grid={{ horizontal: true }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Line Graphs - Priority Level */}
        <Grid  size={{xs:12,md:6}}>
          <Card sx={{ boxShadow: "none", bgcolor: "background.default", p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}>Tasks by Priority</Typography>
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

        {/* Pie Charts - Status Level */}
        <Grid  size={{xs:12,md:6}} sx={{ margin: "0 auto" }}>
          <Card sx={{ boxShadow: "none", bgcolor: "background.default", p: 2, borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <CardContent sx={{ textAlign: "center" }}>
              <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600, color: "text.primary" }}>Task Status Distribution</Typography>
              <Box sx={{ width: "100%", height: 280, display: "flex", justifyContent: "center" }}>
                <PieChart
                  series={[
                    {
                      data: statusChartData,
                      innerRadius: 30, 
                      outerRadius: 100,
                      paddingAngle: 3,
                    },
                  ]}
                  height={260}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
      </Grid>

    </Box>
   </MainLayout>
  );
};