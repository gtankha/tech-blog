// Redirects to a webpage to edit blog once the edit button is clicked
function editBlogHandler() {

    const blog_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];

       document.location.replace('/dashboard/editblog/'+ blog_id);
    }
    
    
    document.querySelector('#editblog').addEventListener('click', editBlogHandler);  