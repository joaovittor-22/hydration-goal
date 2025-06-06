from sqlalchemy.orm import Session
import models, schemas

# --- Pessoa CRUD ---

def get_pessoas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Pessoa).offset(skip).limit(limit).all()

def get_pessoa(db: Session, pessoa_id: int):
    return db.query(models.Pessoa).filter(models.Pessoa.id == pessoa_id).first()

def create_pessoa(db: Session, pessoa: schemas.PessoaCreate):
    db_pessoa = models.Pessoa(**pessoa.dict())
    db.add(db_pessoa)
    db.commit()
    db.refresh(db_pessoa)
    return db_pessoa

def delete_pessoa(db: Session, pessoa_id: int):
    pessoa = db.query(models.Pessoa).filter(models.Pessoa.id == pessoa_id).first()
    if pessoa:
        db.delete(pessoa)
        db.commit()
    return pessoa

# --- Consumo CRUD ---

def get_consumos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Consumo).offset(skip).limit(limit).all()

def get_consumo(db: Session, consumo_id: int):
    return db.query(models.Consumo).filter(models.Consumo.id == consumo_id).first()

def create_consumo(db: Session, consumo: schemas.ConsumoCreate):
    db_consumo = models.Consumo(**consumo.dict())
    db.add(db_consumo)
    db.commit()
    db.refresh(db_consumo)
    return db_consumo

def delete_consumo(db: Session, consumo_id: int):
    consumo = db.query(models.Consumo).filter(models.Consumo.id == consumo_id).first()
    if consumo:
        db.delete(consumo)
        db.commit()
    return consumo
