import { sequelize } from "../models/index.js";

console.log("Connexion à la DB...");
await sequelize.authenticate();
console.log("Connexion réussie !");

await sequelize.sync({ force: true }); 
console.log("Tables créées avec succès");

await sequelize.close();
console.log("Connexion fermée");