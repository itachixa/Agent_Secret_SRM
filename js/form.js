async function sendComment() {
    const pseudo = document.getElementById("pseudo").value;
    const comment = document.getElementById("comment").value;

    try {
        const response = await fetch("http://localhost:3000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ pseudo, comment }),
        });

        if (response.ok) {
            alert("Commentaire enregistré avec succès !");
            document.getElementById("pseudo").value = "";
            document.getElementById("comment").value = "";
        } else {
            alert("Erreur lors de l'enregistrement du commentaire.");
        }
    } catch (error) {
        console.error("Erreur de connexion :", error);
        alert("Impossible de se connecter au serveur.");
    }
}
