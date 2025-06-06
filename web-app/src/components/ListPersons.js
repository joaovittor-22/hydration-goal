import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./styles/ListPersons.css";

const ListPersons = ({ refreshTrigger }) => {
  const [people, setPeople] = useState([]);

  useEffect(() => {
    fetchPeople();
  }, [refreshTrigger]); // Refetch whenever the prop changes

  const fetchPeople = async () => {
    try {
      const response = await axios.get('http://localhost:8000/pessoas/');
      setPeople(response.data);
    } catch (error) {
      console.error("Erro ao buscar pessoas:", error);
    }
  };

  return (
    <div>
      <h2>Pessoas cadastradas</h2>
      <div className="person-list-container">
        <div className="person-list">
          {people.length === 0 ? (
            <p>Nenhuma pessoa cadastrada.</p>
          ) : (
             people.map((person) => (
                <div key={person.id} style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ flexGrow: 1 }}>
                    {person.nome} - {person.peso} kg
                  </label>
                  <label
                    style={{ color: 'slateblue', cursor: 'pointer'}}
                    onClick={() => window.location.href = `/goal?pessoaId=${person.id}`}
                  >
                    Meta
                  </label>
                  <label
                    style={{ color: 'slateblue', cursor: 'pointer'}}
                    onClick={() => window.location.href = `/history?pessoaId=${person.id}`}
                  >
                    Histórico
                  </label>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ListPersons