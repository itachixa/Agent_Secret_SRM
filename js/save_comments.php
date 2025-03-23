<?php
// Activer les en-têtes CORS pour autoriser les requêtes depuis d'autres domaines
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Récupérer le commentaire envoyé
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $file = 'comments.json';
    $comments = json_decode(file_get_contents($file), true);
    $comments[] = $data;

    // Sauvegarde dans le fichier JSON
    file_put_contents($file, json_encode($comments, JSON_PRETTY_PRINT));

    echo json_encode(["message" => "Commentaire enregistré avec succès !"]);
} else {
    echo json_encode(["message" => "Erreur lors de l'enregistrement."]);
}
?>
