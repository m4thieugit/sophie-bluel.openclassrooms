import MainContentManager from './pasb.manager_content.js';

window.addEventListener('DOMContentLoaded', (e) => {
    const mainContentManager = new MainContentManager();
    mainContentManager.showCategories();
    mainContentManager.showWorks();

    let is_connected = localStorage.getItem('is_connected');

    if (!is_connected || is_connected !== 'true') {
        localStorage.setItem('is_connected', 'false');
    } else {
        mainContentManager.displayEditMode();
    }
});