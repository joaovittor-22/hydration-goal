import React, { useState } from 'react';
import axios from 'axios';
import PersonList from '../components/ListPersons';


const PersonRegisterScreen = () => {
  const [nome, setNome] = useState('');
  const [peso, setPeso] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  const registerUser = async (e) => {
    e.preventDefault();

    const pessoaData = {
      nome,
      peso: parseFloat(peso),
      meta_dia: 2000.0 // Default or let backend handle it if optional
    };

    try {
      const response = await axios.post('http://localhost:8000/pessoas/', pessoaData);
      alert('Pessoa registrada com sucesso!');
      setNome('');
      setPeso('');
      setRefreshKey(prev => prev + 1);  // 💥 Trigger refresh
    } catch (error) {
      if (error.response) {
        alert(`Erro: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Erro de conexão: ' + error.message);
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={registerUser}>
        <label htmlFor="nome">Nome da Pessoa</label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Digite o nome"
          required
        />

        <label htmlFor="peso">Peso em kg</label>
        <input
          type="number"
          id="peso"
          name="peso"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          placeholder="Digite o peso"
          min="0"
          step="0.1"
          required
        />

        <button type="submit">Registrar Pessoa</button>
      </form>

      <hr />

      <PersonList refreshTrigger={refreshKey} />
    </div>
  );
};

export default PersonRegisterScreen;
