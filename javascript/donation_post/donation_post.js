document.addEventListener('DOMContentLoaded', function() {
    const donationForm = document.getElementById('donationForm');

    if (donationForm) {
        donationForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'กำลังส่งข้อมูล...';

            const formData = new FormData(this);

            try {
                const response = await fetch('Backend/donat/insert_donation.php', {
                    method: 'POST',
                    body: formData 
                });
                
                const result = await response.json();

                if (response.ok) {
                    alert('✅ ' + result.message);
                    this.reset();
                } else {
                    throw new Error(result.error || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('❌ ' + (error.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้'));
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
        });
    }

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

    const menuToggle = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});