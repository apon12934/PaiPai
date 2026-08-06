// Main Application Controller & UI Module
import { 
    subscribeAuthState, 
    getCurrentUser, 
    loginWithGoogle, 
    signUpWithEmail, 
    loginWithEmail, 
    linkGoogleAccount, 
    linkEmailAccount, 
    getLinkedProviders, 
    logoutUser 
} from './auth.js';
import { 
    setupCloudSync, 
    onDatabaseChange, 
    saveDbData, 
    loadLocalData 
} from './db.js';

let dbState = {};
let currentSelectedPerson = null;
let editingTxId = null;

// DOM Elements
const panelLeft = document.getElementById('panel-left');
const panelMain = document.getElementById('panel-main');
const panelRight = document.getElementById('panel-right');
const resizerLeft = document.getElementById('resizer-left');
const resizerRight = document.getElementById('resizer-right');
const peopleList = document.getElementById('people-list');
const emptyState = document.getElementById('empty-state');
const currentPersonNameEl = document.getElementById('current-person-name');
const balanceCard = document.getElementById('balance-card');
const balanceLabel = document.getElementById('balance-label');
const balanceAmount = document.getElementById('balance-amount');
const txHistory = document.getElementById('tx-history');
const grandTotalContainer = document.getElementById('grand-total-container');
const grandTotalLabel = document.getElementById('grand-total-label');
const grandTotalAmount = document.getElementById('grand-total-amount');

// Auth DOM Elements
const authModal = document.getElementById('auth-modal');
const authTitle = document.getElementById('auth-title');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const authError = document.getElementById('auth-error');
const authEmailInput = document.getElementById('auth-email');
const authPassInput = document.getElementById('auth-password');
const googleAuthBtn = document.getElementById('google-auth-btn');
const toggleAuthModeBtn = document.getElementById('toggle-auth-mode');
const userProfileBar = document.getElementById('user-profile-bar');
const userAvatar = document.getElementById('user-avatar');
const userNameEl = document.getElementById('user-name');
const userEmailEl = document.getElementById('user-email');
const accountLinkBtn = document.getElementById('account-link-btn');
const logoutBtn = document.getElementById('logout-btn');
const openLoginBtn = document.getElementById('open-login-btn');
const accountLinkModal = document.getElementById('account-link-modal');

let isSignUpMode = false;

// Initialize Resizers
function initResizers() {
    let isResizingLeft = false, isResizingRight = false;
    resizerLeft.addEventListener('mousedown', () => { 
        isResizingLeft = true; 
        resizerLeft.classList.add('active'); 
        document.body.classList.add('no-select'); 
        document.body.style.cursor = 'col-resize'; 
    });
    resizerRight.addEventListener('mousedown', () => { 
        isResizingRight = true; 
        resizerRight.classList.add('active'); 
        document.body.classList.add('no-select'); 
        document.body.style.cursor = 'col-resize'; 
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isResizingLeft) {
            const newWidth = e.clientX - panelLeft.getBoundingClientRect().left;
            if (newWidth > 200 && newWidth < 500) panelLeft.style.width = `${newWidth}px`;
        }
        if (isResizingRight) {
            const newWidth = document.getElementById('app-container').getBoundingClientRect().right - e.clientX;
            if (newWidth > 250 && newWidth < 600) panelRight.style.width = `${newWidth}px`;
        }
    });
    document.addEventListener('mouseup', () => {
        isResizingLeft = isResizingRight = false;
        resizerLeft.classList.remove('active'); 
        resizerRight.classList.remove('active');
        document.body.classList.remove('no-select'); 
        document.body.style.cursor = 'default';
    });
}

