document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Récupérer les admins du localStorage ou utiliser le tableau par défaut
    const admins = JSON.parse(localStorage.getItem('admins')) || [
        { email: "admin1", password: "azerty" },
        { email: "admin2", password: "azerty" }
    ];
    
    const admin = admins.find(a => a.email === email && a.password === password);
    
    if (admin) {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'admin.html';
    } else {
        alert('Email ou mot de passe incorrect');
    }
});