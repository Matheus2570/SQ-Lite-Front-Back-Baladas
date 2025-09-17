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
} from "react-native";

const API_URL = "http://(Coloque Seu IP Aqui):3000/baladas";

export default function App() {
  const [baladas, setBaladas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const [idBusca, setIdBusca] = useState("");
  const [nomeBusca, setNomeBusca] = useState("");
  const [cidadeBusca, setCidadeBusca] = useState("");
  const [tipoBusca, setTipoBusca] = useState("");
  const [dataBusca, setDataBusca] = useState("");

  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [tipo, setTipo] = useState("");
  const [data, setData] = useState("");
  const [idEditar, setIdEditar] = useState(null);

  const [resultados, setResultados] = useState([]); // resultados das buscas

  // GET all
  const fetchBaladas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBaladas(data);
      setResultados([]);
    } catch {
      console.log("Erro ao carregar baladas");
    }
  };

  useEffect(() => {
    fetchBaladas();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBaladas();
    setRefreshing(false);
  };

  // Buscar por ID corretamente
 const fetchBaladaPorId = async () => {
    if (!idBusca) return;
    try {
      const res = await fetch(`${API_URL}/${idBusca}`);
      if (res.status === 404) {
        setResultados([{ id: 0, nome: "Nenhuma balada encontrada" }]);
        return;
      }
      const data = await res.json();
      setResultados([data]);
    } catch {
      setResultados([{ id: 0, nome: "Erro na busca" }]);
    }
  };

  // Função genérica para outros campos
  const fetchBaladasPorCampo = async (campo, valor) => {
    if (!valor) return;
    try {
      const res = await fetch(`${API_URL}/${campo}/${valor}`);
      const data = await res.json();
      setResultados(data.length ? data : [{ id: 0, nome: "Nenhum resultado encontrado" }]);
    } catch {
      setResultados([{ id: 0, nome: "Erro na busca" }]);
    }
  };

  const addBalada = async () => {
    if (!nome || !cidade || !data) return;
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cidade, endereco, tipo, data }),
      });
      setNome("");
      setCidade("");
      setEndereco("");
      setTipo("");
      setData("");
      fetchBaladas();
    } catch {
      console.log("Erro ao adicionar balada");
    }
  };

  const updateBalada = async () => {
    if (!idEditar || !nome || !cidade || !data) return;
    try {
      await fetch(`${API_URL}/${idEditar}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, cidade, endereco, tipo, data }),
      });
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

  const deleteBalada = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchBaladas();
    } catch {
      console.log("Erro ao deletar balada");
    }
  };

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

          <FlatList
            data={baladas}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  ID: {item.id} | Nome: {item.nome}
                </Text>
                <Text style={styles.cardText}>
                  {item.cidade} | {item.tipo} | {item.data}
                </Text>
                <Text style={styles.cardText}>{item.endereco}</Text>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <TouchableOpacity
                    style={styles.buttonEdit}
                    onPress={() => {
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
                  <TouchableOpacity
                    style={styles.buttonDelete}
                    onPress={() => deleteBalada(item.id)}
                  >
                    <Text style={styles.buttonText}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            scrollEnabled={false}
          />

          {resultados.length > 0 && (
            <>
              <Text style={styles.subtitulo}>🔍 Resultados da Busca</Text>
              {resultados.map(item => (
                <View
                  key={item.id}
                  style={[styles.card, { backgroundColor: "#e0f7fa" }]}
                >
                  <Text style={styles.cardTitle}>
                    {item.id !== 0
                      ? `ID: ${item.id} | Nome: ${item.nome}`
                      : item.nome}
                  </Text>
                  {item.id !== 0 && (
                    <>
                      <Text style={styles.cardText}>
                        {item.cidade} | {item.tipo} | {item.data}
                      </Text>
                      <Text style={styles.cardText}>{item.endereco}</Text>
                    </>
                  )}
                </View>
              ))}
            </>
          )}

          <Text style={styles.subtitulo}>🔍 Buscar</Text>
          <TextInput
            placeholder="ID"
            value={idBusca}
            onChangeText={setIdBusca}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.buttonSearch}
            onPress={fetchBaladaPorId}
          >
            <Text style={styles.buttonText}>Buscar por ID</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Nome"
            value={nomeBusca}
            onChangeText={setNomeBusca}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.buttonSearch}
            onPress={() => fetchBaladasPorCampo("nome", nomeBusca)}
          >
            <Text style={styles.buttonText}>Buscar por Nome</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Cidade"
            value={cidadeBusca}
            onChangeText={setCidadeBusca}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.buttonSearch}
            onPress={() => fetchBaladasPorCampo("cidade", cidadeBusca)}
          >
            <Text style={styles.buttonText}>Buscar por Cidade</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Tipo"
            value={tipoBusca}
            onChangeText={setTipoBusca}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.buttonSearch}
            onPress={() => fetchBaladasPorCampo("tipo", tipoBusca)}
          >
            <Text style={styles.buttonText}>Buscar por Tipo</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Data (YYYY-MM-DD)"
            value={dataBusca}
            onChangeText={setDataBusca}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.buttonSearch}
            onPress={() => fetchBaladasPorCampo("data", dataBusca)}
          >
            <Text style={styles.buttonText}>Buscar por Data</Text>
          </TouchableOpacity>

          <Text style={styles.subtitulo}>
            {idEditar ? "✏️ Editar Balada" : "➕ Adicionar Balada"}
          </Text>
          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
          <TextInput
            placeholder="Cidade"
            value={cidade}
            onChangeText={setCidade}
            style={styles.input}
          />
          <TextInput
            placeholder="Endereço"
            value={endereco}
            onChangeText={setEndereco}
            style={styles.input}
          />
          <TextInput
            placeholder="Tipo"
            value={tipo}
            onChangeText={setTipo}
            style={styles.input}
          />
          <TextInput
            placeholder="Data (YYYY-MM-DD)"
            value={data}
            onChangeText={setData}
            style={styles.input}
          />
          <TouchableOpacity
            style={styles.buttonAdd}
            onPress={idEditar ? updateBalada : addBalada}
          >
            <Text style={styles.buttonText}>
              {idEditar ? "Atualizar Balada" : "Adicionar Balada"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

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
