import { AppBar, Toolbar, Typography, Button } from "@mui/material";

interface NavbarProps {
    onLoginClick?: () => void;
    onSignupClick?: () => void;
    isAuthenticated?: boolean;
    onLogout?: () => void;
}

const Navbar = ({ onLoginClick, onSignupClick, isAuthenticated, onLogout }: NavbarProps) => {
    return (
        <>
            <AppBar position="static" color="transparent" elevation={0} sx={{ py: 1, bgcolor: "background.paper",  borderBottom: 1, borderColor: "divider" }}>
                <Toolbar>

                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
                    Crypto Tracker
                </Typography>

                {isAuthenticated ? (
                    <Button color="inherit" onClick={onLogout} sx={{ fontWeight: "bold", "&:hover": { color: "primary.light" } }}>
                        Logout
                    </Button>
                ) : (
                    <>
                        <Button color="inherit" onClick={onLoginClick} sx={{ mr: 2, px: 2, fontWeight: "bold", "&:hover": {  color: "primary.light"} }}>
                            Log In
                        </Button>
                        <Button variant="contained" onClick={onSignupClick} sx={{fontWeight: "bold"}}>
                            Sign Up
                        </Button>
                    </>
                )}
                </Toolbar>
            </AppBar>
         </>
     );
}
 
export default Navbar;