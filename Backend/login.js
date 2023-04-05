const authorizedUsers = [{
    email: "sophie.bluel@test.tld",
    password: "S0phie",
    isAdmin: true // Ajoutez une propriété isAdmin pour identifier les admins
}, ];

const loginForm = document.getElementById('login');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const credentials = {
        email: email,
        password: password
    };

    const authorizedUser = authorizedUsers.find(user => user.email === email && user.password === password);

    if (authorizedUser) {
        console.log(authorizedUser);

        localStorage.setItem('authorizedUser', JSON.stringify(authorizedUser));

        // Redirige l'utilisateur vers la page d'administration s'il est un administrateur
        if (authorizedUser.isAdmin) {
            window.location.href = 'index.html';
        } else {
            window.location.href = 'index.html';
        }

    } else {
        alert('Identifiants incorrects');
    }
});