document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.brands-dropdown-toggle').forEach(trigger => {
        trigger.addEventListener('click', function() {
            document.querySelectorAll('.brands-nav-link-dropdown').forEach(target => target.classList.add('move-to-top'));
        });
    });
    document.querySelectorAll('.brands-nav-link-within').forEach(trigger => {
        trigger.addEventListener('click', function() {
            document.querySelectorAll('.brands-nav-link-dropdown').forEach(target => target.classList.remove('move-to-top'));
        });
    });
    document.querySelectorAll('.popover-background-overlay').forEach(trigger => {
        trigger.addEventListener('click', function() {
            document.querySelectorAll('.brands-nav-link-dropdown').forEach(target => target.classList.remove('move-to-top'));
        });
    });
    document.querySelectorAll('.login-dropdown-toggle').forEach(trigger => {
        trigger.addEventListener('click', function() {
            document.querySelectorAll('.login-nav-link-dropdown').forEach(target => target.classList.add('move-to-top'));
        });
    });

    document.querySelectorAll('.login-nav-link-within').forEach(trigger => {
        trigger.addEventListener('click', function() {
            document.querySelectorAll('.login-nav-link-dropdown').forEach(target => target.classList.remove('move-to-top'));
        });
    });

    document.querySelectorAll('.popover-background-overlay').forEach(trigger => {
        trigger.addEventListener('click', function() {
            document.querySelectorAll('.login-nav-link-dropdown').forEach(target => target.classList.remove('move-to-top'));
        });
    });
});

localStorage.setItem('locat', location.href);