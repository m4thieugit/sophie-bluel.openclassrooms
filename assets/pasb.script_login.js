import Toast from './pasb.utils_toast.js';

window.addEventListener('DOMContentLoaded', (e) => {
    const login__form = document.querySelector('#login form');
    login__form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (!formData.has('email') || formData.get('email').trim() === '') { return new Toast('L\'email est invalide !', 'Veuillez ajouter une adresse email valide.', 'warn'); }
        if (!formData.has('password') || formData.get('password').trim() === '') { return new Toast('Le mot de passe est invalide !', 'Veuillez ajouter un mot de passe valide.', 'warn'); }

        const urlEncoded = new URLSearchParams(formData).toString();

        fetch('http://localhost:5678/api/users/login', {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded'
            },
            body: urlEncoded,
        })
        .then((res) => {
            if (res.status !== 200) {
                new Toast('Echec de connexion', 'Veuillez vérifier vos éléments de connexion.', 'error');
                return;
            }
            return res.json();
        })
        .then((res) => {
            if (!res) { return; }
            localStorage.setItem('is_connected', 'true');
            localStorage.setItem('user_data', JSON.stringify(res));
            window.location.href = './index.html';
        })
        .catch((err) => alert('Une erreur s\'est produite !'));
    });
});