// Calculate & Update Grand Total
function updateGrandTotal() {
    let overallTotalGave = 0, overallTotalReceived = 0;
    for (const person in dbState) {
        dbState[person].forEach(tx => {
            if (tx.type === 'gave') overallTotalGave += tx.amount;
            if (tx.type === 'received') overallTotalReceived += tx.amount;
        });
    }
    const grandTotal = overallTotalGave - overallTotalReceived;
    grandTotalContainer.className = 'p-4 rounded-lg mb-4 border text-center transition-colors';
    
    if (grandTotal > 0) {
        grandTotalContainer.classList.add('bg-green-50', 'border-green-200', 'text-green-800');
        grandTotalLabel.innerText = "Total Everyone Owes You";
        grandTotalAmount.innerText = `৳${grandTotal.toFixed(2)}`;
    } else if (grandTotal < 0) {
        grandTotalContainer.classList.add('bg-red-50', 'border-red-200', 'text-red-800');
        grandTotalLabel.innerText = "Total You Owe Overall";
        grandTotalAmount.innerText = `৳${Math.abs(grandTotal).toFixed(2)}`;
    } else {
        grandTotalContainer.classList.add('bg-gray-50', 'border-gray-200', 'text-gray-800');
        grandTotalLabel.innerText = "Overall Net Balance";
        grandTotalAmount.innerText = "৳0.00";
    }
}

// Render Sidebar People List
function renderPeopleList() {
    peopleList.innerHTML = '';
    const people = Object.keys(dbState).sort();
    if (people.length === 0) {
        peopleList.innerHTML = '<li class="text-sm text-gray-400 italic p-2">No people added yet.</li>';
        updateGrandTotal(); 
        return;
    }
    people.forEach(person => {
        const li = document.createElement('li');
        const isSelected = person === currentSelectedPerson;
        let totalGave = 0, totalReceived = 0;
        dbState[person].forEach(tx => {
            if (tx.type === 'gave') totalGave += tx.amount;
            if (tx.type === 'received') totalReceived += tx.amount;
        });
        const balance = totalGave - totalReceived;
        let indicator = balance > 0 ? `<span class="text-xs text-green-600 font-bold">+৳${balance.toFixed(2)}</span>` : 
                        balance < 0 ? `<span class="text-xs text-red-500 font-bold">-৳${Math.abs(balance).toFixed(2)}</span>` : 
                        `<span class="text-xs text-gray-400">Settled</span>`;
        li.className = `cursor-pointer p-3 rounded-lg flex justify-between items-center transition-all ${isSelected ? 'bg-slate-800 text-white shadow-md' : 'hover:bg-gray-100 text-gray-700'}`;
        li.innerHTML = `<span class="font-medium text-sm truncate pr-2">${person}</span><div class="${isSelected && balance > 0 ? 'text-green-300' : (isSelected && balance < 0 ? 'text-red-300' : '')}">${indicator}</div>`;
        li.onclick = () => selectPerson(person);
        peopleList.appendChild(li);
    });
    updateGrandTotal();
}

// Select a Person
function selectPerson(person) {
    currentSelectedPerson = person;
    cancelEdit(); 
    renderPeopleList();
    panelMain.classList.remove('hidden'); 
    panelRight.classList.remove('hidden'); 
    resizerRight.classList.remove('hidden'); 
    resizerLeft.classList.remove('hidden'); 
    emptyState.classList.add('hidden');
    currentPersonNameEl.innerText = person; 
    renderDashboard();
    document.getElementById('tx-amount').focus();
}

