
function addBlogHandler() {
console.log('I am at add blog handler');
   document.location.replace('/dashboard/addblog');
}


document.querySelector('#addblog').addEventListener('click', addBlogHandler);   
