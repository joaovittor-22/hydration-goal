from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas, crud
from database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
   # "http://localhost:3000",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] to allow all (not for production)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Pessoa Routes ---

@app.post("/pessoas/", response_model=schemas.Pessoa)
def create_pessoa(pessoa: schemas.PessoaCreate, db: Session = Depends(get_db)):
    return crud.create_pessoa(db, pessoa)

@app.get("/pessoas/", response_model=list[schemas.Pessoa])
def read_pessoas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_pessoas(db, skip=skip, limit=limit)

@app.get("/pessoas/{pessoa_id}", response_model=schemas.Pessoa)
def read_pessoa(pessoa_id: int, db: Session = Depends(get_db)):
    db_pessoa = crud.get_pessoa(db, pessoa_id)
    if not db_pessoa:
        raise HTTPException(status_code=404, detail="Pessoa not found")
    return db_pessoa

@app.delete("/pessoas/{pessoa_id}", response_model=schemas.Pessoa)
def delete_pessoa(pessoa_id: int, db: Session = Depends(get_db)):
    pessoa = crud.delete_pessoa(db, pessoa_id)
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa not found")
    return pessoa

# --- Consumo Routes ---

@app.post("/consumos/", response_model=schemas.Consumo)
def create_consumo(consumo: schemas.ConsumoCreate, db: Session = Depends(get_db)):
    return crud.create_consumo(db, consumo)

@app.get("/consumos/", response_model=list[schemas.Consumo])
def read_consumos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_consumos(db, skip=skip, limit=limit)

@app.get("/consumos/{consumo_id}", response_model=schemas.Consumo)
def read_consumo(consumo_id: int, db: Session = Depends(get_db)):
    db_consumo = crud.get_consumo(db, consumo_id)
    if not db_consumo:
        raise HTTPException(status_code=404, detail="Consumo not found")
    return db_consumo

@app.delete("/consumos/{consumo_id}", response_model=schemas.Consumo)
def delete_consumo(consumo_id: int, db: Session = Depends(get_db)):
    consumo = crud.delete_consumo(db, consumo_id)
    if not consumo:
        raise HTTPException(status_code=404, detail="Consumo not found")
    return consumo