// Render Dashboard Pane & History
function renderDashboard() {
    if (!currentSelectedPerson || !dbState[currentSelectedPerson]) return;
    const txs = dbState[currentSelectedPerson];
    let totalGave = 0, totalReceived = 0;
    txHistory.innerHTML = '';

    if (txs.length === 0) {
        txHistory.innerHTML = '<div class="text-center p-8 text-gray-400 text-sm">No history yet.</div>';
    } else {
        [...txs].reverse().forEach(tx => {
            if (tx.type === 'gave') totalGave += tx.amount;
            if (tx.type === 'received') totalReceived += tx.amount;
            const dateObj = new Date(tx.date);
            const isGave = tx.type === 'gave';
            const isEditing = tx.id === editingTxId;
            const div = document.createElement('div');
            div.className = `flex flex-col p-4 border rounded-xl shadow-sm transition-all ${isEditing ? 'border-slate-500 bg-slate-50' : 'bg-white border-gray-100 hover:border-gray-300'}`;
            div.innerHTML = `
                <div class="flex justify-between items-start mb-2">
                    <div>
                        <p class="font-semibold text-sm ${isGave ? 'text-red-600' : 'text-green-600'}">${isGave ? 'You gave them' : 'They paid you'}</p>
                        <p class="text-xs text-gray-400 mt-0.5">${dateObj.toLocaleDateString()}</p>
                    </div>
                    <span class="font-bold text-lg ${isGave ? 'text-red-600' : 'text-green-600'}">৳${tx.amount.toFixed(2)}</span>
                </div>
                ${tx.note ? `<p class="text-sm text-gray-600 bg-gray-50 p-2 rounded-md mb-3 border border-gray-100">${tx.note}</p>` : ''}
                <div class="flex justify-end gap-2 mt-auto border-t border-gray-50 pt-2">
                    <button onclick="window.editTx('${tx.id}')" class="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg> Edit</button>
                    <span class="text-gray-200">|</span>
                    <button onclick="window.deleteTx('${tx.id}')" class="text-xs text-red-400 hover:text-red-600 flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg> Delete</button>
                </div>`;
            txHistory.appendChild(div);
        });
    }

    const netBalance = totalGave - totalReceived;
    balanceCard.className = 'p-6 rounded-xl mb-8 text-center border shadow-sm transition-colors';
    if (netBalance > 0) { balanceCard.classList.add('bg-green-50', 'border-green-200', 'text-green-800'); balanceLabel.innerText = "They Owe You"; balanceAmount.innerText = `৳${netBalance.toFixed(2)}`; }
    else if (netBalance < 0) { balanceCard.classList.add('bg-red-50', 'border-red-200', 'text-red-800'); balanceLabel.innerText = "You Owe Them"; balanceAmount.innerText = `৳${Math.abs(netBalance).toFixed(2)}`; }
    else { balanceCard.classList.add('bg-white', 'border-gray-200', 'text-gray-800'); balanceLabel.innerText = "All Settled Up"; balanceAmount.innerText = "৳0.00"; }
}

// Transaction Processing
window.processTx = function(type) {
    const amountInput = document.getElementById('tx-amount');
    const noteInput = document.getElementById('tx-note');
    const amount = parseFloat(amountInput.value);
    const note = noteInput.value.trim();

    if (!currentSelectedPerson || isNaN(amount) || amount <= 0) { amountInput.focus(); return; }

    if (!dbState[currentSelectedPerson]) dbState[currentSelectedPerson] = [];

    if (editingTxId) {
        const txIndex = dbState[currentSelectedPerson].findIndex(t => t.id === editingTxId);
        if (txIndex !== -1) { 
            dbState[currentSelectedPerson][txIndex].amount = amount; 
            dbState[currentSelectedPerson][txIndex].type = type; 
            dbState[currentSelectedPerson][txIndex].note = note; 
        }
    } else {
        dbState[currentSelectedPerson].push({ id: Date.now().toString(), date: new Date().toISOString(), amount: amount, type: type, note: note });
    }
    
    saveDbData(getCurrentUser(), dbState); 
    cancelEdit(); 
    renderDashboard(); 
    renderPeopleList();
};

window.editTx = function(id) {
    const tx = dbState[currentSelectedPerson].find(t => t.id === id);
    if (tx) {
        editingTxId = id;
        document.getElementById('tx-amount').value = tx.amount; 
        document.getElementById('tx-note').value = tx.note;
        document.getElementById('form-title').innerText = "Edit Transaction"; 
        document.getElementById('form-title').classList.add('text-blue-600'); 
        document.getElementById('cancel-edit-btn').classList.remove('hidden');
        document.getElementById('tx-amount').focus(); 
        renderDashboard();
    }
};

window.cancelEdit = function() {
    editingTxId = null;
    document.getElementById('tx-amount').value = ''; 
    document.getElementById('tx-note').value = '';
    document.getElementById('form-title').innerText = "Log Transaction"; 
    document.getElementById('form-title').classList.remove('text-blue-600'); 
    document.getElementById('cancel-edit-btn').classList.add('hidden');
    if (currentSelectedPerson) { renderDashboard(); document.getElementById('tx-amount').focus(); }
};

