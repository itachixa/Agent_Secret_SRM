require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

// Test de connexion à la base de données
(async () => {
    try {
        await sql`SELECT 1`;
        console.log("Connexion réussie à la base de données !");
    } catch (error) {
        console.error("Échec de la connexion à la base de données :", error);
    }
})();

const requestHandler = (req, res) => {
    const filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);

    const ext = path.extname(filePath);
    let contentType = "text/html";

    // Gestion des types de fichiers
    switch (ext) {
        case ".js":
            contentType = "application/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
        case ".png":
        case ".jpg":
        case ".jpeg":
        case ".gif":
            contentType = "image/" + ext.slice(1);
            break;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404, { "Content-Type": "text/plain" });
            res.end("Fichier non trouvé");
        } else {
            res.writeHead(200, { "Content-Type": contentType });
            res.end(data);
        }
    });
};

http.createServer(requestHandler).listen(3000, () => {
    console.log("Serveur démarré sur http://localhost:3000");
});
