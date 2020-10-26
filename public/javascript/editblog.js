function editBlogHandler() {

    const blog_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
      ];

    console.log('I am at add blog handler');
       document.location.replace('/dashboard/editblog/'+ blog_id);
    }
    
    
    document.querySelector('#editblog').addEventListener('click', editBlogHandler);  