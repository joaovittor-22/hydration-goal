import PersonList from '@/components/ListPersons'; // Adjust the path if needed
import axios from 'axios';
import React, { useState } from 'react';
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
require('dotenv').config();

const PersonRegisterScreen = () => {
  const [nome, setNome] = useState('');
  const [peso, setPeso] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const ip = process.env.BACK_IP

  const registerUser = async () => {
    const pessoaData = {
      nome,
      peso: parseFloat(peso),
      meta_dia: 2000.0,
    };

    try {[]
      const response = await axios.post(`http://${ip}:8000/pessoas/`, pessoaData);
      Alert.alert('Sucesso', 'Pessoa registrada com sucesso!');
      setNome('');
      setPeso('');
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      if (error.response) {
        Alert.alert(
          'Erro',
          `Código: ${error.response.status}\n${JSON.stringify(error.response.data)}`
        );
      } else {
        Alert.alert('Erro de conexão', error.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Nome da Pessoa</Text>
      <TextInput
        style={styles.input}
        value={nome}
        onChangeText={setNome}
        placeholder="Digite o nome"
      />

      <Text style={styles.label}>Peso em kg</Text>
      <TextInput
        style={styles.input}
        value={peso}
        onChangeText={setPeso}
        placeholder="Digite o peso"
        keyboardType="numeric"
      />

      <Button title="Registrar Pessoa" onPress={registerUser} />

      <View style={styles.divider} />

      <PersonList refreshTrigger={refreshKey} />
    </ScrollView>
  );
};

export default PersonRegisterScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 6,
    padding: 10,
    fontSize: 16,
  },
  divider: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
