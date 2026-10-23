// Tab Switcher Logic
function switchTab(tabId) {
    // Hide all tab sections
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.add('hidden');
    });

    // Remove active styles from buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('bg-brand-gold', 'text-brand-dark');
        btn.classList.add('text-white');
    });

    // Show selected section
    const activeSection = document.getElementById(`section-${tabId}`);
    if (activeSection) {
        activeSection.classList.remove('hidden');
    }

    // Highlight active button
    const activeBtn = document.getElementById(`tab-${tabId}`);
    if (activeBtn) {
        activeBtn.classList.add('bg-brand-gold', 'text-brand-dark');
    }
}
