import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Container from '@mui/material/Container';

const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar() {
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xxl">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Logo
          </Typography>
          <List sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'row' }}>
            {pages.map((page) => (
              <ListItem button key={page}>
                <ListItemText primary={page} />
              </ListItem>
            ))}
          </List>
        </Toolbar>
      </Container>
      <Drawer anchor="left" open={openDrawer} onClose={toggleDrawer}>
        <List>
          {pages.map((page) => (
            <ListItem button key={page} onClick={toggleDrawer}>
              <ListItemText primary={page} />
            </ListItem>
          ))}
          <ListItem button onClick={toggleDrawer}>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
