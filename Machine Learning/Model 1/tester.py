import os
import fitz
import numpy as np
import joblib
from gensim.parsing.preprocessing import preprocess_string, strip_tags, strip_numeric
from sklearn.feature_extraction.text import TfidfVectorizer
import tensorflow as tf

# Function to read PDF and preprocess text
def read_and_preprocess(file_path):
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")

    text = ''
    with fitz.open(file_path) as pdf_document:
        for page_num in range(pdf_document.page_count):
            page = pdf_document[page_num]
            text += page.get_text()

    preprocessed_text = ' '.join(preprocess_string(text, [strip_tags, strip_numeric]))
    return preprocessed_text

    

def read_text_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as text_file:
        content = text_file.read()
    return content

# Load the vectorizer used during training
vectorizer = joblib.load('tfidf_vectorizer_fin.joblib')

# Read and preprocess new data
new_cv_path = 'G:/CVapps/dataset/data/Newfolder/36136569.pdf'
new_job_description_path = 'G:/CVapps/data/data/BANKING/job description/Financial Analyst.txt'

new_cv_text = read_and_preprocess(new_cv_path)
new_job_description = read_text_file(new_job_description_path)

# Vectorize new data
new_cv_vector = vectorizer.transform([new_cv_text]).toarray()
new_job_vector = vectorizer.transform([new_job_description]).toarray()

# Load the pre-trained model
model_path = 'calculate_similarity_model_fin_V10.h5'
loaded_model = tf.keras.models.load_model(model_path)

# Make predictions for the new data
prediction = loaded_model.predict({
    'cv_input': new_cv_vector,
    'job_input': new_job_vector
})

# Print the prediction
rounded_similarity_score = round(prediction[0][0] * 100, 2)
print(f'Similarity Score: {rounded_similarity_score}')