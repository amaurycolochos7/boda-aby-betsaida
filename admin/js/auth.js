// Authentication Module for Admin Portal
// Use supabaseClient from window (loaded by supabase-config.js)

// Only run auth check on login page, not on dashboard
const isLoginPage = window.location.pathname.includes('index.html') ||
    window.location.pathname.endsWith('/admin/') ||
    window.location.pathname.endsWith('/admin');

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    // Only check auth redirect on login page
    if (isLoginPage && loginForm) {
        checkAuth();
        loginForm.addEventListener('submit', handleLogin);
    }
});

async function checkAuth() {
    const supabase = window.supabaseClient;
    if (!supabase) return;

    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            // Check if user is a groom or bride
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (profile && (profile.role === 'groom' || profile.role === 'bride')) {
                window.location.href = 'dashboard.html';
            }
        }
    } catch (error) {
        console.error('Auth check error:', error);
    }
}

async function handleLogin(e) {
    e.preventDefault();

    const supabase = window.supabaseClient;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('error-message');
    const submitBtn = document.querySelector('.login-btn');

    // Disable button during login
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Ingresando...</span>';

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        // Check user role
        const { data: profile, error: profileError } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        if (profileError) {
            // Create profile if doesn't exist
            await supabase.from('user_profiles').insert({
                id: data.user.id,
                email: data.user.email,
                first_name: 'Novio/a',
                role: 'groom'
            });
        }

        if (profile && profile.role === 'access_control') {
            await supabase.auth.signOut();
            throw new Error('Acceso denegado. Use el portal de control de acceso.');
        }

        window.location.href = 'dashboard.html';

    } catch (error) {
        errorEl.textContent = error.message || 'Error al iniciar sesión';
        errorEl.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span>Ingresar</span>';
    }
}

// Logout function
async function logout() {
    const supabase = window.supabaseClient;
    await supabase.auth.signOut();
    window.location.href = 'index.html';
}
