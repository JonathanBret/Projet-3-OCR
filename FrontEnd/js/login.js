const authorizedUsers = [{
    email: "sophie.bluel@test.tld",
    password: "S0phie",
    isAdmin: true
}];

const loginForm = document.getElementById('login');

loginForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const credentials = {
        email: email,
        password: password
    };

    authenticateUser(credentials)
        .then(data => {
            const authorizedUser = authorizedUsers.find(user => user.email === email && user.password === password);
            if (authorizedUser && authorizedUser.isAdmin) {
                const token = data.token;
                localStorage.setItem('authorizedUser', JSON.stringify({
                    token,
                    isAdmin: true
                }));
                console.log('Token:', token);
                window.location.href = 'index.html';
            } else {
                alert('Vous n\'êtes pas autorisé en tant qu\'administrateur');
            }
        })
        .catch(error => {
            console.error(error);
            alert('Une erreur s\'est produite lors de la connexion');
        });
});

function authenticateUser(credentials) {
    return fetch('https://sophie-bluel-gnij.onrender.com/api/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur lors de l\'authentification de l\'utilisateur');
            }
            return response.json();
        })
        .then(data => {
            return data;
        });
}