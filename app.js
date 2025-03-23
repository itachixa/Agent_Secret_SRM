require("dotenv").config();
const http = require("http");
const fs = require("fs");
const path = require("path");
const { neon } = require("@neondatabase/serverless");

const sql = neon(process.env.DATABASE_URL);

// Test de connexion à la base de données au démarrage
(async () => {
    try {
        const result = await sql`SELECT version()`;
        const { version } = result[0];
        console.log("Connexion réussie à la base de données - Version :", version);
    } catch (error) {
        console.error("Échec de la connexion à la base de données :", error);
    }
})();

const requestHandler = async (req, res) => {
    if (req.method === "POST" && req.url === "/") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            try {
                const { pseudo, comment } = JSON.parse(body);

                // Insertion du commentaire dans la base de données avec SQL
                await sql`INSERT INTO comments (pseudo, comment) VALUES (${pseudo}, ${comment})`;

                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Commentaire enregistré avec succès !");
            } catch (error) {
                console.error("Erreur lors de l'enregistrement :", error);
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Erreur lors de l'enregistrement du commentaire.");
            }
        });
    } else {
        // Gestion des fichiers statiques (HTML, CSS, JS)
        const filePath = path.join(__dirname, req.url === "/" ? "index.html" : req.url);
        const ext = path.extname(filePath);
        let contentType = "text/html";

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
    }
};

http.createServer(requestHandler).listen(agent-secret-srm.vercel.app, () => {
    console.log("Serveur démarré sur https://agent-secret-srm.vercel.app/");
});
