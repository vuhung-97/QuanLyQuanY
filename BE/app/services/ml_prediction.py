import numpy as np
import json
import joblib
import onnxruntime as ort
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent / "model_ai"

onnx_path = str(BASE_DIR / "disease_model.onnx")
ort_session = ort.InferenceSession(onnx_path, providers=["CPUExecutionProvider"])
input_name = ort_session.get_inputs()[0].name

lbl_path = str(BASE_DIR / "label_encoder.pkl")
lbl = joblib.load(lbl_path)
disease_names = list(lbl.classes_)

with open(str(BASE_DIR / "symptoms.json"), encoding="utf-8") as f:
    symptom_data = json.load(f)
symptom_cols = symptom_data["symptoms"]
symptom_set = set(symptom_cols)
input_dim = len(symptom_cols)


def predict_diseases(symptoms: list[str], min_probability: float = 0.0) -> list[dict]:
    input_vector = np.zeros(input_dim, dtype=np.float32)

    for s in symptoms:
        s_clean = s.strip().lower()
        if s_clean in symptom_set:
            idx = symptom_cols.index(s_clean)
            input_vector[idx] = 1.0

    input_tensor = input_vector.reshape(1, -1)
    raw_outputs = ort_session.run(None, {input_name: input_tensor})[0][0]

    exp_vals = np.exp(raw_outputs - np.max(raw_outputs))
    probs = exp_vals / exp_vals.sum()

    top3_idx = np.argsort(probs)[::-1][:3]

    result = [
        {"disease": disease_names[int(i)], "probability": round(float(probs[int(i)]) * 100, 2)}
        for i in top3_idx
        if float(probs[int(i)]) * 100 >= min_probability
    ]

    return result
