
# RoadForge - A Roadmap app
### live Link : https://road-forge.web.app/









## Feature Design : 
### 1. User Authentication(Sign Up/ Log In)

- I used Firebase Authentication because it offers easy email based login, user state management, and a secure authentication system.
### 2. Show Dynamic Roadmap-item Card
- I am saving the road map item data as an array of objects in the database and displaying them in the ui to make the user interface look good.
### 3. Filter and Sorting system
- I have created a filtering system using road map status and a sorting system using upvote and a reset button so that the data can be brought back to its previous place.
### 4. upvote and comment
- A user can only upvote once on each roadmap item card and can comment as many times as they want.
### 5. Nested Reply
- Users can reply to other people's comments, and another user can reply against the reply that the user has replied to.
####    Trade-offs
- I wanted to use JWT tokens for more authentication but couldn't due to time constraints.
- If I had time, I could make the All Comments and My Comments sections more interactive. 

## Architecture Decisions:
### Frontend : React.js + Tailwind CSS
- I used React.js because it is a component base library that creates reusable UIs.It uses state management, conditional rendering, and hooks to make many complex tasks easier.
- I used Tailwind CSS which helped me to create custom designs.
### Backend : Express + mongodb
- I used Express.js on the backend because it is a lightweight and fast framework that makes it much easier to create a REST API.
- Using Express.js makes middleware and routing very easy.
- I used mongodb as the database because using mongodb gives me full control over the database.
## Code Style :
### 1. Moduler Components (React.js)
#####  I have divided each feature on the front into small parts. Such Us : 
- Roadmap-item.jsx
- Comments.jsx
- NestedReplyForm.jsx
### 2. Naming Conventions
##### I used camel case for variables and functions throughout the project.
- variable : roadmapData,totalComments
- functions : handleSignUpBtn, getTotalComments
### 3. RESTful Api (Backend)
##### I have built the backend APIs according to RESTful conventions.
- POST /api/users - Insert Users Data
- Get /api/users  -  Find Usrs Data
- PATCH /api/users/update/:id - Update User Data
- DELETE /api/users/delete/:id - Delete user Data
### Readability and Extensibility : 
- I used a clear naming convention for each file and folder so that it would be easy for other developers to understand when reading the code.
- I wrote it in such a way that if I want to add new features in the future, I don't have to change the code.




