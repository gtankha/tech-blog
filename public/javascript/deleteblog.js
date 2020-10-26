async function deleteBlogHandler() {


    const blog_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    if (blog_id) {

        const response = await fetch('/api/blogs/'+blog_id, {
            method: 'DELETE',
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

document.querySelector('#deleteblog').addEventListener('click', deleteBlogHandler);