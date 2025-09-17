import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Button,
  Alert,
  ScrollView,
} from "react-native";

const API_URL = "http://192.168.107.92:3000/baladas"; // sua API

export default function App() {
  const [baladas, setBaladas] = useState([]);
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

  // GET all
  const fetchBaladas = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setBaladas(data);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar baladas");
    }
  };

  // GET by ID
  const fetchBaladaById = async () => {
    if (!idBusca) return;
    try {
      const res = await fetch(`${API_URL}/${idBusca}`);
      const data = await res.json();
      Alert.alert("Balada encontrada", JSON.stringify(data));
    } catch {
      Alert.alert("Erro", "Balada não encontrada");
    }
  };

  // GET by Nome
  const fetchBaladasByNome = async () => {
    if (!nomeBusca) return;
    try {
      const res = await fetch(`${API_URL}/nome/${nomeBusca}`);
      const data = await res.json();
      setBaladas(data);
    } catch {
      Alert.alert("Erro", "Nenhuma balada encontrada com esse nome");
    }
  };

  // GET by Cidade
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

  // GET by Tipo
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

  // GET by Data
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

  // ADD balada
  const addBalada = async () => {
    if (!nome || !cidade || !data) {
      Alert.alert("Erro", "Preencha nome, cidade e data");
      return;
    }
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
      Alert.alert("Erro", "Não foi possível adicionar balada");
    }
  };

  // UPDATE balada
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
      Alert.alert("Erro", "Não foi possível atualizar balada");
    }
  };

  // DELETE balada
  const deleteBalada = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      fetchBaladas();
    } catch {
      Alert.alert("Erro", "Não foi possível deletar balada");
    }
  };

  useEffect(() => {
    fetchBaladas();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titulo}>🎉 Lista de Baladas</Text>

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

      <Text style={styles.subtitulo}>🔍 Buscar</Text>
      <TextInput
        placeholder="ID"
        value={idBusca}
        onChangeText={setIdBusca}
        style={styles.input}
      />
      <Button title="Buscar por ID" onPress={fetchBaladaById} />

      <TextInput
        placeholder="Nome"
        value={nomeBusca}
        onChangeText={setNomeBusca}
        style={styles.input}
      />
      <Button title="Buscar por Nome" onPress={fetchBaladasByNome} />

      <TextInput
        placeholder="Cidade"
        value={cidadeBusca}
        onChangeText={setCidadeBusca}
        style={styles.input}
      />
      <Button title="Buscar por Cidade" onPress={fetchBaladasByCidade} />

      <TextInput
        placeholder="Tipo"
        value={tipoBusca}
        onChangeText={setTipoBusca}
        style={styles.input}
      />
      <Button title="Buscar por Tipo" onPress={fetchBaladasByTipo} />

      <TextInput
        placeholder="Data (YYYY-MM-DD)"
        value={dataBusca}
        onChangeText={setDataBusca}
        style={styles.input}
      />
      <Button title="Buscar por Data" onPress={fetchBaladasByData} />

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

      <Button
        title={idEditar ? "Atualizar Balada" : "Adicionar Balada"}
        onPress={idEditar ? updateBalada : addBalada}
      />
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitulo: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
  },
  card: { padding: 10, marginVertical: 5, borderWidth: 1, borderRadius: 5 },
});
