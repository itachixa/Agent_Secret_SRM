const commentArray = [];

function sendComment() {
    const pseudo = document.getElementById("pseudo").value;
    const comment = document.getElementById("comment").value;

    if (pseudo && comment) {
        commentArray.push([pseudo, comment]);
        document.getElementById("pseudo").value = "";
        document.getElementById("comment").value = "";
        displayComments();
    } else {
        alert("Veuillez remplir les deux champs.");
    }
}

function displayComments() {
    const commentsList = document.getElementById("commentsList");

    // Vérification si l'élément existe avant d'accéder à ses propriétés
    if (!commentsList) {
        console.error("L'élément 'commentsList' est introuvable.");
        return;
    }

    commentsList.innerHTML = "";

    commentArray.forEach(([pseudo, comment]) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${pseudo} :</strong> ${comment}`;
        commentsList.appendChild(li);
    });
}
