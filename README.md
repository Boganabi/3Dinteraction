# 3D-Interactions-threejs
Performed Interactions with 3D models in threejs

# Steps to execute
1. Install all the packages: `npm install`
2. Run the development environment: `npm run dev`
3. In a new terminal: `cd Backend/` and then `node index.js`

---

## Postgres is required for this to run properly on the backend
You can add any models onto it, as long as you have these columns:
- id (holds the id of the model, also is the primary key for this database)
- a string that holds the name of the model
- a string that holds the filepath to the model on your machine

This project will work fine without setting up the database, but you will need to upload your own models to view in that case