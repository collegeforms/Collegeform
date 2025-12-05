import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  TextField,
  Typography,
  styled,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Add as AddIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon
} from '@mui/icons-material';

const API_URL = "https://www.collegeforms.in";
// Styled components
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: 1200,
  margin: '0 auto',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: '#fff',
  borderRadius: theme.spacing(1),
  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },
}));

const DocumentCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
  }
}));

const PreviewContainer = styled(Box)(({ theme }) => ({
  height: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f5f7fa',
  overflow: 'hidden',
  [theme.breakpoints.up('sm')]: {
    height: 180,
  },
  [theme.breakpoints.up('md')]: {
    height: 200,
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
  gridColumn: '1 / -1',
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(6),
  },
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(8),
  },
}));

const Docs = () => {
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocument, setNewDocument] = useState({
    name: '',
    file: null,
    fileType: '',
    status: 'pending'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Get token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('userToken');
  };

  // Get user ID from token
  const getUserId = () => {
    const token = getAuthToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log(payload);
        
        return payload.id;
      } catch (error) {
        console.error('Error parsing token:', error);
        return null;
      }
    }
    return null;
  };

  // Create axios instance with auth header
  const api = axios.create({
    baseURL: API_URL,
  });

  // Add request interceptor to include auth token
  api.interceptors.request.use(
    (config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const userId = getUserId();
      
      if (!token || !userId) {
        setError('Authentication token not found. Please log in.');
        return;
      }

      const response = await api.get('/api/documents');
      setDocuments(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching documents:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Error fetching documents. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument({ ...newDocument, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.includes('image') ? 'image' : 'pdf';
      setNewDocument({
        ...newDocument,
        file,
        fileType
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getAuthToken();
    const userId = getUserId();
    
    if (!token || !userId) {
      setError('Authentication token not found. Please log in.');
      return;
    }

    const formData = new FormData();
    formData.append('name', newDocument.name);
    formData.append('file', newDocument.file);
    formData.append('fileType', newDocument.fileType);
    formData.append('status', newDocument.status);

    try {
      await api.post('/api/documents', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        }
      });

      setShowUploadModal(false);
      setNewDocument({
        name: '',
        file: null,
        fileType: '',
        status: 'pending'
      });

      fetchDocuments();
    } catch (error) {
      console.error('Error uploading document:', error);
      if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.');
      } else {
        setError('Error uploading document. Please try again.');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const token = getAuthToken();
        const userId = getUserId();
        
        if (!token || !userId) {
          setError('Authentication token not found. Please log in.');
          return;
        }

        await api.delete(`/api/documents/${id}`);
        fetchDocuments();
      } catch (error) {
        console.error('Error deleting document:', error);
        if (error.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (error.response?.status === 403) {
          setError('You are not authorized to delete this document.');
        } else {
          setError('Error deleting document. Please try again.');
        }
      }
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      approved: { color: 'success', label: 'Approved' },
      pending: { color: 'warning', label: 'Pending' },
      rejected: { color: 'error', label: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Chip color={config.color} label={config.label} size="small" />;
  };

  // Responsive grid configuration
  const getGridConfig = () => {
    if (isMobile) return { xs: 12 };
    if (isTablet) return { xs: 12, sm: 6 };
    return { xs: 12, sm: 6, md: 4 };
  };

  if (loading) {
    return (
      <PageContainer>
        <Typography variant={isMobile ? "h6" : "h5"} align="center">
          Loading documents...
        </Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderBox>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          component="h1" 
          color="#002147" 
          fontWeight="600"
          align={isMobile ? "center" : "left"}
        >
          My Documents
        </Typography>
        <Button
          variant="contained"
          startIcon={!isMobile && <AddIcon />}
          onClick={() => setShowUploadModal(true)}
          sx={{ 
            borderRadius: 2, 
            padding: isMobile ? '8px 16px' : '10px 20px', 
            background: '#002147',
            minWidth: isMobile ? 'auto' : 'inherit'
          }}
          fullWidth={isMobile}
        >
          {isMobile ? <AddIcon /> : 'Upload Document'}
        </Button>
      </HeaderBox>

      {error && (
        <Typography 
          color="error" 
          sx={{ 
            mb: 2, 
            p: 2, 
            backgroundColor: '#ffebee', 
            borderRadius: 1,
            fontSize: isMobile ? '0.875rem' : '1rem'
          }}
        >
          {error}
        </Typography>
      )}

      <Grid container spacing={isMobile ? 2 : 3}>
        {documents.length > 0 ? (
          documents.map((doc) => (
            <Grid item {...getGridConfig()} key={doc._id}>
              <DocumentCard>
                <CardContent sx={{ flexGrow: 1, p: isMobile ? 1.5 : 2 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography 
                      variant={isMobile ? "subtitle1" : "h6"} 
                      component="h3" 
                      noWrap 
                      sx={{ 
                        maxWidth: isMobile ? '60%' : '70%',
                        fontSize: isMobile ? '0.9rem' : '1.1rem'
                      }}
                    >
                      {doc.name}
                    </Typography>
                    {getStatusChip(doc.status)}
                  </Box>

                  <PreviewContainer>
                    {doc.fileType === 'image' ? (
                      <img
                        src={doc.fileUrl}
                        alt={doc.name}
                        style={{ 
                          maxWidth: '100%', 
                          maxHeight: '100%', 
                          objectFit: 'contain' 
                        }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <PdfIcon sx={{ 
                          fontSize: isMobile ? 48 : 64, 
                          color: '#e74c3c', 
                          mb: 1 
                        }} />
                        <Typography variant="body2" sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}>
                          PDF Document
                        </Typography>
                      </Box>
                    )}
                  </PreviewContainer>
                </CardContent>

                <CardActions sx={{ 
                  justifyContent: 'space-between', 
                  p: isMobile ? 1 : 2,
                  gap: isMobile ? 1 : 0
                }}>
                  <Button
                    size={isMobile ? "small" : "medium"}
                    startIcon={!isMobile && <DownloadIcon />}
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ 
                      minWidth: 'auto',
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }}
                  >
                    {isMobile ? <DownloadIcon /> : 'Download'}
                  </Button>
                  <Button
                    size={isMobile ? "small" : "medium"}
                    color="error"
                    startIcon={!isMobile && <DeleteIcon />}
                    onClick={() => handleDelete(doc._id)}
                    sx={{ 
                      minWidth: 'auto',
                      fontSize: isMobile ? '0.75rem' : '0.875rem'
                    }}
                  >
                    {isMobile ? <DeleteIcon /> : 'Delete'}
                  </Button>
                </CardActions>
              </DocumentCard>
            </Grid>
          ))
        ) : (
          <EmptyState>
            <ImageIcon sx={{ 
              fontSize: isMobile ? 48 : 64, 
              color: '#bdc3c7', 
              mb: 2 
            }} />
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              color="textSecondary" 
              gutterBottom
            >
              No documents found
            </Typography>
            <Typography 
              variant="body2" 
              color="textSecondary"
              sx={{ fontSize: isMobile ? '0.875rem' : '1rem' }}
            >
              Upload your first document to get started
            </Typography>
          </EmptyState>
        )}
      </Grid>

      <Dialog 
        open={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        maxWidth="sm" 
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle sx={{ p: isMobile ? 2 : 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant={isMobile ? "h6" : "h5"}>
              Upload New Document
            </Typography>
            <IconButton 
              onClick={() => setShowUploadModal(false)}
              size={isMobile ? "small" : "medium"}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              name="name"
              label="Document Name"
              type="text"
              fullWidth
              variant="outlined"
              value={newDocument.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
              size={isMobile ? "small" : "medium"}
            />

            <Button 
              variant="outlined" 
              component="label" 
              fullWidth 
              sx={{ 
                py: isMobile ? 1 : 1.5,
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
            >
              {newDocument.file ? 'Change File' : 'Select File (PDF or Image)'}
              <input
                type="file"
                hidden
                id="file"
                name="file"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                required
              />
            </Button>

            {newDocument.file && (
              <Typography 
                variant="body2" 
                sx={{ 
                  mt: 1, 
                  textAlign: 'center',
                  fontSize: isMobile ? '0.75rem' : '0.875rem'
                }}
              >
                Selected: {newDocument.file.name}
              </Typography>
            )}
          </DialogContent>

          <DialogActions sx={{ p: isMobile ? 2 : 3 }}>
            <Button 
              onClick={() => setShowUploadModal(false)} 
              sx={{ borderRadius: 1 }}
              size={isMobile ? "small" : "medium"}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!newDocument.file || !newDocument.name}
              sx={{ 
                borderRadius: 1, 
                background: '#002147',
                fontSize: isMobile ? '0.875rem' : '1rem'
              }}
              size={isMobile ? "small" : "medium"}
            >
              Upload Document
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
};

export default Docs;