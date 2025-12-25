// Dashboard Module
// Get Supabase client from window
function getSupabase() {
    return window.supabaseClient;
}

// State
let currentUser = null;
let userProfile = null;
let eventConfig = null;
let tables = [];
let passes = [];
let userProfiles = {}; // Cache of user profiles
let isInitialized = false;

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', async () => {
    if (isInitialized) return;
    isInitialized = true;

    const hasAuth = await checkDashboardAuth();
    if (!hasAuth) return;

    await loadUserProfile();
    initNavigation();
    await loadDashboardData();
    initForms();
    updateCurrentDate();
    updateUserGreeting();
});

// Check authentication for dashboard
async function checkDashboardAuth() {
    const supabase = getSupabase();
    if (!supabase) {
        console.error('Supabase not initialized');
        return false;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        window.location.href = 'index.html';
        return false;
    }

    currentUser = session.user;
    return true;
}

// Load user profile
async function loadUserProfile() {
    const supabase = getSupabase();
    const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

    if (profile) {
        userProfile = profile;
    }
}

// Update greeting with user name
function updateUserGreeting() {
    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl && userProfile) {
        greetingEl.textContent = `Hola, ${userProfile.first_name}`;
    }
}

// Navigation
function initNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;

            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            // Show section
            document.querySelectorAll('.dashboard-section').forEach(s => {
                s.classList.remove('active');
            });
            document.getElementById(`section-${section}`).classList.add('active');

            // Refresh data for specific sections
            if (section === 'guests') loadGuests();
            if (section === 'passes') loadRecentPasses();
        });
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterGuests(btn.dataset.filter);
        });
    });

    // Search
    const searchInput = document.getElementById('guest-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchGuests(e.target.value);
        });
    }
}

