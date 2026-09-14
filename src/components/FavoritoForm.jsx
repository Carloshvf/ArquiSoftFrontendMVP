import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
  Rating,
} from "@mui/material";
import { criarFavorito } from "../api/favoritosService";

const valoresIniciais = {
  nome: "",
  endereco: "",
  latitude: "",
  longitude: "",
  categoria: "",
  nota_pessoal: null,
  comentario: "",
  tags: "",
};

function FavoritoForm({ onFavoritoCriado }) {
  const [form, setForm] = useState(valoresIniciais);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  function handleChange(evento) {
    const { name, value } = evento.target;
    setForm((atual) => ({ ...atual, [name]: value }));
  }

  async function handleSubmit(evento) {
    evento.preventDefault();
    setEnviando(true);
    setErro(null);

    try {
      const dados = {
        nome: form.nome,
        endereco: form.endereco || null,
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude),
        categoria: form.categoria || null,
        nota_pessoal: form.nota_pessoal,
        comentario: form.comentario || null,
        tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
      };

      await criarFavorito(dados);
      setForm(valoresIniciais);
      onFavoritoCriado();
    } catch (e) {
      setErro(e.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h6" gutterBottom>
        Adicionar favorito
      </Typography>

      <Stack spacing={2}>
        <TextField
          name="nome"
          label="Nome"
          value={form.nome}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          name="endereco"
          label="Endereço"
          value={form.endereco}
          onChange={handleChange}
          fullWidth
        />

        <Stack direction="row" spacing={2}>
          <TextField
            name="latitude"
            label="Latitude"
            type="number"
            value={form.latitude}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            name="longitude"
            label="Longitude"
            type="number"
            value={form.longitude}
            onChange={handleChange}
            required
            fullWidth
          />
        </Stack>

        <TextField
          name="categoria"
          label="Categoria"
          value={form.categoria}
          onChange={handleChange}
          fullWidth
        />

        <Box>
          <Typography component="legend">Nota</Typography>
          <Rating
            value={form.nota_pessoal}
            onChange={(_, novoValor) =>
              setForm((atual) => ({ ...atual, nota_pessoal: novoValor }))
            }
          />
        </Box>

        <TextField
          name="comentario"
          label="Comentário"
          value={form.comentario}
          onChange={handleChange}
          multiline
          rows={2}
          fullWidth
        />
        <TextField
          name="tags"
          label="Tags (separadas por vírgula)"
          value={form.tags}
          onChange={handleChange}
          fullWidth
        />

        {erro && <Alert severity="error">{erro}</Alert>}

        <Button type="submit" variant="contained" disabled={enviando}>
          {enviando ? "Salvando..." : "Salvar favorito"}
        </Button>
      </Stack>
    </Box>
  );
}

export default FavoritoForm;
