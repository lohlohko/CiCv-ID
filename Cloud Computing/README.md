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
