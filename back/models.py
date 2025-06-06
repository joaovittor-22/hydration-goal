from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base  # assume you have a Base from SQLAlchemy declarative base

class Pessoa(Base):
    __tablename__ = "pessoas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    data_registro = Column(DateTime, default=datetime.utcnow)
    peso = Column(Float)
    meta_dia = Column(Float)  # daily goal

    consumos = relationship("Consumo", back_populates="pessoa")

class Consumo(Base):
    __tablename__ = "consumos"

    id = Column(Integer, primary_key=True, index=True)
    quantidade = Column(Float)
    data = Column(DateTime, default=datetime.utcnow)
    
    pessoa_id = Column(Integer, ForeignKey("pessoas.id"))
    pessoa = relationship("Pessoa", back_populates="consumos")
