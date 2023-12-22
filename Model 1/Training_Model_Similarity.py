import os
import fitz
import numpy as np
import joblib
import matplotlib.pyplot as plt
import tensorflow as tf
from sklearn.feature_extraction.text import TfidfVectorizer
from gensim.parsing.preprocessing import preprocess_string, strip_tags, strip_numeric
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, concatenate
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.model_selection import train_test_split

def read_pdf(file_path):
    text = ''
    with fitz.open(file_path) as pdf_document:
        num_pages = pdf_document.page_count
        for page_num in range(num_pages):
            page = pdf_document[page_num]
            text += page.get_text()
    return text

def preprocess_text(text):
    custom_filters = [strip_tags, strip_numeric]
    return preprocess_string(text, custom_filters)

def calculate_count_similarity(cv_text, job_description):
    vectorizer = CountVectorizer()
    cv_vector = vectorizer.fit_transform([cv_text])
    job_vector = vectorizer.transform([job_description])

    similarity_score = cosine_similarity(cv_vector, job_vector)[0][0]
    return similarity_score

cv_folder_path = 'G:/CVapps/dataset/cv'
cv_files = [os.path.join(cv_folder_path, file) for file in os.listdir(cv_folder_path) if file.endswith('.pdf')]
cv_texts = [read_pdf(file) for file in cv_files]
preprocessed_cv_texts = [' '.join(preprocess_text(text)) for text in cv_texts]

job_description_folder_path = 'G:/CVapps/dataset/job'
job_description_files = [os.path.join(job_description_folder_path, file) for file in os.listdir(job_description_folder_path) if file.endswith('.txt')]
job_descriptions = [open(file, 'r', encoding='utf-8').read() for file in job_description_files]

all_texts = preprocessed_cv_texts + job_descriptions
vectorizer = TfidfVectorizer()
all_vectors = vectorizer.fit_transform(all_texts)
joblib.dump(vectorizer, 'tfidf_vectorizer_fin.joblib')
cv_vectors = all_vectors[:len(preprocessed_cv_texts)]
job_vectors = all_vectors[len(preprocessed_cv_texts):]

X_train_cv = []
X_train_job = []
y_train = []

for cv_text in preprocessed_cv_texts:
    for job_description in job_descriptions:
        similarity_score = calculate_count_similarity(cv_text, job_description)  # Use calculate_count_similarity
        X_train_cv.append(cv_text)
        X_train_job.append(job_description)
        y_train.append(similarity_score)

X_train_cv = np.array(X_train_cv)
X_train_job = np.array(X_train_job)
y_train = np.array(y_train)
fraction_of_data = 0.3  # Adjust the fraction based on available memory
X_train_cv, X_val_cv, X_train_job, X_val_job, y_train, y_val = train_test_split(
    X_train_cv[:int(fraction_of_data * len(X_train_cv))],
    X_train_job[:int(fraction_of_data * len(X_train_job))],
    y_train[:int(fraction_of_data * len(y_train))],
    test_size=0.7,
    random_state=42
)

X_train_cv_vectorized = vectorizer.transform(X_train_cv)
X_train_job_vectorized = vectorizer.transform(X_train_job)
X_val_cv_vectorized = vectorizer.transform(X_val_cv)
X_val_job_vectorized = vectorizer.transform(X_val_job)

cv_input = Input(shape=(cv_vectors.shape[1],), name='cv_input')
job_input = Input(shape=(job_vectors.shape[1],), name='job_input')
merged_inputs = concatenate([cv_input, job_input])
x = Dense(128, activation='relu')(merged_inputs)
x = Dense(64, activation='relu')(x)
output_layer = Dense(1, activation='linear')(x)

model = Model(inputs=[cv_input, job_input], outputs=output_layer)
optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
model.compile(optimizer=optimizer, loss='mean_squared_error')

model.summary()

history = model.fit(
    {'cv_input': X_train_cv_vectorized.toarray(), 'job_input': X_train_job_vectorized.toarray()},  # Convert to dense array
    y_train,
    epochs=20,
    batch_size=8,
    validation_data=({'cv_input': X_val_cv_vectorized.toarray(), 'job_input': X_val_job_vectorized.toarray()}, y_val)  # Convert to dense array
)

model.save('calculate_similarity_model_fin_V10.h5')

plt.figure(figsize=(12, 6))

plt.subplot(1, 2, 1)
plt.plot(history.history['loss'])
plt.plot(history.history['val_loss'])
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend(['Train', 'Validation'], loc='upper right')

model.summary()

plt.show()