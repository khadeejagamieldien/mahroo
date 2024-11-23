document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    

    setTimeout(function() {
        loadingOverlay.style.opacity = '0';
        setTimeout(function() {
            loadingOverlay.style.display = 'none';
        }, 300); 
    }, 500); 
});
