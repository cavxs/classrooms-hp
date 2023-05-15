# Overview

This project boils down to making your own classroom. You can add student to your classroom using a unique code. You can assign those students an exam by creating an exam template. You can check the students' answers. The students can see their grades. And much more. This simple description doesn't do it justice, you'll have to use it yourself, and read the features and the file content summary to fully grasp the complexity and distinctiveness of my project.

# How to use

You have to install node in order to use this project since the frontend is made using the javascript React library from start-react-app.

1- Open a terminal, cd into `backend`
2- Install the python requirements using `pip install -r requirements.txt`
3- Make migrations and migrate `py manage.py makemigrations api` and `py manage.py migrate` into the terminal
4- Start the server using `py manage.py runserver`
5- Open another terminal; then, cd into `frontend`
6- Install the packages required for React using `npm i`
7- After successful installation, run `npm start` in the terminal and wait for the local server to start
8- A browser window will open automatically on `localhost:3000`.

# Distinctiveness and Complexity

My project is definitely distinct and complex. I have went way beyond what is taught in the course while still adhering to the material of the course. I have spent time studying and learning React, React Router DOM, Django Rest Framework, JWT Authentication, and a lot more nuances I won't mention in this paragraph but will mention in the following sections. I believe this project is distinct enough from all the other projects I made before: never have I made a Classrooms project where any user can become a teacher, add students to their classroom using a code, and then assign an exam to their students. I will go in depth about distinctiveness and complexity in the following sections, especially the File Content Summary.

# Features

I will summarize the features and group them by url.

## Classrooms `/classrooms`

- You can create a classroom as a teacher
- You can join a classroom as a student using the code sent to you by a teacher who created the classroom

## Classroom `/classroom/:id`

- You can see all the students who are in this classroom
- You can take an exam as a student
- You can invite students to your classroom by sending them a code
- You can check exams and assign grades as a teacher
- You can know your last grade as a student
- You can assign an exam from an exam template to your classroom
- In the student list, as a teacher, you can see the grades of every student you graded; you can also identify which students you haven't graded yet and the students you didn't take the active exam
- You can leave or delete the classroom

## Exams `/exams`

- You can view, create, edit and delete exam templates
- You can view all the exams you've taken as a student or given as a teacher

## Exam `/exam/:id`

- You can start the exam as a student who didn't start the exam yet
- You can see the answers --by clicking see answers button-- as a teacher who assigned the exam
- You can see the questions and solve them and submit your answers

## Exam Answers `/exam/:id/answers`

- You get to this page by clicking see answers either in `/classroom/:id` or `/exam/:id`. This is the page where you can view your answers and your grade, if graded

## Exam Check `/exam/:id/check`

- This page can only be accessed by the teacher.
- This page allows the teacher to check the answers of all his students who took the active exam.
- Each button represents a student in the list and takes the taecher to `/exam/:id/check/:qid` where the teacher sees and checks the answers

## Exam Make `/make`

- This page allows a teacher to create an exam template to be used later
- You can either create a field question or a multiple choice question

## Exam Edit `/make/:id`

- This page allows a teacher to edit a current exam template

There are so many details and nuances in the project that I can't talk about because I don't remember myself. The only way to appreciate this project is by using it for yourself.

# File Content Summary

This section will only include the files I have created myself or edited and will not contain any files automatically generated.

## Backend

`api/viewsets.py`: one of the largest files in the project. I've written it from scratch. It is the file that handles the API requests. It contains Django Rest Framework viewsets which are equivalent to modified class-based Django views. A viewset can contain any of the four 'list', 'retrieve', 'create', and 'update'. When an API request is made, the request is directed to one of those four functions in the viewset. The viewset calls for the serialization of the request data, handles the data, serializes a response, and finally sends it back to the client.

`api/serializers.py`: also one of the largest files in the project. Since the data is sent to and from React, it has to be serialized first into JSON format; you can't directly send a Django model to the client React app. And likewise, you can't use JSON data (that represent a Django model) from the React app. That's where serializers.py comes in. It acts as a translator between React and Django. There is a serializer for each model. This file also handles the serialization of the JWT Token since I modified it to include the username.

`api/urls.py`: This file creates a router and registers all the different viewsets created in `viewsets.py` then adds them to the urlpattern list. This is equivalent to adding views to the urlpatterns list.

`api/models.py`: This is a typical models file. The only unique things here are the custom id generation for the Exams model and the Classroom codes; and the Meta class in the Classroom model with the unique_together field that enables each classroom to have a unique code.

`api/admin.py`: A typical admin file.

`backend/settings.py`: I used the CORs middleware and whitelisted the React app at 'http://localhost:3000'. I've also set the 'DEFAULT_AUTHENTICATION_CLASSES' to be the simplejwt JWT Authentication class. I've also configured the token obtain serializer to be my own custom serializer.

## Frontend

`src/App.js`: This is the gate of the React app. I've set it up so that it imports all the different pages from the `pages` folder and uses these pages in React Router DOM Routes. This is how the frontend routes are set up. You may notice there are nested Routes; these either handle the NavLayout (which is the navigation bar at the bottom) or identify the Private Routes.

`src/index.css`: This is for the global styles that are used throughout the whole application. Aside from this css, every page and component has its own css coming from their associated `style.module.css` file.

`src/context/AuthContext.js`: This is one of the biggest and most worked on files in the entire project. This file provides a React Context that handles api requests (using axios library), authentication, access and refresh token storage, and user identity.

`src/context/PrivateRoutes.js`: This file contains a React Component that acts as a Route. The children of this component will be Routes that are meant to be private. If a private route is visited, this component ensures that the user is redirected to the login page. It is used in the `src/App.js` file.

`src/layout/NavLayout.js`: This file is responsible for the navigation bar at the bottom of the app.

`src/pages/*`: Every folder in this folder contains a single page component used in the React app. I have coded all those pages from scratch. Each of those pages communicate with the backend using the api provided by the `src/context/AuthContext.js`. Note: there is an unused Home page I didn't make because of the time constraint.

`src/components/Popup.jsx`: This handles every single popup that there is in the app. It is imported by multiple pages, such as the ClassroomList page (in the join and create classrooms popup) and the Classroom page (in the classroom code, assign exam, and delete classroom popups)

This project took me around a month to complete but I believe it was worth it because I've learned a lot.

# What I have learned:

- Mastered React from start-react-app
- Mastered React Router DOM (especially using outlets, params, navigation, links)
- Mastered JWT Authentication on the frontend and backend
- Mastered Django Rest Framework and how it works from serializers to ViewSets
- Learned more about security and permissions
- Mastered linking both frontend and backend and communicating between them (which makes me now a fullstack developer)
- I use git more frequently now
- Much more I forgot about but now became part of my muscle memory
