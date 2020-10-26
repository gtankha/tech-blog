// this function will redirect to a webpage to add a blog once button is clicked

function addBlogHandler() {
   document.location.replace('/dashboard/addblog');
}


document.querySelector('#addblog').addEventListener('click', addBlogHandler);   
