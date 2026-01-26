import Navbar from "../components/navbar";
import { Container, Typography, Button } from "@mui/material";
import { useState } from "react";
import AuthModal from "../components/authModal";

export default function HomePage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"login" | "signup">("login");

    const openModal = (mode: "login" | "signup") => {
        setModalMode(mode);
        setModalOpen(true);
    }

    return (
        <>
            <Navbar onLoginClick={() => openModal("login")} onSignupClick={() => openModal("signup")} />
            <Container maxWidth="md" sx={{ textAlign: "center", mt: 10 }}>
                    <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                    Track your Crypto Wealth
                    </Typography>
                    <Typography variant="h6" color="text.secondary" paragraph>
                    Real-time balances, historical charts, and multi-wallet tracking in one place.
                    </Typography>
                    <Button variant="contained" size="large" sx={{ mt: 4, fontWeight: "bold", fontSize: "1.2rem", px: 4 }} onClick={() => openModal("signup")}>
                    Get Started
                    </Button>
                </Container>

                <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} initialMode={modalMode} />
        </>
    );
}