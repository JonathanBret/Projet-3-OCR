const authorizedUsers = [{
    email: "sophie.bluel@test.tld",
    password: "S0phie"
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

        window.location.href = 'index.html';

    } else {
        alert('Identifiants incorrects');
    }
});