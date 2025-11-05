import React from "react";
import { Box, Container, Typography, Grid, Paper } from "@mui/material";
import { People, ShoppingCart, HourglassEmpty } from "@mui/icons-material";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const userData = [
  { month: "Jan", users: 400 },
  { month: "Feb", users: 600 },
  { month: "Mar", users: 800 },
  { month: "Apr", users: 1500 },
  { month: "May", users: 1800 },
  { month: "Jun", users: 2000 },
];

const orderData = [
  { name: "Completed", value: 65 },
  { name: "Pending", value: 25 },
  { name: "Cancelled", value: 10 },
];

const COLORS = ["#696CFF", "#6DCBA2", "#E1675E"];

const Dashboard = () => {
  const API_URL =  "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";
  
  return (
    <Box sx={{ display: "flex" }}>
      <Container sx={{ flexGrow: 1, paddingTop: "20px" }}>
        {/* Stats Cards */}
        <Grid container spacing={2}>
          {[{ title: "Total Users", value: "1,024", icon: <People /> },
            { title: "New Orders", value: "78", icon: <ShoppingCart /> },
            { title: "Pending Requests", value: "25", icon: <HourglassEmpty /> },
            { title: "Pending Requests", value: "25", icon: <HourglassEmpty /> }

          ].map((item, index) => (
            <Grid item xs={12} md={3} key={index}>
              <Paper
                sx={{
                  padding: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: `linear-gradient(145deg, #696CFF, #4A4EFF)`,
                  color: "white",
                  boxShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
                  borderRadius: 2,
                  "&:hover": { transform: "scale(1.05)", transition: "0.3s ease-in-out" },
                }}
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold",color:"white" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mt: 1,color:"white" }}>
                    {item.value}
                  </Typography>
                </Box>
                <Box sx={{ fontSize: 30 }}>{item.icon}</Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ padding: 3, backgroundColor: "white", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2, color: "#333" }}>
                User Growth
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line type="monotone" dataKey="users" stroke="#696CFF" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ padding: 3, textAlign: "center", backgroundColor: "white", borderRadius: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2, color: "#333" }}>
                Order Status
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={orderData} dataKey="value" outerRadius={100} label>
                    {orderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard;