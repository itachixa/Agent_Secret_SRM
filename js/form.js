async function sendComment() {
    const pseudo = document.getElementById("pseudo").value;
    const comment = document.getElementById("comment").value;

    try {
        const response = await fetch("https://agent-secret-srm.vercel.app/api/comments", {
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
