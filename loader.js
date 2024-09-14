document.addEventListener('DOMContentLoaded', function() {
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Hide the loading overlay after a short delay to ensure everything is fully loaded
    setTimeout(function() {
        loadingOverlay.style.opacity = '0';
        setTimeout(function() {
            loadingOverlay.style.display = 'none';
        }, 300); // Match the transition duration in CSS
    }, 500); // Adjust the delay as needed
});