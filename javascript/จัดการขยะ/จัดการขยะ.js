async function loadReports() {
    try {
        const response = await fetch('Backend/manage_waste/manage_trash_api.php'); 
        if (!response.ok) throw new Error('Network response was not ok');
        
        const data = await response.json();
        renderTable(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        const tableBody = document.querySelector('#reportTableBody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">เกิดข้อผิดพลาดในการโหลดข้อมูล (เช็ค Console)</td></tr>';
        }
    }
}

function renderTable(data) {
    const tableBody = document.querySelector('#reportTableBody');
    if (!tableBody) return;
    tableBody.innerHTML = ''; 

    if (!data || data.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">ไม่พบข้อมูลรายการแจ้งเก็บขยะ</td></tr>';
        return;
    }

    data.forEach(item => {

        const isPending = (item.status === 'Pending' || item.status === 'รอดำเนินการ' || !item.status);
        
        const actionButton = isPending 
            ? `<button class="btn btn-sm btn-primary" onclick="updateTrashStatus(${item.id})">จัดการ</button>` 
            : `<span class="text-success">✅ เรียบร้อย</span>`;

        const row = `   
            <tr>
                <td>${item.id}</td>
                <td>${item.topic}</td>
                <td>${item.name_or_alias || '-'}</td>
                <td>${item.address}</td>
                <td>${item.details || '-'}</td>
                <td>
                    <span class="badge ${getStatusClass(item.status)}">${item.status || 'Pending'}</span>
                </td>
                <td>${item.reported_at}</td>
                <td>${actionButton}</td> 
            </tr>
        `;
        tableBody.insertAdjacentHTML('beforeend', row);
    });
}

async function updateTrashStatus(id) {
    if (!confirm('ยืนยันว่าดำเนินการเรียบร้อยแล้วใช่หรือไม่?')) return;

    try {
        const response = await fetch('Backend/manage_waste/update_status.php', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                id: id, 
                status: 'ดำเนินการเรียบร้อยแล้ว' 
            })
        });

        const result = await response.json();
        if (response.ok) {
            alert('อัปเดตสถานะสำเร็จ');
            loadReports();
        } else {
            alert('Error: ' + (result.error || 'ไม่สามารถอัปเดตได้'));
        }
    } catch (error) {
        console.error('Update Error:', error);
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อ (โปรดเช็ค Path ของไฟล์ PHP)');
    }
}

function getStatusClass(status) {
    if (status === 'Pending' || status === 'รอดำเนินการ' || !status) return 'bg-warning text-dark';
    if (status === 'ดำเนินการเรียบร้อยแล้ว' || status === 'Resolved') return 'bg-success text-white';
    return 'bg-secondary text-white';
}

document.addEventListener('DOMContentLoaded', function() {
    loadReports();

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