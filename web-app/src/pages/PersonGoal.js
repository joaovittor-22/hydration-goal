// src/screens/WaterTrackerScreen.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const WaterTrackerScreen = () => {
  const [searchParams] = useSearchParams();
  const pessoaId = parseInt(searchParams.get('pessoaId'), 10) || 1;
  const [selectedVolume, setSelectedVolume] = useState(0);
  const [consumed, setConsumed] = useState(0);
  const [goalReached, setGoalReached] = useState(false);
  const [consumos, setConsumos] = useState([]);
  const [dailyGoal, setDailyGoal] = useState(2000); // Default before loading

  const todayDateISO = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

  const fetchPessoa = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/pessoas/${pessoaId}`);
      setDailyGoal(response.data.meta_dia || 2000);
    } catch (error) {
      console.error("Erro ao buscar dados da pessoa:", error);
    }
  };

  const fetchDailyConsumos = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/consumos/`);
      const todayConsumos = response.data.filter(item =>
        item.pessoa_id === pessoaId &&
        item.data.startsWith(todayDateISO)
      );
      setConsumos(todayConsumos);

      const total = todayConsumos.reduce((sum, item) => sum + item.quantidade, 0);
      setConsumed(total);
      setGoalReached(total >= dailyGoal);
    } catch (error) {
      console.error("Erro ao buscar consumos:", error);
    }
  };

  const handleConsume = async () => {
    if (selectedVolume > 0) {
      const now = new Date().toISOString();
      try {
        await axios.post(`http://localhost:8000/consumos/`, {
          quantidade: selectedVolume,
          data: now,
          pessoa_id: pessoaId
        });
        fetchDailyConsumos(); // Refresh stats
      } catch (error) {
        console.error("Erro ao registrar consumo:", error);
      }
    }
  };

  useEffect(() => {
    fetchPessoa().then(fetchDailyConsumos);
  }, []);

  const remaining = Math.max(dailyGoal - consumed, 0);
  const percentage = Math.min((consumed / dailyGoal) * 100, 100).toFixed(1);
  const today = new Date().toLocaleDateString('pt-BR');

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Data de hoje: {today}</h1>

      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
        <label>
          <input type="radio" name="volume" value={200} onChange={() => setSelectedVolume(200)} />
          Copo pequeno - 200ml
        </label>
        <label>
          <input type="radio" name="volume" value={300} onChange={() => setSelectedVolume(300)} />
          Copo médio - 300ml
        </label>
        <label>
          <input type="radio" name="volume" value={500} onChange={() => setSelectedVolume(500)} />
          Garrafa média - 500ml
        </label>
      </div>

      <button
        onClick={handleConsume}
        style={{
          backgroundColor: '#001f3f',
          color: 'white',
          padding: '10px 20px',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        Consumir
      </button>

      <hr />

      <div
        style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '16px',
          marginBottom: '16px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <p><strong>Meta do dia:</strong> {dailyGoal} ml</p>
        <p><strong>Meta restante:</strong> {remaining} ml</p>
        <p><strong>Meta já consumida:</strong> {consumed} ml</p>
        <p><strong>Porcentagem consumida:</strong> {percentage}%</p>
      </div>

      <div style={{ display: "block" }}>
        <p style={{ fontSize: '40px', color: '#555' }}>Chegou na meta?</p>
        {goalReached
          ? <p style={{ fontSize: "30px", color: "green" }}>SIM!</p>
          : <p style={{ fontSize: "30px", color: "red" }}>NÃO</p>}
      </div>
    </div>
  );
};

export default WaterTrackerScreen;
