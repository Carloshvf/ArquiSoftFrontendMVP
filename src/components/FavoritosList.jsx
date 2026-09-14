import { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Rating,
  TextField,
  Stack,
  Button,
  Alert,
  CircularProgress,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  listarFavoritos,
  atualizarFavorito,
  removerFavorito,
} from "../api/favoritosService";

function FavoritosList() {
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [editandoId, setEditandoId] = useState(null);
  const [formEdicao, setFormEdicao] = useState({
    nota_pessoal: null,
    comentario: "",
  });

  useEffect(() => {
    async function carregarFavoritos() {
      try {
        setCarregando(true);
        const dados = await listarFavoritos();
        setFavoritos(dados.resultados);
      } catch (e) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    }

    carregarFavoritos();
  }, []);

  function iniciarEdicao(favorito) {
    setEditandoId(favorito.id);
    setFormEdicao({
      nota_pessoal: favorito.nota_pessoal || null,
      comentario: favorito.comentario || "",
    });
  }

  function cancelarEdicao() {
    setEditandoId(null);
  }

  async function salvarEdicao(id) {
    try {
      const dados = {
        nota_pessoal: formEdicao.nota_pessoal,
        comentario: formEdicao.comentario || null,
      };
      const favoritoAtualizado = await atualizarFavorito(id, dados);
      setFavoritos((atual) =>
        atual.map((f) => (f.id === id ? favoritoAtualizado : f)),
      );
      setEditandoId(null);
    } catch (e) {
      setErro(e.message);
    }
  }

  async function excluir(id) {
    try {
      await removerFavorito(id);
      setFavoritos((atual) => atual.filter((f) => f.id !== id));
    } catch (e) {
      setErro(e.message);
    }
  }

  if (carregando) return <CircularProgress />;
  if (erro) return <Alert severity="error">{erro}</Alert>;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Meus favoritos
      </Typography>

      {favoritos.length === 0 ? (
        <Typography color="text.secondary">Nenhum favorito ainda.</Typography>
      ) : (
        <List>
          {favoritos.map((favorito, index) => (
            <div key={favorito.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  editandoId !== favorito.id && (
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        edge="end"
                        onClick={() => iniciarEdicao(favorito)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        onClick={() => excluir(favorito.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  )
                }
              >
                {editandoId === favorito.id ? (
                  <Stack spacing={1} sx={{ width: "100%", pr: 10 }}>
                    <Typography fontWeight="bold">{favorito.nome}</Typography>
                    <Rating
                      value={formEdicao.nota_pessoal}
                      onChange={(_, novoValor) =>
                        setFormEdicao((f) => ({
                          ...f,
                          nota_pessoal: novoValor,
                        }))
                      }
                    />
                    <TextField
                      label="Comentário"
                      value={formEdicao.comentario}
                      onChange={(e) =>
                        setFormEdicao((f) => ({
                          ...f,
                          comentario: e.target.value,
                        }))
                      }
                      multiline
                      rows={2}
                      fullWidth
                    />
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => salvarEdicao(favorito.id)}
                      >
                        Salvar
                      </Button>
                      <Button size="small" onClick={cancelarEdicao}>
                        Cancelar
                      </Button>
                    </Stack>
                  </Stack>
                ) : (
                  <ListItemText
                    primary={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography fontWeight="bold">
                          {favorito.nome}
                        </Typography>
                        {favorito.categoria && (
                          <Typography variant="body2" color="text.secondary">
                            — {favorito.categoria}
                          </Typography>
                        )}
                      </Stack>
                    }
                    secondary={
                      <>
                        {favorito.endereco && (
                          <Typography variant="body2" color="text.secondary">
                            {favorito.endereco}
                          </Typography>
                        )}
                        {favorito.nota_pessoal && (
                          <Rating
                            value={favorito.nota_pessoal}
                            readOnly
                            size="small"
                          />
                        )}
                        {favorito.comentario && (
                          <Typography variant="body2">
                            {favorito.comentario}
                          </Typography>
                        )}
                      </>
                    }
                  />
                )}
              </ListItem>
              {index < favoritos.length - 1 && <Divider component="li" />}
            </div>
          ))}
        </List>
      )}
    </>
  );
}

export default FavoritosList;