// Navigate to section (for clickable stat cards)
function navigateToSection(section) {
    const navLinks = document.querySelectorAll('.sidebar-nav a');

    // Update active states
    navLinks.forEach(l => l.classList.remove('active'));
    const targetLink = document.querySelector(`[data-section="${section}"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }

    // Show section
    document.querySelectorAll('.dashboard-section').forEach(s => {
        s.classList.remove('active');
    });
    document.getElementById(`section-${section}`).classList.add('active');

    // Refresh data for specific sections
    if (section === 'guests') loadGuests();
    if (section === 'passes') loadRecentPasses();
}

// Update current date display
function updateCurrentDate() {
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('es-MX', options);
    }
}

// Load all dashboard data
async function loadDashboardData() {
    await loadEventConfig();
    await loadTables();
    await loadPasses();
    updateStats();
}

// Load event configuration
async function loadEventConfig() {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('event_config')
        .select('*')
        .limit(1)
        .single();

    if (data) {
        eventConfig = data;
        document.getElementById('total-tables').value = data.total_tables;
        document.getElementById('seats-per-table').value = data.seats_per_table;
    } else {
        // Create default config
        const { data: newConfig } = await getSupabase()
            .from('event_config')
            .insert({ total_tables: 10, seats_per_table: 8 })
            .select()
            .single();

        eventConfig = newConfig;
    }
}

// Load tables
async function loadTables() {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('tables')
        .select('*')
        .order('table_number');

    if (data) {
        tables = data;
        renderTablesGrid();
        populateTableSelect();
    }
}

// Load passes
async function loadPasses() {
    const supabase = getSupabase();
    const { data, error } = await supabase
        .from('guest_passes')
        .select(`*, tables (table_number)`)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error loading passes:', error);
        return;
    }

    if (data) {
        passes = data;

        // Load creator profiles for passes
        await loadCreatorProfiles();

        loadRecentPasses();
        loadGuests();
    }
}

// Load creator profiles for all passes
async function loadCreatorProfiles() {
    const supabase = getSupabase();

    // Get unique creator IDs
    const creatorIds = [...new Set(passes.map(p => p.created_by).filter(Boolean))];

    if (creatorIds.length === 0) return;

    const { data: profiles } = await supabase
        .from('user_profiles')
        .select('id, first_name, role')
        .in('id', creatorIds);

    if (profiles) {
        // Create lookup map
        profiles.forEach(p => {
            userProfiles[p.id] = p;
        });

        // Attach creator info to passes
        passes.forEach(pass => {
            if (pass.created_by && userProfiles[pass.created_by]) {
                pass.creator = userProfiles[pass.created_by];
            }
        });
    }
}

// Update statistics
function updateStats() {
    document.getElementById('stat-tables').textContent = tables.length;
    document.getElementById('stat-passes').textContent = passes.length;

    const confirmed = passes.filter(p => p.confirmed).length;
    document.getElementById('stat-confirmed').textContent = confirmed;

    const totalGuests = passes.reduce((sum, p) => sum + p.total_guests, 0);
    document.getElementById('stat-guests').textContent = totalGuests;

    // Update chart
    const pending = passes.filter(p => !p.confirmed).length;
    const inside = passes.filter(p => p.guests_entered > 0).length;

    document.getElementById('chart-pending').textContent = pending;
    document.getElementById('chart-confirmed').textContent = confirmed;
    document.getElementById('chart-inside').textContent = inside;

    // Update total capacity
    const capacity = tables.reduce((sum, t) => sum + t.capacity, 0);
    document.getElementById('total-capacity').textContent = capacity;
}

// Render tables visual grid
function renderTablesGrid() {
    const container = document.getElementById('tables-grid');
    if (!container) return;

    container.innerHTML = tables.map(table => {
        const occupiedPercent = (table.occupied_seats / table.capacity) * 100;
        const statusClass = occupiedPercent >= 100 ? 'full' :
            occupiedPercent >= 50 ? 'partial' : 'empty';

        return `
            <div class="table-item ${statusClass}" onclick="showTableGuests('${table.id}', ${table.table_number})" style="cursor: pointer;">
                <div class="table-number">Mesa ${table.table_number}</div>
                <div class="table-occupancy">
                    ${table.occupied_seats} / ${table.capacity}
                </div>
                <div class="table-bar">
                    <div class="table-bar-fill" style="width: ${occupiedPercent}%"></div>
                </div>
            </div>
        `;
    }).join('');
}

// Populate table select dropdown
function populateTableSelect() {
    const select = document.getElementById('table-select');
    if (!select) return;

    select.innerHTML = '<option value="">Selecciona una mesa</option>' +
        tables.map(table => {
            const available = table.capacity - table.occupied_seats;
            const disabled = available <= 0 ? 'disabled' : '';
            return `<option value="${table.id}" ${disabled}>
                Mesa ${table.table_number} (${available} lugares disponibles)
            </option>`;
        }).join('');
}

// Initialize forms
function initForms() {
    // Tables config form
    const tablesForm = document.getElementById('tables-config-form');
    if (tablesForm) {
        tablesForm.addEventListener('submit', handleTablesConfig);
    }

    // Create pass form
    const passForm = document.getElementById('create-pass-form');
    if (passForm) {
        passForm.addEventListener('submit', handleCreatePass);
    }
}

// Handle tables configuration
async function handleTablesConfig(e) {
    e.preventDefault();
    const supabase = getSupabase();

    const totalTables = parseInt(document.getElementById('total-tables').value);
    const seatsPerTable = parseInt(document.getElementById('seats-per-table').value);

    try {
        // Update or create config
        if (eventConfig?.id) {
            await supabase
                .from('event_config')
                .update({ total_tables: totalTables, seats_per_table: seatsPerTable })
                .eq('id', eventConfig.id);
        }

        // Create tables if needed
        const existingCount = tables.length;

        if (totalTables > existingCount) {
            // Add new tables
            const newTables = [];
            for (let i = existingCount + 1; i <= totalTables; i++) {
                newTables.push({ table_number: i, capacity: seatsPerTable });
            }
            await supabase.from('tables').insert(newTables);
        } else if (totalTables < existingCount) {
            // Remove excess tables (only if empty)
            const tablesToRemove = tables
                .filter(t => t.table_number > totalTables && t.occupied_seats === 0)
                .map(t => t.id);

            if (tablesToRemove.length > 0) {
                await supabase.from('tables').delete().in('id', tablesToRemove);
            }
        }

        // Update capacity for all tables
        await supabase
            .from('tables')
            .update({ capacity: seatsPerTable })
            .lte('table_number', totalTables);

        showToast('Configuración guardada correctamente', 'success');
        await loadTables();
        updateStats();

    } catch (error) {
        showToast('Error al guardar: ' + error.message, 'error');
    }
}

// Generate unique 4-character code
function generateCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding confusing chars
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Handle create pass
async function handleCreatePass(e) {
    e.preventDefault();
    const supabase = getSupabase();

    const familyName = document.getElementById('family-name').value.trim();
    const guestCount = parseInt(document.getElementById('guest-count').value);
    const tableId = document.getElementById('table-select').value;

    if (!familyName || !tableId) {
        showToast('Por favor completa todos los campos', 'error');
        return;
    }

    try {
        // Generate unique code
        let code = generateCode();
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            const { data } = await supabase
                .from('guest_passes')
                .select('id')
                .eq('access_code', code)
                .single();

            if (!data) {
                isUnique = true;
            } else {
                code = generateCode();
                attempts++;
            }
        }

        // Create pass
        const { data: newPass, error } = await supabase
            .from('guest_passes')
            .insert({
                access_code: code,
                family_name: familyName,
                total_guests: guestCount,
                table_id: tableId,
                created_by: currentUser.id
            })
            .select()
            .single();

        if (error) throw error;

        // Update table occupied seats
        const table = tables.find(t => t.id === tableId);
        await supabase
            .from('tables')
            .update({ occupied_seats: table.occupied_seats + guestCount })
            .eq('id', tableId);

        // Show generated code
        document.getElementById('pass-code').textContent = code;
        document.getElementById('generated-pass').style.display = 'block';

        // Reset form
        document.getElementById('family-name').value = '';
        document.getElementById('guest-count').value = '2';
        document.getElementById('table-select').value = '';

        showToast('Pase creado exitosamente', 'success');

        // Reload data
        await loadTables();
        await loadPasses();
        updateStats();

    } catch (error) {
        showToast('Error al crear pase: ' + error.message, 'error');
    }
}

// Copy code to clipboard
function copyCode() {
    const code = document.getElementById('pass-code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Código copiado al portapapeles', 'success');
    });
}

// Load recent passes table
function loadRecentPasses() {
    const tbody = document.getElementById('recent-passes');
    if (!tbody) return;

    const recent = passes.slice(0, 10);

    tbody.innerHTML = recent.map(pass => {
        const status = getPassStatus(pass);
        const tableNum = pass.tables?.table_number || '-';

        return `
            <tr>
                <td><code>${pass.access_code}</code></td>
                <td>${pass.family_name}</td>
                <td>${pass.total_guests}</td>
                <td>Mesa ${tableNum}</td>
                <td><span class="status-badge ${status.class}">${status.text}</span></td>
                <td>
                    <button class="btn btn-secondary" onclick="copyPassCode('${pass.access_code}')" style="padding: 0.5rem 1rem; font-size: 0.8rem;">
                        📋 Copiar
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Load guests list
function loadGuests() {
    const tbody = document.getElementById('guests-list');
    if (!tbody) return;

    tbody.innerHTML = passes.map(pass => {
        const status = getPassStatus(pass);
        const tableNum = pass.tables?.table_number || '-';
        const confirmedDate = pass.confirmed_at
            ? new Date(pass.confirmed_at).toLocaleDateString('es-MX')
            : '-';
        const creatorName = pass.creator?.first_name || 'Desconocido';
        const creatorRole = pass.creator?.role || 'unknown';

        return `
            <tr data-status="${status.class}" data-family="${pass.family_name.toLowerCase()}" data-id="${pass.id}" data-creator-role="${creatorRole}">
                <td><code>${pass.access_code}</code></td>
                <td>${pass.family_name}</td>
                <td>${pass.total_guests}</td>
                <td>${pass.guests_entered} / ${pass.total_guests}</td>
                <td>Mesa ${tableNum}</td>
                <td><span class="status-badge ${status.class}">${status.text}</span></td>
                <td><span class="creator-badge ${creatorRole}">${creatorName}</span></td>
                <td>${confirmedDate}</td>
                <td class="actions-cell">
                    <button class="btn-icon edit" onclick="editPass('${pass.id}')" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon delete" onclick="deletePass('${pass.id}')" title="Eliminar">
                        🗑️
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Get pass status
function getPassStatus(pass) {
    if (pass.all_entered) {
        return { class: 'complete', text: 'Completo' };
    }
    if (pass.guests_entered > 0) {
        return { class: 'partial', text: 'Parcial' };
    }
    if (pass.confirmed) {
        return { class: 'confirmed', text: 'Confirmado' };
    }
    return { class: 'pending', text: 'Pendiente' };
}

// Filter guests by status
function filterGuests(filter) {
    const rows = document.querySelectorAll('#guests-list tr');

    rows.forEach(row => {
        if (filter === 'all') {
            row.style.display = '';
        } else {
            row.style.display = row.dataset.status === filter ? '' : 'none';
        }
    });
}

// Filter guests by creator
function filterByCreator(creatorRole) {
    const rows = document.querySelectorAll('#guests-list tr');

    rows.forEach(row => {
        if (creatorRole === 'all') {
            row.style.display = '';
        } else {
            row.style.display = row.dataset.creatorRole === creatorRole ? '' : 'none';
        }
    });
}

// Search guests
function searchGuests(query) {
    const rows = document.querySelectorAll('#guests-list tr');
    const q = query.toLowerCase();

    rows.forEach(row => {
        row.style.display = row.dataset.family.includes(q) ? '' : 'none';
    });
}

// Copy pass code
function copyPassCode(code) {
    navigator.clipboard.writeText(code).then(() => {
        showToast('Código copiado', 'success');
    });
}

// Edit pass - show modal
function editPass(passId) {
    const pass = passes.find(p => p.id === passId);
    if (!pass) return;

    // Create or get modal
    let modal = document.getElementById('edit-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'edit-modal';
        modal.className = 'table-modal';
        document.body.appendChild(modal);
    }

    const tableNum = pass.tables?.table_number || '';

    modal.innerHTML = `
        <div class="table-modal-overlay" onclick="closeEditModal()"></div>
        <div class="table-modal-content">
            <button class="table-modal-close" onclick="closeEditModal()">×</button>
            <h2>✏️ Editar Pase</h2>
            <p class="modal-subtitle">Código: <code>${pass.access_code}</code></p>
            
            <form id="edit-pass-form" class="edit-form">
                <input type="hidden" id="edit-pass-id" value="${pass.id}">
                <input type="hidden" id="edit-old-guests" value="${pass.total_guests}">
                <input type="hidden" id="edit-old-table" value="${pass.table_id}">
                
                <div class="form-group">
                    <label>Nombre de la Familia</label>
                    <input type="text" id="edit-family" value="${pass.family_name}" required>
                </div>
                
                <div class="form-group">
                    <label>Número de Invitados</label>
                    <input type="number" id="edit-guests" value="${pass.total_guests}" min="1" max="20" required>
                </div>
                
                <div class="form-group">
                    <label>Mesa</label>
                    <select id="edit-table" required>
                        ${tables.map(t => `
                            <option value="${t.id}" ${t.id === pass.table_id ? 'selected' : ''}>
                                Mesa ${t.table_number} (${t.capacity - t.occupied_seats} disponibles)
                            </option>
                        `).join('')}
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeEditModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">Guardar Cambios</button>
                </div>
            </form>
        </div>
    `;

    modal.classList.add('active');

    // Add form submit handler
    document.getElementById('edit-pass-form').addEventListener('submit', savePassEdit);
}

// Save pass edit
async function savePassEdit(e) {
    e.preventDefault();
    const supabase = getSupabase();

    const passId = document.getElementById('edit-pass-id').value;
    const newFamily = document.getElementById('edit-family').value.trim();
    const newGuests = parseInt(document.getElementById('edit-guests').value);
    const newTableId = document.getElementById('edit-table').value;
    const oldGuests = parseInt(document.getElementById('edit-old-guests').value);
    const oldTableId = document.getElementById('edit-old-table').value;

    try {
        // Update guest pass
        await supabase
            .from('guest_passes')
            .update({
                family_name: newFamily,
                total_guests: newGuests,
                table_id: newTableId
            })
            .eq('id', passId);

        // Update table occupancy if table or guest count changed
        if (newTableId !== oldTableId || newGuests !== oldGuests) {
            // Free old table seats
            if (oldTableId) {
                const oldTable = tables.find(t => t.id === oldTableId);
                if (oldTable) {
                    await supabase
                        .from('tables')
                        .update({ occupied_seats: Math.max(0, oldTable.occupied_seats - oldGuests) })
                        .eq('id', oldTableId);
                }
            }

            // Occupy new table seats
            const newTable = tables.find(t => t.id === newTableId);
            if (newTable) {
                await supabase
                    .from('tables')
                    .update({ occupied_seats: newTable.occupied_seats + newGuests })
                    .eq('id', newTableId);
            }
        }

        closeEditModal();
        showToast('Pase actualizado correctamente', 'success');
        await loadTables();
        await loadPasses();
        updateStats();

    } catch (error) {
        showToast('Error al actualizar: ' + error.message, 'error');
    }
}

// Close edit modal
function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Delete pass
async function deletePass(passId) {
    if (!confirm('¿Estás seguro de eliminar este pase?')) return;
    const supabase = getSupabase();

    try {
        const pass = passes.find(p => p.id === passId);

        // Update table seats
        if (pass && pass.table_id) {
            const table = tables.find(t => t.id === pass.table_id);
            if (table) {
                await supabase
                    .from('tables')
                    .update({ occupied_seats: Math.max(0, table.occupied_seats - pass.total_guests) })
                    .eq('id', pass.table_id);
            }
        }

        await supabase.from('guest_passes').delete().eq('id', passId);

        showToast('Pase eliminado', 'success');
        await loadTables();
        await loadPasses();
        updateStats();

    } catch (error) {
        showToast('Error al eliminar: ' + error.message, 'error');
    }
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
        <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => toast.remove(), 4000);
}

// Show guests for a specific table
function showTableGuests(tableId, tableNumber) {
    // Find guests assigned to this table
    const tableGuests = passes.filter(p => p.table_id === tableId);

    // Create or get modal
    let modal = document.getElementById('table-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'table-modal';
        modal.className = 'table-modal';
        document.body.appendChild(modal);
    }

    // Build guest list
    let guestListHTML = '';
    if (tableGuests.length === 0) {
        guestListHTML = '<p class="no-guests">No hay invitados asignados a esta mesa</p>';
    } else {
        guestListHTML = `
            <div class="table-guest-list">
                ${tableGuests.map(guest => {
            const status = getPassStatus(guest);
            return `
                        <div class="table-guest-item">
                            <div class="guest-info">
                                <strong>${guest.family_name}</strong>
                                <span class="guest-count">${guest.total_guests} persona${guest.total_guests > 1 ? 's' : ''}</span>
                            </div>
                            <div class="guest-status">
                                <span class="status-badge ${status.class}">${status.text}</span>
                                <code>${guest.access_code}</code>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
            <div class="table-summary">
                <p>Total: <strong>${tableGuests.reduce((sum, g) => sum + g.total_guests, 0)}</strong> personas</p>
            </div>
        `;
    }

    modal.innerHTML = `
        <div class="table-modal-overlay" onclick="closeTableModal()"></div>
        <div class="table-modal-content">
            <button class="table-modal-close" onclick="closeTableModal()">×</button>
            <h2>🪑 Mesa ${tableNumber}</h2>
            <p class="modal-subtitle">Invitados asignados</p>
            ${guestListHTML}
        </div>
    `;

    modal.classList.add('active');
}

// Close table modal
function closeTableModal() {
    const modal = document.getElementById('table-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

// Add additional CSS for dashboard elements
const style = document.createElement('style');
style.textContent = `
    .dashboard-section {
        display: none;
    }
    .dashboard-section.active {
        display: block;
    }
    
    .stat-card.clickable {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .stat-card.clickable:hover {
        border-color: var(--primary);
        transform: translateY(-3px);
        box-shadow: 0 5px 20px rgba(184, 134, 11, 0.3);
    }
    
    .tables-visual-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
    }
    
    .table-item {
        background: var(--surface-light);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 1rem;
        text-align: center;
    }
    
    .table-item.full {
        border-color: var(--error);
    }
    
    .table-item.partial {
        border-color: var(--warning);
    }
    
    .table-number {
        font-weight: 600;
        margin-bottom: 0.5rem;
    }
    
    .table-occupancy {
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
    }
    
    .table-bar {
        height: 4px;
        background: var(--surface);
        border-radius: 2px;
        overflow: hidden;
    }
    
    .table-bar-fill {
        height: 100%;
        background: var(--primary);
        transition: width 0.3s ease;
    }
    
    .filter-tabs {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1.5rem;
        flex-wrap: wrap;
    }
    
    .filter-btn {
        background: var(--surface-light);
        border: 1px solid var(--border);
        color: var(--text-muted);
        padding: 0.5rem 1rem;
        border-radius: 25px;
        cursor: pointer;
        font-family: var(--font-body);
        font-size: 0.9rem;
        transition: all 0.3s ease;
    }
    
    .filter-btn:hover,
    .filter-btn.active {
        background: var(--primary);
        border-color: var(--primary);
        color: var(--text);
    }
    
    .search-input {
        background: var(--surface-light);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 0.75rem 1rem;
        color: var(--text);
        font-family: var(--font-body);
        width: 250px;
    }
    
    .search-input:focus {
        outline: none;
        border-color: var(--primary);
    }
    
    .attendance-chart {
        padding: 1rem 0;
    }
    
    .chart-bars {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        height: 150px;
        gap: 2rem;
    }
    
    .chart-bar {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }
    
    .bar-fill {
        width: 60px;
        border-radius: 5px 5px 0 0;
        transition: height 0.5s ease;
    }
    
    .bar-fill.pending { background: var(--warning); }
    .bar-fill.confirmed { background: var(--success); }
    .bar-fill.inside { background: var(--primary); }
    
    .bar-label {
        color: var(--text-muted);
        font-size: 0.85rem;
    }
    
    .bar-value {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text);
    }
    
    code {
        background: var(--surface-light);
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        color: var(--primary);
    }
    
    .nav-logout {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        color: var(--error);
        text-decoration: none;
        border-radius: 10px;
        transition: all 0.3s ease;
        font-size: 0.95rem;
        width: 100%;
        background: transparent;
        border: none;
        cursor: pointer;
        font-family: var(--font-body);
        text-align: left;
    }
    
    .nav-logout:hover {
        background: rgba(231, 76, 60, 0.1);
    }
    
    .nav-logout svg {
        width: 20px;
        height: 20px;
    }
    
    /* Table Modal Styles */
    .table-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .table-modal.active {
        opacity: 1;
        visibility: visible;
    }
    
    .table-modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        backdrop-filter: blur(5px);
    }
    
    .table-modal-content {
        position: relative;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 2rem;
        width: 90%;
        max-width: 450px;
        max-height: 80vh;
        overflow-y: auto;
        transform: translateY(20px);
        transition: transform 0.3s ease;
    }
    
    .table-modal.active .table-modal-content {
        transform: translateY(0);
    }
    
    .table-modal-close {
        position: absolute;
        top: 1rem;
        right: 1.5rem;
        background: none;
        border: none;
        color: var(--text-muted);
        font-size: 2rem;
        cursor: pointer;
        transition: color 0.3s ease;
    }
    
    .table-modal-close:hover {
        color: var(--error);
    }
    
    .table-modal-content h2 {
        font-family: var(--font-display);
        font-size: 1.75rem;
        margin-bottom: 0.25rem;
        color: var(--primary);
    }
    
    .modal-subtitle {
        color: var(--text-muted);
        margin-bottom: 1.5rem;
    }
    
    .table-guest-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .table-guest-item {
        background: var(--surface-light);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .table-guest-item:hover {
        border-color: var(--primary);
    }
    
    .guest-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    .guest-info strong {
        color: var(--text);
    }
    
    .guest-count {
        color: var(--text-muted);
        font-size: 0.85rem;
    }
    
    .guest-status {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.5rem;
    }
    
    .table-summary {
        margin-top: 1.5rem;
        padding-top: 1rem;
        border-top: 1px solid var(--border);
        text-align: center;
        color: var(--text-muted);
    }
    
    .table-summary strong {
        color: var(--primary);
        font-size: 1.25rem;
    }
    
    .no-guests {
        text-align: center;
        color: var(--text-muted);
        padding: 2rem;
        font-style: italic;
    }
    
    .table-item:hover {
        border-color: var(--primary);
        transform: translateY(-2px);
    }
    
    /* Action buttons */
    .actions-cell {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
    }
    
    .btn-icon {
        background: transparent;
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 0.5rem;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 1rem;
    }
    
    .btn-icon.edit:hover {
        border-color: var(--primary);
        background: rgba(184, 134, 11, 0.1);
    }
    
    .btn-icon.delete:hover {
        border-color: var(--error);
        background: rgba(231, 76, 60, 0.1);
    }
    
    /* Edit Form */
    .edit-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }
    
    .edit-form .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    
    .edit-form label {
        color: var(--text-muted);
        font-size: 0.9rem;
    }
    
    .edit-form input,
    .edit-form select {
        background: var(--surface-light);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 0.875rem 1rem;
        color: var(--text);
        font-size: 1rem;
        font-family: var(--font-body);
    }
    
    .edit-form input:focus,
    .edit-form select:focus {
        outline: none;
        border-color: var(--primary);
    }
    
    .form-actions {
        display: flex;
        gap: 1rem;
        justify-content: flex-end;
        margin-top: 1rem;
    }
    
    /* User greeting */
    .user-greeting {
        color: var(--primary);
        font-size: 1.1rem;
        font-weight: 500;
    }
    
    .header-left {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
    
    /* Creator badges */
    .creator-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 500;
    }
    
    .creator-badge.groom {
        background: rgba(52, 152, 219, 0.2);
        color: #3498db;
    }
    
    .creator-badge.bride {
        background: rgba(155, 89, 182, 0.2);
        color: #9b59b6;
    }
    
    .creator-badge.unknown {
        background: var(--surface-light);
        color: var(--text-muted);
    }
    
    /* Filters row */
    .filters-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .creator-filter {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .creator-filter label {
        color: var(--text-muted);
        font-size: 0.9rem;
    }
    
    .creator-filter select {
        background: var(--surface-light);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 0.5rem 1rem;
        color: var(--text);
        font-family: var(--font-body);
        cursor: pointer;
    }
    
    .creator-filter select:focus {
        outline: none;
        border-color: var(--primary);
    }
`;
document.head.appendChild(style);
