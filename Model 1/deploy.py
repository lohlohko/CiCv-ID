from flask import Flask, request, jsonify
from gensim.parsing.preprocessing import preprocess_string, strip_tags, strip_numeric
import tensorflow as tf
import os
import joblib
import magic  
import fitz     

app = Flask(__name__)

vectorizer = joblib.load('tfidf_vectorizer_fin.joblib')
model = tf.keras.models.load_model('calculate_similarity_model_fin_V10.h5')

def read_and_preprocess_pdf(file):
    if not file:
        raise ValueError("File not provided.")

    try:
        mime_type = magic.Magic()
        file_type = mime_type.from_buffer(file.read(1024))
        file.seek(0) 

        if 'pdf' in file_type.lower():
            pdf_document = fitz.open(file)
            text = ''
            for page_num in range(pdf_document.page_count):
                page = pdf_document[page_num]
                text += page.get_text()
            pdf_document.close()
        else:
            text = file.read()

        preprocessed_text = ' '.join(preprocess_string(text, [strip_tags, strip_numeric]))
        return preprocessed_text

    except FileNotFoundError as e:
        raise FileNotFoundError(f"File not found: {file.filename}") from e
    except IsADirectoryError as e:
        raise IsADirectoryError(f"Expected a file, but got a directory: {file.filename}") from e
    except Exception as e:
        raise ValueError(f"Error processing file: {str(e)}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        cv_file = request.files['cv']
        job_description_file = request.files['job_description']

        new_cv_text = read_and_preprocess_pdf(cv_file)
        new_job_description = read_and_preprocess_pdf(job_description_file)

        # Use the loaded vectorizer to transform the text
        new_cv_vector = vectorizer.transform([new_cv_text]).toarray()
        new_job_vector = vectorizer.transform([new_job_description]).toarray()

        prediction = model.predict({
            'cv_input': new_cv_vector,
            'job_input': new_job_vector
        })

        rounded_similarity_score = round(prediction[0][0] * 100, 2)
        return jsonify({'similarity_score': rounded_similarity_score})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
