import numpy as np
import json
import joblib
import onnxruntime as ort
from pathlib import Path
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel

BASE = Path(__file__).resolve().parent

# 1. Khởi tạo ONNX Session (Chạy siêu nhẹ trên CPU)
onnx_path = str(BASE / 'disease_model.onnx')
ort_session = ort.InferenceSession(onnx_path, providers=['CPUExecutionProvider'])
input_name = ort_session.get_inputs()[0].name

# 2. Nạp Label Encoder
lbl_path = str(BASE /  'label_encoder.pkl')
lbl = joblib.load(lbl_path)
disease_names = list(lbl.classes_)

# 3. Nạp danh sách triệu chứng từ file JSON
with open(str(BASE / 'symptoms.json'), 'r', encoding='utf-8') as f:
    symptom_data = json.load(f)
symptom_cols = symptom_data['symptoms']
symptom_set = set(symptom_cols)
input_dim = len(symptom_cols)

with open(str(BASE / 'symptoms.json'), 'r', encoding='utf-8') as f:
    all_symptoms = json.load(f)

app = FastAPI(title="Disease Prediction v6 (ONNX)")

# app.mount("/static", StaticFiles(directory=str(BASE / "api" / "static")), name="static")

class PredictRequest(BaseModel):
    symptoms: list[str]
    min_probability: float = 20.0

@app.get("/")
def index():
    return FileResponse(str(BASE / "api" / "static" / "index.html"))

@app.get("/symptoms")
def get_symptoms():
    return all_symptoms

@app.post("/predict")
def predict(req: PredictRequest):
    # Khởi tạo vector input bằng 0
    input_vector = np.zeros(input_dim, dtype=np.float32)
    
    # Kích hoạt các triệu chứng người dùng nhập vào
    for s in req.symptoms:
        s_clean = s.strip().lower()
        if s_clean in symptom_set:
            idx = symptom_cols.index(s_clean)
            input_vector[idx] = 1.0

    # Chuyển đổi về dạng tensor 2 chiều (batch_size=1, input_dim)
    input_tensor = input_vector.reshape(1, -1)

    # Đẩy qua mô hình ONNX
    raw_outputs = ort_session.run(None, {input_name: input_tensor})[0][0]

    # Tính xác suất bằng Softmax
    exp_vals = np.exp(raw_outputs - np.max(raw_outputs))
    probs = exp_vals / exp_vals.sum()

    # Sắp xếp và lấy Top 3
    top3_idx = np.argsort(probs)[::-1][:3]
    
    # Trả về kết quả vượt ngưỡng (min_probability)
    result = [
        {"disease": disease_names[int(i)], "probability": round(float(probs[int(i)]) * 100, 2)}
        for i in top3_idx
        if float(probs[int(i)]) * 100 >= req.min_probability
    ]
    
    return {"predictions": result, "threshold": req.min_probability}
