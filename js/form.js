document.addEventListener("DOMContentLoaded", loadComments);

function sendComment() {
    const pseudo = document.getElementById("pseudo").value;
    const comment = document.getElementById("comment").value;

    if (pseudo && comment) {
        const newComment = { pseudo, comment };
        saveComment(newComment);

        // Réinitialiser les champs
        document.getElementById("pseudo").value = "";
        document.getElementById("comment").value = "";
    } else {
        alert("Veuillez remplir les deux champs.");
    }
}

function saveComment(comment) {
    // Envoi du commentaire au serveur
    fetch("https://tonsite.com/save_comments.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(comment)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur lors de l'enregistrement des commentaires.");
        }
        displayComments();
    })
    .catch(error => console.error(error));
}

function loadComments() {
    fetch("https://tonsite.com/comments.json")
        .then(response => response.json())
        .then(comments => displayComments(comments))
        .catch(error => console.error("Erreur lors du chargement des commentaires :", error));
}

function displayComments(comments) {
    const commentsList = document.getElementById("commentsList");
    commentsList.innerHTML = "";

    comments.forEach(comment => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${comment.pseudo} :</strong> ${comment.comment}`;
        commentsList.appendChild(li);
    });
}
