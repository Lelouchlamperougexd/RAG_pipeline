import faiss
import numpy as np
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")
dimension = 384
index = faiss.IndexFlatL2(dimension)
corpus = []

def add_document(text):
    vec = model.encode([text])[0]
    index.add(np.array([vec]))
    corpus.append(text)

def search_similar(text, k=3):
    vec = model.encode([text])[0]
    D, I = index.search(np.array([vec]), k)
    return [corpus[i] for i in I[0] if i < len(corpus)] 