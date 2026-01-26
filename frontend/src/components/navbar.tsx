import { AppBar, Toolbar, Typography, Button, Container, Box } from "@mui/material";
import { useState } from "react";
import AuthModal from "./authModal";

const Navbar = () => {
    return ( 
        <>
            <AppBar position="static" color="transparent" elevation={0} sx={{ py: 1, bgcolor: "background.paper",  borderBottom: 1, borderColor: "divider" }}>
                <Toolbar>
                
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "white" }}>
                    Crypto Tracker
                </Typography>

                <Button color="inherit" onClick={() => openModal(0)} sx={{ mr: 2, px: 2, fontWeight: "bold", "&:hover": {  color: "primary.light"} }}>
                    Log In
                </Button>
                <Button variant="contained" onClick={() => openModal(1)} sx={{fontWeight: "bold"}}>
                    Sign Up
                </Button>
                </Toolbar>
            </AppBar>
         </>
     );
}
 
export default Navbar;