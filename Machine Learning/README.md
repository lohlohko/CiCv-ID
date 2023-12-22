<h1 align="center">Machine Learning</h1>


# This contains what Machine Learning's team do
The job of Machine learning Team is to learn and make machine learning model of matching the qualifications and requirements listed on a candidate's CV with the specific job they are applying for.

## 1. Dataset
### Dataset Resource
We get dataset from various source such as:
- [Resume Dataset](https://www.kaggle.com/datasets/gauravduttakiit/resume-dataset)
- [JFLEG: English Grammatical Error Benchmark](https://www.kaggle.com/datasets/thedevastator/jfleg-english-grammatical-error-benchmark)

## 2. First Model
This first model was created to predict the match score between CV and job description.
The dataset used is preprocessed first by taking the text contained in the CV. then the text is converted into vector form as data to train the model.
we also use flask to deploy models on cloud servers.
There is a joblib file which is used to store vectors previously used when training the model.

## 3. Second Model
The second model is used to identify sentences contained in the CV, then suggestions for improvement will be given to those sentences which are not grammatically good.

## Disclaimer
-   This project is created for educational purpose as the requirement to graduate from [**_Bangkit Academy led by Google, Tokopedia, Gojek, & Traveloka_**.](https://www.linkedin.com/company/bangkit-academy/mycompany/)
