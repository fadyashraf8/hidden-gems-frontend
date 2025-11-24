import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Stack, 
  Paper, 
  TextField,
  Divider,
  InputBase
} from '@mui/material';
// Import Link to allow navigation without adding a Router
// import { Link } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import SendIcon from '@mui/icons-material/Send';

// --- THEME COLORS ---
const BRAND_RED = '#DD0303'; 
const TEXT_DARK = '#2D2E2F';
const TEXT_GREY = '#6E7072';
const BG_LIGHT = '#F9F9F9';

// --- COMPONENTS ---

// const NavBar = () => (
//   <Box sx={{ borderBottom: '1px solid #e0e0e0', py: 2, mb: 0, bgcolor: 'white', position: 'sticky', top: 0, zIndex: 1100 }}>
//     <Container maxWidth="lg" sx={{ display: 'flex', gap: { xs: 1, md: 3 }, alignItems: 'center', flexWrap: 'wrap' }}>
      
//       {/* BRAND LOGO - Wrapped in Link to go Home */}
//       <Link to="/" style={{ textDecoration: 'none' }}>
//         <Typography variant="h4" sx={{ color: BRAND_RED, fontWeight: 900, mr: 1, letterSpacing: '-1px', cursor: 'pointer' }}>
//             Gemsy
//         </Typography>
//       </Link>
      
//       <Paper sx={{ 
//           p: '2px 4px', display: 'flex', alignItems: 'center', 
//           width: { xs: '100%', md: 400 }, order: { xs: 3, md: 2 }, mt: { xs: 1, md: 0 },
//           boxShadow: 'none', borderRadius: 2, border: '1px solid #eee', bgcolor: '#f7f7f7'
//       }}>
//         <InputBase sx={{ ml: 2, flex: 1, fontSize: '0.95rem' }} placeholder="Search for help..." />
//         <Box sx={{ p: 1, cursor: 'pointer', color: TEXT_GREY }}>
//             <SearchIcon />
//         </Box>
//       </Paper>

//       <Box sx={{ flexGrow: 1, order: { xs: 2, md: 3 } }} />
      
//       <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' }, order: 4 }}>
//         <Button color="inherit" sx={{ textTransform: 'none', fontWeight: 600 }}>Log In</Button>
//         <Button variant="contained" size="small" sx={{ bgcolor: BRAND_RED, textTransform: 'none', borderRadius: 2, px: 3, fontWeight: 700, '&:hover': { bgcolor: '#b30000' } }}>Sign Up</Button>
//       </Stack>
//     </Container>
//   </Box>
// );

const ContactForm = () => (
  <Paper elevation={0} sx={{ p: 4, borderRadius: 3, border: '1px solid #e0e0e0' }}>
    <Typography variant="h5" sx={{ fontWeight: 800, color: TEXT_DARK, mb: 1 }}>
      Send us a message
    </Typography>
    <Typography variant="body2" sx={{ color: TEXT_GREY, mb: 3 }}>
      We'll get back to you within 24 hours.
    </Typography>

    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="First Name" variant="outlined" size="small" />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField fullWidth label="Last Name" variant="outlined" size="small" />
      </Grid>
      <Grid item xs={12}>
        <TextField fullWidth label="Email Address" variant="outlined" size="small" type="email" />
      </Grid>
      <Grid item xs={12}>
        <TextField 
          fullWidth 
          label="What can we help you with?" 
          variant="outlined" 
          multiline 
          rows={4} 
        />
      </Grid>
      <Grid item xs={12}>
        <Button 
          fullWidth 
          variant="contained" 
          endIcon={<SendIcon />}
          sx={{ 
            bgcolor: BRAND_RED, 
            py: 1.5, 
            fontWeight: 700, 
            textTransform: 'none',
            fontSize: '1rem',
            '&:hover': { bgcolor: '#b30000' } 
          }}
        >
          Submit Request
        </Button>
      </Grid>
    </Grid>
  </Paper>
);

const InfoItem = ({ icon: Icon, title, subtitle }) => (
  <Stack direction="row" spacing={2} alignItems="flex-start">
    <Box sx={{ 
      width: 40, height: 40, borderRadius: '50%', bgcolor: '#FFEFEF', 
      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
    }}>
      <Icon sx={{ color: BRAND_RED }} />
    </Box>
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: TEXT_DARK, lineHeight: 1.2 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ color: TEXT_GREY, mt: 0.5, whiteSpace: 'pre-line' }}>
        {subtitle}
      </Typography>
    </Box>
  </Stack>
);

export default function ContactUsPage() {
  return (
    <Box sx={{ bgcolor: BG_LIGHT, minHeight: '100vh', pb: 8 }}>
      {/* <NavBar /> */}
      
      {/* Header Section */}
      <Box sx={{ bgcolor: "white", py: 8, textAlign: 'center', color: 'black' }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" sx={{ fontWeight: 900, mb: 2 }}>
            Get in Touch
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 400, opacity: 0.9 }}>
            Have questions about a business? Need support? We're here to help.
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ mt: -5 }}>
        <Grid container spacing={4}>
          
          {/* Left Column: Contact Info */}
          <Grid item xs={12} md={5} order={{ xs: 2, md: 1 }}>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <br></br>
              <Typography variant="h5" sx={{ fontWeight: 800, color: TEXT_DARK, mb: 4 }}>
                Contact Information
              </Typography>
              
              <Stack spacing={4} direction={"row"}>
                <InfoItem 
                  icon={LocationOnIcon} 
                  title="Our Office" 
                  subtitle={`123 Market Street, Suite 400\nSan Francisco, CA 94103`} 
                />
                <InfoItem 
                  icon={PhoneIcon} 
                  title="Phone" 
                  subtitle={`+1 (555) 123-4567\nMon-Fri 9am-6pm PST`} 
                />
                <InfoItem 
                  icon={EmailIcon} 
                  title="Email" 
                  subtitle={`support@gemsy.com\nhelp@gemsy.com`} 
                />
              </Stack>

              {/* <Divider sx={{ my: 4 }} />

              <Typography variant="h6" sx={{ fontWeight: 700, color: TEXT_DARK, mb: 2 }}>
                Follow Us
              </Typography>
              <Stack direction="row" spacing={2}>
                {[FacebookIcon, TwitterIcon, InstagramIcon].map((Icon, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      p: 1.5, border: '1px solid #ddd', borderRadius: 2, cursor: 'pointer',
                      bgcolor: 'white', transition: 'all 0.2s',
                      '&:hover': { borderColor: BRAND_RED, color: BRAND_RED, transform: 'translateY(-2px)' }
                    }}
                  >
                    <Icon sx={{ fontSize: 20 }} />
                  </Box>
                ))}
              </Stack> */}
            </Box>
          </Grid>

          {/* Right Column: Form */}
          <Grid item xs={12} md={7} order={{ xs: 1, md: 2 }}>
            <ContactForm />
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}