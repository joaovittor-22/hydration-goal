from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# --- Pessoa Schemas ---

class PessoaBase(BaseModel):
    nome: str
    peso: Optional[float] = None
    meta_dia: Optional[float] = None

class PessoaCreate(PessoaBase):
    pass

class Pessoa(PessoaBase):
    id: int
    data_registro: datetime

    class Config:
        orm_mode = True

# --- Consumo Schemas ---

class ConsumoBase(BaseModel):
    quantidade: float
    data: Optional[datetime] = None

class ConsumoCreate(ConsumoBase):
    pessoa_id: int

class Consumo(ConsumoBase):
    id: int
    pessoa_id: int

    class Config:
        orm_mode = True
