window.onload = function() {
    displayComments();
};

function sendComment() {
    const pseudo = document.getElementById("pseudo").value;
    const comment = document.getElementById("comment").value;

    if (!pseudo || !comment) {
        alert("Veuillez remplir tous les champs.");
        return;
    }

    const newComment = { pseudo, comment };
    saveComment(newComment);

    // Vider les champs
    document.getElementById("pseudo").value = "";
    document.getElementById("comment").value = "";

    displayComments();
}

function saveComment(comment) {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));
}

function displayComments() {
    const commentsList = document.getElementById("commentsList");
    commentsList.innerHTML = "";

    let comments = JSON.parse(localStorage.getItem("comments")) || [];

    comments.forEach(comment => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${comment.pseudo} :</strong> ${comment.comment}`;
        commentsList.appendChild(li);
    });
}
