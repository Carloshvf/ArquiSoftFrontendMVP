const API_BASE_URL = "http://localhost:5000/api";

async function tratarResposta(response) {
  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.erro || `Erro na requisição: ${response.status}`);
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

export async function listarFavoritos() {
  const response = await fetch(`${API_BASE_URL}/favoritos`);
  return tratarResposta(response);
}

export async function obterFavorito(id) {
  const response = await fetch(`${API_BASE_URL}/favoritos/${id}`);
  return tratarResposta(response);
}

export async function criarFavorito(dados) {
  const response = await fetch(`${API_BASE_URL}/favoritos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return tratarResposta(response);
}

export async function atualizarFavorito(id, dados) {
  const response = await fetch(`${API_BASE_URL}/favoritos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  return tratarResposta(response);
}

export async function removerFavorito(id) {
  const response = await fetch(`${API_BASE_URL}/favoritos/${id}`, {
    method: "DELETE",
  });
  return tratarResposta(response);
}

export async function descobrirRestaurantes(lat, lng, raio = 1000) {
  const params = new URLSearchParams({ lat, lng, raio });
  const response = await fetch(`${API_BASE_URL}/descobrir?${params}`);
  return tratarResposta(response);
}
