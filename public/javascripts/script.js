document.addEventListener(
    'DOMContentLoaded',
    () => {
        console.log('IronGenerator JS imported successfully!');
    },
    false
);

// Select all elements with data-toggle="popover" in the document
$('[data-toggle="popover"]').popover();

// Select a specified element
$('#myPopover').popover();
