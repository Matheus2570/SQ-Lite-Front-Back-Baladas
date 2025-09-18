// Este é o componente principal da sua aplicação React Native.
// Ele gerencia a interface do usuário, a lógica e a comunicação com a API de baladas.

// Importa os componentes e hooks necessários do React e React Native.
import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList, // Componente otimizado para renderizar listas grandes.
  TextInput,
  ScrollView,
  RefreshControl, // Componente para adicionar a funcionalidade de "pull-to-refresh".
  KeyboardAvoidingView, // Ajuda a evitar que o teclado cubra os inputs.
  Keyboard,
  Platform,
  TouchableWithoutFeedback, // Componente que detecta toques sem feedback visual.
  TouchableOpacity, // Componente que detecta toques com opacidade.
} from "react-native";

// URL da API (seu backend Express rodando no PC ou servidor)
// Altere o IP para o endereço da sua máquina, se necessário.
const API_URL = "http:// 10.136.35.15:3000/baladas"; // Valentina

export default function App() {
  /* ---------------- ESTADOS ---------------- */
  // `useState` é um hook que permite adicionar estado a componentes de função.

  // Estado para armazenar a lista de baladas.
  const [baladas, setBaladas] = useState([]);
  // Estados para os inputs de busca.
  const [idBusca, setIdBusca] = useState("");
  const [nomeBusca, setNomeBusca] = useState("");
  const [cidadeBusca, setCidadeBusca] = useState("");
  const [tipoBusca, setTipoBusca] = useState("");
  const [dataBusca, setDataBusca] = useState("");

  // Estados para os inputs do formulário de criação/edição.
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [tipo, setTipo] = useState("");
  const [data, setData] = useState("");
  // Estado para armazenar o ID da balada que está sendo editada. `null` significa que está em modo de criação.
  const [idEditar, setIdEditar] = useState(null);
  // Estado para controlar o indicador de "pull-to-refresh".
  const [refreshing, setRefreshing] = useState(false);

  /* ---------------- FUNÇÕES DE API ---------------- */
  // Funções assíncronas para interagir com o backend.

  // Busca todas as baladas.
  const fetchBaladas = async () => {
    try {
      // Faz uma requisição GET para a API.
      const res = await fetch(API_URL);
      // Converte a resposta para JSON.
      const data = await res.json();
      // Atualiza o estado `baladas` com os dados recebidos.
      setBaladas(data);
    } catch {
      console.log("Erro ao carregar baladas");
    }
  };

  // Busca uma balada por ID.
  const fetchBaladaById = async () => {
    // Se o campo de busca estiver vazio, a função não faz nada.
    if (!idBusca) return;
    try {
      const res = await fetch(`${API_URL}/${idBusca}`);
      // Se a resposta for 404 (Não Encontrada), exibe uma mensagem.
      if (res.status === 404) {
        setBaladas([{ id: 0, nome: "Nenhuma balada encontrada" }]);
        return;
      }
      const data = await res.json();
      // Coloca a balada encontrada em um array para que a FlatList possa renderizá-la.
      setBaladas([data]);
    } catch {
      setBaladas([{ id: 0, nome: "Erro na busca" }]);
    }
  };

  // Demais funções de busca, seguem a mesma lógica, alterando apenas a URL da API.
  const fetchBaladasByNome = async () => {
    if (!nomeBusca) return;
    try {
      const res = await fetch(`${API_URL}/nome/${nomeBusca}`);
      const data = await res.json();
      setBaladas(data.length ? data : [{ id: 0, nome: "Nenhum resultado encontrado" }]);
    } catch {
      setBaladas([{ id: 0, nome: "Erro na busca" }]);
    }
  };

  const fetchBaladasByCidade = async () => {
    if (!cidadeBusca) return;
    try {
      const res = await fetch(`${API_URL}/cidade/${cidadeBusca}`);
      const data = await res.json();
      setBaladas(data);
    } catch {
      console.log("Erro cidade");
    }
  };

  const fetchBaladasByTipo = async () => {
    if (!tipoBusca) return;
    try {
      const res = await fetch(`${API_URL}/tipo/${tipoBusca}`);
      const data = await res.json();
      setBaladas(data);
    } catch {
      console.log("Erro tipo");
    }
  };

  const fetchBaladasByData = async () => {
    if (!dataBusca) return;
    try {
      const res = await fetch(`${API_URL}/data/${dataBusca}`);
      const data = await res.json();
      setBaladas(data);
    } catch {
      console.log("Erro data");
    }
  };

  // Adiciona uma nova balada.
  const addBalada = async () => {
    // Verifica se os campos obrigatórios estão preenchidos.
    if (!nome || !cidade || !data) return;
    try {
      // Faz uma requisição POST com o método, headers e corpo da requisição.
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cidade, endereco, tipo, data }),
      });
      // Limpa os campos do formulário.
      setNome("");
      setCidade("");
      setEndereco("");
      setTipo("");
      setData("");
      // Recarrega a lista para mostrar a nova balada.
      fetchBaladas();
    } catch {
      console.log("Erro ao adicionar balada");
    }
  };

  // Atualiza uma balada.
  const updateBalada = async () => {
    // Verifica se há uma balada para editar e se os campos obrigatórios estão preenchidos.
    if (!idEditar || !nome || !cidade || !data) return;
    try {
      // Faz uma requisição PUT para atualizar.
      await fetch(`${API_URL}/${idEditar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cidade, endereco, tipo, data }),
      });
      // Limpa os campos e o estado de edição.
      setIdEditar(null);
      setNome("");
      setCidade("");
      setEndereco("");
      setTipo("");
      setData("");
      // Recarrega a lista.
      fetchBaladas();
    } catch {
      console.log("Erro ao atualizar balada");
    }
  };

  // Deleta uma balada.
  const deleteBalada = async (id) => {
    try {
      // Faz uma requisição DELETE.
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      // Recarrega a lista.
      fetchBaladas();
    } catch {
      console.log("Erro ao deletar balada");
    }
  };

  // Função para "pull-to-refresh".
  const onRefresh = () => {
    setRefreshing(true);
    // Chama a função de busca e, quando ela termina, desativa o indicador de refresh.
    fetchBaladas().finally(() => setRefreshing(false));
  };

  // `useEffect` é um hook que executa efeitos colaterais em componentes de função.
  // O array vazio `[]` como segundo argumento faz com que o efeito seja executado apenas uma vez,
  // quando o componente é montado.
  useEffect(() => {
    fetchBaladas();
  }, []);

  /* ---------------- RENDERIZAÇÃO ---------------- */
  // Retorna a estrutura da interface do usuário.

  return (
    // `KeyboardAvoidingView` ajusta o layout para que os inputs fiquem visíveis quando o teclado aparece.
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* `TouchableWithoutFeedback` fecha o teclado quando o usuário toca em qualquer lugar fora dos inputs. */}
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          // Permite que o teclado permaneça aberto quando um toque acontece dentro da área do ScrollView.
          keyboardShouldPersistTaps="handled"
          // Adiciona o controle de refresh.
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.titulo}>🎉 Lista de Baladas</Text>

          {/* Lista de baladas */}
          <FlatList
            data={baladas}
            // `keyExtractor` informa à lista como encontrar uma chave única para cada item.
            keyExtractor={(item) => item.id.toString()}
            // `renderItem` renderiza cada item da lista.
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={{ fontWeight: "bold" }}>{item.nome}</Text>
                <Text>
                  {item.cidade} | {item.tipo} | {item.data}
                </Text>
                <Text>{item.endereco}</Text>

                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  {/* Botão para editar */}
                  <TouchableOpacity
                    style={styles.buttonRoxo}
                    onPress={() => {
                      // Preenche os campos do formulário com os dados do item clicado.
                      setIdEditar(item.id);
                      setNome(item.nome);
                      setCidade(item.cidade);
                      setEndereco(item.endereco);
                      setTipo(item.tipo);
                      setData(item.data);
                    }}
                  >
                    <Text style={styles.buttonText}>Editar</Text>
                  </TouchableOpacity>

                  <View style={{ width: 10 }} />

                  {/* Botão para excluir */}
                  <TouchableOpacity
                    style={styles.buttonVermelho}
                    onPress={() => deleteBalada(item.id)}
                  >
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          {/* Seção de buscas */}
          <Text style={styles.subtitulo}>🔍 Buscar</Text>

          {/* Inputs e botões de busca */}
          <TextInput placeholder="ID" value={idBusca} onChangeText={setIdBusca} style={styles.input} />
          <TouchableOpacity style={styles.buttonRoxo} onPress={fetchBaladaById}>
            <Text style={styles.buttonText}>Buscar por ID</Text>
          </TouchableOpacity>
          {/* Repete a mesma estrutura para as outras buscas */}
          <TextInput placeholder="Nome" value={nomeBusca} onChangeText={setNomeBusca} style={styles.input} />
          <TouchableOpacity style={styles.buttonRoxo} onPress={fetchBaladasByNome}>
            <Text style={styles.buttonText}>Buscar por Nome</Text>
          </TouchableOpacity>
          <TextInput placeholder="Cidade" value={cidadeBusca} onChangeText={setCidadeBusca} style={styles.input} />
          <TouchableOpacity style={styles.buttonRoxo} onPress={fetchBaladasByCidade}>
            <Text style={styles.buttonText}>Buscar por Cidade</Text>
          </TouchableOpacity>
          <TextInput placeholder="Tipo" value={tipoBusca} onChangeText={setTipoBusca} style={styles.input} />
          <TouchableOpacity style={styles.buttonRoxo} onPress={fetchBaladasByTipo}>
            <Text style={styles.buttonText}>Buscar por Tipo</Text>
          </TouchableOpacity>
          <TextInput placeholder="Data (YYYY-MM-DD)" value={dataBusca} onChangeText={setDataBusca} style={styles.input} />
          <TouchableOpacity style={styles.buttonRoxo} onPress={fetchBaladasByData}>
            <Text style={styles.buttonText}>Buscar por Data</Text>
          </TouchableOpacity>

          {/* Formulário de adição/edição */}
          <Text style={styles.subtitulo}>
            {/* Muda o título com base no estado `idEditar` */}
            {idEditar ? "✏️ Editar Balada" : "➕ Adicionar Balada"}
          </Text>

          {/* Inputs do formulário */}
          <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
          <TextInput placeholder="Cidade" value={cidade} onChangeText={setCidade} style={styles.input} />
          <TextInput placeholder="Endereço" value={endereco} onChangeText={setEndereco} style={styles.input} />
          <TextInput placeholder="Tipo" value={tipo} onChangeText={setTipo} style={styles.input} />
          <TextInput placeholder="Data (YYYY-MM-DD)" value={data} onChangeText={setData} style={styles.input} />

          {/* Botão para enviar o formulário */}
          <TouchableOpacity
            style={styles.buttonRoxoGrande}
            // Chama a função de atualização se `idEditar` tiver um valor, senão chama a de adição.
            onPress={idEditar ? updateBalada : addBalada}
          >
            <Text style={styles.buttonText}>
              {/* Muda o texto do botão com base no modo (editar ou adicionar) */}
              {idEditar ? "Atualizar Balada" : "Adicionar Balada"}
            </Text>
          </TouchableOpacity>

          <View style={{ height: 20 }} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

/* ---------------- ESTILOS ---------------- */
// Objeto de estilos para os componentes, semelhante a CSS.
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40, backgroundColor: "#f2f2f2" },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#6a1b9a", // Roxo escuro
  },
  subtitulo: { fontSize: 20, fontWeight: "bold", marginTop: 20, color: "#8e24aa" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  card: {
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonRoxo: {
    flex: 1,
    backgroundColor: "#8e24aa",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonRoxoGrande: {
    backgroundColor: "#6a1b9a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonVermelho: {
    flex: 1,
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
