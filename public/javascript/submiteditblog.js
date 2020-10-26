async function submitEditBlogHandler() {


    const title = document.querySelector('textarea[name="blog-title"]').value.trim();
    const content = document.querySelector('textarea[name="blog-body"]').value.trim();
    const blog_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    if (title && content) {


        const response = await fetch('/api/blogs/'+blog_id, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                content
            }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.blogedit-form').addEventListener('submit', submitEditBlogHandler);