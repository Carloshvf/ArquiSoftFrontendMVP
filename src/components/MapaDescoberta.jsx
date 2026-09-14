import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import {
  Box,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { descobrirRestaurantes, criarFavorito } from "../api/favoritosService";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function CliqueNoMapa({ onClique }) {
  useMapEvents({
    click(evento) {
      onClique(evento.latlng);
    },
  });
  return null;
}

function MapaDescoberta({ onFavoritoCriado }) {
  const [pontoBusca, setPontoBusca] = useState(null);
  const [restaurantes, setRestaurantes] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [erro, setErro] = useState(null);

  async function buscarRestaurantes(lat, lng) {
    setPontoBusca({ lat, lng });
    setBuscando(true);
    setErro(null);

    try {
      const resposta = await descobrirRestaurantes(lat, lng, 1000);
      setRestaurantes(resposta.resultados);
    } catch (e) {
      setErro(e.message);
    } finally {
      setBuscando(false);
    }
  }

  function usarLocalizacaoAtual() {
    if (!navigator.geolocation) {
      setErro("Geolocalização não suportada neste navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (posicao) =>
        buscarRestaurantes(posicao.coords.latitude, posicao.coords.longitude),
      () => setErro("Não foi possível obter sua localização."),
    );
  }

  async function favoritar(restaurante) {
    try {
      await criarFavorito({
        nome: restaurante.nome,
        endereco: restaurante.endereco,
        latitude: restaurante.latitude,
        longitude: restaurante.longitude,
        categoria: restaurante.categoria,
        osm_id: restaurante.osm_id,
        tags: [],
      });
      onFavoritoCriado();
    } catch (e) {
      setErro(e.message);
    }
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Descobrir restaurantes
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
        <Button
          variant="outlined"
          startIcon={<MyLocationIcon />}
          onClick={usarLocalizacaoAtual}
          disabled={buscando}
        >
          Usar minha localização
        </Button>
        {buscando && <CircularProgress size={24} />}
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Ou clique em qualquer ponto do mapa para buscar restaurantes ali.
      </Typography>

      {erro && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {erro}
        </Alert>
      )}

      <Box
        sx={{ height: 400, width: "100%", borderRadius: 1, overflow: "hidden" }}
      >
        <MapContainer
          center={[-22.9068, -43.1729]}
          zoom={14}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <CliqueNoMapa
            onClique={(latlng) => buscarRestaurantes(latlng.lat, latlng.lng)}
          />

          {pontoBusca && <Marker position={[pontoBusca.lat, pontoBusca.lng]} />}

          {restaurantes.map((restaurante) => (
            <Marker
              key={restaurante.osm_id}
              position={[restaurante.latitude, restaurante.longitude]}
            >
              <Popup>
                <Stack spacing={0.5} sx={{ minWidth: 180 }}>
                  <Typography fontWeight="bold">{restaurante.nome}</Typography>
                  {restaurante.categoria && (
                    <Typography variant="body2" color="text.secondary">
                      {restaurante.categoria}
                    </Typography>
                  )}
                  {restaurante.endereco && (
                    <Typography variant="body2" color="text.secondary">
                      {restaurante.endereco}
                    </Typography>
                  )}
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => favoritar(restaurante)}
                  >
                    Favoritar
                  </Button>
                </Stack>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Box>
    </Box>
  );
}

export default MapaDescoberta;