window.deleteTx = function(id) {
    if (confirm("Delete this transaction?")) {
        dbState[currentSelectedPerson] = dbState[currentSelectedPerson].filter(tx => tx.id !== id);
        if (editingTxId === id) cancelEdit();
        saveDbData(getCurrentUser(), dbState); 
        renderDashboard(); 
        renderPeopleList();
    }
};

window.deletePerson = function() {
    if (confirm(`Delete ${currentSelectedPerson} and all their history?`)) {
        delete dbState[currentSelectedPerson]; 
        saveDbData(getCurrentUser(), dbState); 
        currentSelectedPerson = null;
        panelMain.classList.add('hidden'); 
        panelRight.classList.add('hidden'); 
        resizerRight.classList.add('hidden'); 
        resizerLeft.classList.add('hidden'); 
        emptyState.classList.remove('hidden');
        renderPeopleList();
    }
};

// Export Data
window.exportData = function() {
    if (Object.keys(dbState).length === 0) {
        alert("You don't have any data to export yet!");
        return;
    }
    const dataStr = JSON.stringify(dbState, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `paipai-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

// Import Data
window.importData = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (typeof importedData === 'object' && importedData !== null) {
                dbState = importedData;
                saveDbData(getCurrentUser(), dbState);
                currentSelectedPerson = null;
                emptyState.classList.remove('hidden');
                panelMain.classList.add('hidden');
                panelRight.classList.add('hidden');
                resizerLeft.classList.add('hidden');
                resizerRight.classList.add('hidden');
                renderPeopleList();
                alert("PaiPai backup restored successfully!");
            } else {
                throw new Error("Invalid format");
            }
        } catch (err) {
            alert("Invalid backup file. Please make sure you selected a valid JSON file generated by PaiPai.");
        }
    };
    reader.readAsText(file);
    event.target.value = '';
};

// Authentication Modal UI Handlers
function openAuthModal(signup = false) {
    isSignUpMode = signup;
    authError.classList.add('hidden');
    authEmailInput.value = '';
    authPassInput.value = '';
    if (isSignUpMode) {
        authTitle.innerText = "Create PaiPai Account";
        authSubmitBtn.innerText = "Sign Up";
        toggleAuthModeBtn.innerText = "Already have an account? Log In";
    } else {
        authTitle.innerText = "Log In to PaiPai";
        authSubmitBtn.innerText = "Log In";
        toggleAuthModeBtn.innerText = "Don't have an account? Sign Up";
    }
    authModal.classList.remove('hidden');
}

function closeAuthModal() {
    authModal.classList.add('hidden');
}

// Account Linking Modal UI Handler
function openAccountLinkModal() {
    const user = getCurrentUser();
    if (!user) return;
    const { hasGoogle, hasEmail } = getLinkedProviders(user);
    
    document.getElementById('link-google-status').innerText = hasGoogle ? "Linked ✓" : "Not Linked";
    document.getElementById('link-email-status').innerText = hasEmail ? "Linked ✓" : "Not Linked";
    
    const linkGoogleActionBtn = document.getElementById('link-google-action-btn');
    const linkEmailForm = document.getElementById('link-email-form');

    if (hasGoogle) {
        linkGoogleActionBtn.innerText = "Linked";
        linkGoogleActionBtn.disabled = true;
        linkGoogleActionBtn.className = "bg-gray-200 text-gray-500 text-xs px-3 py-1.5 rounded cursor-not-allowed font-medium";
    } else {
        linkGoogleActionBtn.innerText = "Link Google";
        linkGoogleActionBtn.disabled = false;
        linkGoogleActionBtn.className = "bg-slate-800 hover:bg-slate-700 text-white text-xs px-3 py-1.5 rounded transition font-medium";
    }

    if (hasEmail) {
        linkEmailForm.classList.add('hidden');
    } else {
        linkEmailForm.classList.remove('hidden');
    }

    accountLinkModal.classList.remove('hidden');
}

function closeAccountLinkModal() {
    accountLinkModal.classList.add('hidden');
}

// Setup Event Listeners
function setupEventListeners() {
    // Form Keydowns
    document.getElementById('tx-form').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            if (e.shiftKey) window.processTx('received'); 
            else window.processTx('gave'); 
        }
    });

    // Add Person Form
    document.getElementById('add-person-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('new-person-name'); 
        const name = input.value.trim();
        if (name && !dbState[name]) { 
            dbState[name] = []; 
            saveDbData(getCurrentUser(), dbState); 
            input.value = ''; 
            selectPerson(name); 
        } else if (dbState[name]) {
            alert("This person already exists!");
        }
    });

    // Auth Buttons
    openLoginBtn.addEventListener('click', () => openAuthModal(false));
    document.getElementById('close-auth-modal-btn').addEventListener('click', closeAuthModal);
    toggleAuthModeBtn.addEventListener('click', () => openAuthModal(!isSignUpMode));

    // Auth Form Submission
    document.getElementById('auth-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        authError.classList.add('hidden');
        const email = authEmailInput.value.trim();
        const password = authPassInput.value;

        let res;
        if (isSignUpMode) {
            res = await signUpWithEmail(email, password);
        } else {
            res = await loginWithEmail(email, password);
        }

        if (res.success) {
            closeAuthModal();
        } else {
            authError.innerText = res.error || "Authentication failed.";
            authError.classList.remove('hidden');
        }
    });

    // Google Auth Button
    googleAuthBtn.addEventListener('click', async () => {
        authError.classList.add('hidden');
        const res = await loginWithGoogle();
        if (res.success) {
            closeAuthModal();
        } else {
            authError.innerText = res.error || "Google login failed.";
            authError.classList.remove('hidden');
        }
    });

    // Account Link Buttons
    accountLinkBtn.addEventListener('click', openAccountLinkModal);
    document.getElementById('close-link-modal-btn').addEventListener('click', closeAccountLinkModal);

    document.getElementById('link-google-action-btn').addEventListener('click', async () => {
        const res = await linkGoogleAccount();
        if (res.success) {
            alert("Google account linked successfully!");
            openAccountLinkModal();
        } else {
            alert("Linking failed: " + res.error);
        }
    });

    document.getElementById('link-email-submit-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('link-email-input').value.trim();
        const pass = document.getElementById('link-pass-input').value;
        const res = await linkEmailAccount(email, pass);
        if (res.success) {
            alert("Email/Password linked successfully!");
            openAccountLinkModal();
        } else {
            alert("Linking failed: " + res.error);
        }
    });

    // Logout
    logoutBtn.addEventListener('click', async () => {
        await logoutUser();
        closeAccountLinkModal();
    });
}

// Observe Auth State & Update UI
subscribeAuthState((user) => {
    if (user) {
        openLoginBtn.classList.add('hidden');
        userProfileBar.classList.remove('hidden');
        userNameEl.innerText = user.displayName || user.email.split('@')[0];
        userEmailEl.innerText = user.email || "No email";
        userAvatar.innerText = (user.displayName || user.email || 'U')[0].toUpperCase();
        
        // Connect Firestore Real-Time Listener
        setupCloudSync(user, (err) => {
            console.warn("Using local cache due to cloud sync issue:", err);
        });
    } else {
        openLoginBtn.classList.remove('hidden');
        userProfileBar.classList.add('hidden');
        
        // Use LocalStorage DB when logged out
        setupCloudSync(null);
    }
});

// Observe Database Changes & Re-render
onDatabaseChange((data) => {
    dbState = data || {};
    renderPeopleList();
    if (currentSelectedPerson && dbState[currentSelectedPerson]) {
        renderDashboard();
    } else if (currentSelectedPerson && !dbState[currentSelectedPerson]) {
        currentSelectedPerson = null;
        panelMain.classList.add('hidden'); 
        panelRight.classList.add('hidden'); 
        resizerRight.classList.add('hidden'); 
        resizerLeft.classList.add('hidden'); 
        emptyState.classList.remove('hidden');
    }
});

// App Initialization
initResizers();
setupEventListeners();
loadLocalData();
