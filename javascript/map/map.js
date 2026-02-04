   const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (confirm('คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?')) {
                fetch('Backend/Dashboard สะสมแต้ม/logout.php')
                    .then(() => {
                        localStorage.clear();
                        sessionStorage.clear();

                        alert('ออกจากระบบเรียบร้อย✅');

                        window.location.replace('index.html');
                    })
                    .catch(error => {
                        console.error('Logout Error:', error);
                        localStorage.clear();
                        window.location.replace('index.html');
                    });
            }
        });
    }