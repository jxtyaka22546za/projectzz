document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault(); 

    const formData = new FormData(this);
    formData.append('role', 'member');  

    try {
        const response = await fetch('register_api.php', { 
            method: 'POST',
            body: formData
        });

        if (response.redirected) {
            window.location.href = response.url;
            return;
        }

        const result = await response.text();
        if (result.includes("สำเร็จ")) {
            alert("สมัครสมาชิกสำเร็จ!");
            window.location.href = 'login_api.php';
        }
    } catch (error) {
        console.error('Error:', error);
    }
});