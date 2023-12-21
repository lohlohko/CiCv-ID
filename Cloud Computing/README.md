<h1 align="center">Cloud Computing</h1>
<p align="center"><img src="https://github.com/lohlohko/CiCv-ID/assets/142643683/be5e6a68-931b-42b5-b17f-ab81c213af6e"></p>
# REST API - APP CiCV.ID

# Cloud Computing Job Desk
- Create endpoints for login, register, dashboard which contain template CV
- Create SQL instance to store data login register
- Create cloud storage to store template cv
- Deploy APIs to App Engine

# API Endpoint
In making the RESTful APIs we use nodejs 18 and Cloud SQL for building an API server, and for responses using JSON format.
Explanation for each endpoint that can be used :

**Base URL :**
> https://optical-precept-406804.et.r.appspot.com

# Register

**Path :**

> /signup

**Method :**

> `POST`

**Request Body :**

> - nama as `string`
> - email as `string`
> - phone_number as `string`
> - password as `string`, must be at least 8 characters

**Response :**

```json
{
"status": 201,
"message": "You have been successfully registered.",
"user_id": 2
}
```

**Error Response :**

```json
{
    "error": true,
    "message": "Email or Username already exist"
}
{
    "error": true,
    "message": "Password must be at least 8 characters long!"
}
```

# Login

**Path :**

> /login

**Method :**

> `POST`

**Request Body :**

> - email as `string`
> - password as `string`

**Response :**

```json
{
    "status": 200,
    "error": false,
    "message": "Success",
    "loginResult": {
        "userId": 2,
        "name": "Admin Galak"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzAxNzk3NDAyLCJleHAiOjE3MDE3OTg2MDJ9.Rtxm5NP5vTMZflqnE1i5CxHJOPRTaqxlQKaOcp2wLkY",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzAxNzk3NDAyLCJleHAiOjE3MDE4ODM4MDJ9.4_8NQDaRhLFFb1Rz_LeNNElNr3rbHKMOPiUiShDKRjg"
}
```

**Error Response :**

```json
{
  "error": true,
  "message": "Invalid email or password!"
}
```

# Show Template

**Path :**

> /fileCv/files/list

**Method :**

> `GET`

**Response :**

```json
[
    {
        "name": "Ats Clean",
        "url": "https://storage.googleapis.com/template-cv/Ats%20Clean",
        "size": "508.81 KB",
        "id": "template-cv/Ats Clean/1702780459881937",
        "description": "This template is clean, easy for resume screeners to read, and effective at mentioning key accomplishments and projects from specific work experience. This will be useful if you've been with a company for a long time, or have worked as a consultant, and want to show hiring managers your most impressive accomplishments",
        "image": "https://storage.googleapis.com/template-cv/image%20template/Ats%20Clean.png",
        "createDate": "2023-12-17T02:34:19.883Z"
    },
    {
        "name": "Ats Student With Projects and Extracurriculars",
        "url": "https://storage.googleapis.com/template-cv/Ats%20Student%20With%20Projects%20and%20Extracurriculars",
        "size": "16.88 KB",
        "id": "template-cv/Ats Student With Projects and Extracurriculars/1702782394046926",
        "description": "Use this resume template if you don't have much work experience and want to outline relevant extracurricular experience and university projects.",
        "image": "https://storage.googleapis.com/template-cv/image%20template/Ats%20Student%20With%20Projects%20and%20Extracurriculars.png",
        "createDate": "2023-12-17T03:06:34.049Z"
    },
    {
        "name": "Resume Student With Little To No Work Experience",
        "url": "https://storage.googleapis.com/template-cv/Resume%20Student%20With%20Little%20To%20No%20Work%20Experience",
        "size": "18.35 KB",
        "id": "template-cv/Resume Student With Little To No Work Experience/1702781825399641",
        "description": "This template is suitable for high school students or college students with little experience. this template shows you how to turn your extracurricular experiences into achievements",
        "image": "https://storage.googleapis.com/template-cv/image%20template/Resume%20Student%20With%20Little%20To%20No%20Work%20Experience.png",
        "createDate": "2023-12-17T02:57:05.402Z"
    },
    {
        "name": "Resume Two Column",
        "url": "https://storage.googleapis.com/template-cv/Resume%20Two%20Column",
        "size": "503.75 KB",
        "id": "template-cv/Resume Two Column/1702782580216136",
        "description": "This two column resume template has been designed and puts emphasis on the skills section. This puts the focus on your work experience, while leaving enough space for skills, education, and other useful sections.",
        "image": "https://storage.googleapis.com/template-cv/image%20template/Resume%20Two%20Column.png",
        "createDate": "2023-12-17T03:09:40.218Z"
    }
]
```

**Error Response :**

```json
{
  "error": true,
  "message": "Unable to read list of files"
}
```

