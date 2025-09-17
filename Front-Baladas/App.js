import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  ScrollView,
  RefreshControl,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Button,
  Alert,
} from "react-native";

// URL da API (seu backend Express rodando no PC ou servidor)
const API_URL = "http://(Coloque seu IP Aqui):3000/baladas";

export default function App() {
  /* ---------------- ESTADOS ---------------- */
  // Lista de baladas carregadas do backend
  const [baladas, setBaladas] = useState([]);

  // Campos de busca
  const [idBusca, setIdBusca] = useState("");
  const [nomeBusca, setNomeBusca] = useState("");
  const [cidadeBusca, setCidadeBusca] = useState("");
  const [tipoBusca, setTipoBusca] = useState("");
  const [dataBusca, setDataBusca] = useState("");

  // Campos do formulário de cadastro/edição
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [tipo, setTipo] = useState("");
  const [data, setData] = useState("");

  // ID da balada que está sendo editada
  const [idEditar, setIdEditar] = useState(null);

  // Estado para refresh
  const [refreshing, setRefreshing] = useState(false);

  /* ---------------- FUNÇÕES DE API ---------------- */
  // GET todas as baladas
  const fetchBaladas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBaladas(data); // Atualiza lista
    } catch {
      console.log("Erro ao carregar baladas");
    }
  };

  // GET por ID
  const fetchBaladaById = async () => {
    if (!idBusca) return;
    try {
      const res = await fetch(`${API_URL}/${idBusca}`);
      if (res.status === 404) {
        setBaladas([{ id: 0, nome: "Nenhuma balada encontrada" }]);
        return;
      }
      const data = await res.json();
      setBaladas([data]);
    } catch {
      setBaladas([{ id: 0, nome: "Erro na busca" }]);
    }
  };

  // GET por Nome
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

  // GET por Cidade
  const fetchBaladasByCidade = async () => {
    if (!cidadeBusca) return;
    try {
      const res = await fetch(`${API_URL}/cidade/${cidadeBusca}`);
      const data = await res.json();
      setBaladas(data);
    } catch {
      Alert.alert("Erro", "Nenhuma balada encontrada nessa cidade");
    }
  };

  // GET por Tipo
  const fetchBaladasByTipo = async () => {
    if (!tipoBusca) return;
    try {
      const res = await fetch(`${API_URL}/tipo/${tipoBusca}`);
      const data = await res.json();
      setBaladas(data);
    } catch {
      Alert.alert("Erro", "Nenhuma balada encontrada para esse tipo");
    }
  };

  // GET por Data
  const fetchBaladasByData = async () => {
    if (!dataBusca) return;
    try {
      const res = await fetch(`${API_URL}/data/${dataBusca}`);
      const data = await res.json();
      setBaladas(data);
    } catch {
      Alert.alert("Erro", "Nenhuma balada encontrada para essa data");
    }
  };

  // POST - Adicionar balada
  const addBalada = async () => {
    if (!nome || !cidade || !data) return;
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cidade, endereco, tipo, data }),
      });
      // Limpa os campos
      setNome("");
      setCidade("");
      setEndereco("");
      setTipo("");
      setData("");
      fetchBaladas(); // Atualiza lista
    } catch {
      console.log("Erro ao adicionar balada");
    }
  };

  // PUT - Atualizar balada
  const updateBalada = async () => {
    if (!idEditar || !nome || !cidade || !data) return;
    try {
      await fetch(`${API_URL}/${idEditar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cidade, endereco, tipo, data }),
      });
      // Reseta estado
      setIdEditar(null);
      setNome("");
      setCidade("");
      setEndereco("");
      setTipo("");
      setData("");
      fetchBaladas();
    } catch {
      console.log("Erro ao atualizar balada");
    }
  };

  // DELETE - Excluir balada
  const deleteBalada = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchBaladas();
    } catch {
      console.log("Erro ao deletar balada");
    }
  };

  // Função para refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchBaladas().finally(() => setRefreshing(false));
  };

  // Carregar todas as baladas assim que o app abrir
  useEffect(() => {
    fetchBaladas();
  }, []);

  /* ---------------- RENDERIZAÇÃO ---------------- */
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Text style={styles.titulo}>🎉 Lista de Baladas</Text>

          {/* Lista de baladas */}
          <FlatList
            data={baladas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={{ fontWeight: "bold" }}>{item.nome}</Text>
                <Text>
                  {item.cidade} | {item.tipo} | {item.data}
                </Text>
                <Text>{item.endereco}</Text>

                {/* Botões Editar/Excluir */}
                <View style={{ flexDirection: "row", marginTop: 5 }}>
                  <Button
                    title="Editar"
                    onPress={() => {
                      setIdEditar(item.id);
                      setNome(item.nome);
                      setCidade(item.cidade);
                      setEndereco(item.endereco);
                      setTipo(item.tipo);
                      setData(item.data);
                    }}
                  />
                  <View style={{ width: 10 }} />
                  <Button
                    title="Excluir"
                    color="red"
                    onPress={() => deleteBalada(item.id)}
                  />
                </View>
              </View>
            )}
          />

          {/* BUSCAS */}
          <Text style={styles.subtitulo}>🔍 Buscar</Text>
          <TextInput placeholder="ID" value={idBusca} onChangeText={setIdBusca} style={styles.input} />
          <Button title="Buscar por ID" onPress={fetchBaladaById} />

          <TextInput placeholder="Nome" value={nomeBusca} onChangeText={setNomeBusca} style={styles.input} />
          <Button title="Buscar por Nome" onPress={fetchBaladasByNome} />

          <TextInput placeholder="Cidade" value={cidadeBusca} onChangeText={setCidadeBusca} style={styles.input} />
          <Button title="Buscar por Cidade" onPress={fetchBaladasByCidade} />

          <TextInput placeholder="Tipo" value={tipoBusca} onChangeText={setTipoBusca} style={styles.input} />
          <Button title="Buscar por Tipo" onPress={fetchBaladasByTipo} />

          <TextInput placeholder="Data (YYYY-MM-DD)" value={dataBusca} onChangeText={setDataBusca} style={styles.input} />
          <Button title="Buscar por Data" onPress={fetchBaladasByData} />

          {/* FORMULÁRIO ADD/EDITAR */}
          <Text style={styles.subtitulo}>
            {idEditar ? "✏️ Editar Balada" : "➕ Adicionar Balada"}
          </Text>
          <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
          <TextInput placeholder="Cidade" value={cidade} onChangeText={setCidade} style={styles.input} />
          <TextInput placeholder="Endereço" value={endereco} onChangeText={setEndereco} style={styles.input} />
          <TextInput placeholder="Tipo" value={tipo} onChangeText={setTipo} style={styles.input} />
          <TextInput placeholder="Data (YYYY-MM-DD)" value={data} onChangeText={setData} style={styles.input} />

          {/* Botão final: adiciona ou edita */}
          <Button
            title={idEditar ? "Atualizar Balada" : "Adicionar Balada"}
            onPress={idEditar ? updateBalada : addBalada}
          />

          <View style={{ height: 20 }} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

/* ---------------- ESTILOS ---------------- */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40, backgroundColor: "#f2f2f2" },
  titulo: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#00796b",
  },
  subtitulo: { fontSize: 20, fontWeight: "bold", marginTop: 20, color: "#004d40" },
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
  cardTitle: { fontWeight: "bold", fontSize: 16, color: "#00796b" },
  cardText: { fontSize: 14, color: "#555", marginTop: 3 },
  buttonEdit: {
    flex: 1,
    backgroundColor: "#ffb300",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDelete: {
    flex: 1,
    backgroundColor: "#d32f2f",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonSearch: {
    backgroundColor: "#00796b",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonAdd: {
    backgroundColor: "#388e3c",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});