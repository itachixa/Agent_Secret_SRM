document.querySelector('.comment_form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const pseudo = document.getElementById('pseudo').value;
    const comment = document.getElementById('comment').value;

    try {
        const response = await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pseudo, comment })
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du commentaire');
        }

        alert('Commentaire envoyé avec succès !');
    } catch (error) {
        console.error('Erreur :', error);
    }
});
