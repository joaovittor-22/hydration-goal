// src/screens/PersonHistoryScreen.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const PersonHistoryScreen = () => {
  const [searchParams] = useSearchParams();
  const pessoaId = parseInt(searchParams.get('pessoaId'), 10) || 1;
  const [history, setHistory] = useState([]);
  const [personName, setPersonName] = useState('Carregando...');
  const [metaDia, setMetaDia] = useState(2000);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const pessoaRes = await axios.get(`http://localhost:8000/pessoas/${pessoaId}`);
      const pessoa = pessoaRes.data;
      setPersonName(pessoa.nome);
      setMetaDia(pessoa.meta_dia || 2000);

      const consumoRes = await axios.get(`http://localhost:8000/consumos/`);
      const pessoaConsumos = consumoRes.data.filter(c => c.pessoa_id === pessoaId);

      // Group by date
      const grouped = pessoaConsumos.reduce((acc, c) => {
        const dateKey = new Date(c.data).toLocaleDateString('pt-BR');
        acc[dateKey] = acc[dateKey] || { date: dateKey, consumed: 0 };
        acc[dateKey].consumed += c.quantidade;
        return acc;
      }, {});

      const result = Object.values(grouped)
        .map(day => ({
          ...day,
          goal: metaDia,
          reached: day.consumed >= metaDia,
        }))
        .sort((a, b) => new Date(b.date.split('/').reverse().join('/')) - new Date(a.date.split('/').reverse().join('/'))); // latest first

      setHistory(result);
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '40px',
        backgroundColor: '#f9f9f9',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: '0px' }}>Histórico da pessoa</h1>
      <h3 style={{ color: '#888', marginTop: '4px', marginBottom: '30px' }}>
        {personName}
      </h3>

      <div style={{ width: '90%', maxWidth: '600px' }}>
        {history.length === 0 ? (
          <p style={{ color: '#777' }}>Nenhum consumo registrado ainda.</p>
        ) : (
          history.map((entry, index) => (
            <div key={index}>
              <div
                style={{
                  backgroundColor: '#fff',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '16px',
                  marginBottom: '10px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <p><strong>Data:</strong> {entry.date}</p>
                <p><strong>Meta:</strong> {entry.goal} ml</p>
                <p><strong>Consumido:</strong> {entry.consumed} ml</p>
                <p><strong>Chegou na meta?</strong> {entry.reached ? 'Sim' : 'Não'}</p>
              </div>
              {index < history.length - 1 && <hr />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PersonHistoryScreen;
