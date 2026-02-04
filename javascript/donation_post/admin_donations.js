async function loadDonations() {
    try {
        const response = await fetch('Backend/donat/get_donations.php'); 
        if (!response.ok) throw new Error('ไม่สามารถโหลดข้อมูลได้');
        
        const data = await response.json();
        const tableBody = document.getElementById('donationTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = ''; 

        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">ยังไม่มีข้อมูลการบริจาค</td></tr>';
            return;
        }

        data.forEach(item => {
            const rawStatus = item.status ? item.status.trim() : '';
            const isPending = (rawStatus === 'รอดำเนินการ' || rawStatus === 'Pending' || rawStatus === '');
            
            let actionButtons = '';
            const displayStatus = isPending ? 'รอดำเนินการ' : rawStatus;

            if (isPending) {
                actionButtons = `
                    <button class="btn btn-sm btn-success me-1" onclick="updateDonationStatus(${item.id}, 'รับของแล้ว')">รับของ</button>
                    <button class="btn btn-sm btn-danger" onclick="updateDonationStatus(${item.id}, 'ไม่รับสิ่งของ')">ปฏิเสธ</button>
                `;
            } else {
                const isSuccess = rawStatus === 'รับของแล้ว';
                const colorClass = isSuccess ? 'text-success' : 'text-danger';
                const icon = isSuccess ? '✅' : '❌'; 
                actionButtons = `<span class="${colorClass}">${icon} ${displayStatus}</span>`;
            }

            const row = `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.item_name || item.item_type || '-'}</td>
                    <td>${item.donor_name || 'ไม่ระบุชื่อ'}</td>
                    <td>${item.created_at || item.donated_at || '-'}</td>
                    <td><span class="badge ${getStatusBadge(displayStatus)}">${displayStatus}</span></td>
                    <td>${actionButtons}</td>
                </tr>
            `;
            tableBody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error('Error:', error);
        const tableBody = document.getElementById('donationTableBody');
        if (tableBody) tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล</td></tr>';
    }
}

async function updateDonationStatus(id, newStatus) {
    if (!confirm(`ยืนยันการเปลี่ยนสถานะเป็น "${newStatus}"?`)) return;

    try {
        const response = await fetch('Backend/donat/update_donation_status.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id, status: newStatus })
        });

        const result = await response.json();
        if (response.ok) {
            alert("อัปเดตสถานะเรียบร้อย");
            loadDonations();
        } else {
            alert("Error: " + (result.error || 'ไม่สามารถอัปเดตได้'));
        }
    } catch (error) {
        alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ (โปรดเช็ค Path ของไฟล์ PHP)");
    }
}

function getStatusBadge(status) {
    if (status === 'รับของแล้ว' || status === 'ดำเนินการแล้ว') return 'bg-success text-white';
    if (status === 'ไม่รับสิ่งของ') return 'bg-danger text-white';
    if (status === 'รอดำเนินการ' || status === 'Pending') return 'bg-warning text-dark';
    return 'bg-secondary text-white';
}

document.addEventListener('DOMContentLoaded', function() {
    loadDonations();

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (confirm('คุณต้องการออกจากระบบเจ้าหน้าที่ใช่หรือไม่?')) {
                fetch('Backend/logout.php') 
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
});