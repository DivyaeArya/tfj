import json
import os
import numpy as np
from google import genai
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
load_dotenv()


def rank_resumes():
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    resume_file = 'resume_data.json'
    dataset_file = 'database_with_embeddings.json'

    with open(resume_file, 'r') as f:
        resume_data = json.load(f)

    resume_text = json.dumps(resume_data, sort_keys=True)
    
    response = client.models.embed_content(
        model="text-embedding-004",
        contents=resume_text
    )
    query_embedding = np.array(response.embeddings[0].values).reshape(1, -1)

    with open(dataset_file, 'r') as f:
        dataset = json.load(f)

    results = []

    for item in dataset:
        if 'embedding' in item:
            item_embedding = np.array(item['embedding']).reshape(1, -1)
            score = cosine_similarity(query_embedding, item_embedding)[0][0]
            
            results.append({
                "id": item.get("id"),
                "score": float(score)
            })

    results.sort(key=lambda x: x['score'], reverse=True)

    ranked_dict = {
        rank + 1: data 
        for rank, data in enumerate(results)
    }

    print(json.dumps(ranked_dict, indent=4))

if __name__ == "__main__":
    rank_resumes()