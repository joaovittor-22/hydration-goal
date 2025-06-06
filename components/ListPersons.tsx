import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View, Alert } from 'react-native';
import axios from 'axios';

type Person = {
  id: number;
  nome: string;
  peso: number;
};

type Props = {
  refreshTrigger: number;
};

const ListPersons: React.FC<Props> = ({ refreshTrigger }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPeople();
  }, [refreshTrigger]);

  const fetchPeople = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://192.168.1.16:8000/pessoas/');
      setPeople(response.data);
    } catch (error) {
      console.error('Erro ao buscar pessoas:', error);
      Alert.alert('Erro', 'Falha ao buscar pessoas. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  };

  const goTo = (route: string, pessoaId: number) => {
    Alert.alert(`Navegar para ${route}`, `pessoaId: ${pessoaId}`);
    // Replace Alert with navigation logic when using react-navigation
    // Example:
    // navigation.navigate(route, { pessoaId });
  };

  const renderItem = ({ item }: { item: Person }) => (
    <View style={styles.personRow}>
      <Text style={styles.personName}>{item.nome} - {item.peso} kg</Text>
      <View style={styles.actions}>
        <Pressable onPress={() => goTo('Goal', item.id)}>
          <Text style={styles.link}>Meta</Text>
        </Pressable>
        <Pressable onPress={() => goTo('History', item.id)}>
          <Text style={styles.link}>Histórico</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pessoas cadastradas</Text>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : people.length === 0 ? (
        <Text style={styles.noPeople}>Nenhuma pessoa cadastrada.</Text>
      ) : (
        <FlatList
          data={people}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
};

export default ListPersons;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  personName: {
    fontSize: 16,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  link: {
    color: 'slateblue',
    fontWeight: '600',
  },
  noPeople: {
    fontStyle: 'italic',
    color: '#666',
  },
});
