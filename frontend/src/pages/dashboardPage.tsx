import {useState, useEffect } from "react";
import {
    Container, Grid, Paper, Typography, Box, TextField, Button,
    IconButton, Alert, CircularProgress,Card, CardContent, Table,
    TableBody, TableCell, TableHead, TableRow,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from 'react-router-dom';

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Navbar from '../components/navbar';
import { useAuth } from '../contexts/AuthContext';
import { fetchWithAuth } from '../utils/fetchWithAuth';

interface Wallet {
    id: string;
    address: string;
    name: string;
    chain: string;
}

export default function DashboardPage() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [netWorth, setNetWorth] = useState(0);

    const [address, setAddress] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [history, setHistory] = useState([]);

    const navigate = useNavigate();
    const { logout } = useAuth();

useEffect(() => {
        fetchLatestPortfolio();
        fetchHistory();
        fetchWallets();
    }, []);

    const fetchWallets = async () => {
        try {
            const res = await fetchWithAuth("/api/wallet");
            const data = await res.json();
            if (res.ok) {
                setWallets(data);
            }
        } catch (err) {
            setError("Failed to load wallets");
        }
    };

    const fetchHistory = async () => {
        try {
            const res = await fetchWithAuth("/api/portfolio/history");
            const data = await res.json();
            if (res.ok) setHistory(data);
        } catch (err) {
            console.error("Failed to load history", err);
        }
    };

    const fetchLatestPortfolio = async () => {
        try {
            const res = await fetchWithAuth("/api/portfolio/latest");
            const data = await res.json();
            if (res.ok) {
                setNetWorth(data.totalValue || 0);
            }
        } catch (err) {
            console.error("Failed to fetch latest portfolio:", err);
        }
};

    const handleAddWallet = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetchWithAuth("/api/wallet", {
                method: "POST",
                body: JSON.stringify({ address, name }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to add");

            setAddress("");
            setName("");
            fetchLatestPortfolio();

        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        await fetchWithAuth(`/api/wallet/${id}`, {
            method: "DELETE"
        });
        fetchLatestPortfolio();
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <>
            <Navbar isAuthenticated={true} onLogout={handleLogout} />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            
            {/* NET WORTH */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={3}>
                    <Card sx={{ background: 'linear-gradient(135deg, #293f63ff 0%, #0f172a 100%)', color: 'white' }}>
                        <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h6" sx={{ opacity: 0.7 }}>Total Net Worth</Typography>
                                <Typography variant="h2" fontWeight="bold">
                                    C${(netWorth || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* CHART SECTION */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={12}>
                    <Paper sx={{ p: 3, height: 300 }}>
                        <Typography variant="h6" gutterBottom>Portfolio Performance</Typography>
                        
                        {history.length === 0 ? (
                            <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                                <Typography>Waiting for more data snapshots...</Typography>
                            </Box>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={history}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis dataKey="date" tick={{fontSize: 12}} />
                                        <YAxis 
                                            domain={['auto', 'auto']} 
                                            tick={{fontSize: 12}}
                                            tickFormatter={(val) => `$${val}`}
                                        />
                                        <Tooltip 
                                            formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Net Worth']}
                                            contentStyle={{ backgroundColor: '#1e293b', border: 'none' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="value" 
                                            stroke="#8884d8" 
                                            fillOpacity={1} 
                                            fill="url(#colorValue)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* WALLETS */}
            <Grid container spacing={3}>
                <Grid size={12}>
                    <Paper sx={{ p: 0, overflow: "hidden" }}>
                        {error && <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>}
                        
                        <Table>
                            <TableHead sx={{ bgcolor: "background.default" }}>
                                <TableRow>
                                    <TableCell>Wallets</TableCell>
                                    <TableCell align="right">Chain</TableCell>
                                    <TableCell align="right" width={100}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {/* ADD WALLET */}
                                <TableRow sx={{ bgcolor: "action.hover" }}>
                                    <TableCell>
                                        <Box component="form" onSubmit={handleAddWallet} sx={{ display: 'flex', gap: 2 }}>
                                            <TextField 
                                                placeholder="Wallet Address (0x...)" 
                                                size="small" 
                                                required
                                                value={address} 
                                                onChange={(e) => setAddress(e.target.value)}
                                                sx={{ minWidth: 200 }}
                                            />
                                            <TextField 
                                                placeholder="Name (Optional)" 
                                                size="small" 
                                                value={name} 
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell colSpan={2}>
                                        <Button 
                                            variant="contained" 
                                            size="small" 
                                            onClick={handleAddWallet}
                                            disabled={loading}
                                        >
                                            {loading ? <CircularProgress size={20} color="inherit" /> : "Add"}
                                        </Button>
                                    </TableCell>
                                </TableRow>

                                {/* EXISTING WALLETS */}
                                {wallets.map((wallet) => (
                                    <TableRow key={wallet.id} hover>
                                        <TableCell>
                                            <Box>
                                                <Typography fontWeight="bold">{wallet.name || "Wallet"}</Typography>
                                                <Typography variant="caption" sx={{ fontFamily: "monospace", opacity: 0.6 }}>
                                                    {wallet.address.substring(0, 6)}...{wallet.address.substring(38)}
                                                </Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: "bold", color: "success.main" }}>
                                            {wallet.chain || "Unknown"}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton size="small" color="error" onClick={() => handleDelete(wallet.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
        </>
    )
} 