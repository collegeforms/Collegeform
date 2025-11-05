import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Card,
  CardContent,
  TextField,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import { Delete, Add } from "@mui/icons-material";
import axios from "axios";

const SliderManager = () => {
  const API_URL = "https://collegeform.onrender.com" || "https://collegeform-production.up.railway.app" || "http://localhost:5000";

  const sliderContentRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sliderItems, setSliderItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchSliderItems();
    checkAdminStatus();
  }, []);

  useEffect(() => {
    if (sliderContentRef.current && sliderItems.length > 0) {
      const totalWidth = Array.from(sliderContentRef.current.children).reduce(
        (acc, child) => acc + child.offsetWidth,
        0
      );
      setContentWidth(totalWidth / 2); // Divide by 2 since we duplicate content
    }
  }, [sliderItems]);

  const checkAdminStatus = () => {
    const adminToken = localStorage.getItem("adminToken");
    setIsAdmin(!!adminToken);
  };

  const fetchSliderItems = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/slider`);
      setSliderItems(response.data);
    } catch (error) {
      console.error("Error fetching slider items:", error);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/slider`,
        { content: newItem },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`
          }
        }
      );
      setSliderItems([response.data, ...sliderItems]);
      setNewItem("");
    } catch (error) {
      console.error("Error adding slider item:", error);
      alert("Failed to add item. You may not have admin privileges.");
    }
  };

  const openDeleteDialog = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  const handleDeleteItem = async () => {
    if (!itemToDelete) return;
    
    try {
      await axios.delete(`${API_URL}/api/slider/${itemToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`
        }
      });
      setSliderItems(sliderItems.filter((item) => item._id !== itemToDelete));
      closeDeleteDialog();
    } catch (error) {
      console.error("Error deleting slider item:", error);
      alert("Failed to delete item. You may not have admin privileges.");
      closeDeleteDialog();
    }
  };

  const calculateDuration = () => {
    const baseSpeed = 0.05;
    return contentWidth / baseSpeed / 1000;
  };

  return (
    <Box sx={{ 
      padding: "20px",
      width: "100%",
      boxSizing: "border-box",
      overflow: "hidden"
    }}>
      {/* Slider Display */}
      <Box sx={{
        overflow: "hidden",
        width: "100%",
        backgroundColor: "#002147",
        color: "white",
        py: 2,
        mb: 4,
        borderRadius: 1,
      }}>
        <motion.div
          ref={sliderContentRef}
          animate={{ x: [0, -contentWidth] }}
          transition={{
            repeat: Infinity,
            duration: calculateDuration(),
            ease: "linear",
            repeatType: "loop"
          }}
          style={{
            display: "inline-flex",
            whiteSpace: "nowrap",
            willChange: "transform"
          }}
        >
          {[...sliderItems, ...sliderItems].map((item, index) => (
            <Box
              key={`${item._id}-${index}`}
              sx={{
                px: 3,
                display: "flex",
                alignItems: "center",
                flexShrink: 0
              }}
            >
              <Typography
                variant={isMobile ? "body1" : "h6"}
                component="span"
                sx={{ fontWeight: "bold" }}
              >
                {item.content}
              </Typography>
            </Box>
          ))}
        </motion.div>
      </Box>

      {/* Admin Controls */}
      {isAdmin && (
        <Box sx={{ width: "100%" }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            Manage Slider Content
          </Typography>

          <Box sx={{ 
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 4,
            width: "100%"
          }}>
            <TextField
              fullWidth
              label="Add New Slider Content"
              variant="outlined"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="Enter content to display"
              size="small"
              sx={{ maxWidth: 500 }}
              onKeyPress={(e) => e.key === "Enter" && handleAddItem()}
            />
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddItem}
              disabled={!newItem.trim()}
              sx={{ 
                width: { xs: "100%", sm: "auto" },
                minWidth: 120
              }}
            >
              Add
            </Button>
          </Box>

          {/* Replaced Grid with Flexbox layout */}
          <Box sx={{
            gap: 2,
            width: "100%",
          }}>
            {sliderItems.map((item) => (
              <Card
                key={item._id}
                sx={{
                  width: { xs: "100%", },
                  minWidth: 200,
                  maxWidth: 1000,
                  position: "relative",
                  marginBottom:2
                }}
              >
                <CardContent sx={{ 
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}>
                  <Typography>{item.content}</Typography>
                </CardContent>
                <IconButton
                  color="error"
                  onClick={() => openDeleteDialog(item._id)}
                  sx={{ 
                    position: "absolute",
                    bottom: 8,
                    right: 8
                  }}
                >
                  <Delete fontSize={isMobile ? "small" : "medium"} />
                </IconButton>
              </Card>
            ))}
          </Box>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this slider item? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteItem} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SliderManager;