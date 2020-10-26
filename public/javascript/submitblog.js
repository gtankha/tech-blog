// Submits new blog 

async function submitAddBlogHandler() {
   

    const title = document.querySelector('textarea[name="blog-title"]').value.trim();
    const content = document.querySelector('textarea[name="blog-body"]').value.trim();

    if (title && content)
{


    const response = await fetch('/api/blogs', {
        method: 'POST',
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

document.querySelector('.blogadd-form').addEventListener('submit', submitAddBlogHandler);