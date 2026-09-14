import { useState } from "react";
import { Container, Box, Typography, Paper, Divider } from "@mui/material";
import FavoritosList from "./components/FavoritosList";
import FavoritoForm from "./components/FavoritoForm";
import MapaDescoberta from "./components/MapaDescoberta";

function App() {
  const [chaveAtualizacao, setChaveAtualizacao] = useState(0);

  function handleFavoritoCriado() {
    setChaveAtualizacao((atual) => atual + 1);
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Restaurantes Favoritos
        </Typography>

        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <FavoritoForm onFavoritoCriado={handleFavoritoCriado} />
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <FavoritosList key={chaveAtualizacao} />
        </Paper>

        <Divider sx={{ mb: 4 }} />

        <Paper elevation={2} sx={{ p: 3 }}>
          <MapaDescoberta onFavoritoCriado={handleFavoritoCriado} />
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
