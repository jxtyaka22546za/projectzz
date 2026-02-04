document.querySelector('.login-btn').addEventListener('click', async function(e) {
    e.preventDefault();

    const identifier = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');

    errorDiv.innerText = '';

    if (!identifier || !password) {
        errorDiv.innerText = 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน';
        return;
    }

    const formData = new FormData();
    formData.append('identifier', identifier);
    formData.append('password', password);

    try {
        const response = await fetch('login_api.php', {
            method: 'POST',
            body: formData
        });     
        if (response.redirected) {
            window.location.href = response.url;
        } else {
            const text = await response.text();
            if (text.includes("ไม่ถูกต้อง")) {
                errorDiv.innerText = 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
            }
        }
    } catch (error) {
        console.error('Error:', error);
        errorDiv.innerText = 'ไม่สามารถเชื่อมต่อระบบได้ในขณะนี้';
    }
});
