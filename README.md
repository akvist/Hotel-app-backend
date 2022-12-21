# Hotell app, back-end

This is the back-end of an app created with Node.js, Express and MongoDB.
The front-end can be found at: https://github.com/akvist/Hotel-app-frontend.git

Deployment: https://coruscating-ganache-ede5f1.netlify.app

## Table of contents

- Introduction
- Scope of Functionalities
- Deployment
- Demo
- Lessons Learned
- Tech Stack
- API Reference
- Environmental Variables
- Run Locally Together with Front-end Code
- Links

## Introduction

This is a back-end for a full-stack project. The application was made to learn the whole process of developing an app,
from writing both back-and front-end code with Node.js and React.js to using git, databases, and hosting services.

The application is a simulation of the functionality of three elevators in a hotell with ten floors.

## Scope of Functionalities

The project is a simulation of a hotell with ten floors and three elevators.
It consists of ten buttons, one for each floor, and the three elevators that move between
these ten floors when the buttons are pushed.

The starting point of the elevators is that they are standing still. When pushing a button,
the closest elevator will leave it's location and move towards the chosen floor with a pace
of 2 seconds per floor and stop when it has arrived. If a button is pushed while one or more elevators
are moving, the closest free elevator will be called to the chosen floor. All three elevators
can move at the same time. If a button is pushed while all three elevators are moving, the
elevators will still finish with their current paths. The elevator that arrives first to its
destination will after its arrival start again and move to the chosen floor. If a button is pushed and an elevator already is at the chosen floor, nothing will happen.

## Deployment

The whole full-stack project has been deployed and can be found at: https://coruscating-ganache-ede5f1.netlify.app

## Demo

Demo video on youtube: https://www.youtube.com/watch?v=VU5xx1ZXCaE

## Lessons Learned

**Lessons learned and highlights of this code**:

- Managing a NoSQL MongoDB-database
  - Getting data from the database and updating data in the database
- Creating RESTful API:s with express
- Managing git and GitHub
- Writing DRY code
  - By using variable url parameters so that the GET-request for calling an elevator to a specific floor can be used for all ten floors
  - By using one function, elevator(), for all three elevators
- Managing the asynchronous aspect in JavaScript
- Using timers
  - Writing functions that depend on the time, the elevators move with a pace of 2sec per floor
  - Checking the value of a variable every second. When it becomes a specific value, a function is called. A timer starts when an elevator button is pushed. The elevator function will not start until one of the three elevators are standing still.
- Using environment variables
- Managing the local scope, global scope and block scope of JavaScript
  - Using variables inside functions that will be assigned different values depending on when and where the function was called
- The logic that checks whether an elevator is free, and if it's free it sends the elevator that is closest (inside the function evelatorCheck())
- The logic that moves the elevators and updates their status (inside the functions whichFloor() and elevatorUpdateData())

**Together with front-end code**:

- Making a full-stack application

## Tech Stack

**Server:** Node.js v16.16.0, Express

**Database:** MongoDB

**Deployment:** Fly.io

## API Reference

#### Get elevator status

```http
  GET /api/elevatorstatus
```

#### Call elevator to specific floor

```http
  GET /api/callelevatorto/:goTo
```

| Parameter | Type     | Description                                            |
| :-------- | :------- | :----------------------------------------------------- |
| `goTo`    | `number` | The floor that the elevator should go to. Value: 1-10. |

#### elevatorCheck()

The logic that checks whether an elevator is free, and if it's free it sends the elevator that is closest.

#### elevator(elevator, goTo, res)

The logic that takes one elevator and calls it to a specifified floor.

## Environment Variables

To run this project, you will need to add the following environmental variables to your .env file

`PORT`, the port that will be used. If no port is specified in .env, a port specified in hotell.js will be used.

`DB_URI`, the uri to the MongoDB-database. The database should be called "Hotell" and should include a collection
called "Elevators and their status". When inserting documents in the database, three documents should be
inserted for each elevator with three fields each after the id-field. The added fields should be:
"Elevator: x", "Floor: 1" and "Status: "Elevator is standing still"". x should be 1 for the first elevator,
2 for the second and 3 for the third. The floor can be 1 or any other number between 1-10. This will be the
starting point of the elevators.

## Run Locally Together with Front-end Code

**Back-end**

Clone the back-end

```bash
  git clone https://github.com/akvist/Hotel-app-backend.git
```

Go to the project directory

```bash
  cd Hotellapp-backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

**Front-end**

Clone the front-end

```bash
  git clone https://github.com/akvist/Hotel-app-frontend.git
```

Go to the project directory

```bash
  cd Hotellapp-frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

## 🔗 Links

You can find me on LinkedIn:

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/amira-kvist-7a5083187/)
