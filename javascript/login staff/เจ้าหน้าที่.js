function toggleSidebar() { 
    const sidebar = document.querySelector('.sidebar'); 
    const appContainer = document.querySelector('.app-container'); 
    const hamburgerToggle = document.querySelector('.hamburger-toggle'); 
    
    if (sidebar && appContainer && hamburgerToggle) { 
        sidebar.classList.toggle('is-open'); 
        appContainer.classList.toggle('menu-open'); 
        hamburgerToggle.classList.toggle('is-active'); 
        
        document.body.style.overflow = appContainer.classList.contains('menu-open') ? 'hidden' : ''; 
    } 
}

function closeSidebar() { 
    const sidebar = document.querySelector('.sidebar'); 
    const appContainer = document.querySelector('.app-container'); 
    const hamburgerToggle = document.querySelector('.hamburger-toggle'); 

    if (sidebar && sidebar.classList.contains('is-open')) { 
        sidebar.classList.remove('is-open'); 
        appContainer.classList.remove('menu-open'); 
        hamburgerToggle.classList.remove('is-active');
        document.body.style.overflow = '';
    } 
}


async function updateStatus(reportId, newStatus) { 
    if (!confirm(`ยืนยันการเปลี่ยนสถานะของรายงาน ID: ${reportId} เป็น "${newStatus}" หรือไม่?`)) { 
        return; 
    } 
    
    try { 
        const response = await fetch('update_status.php', {

            method: 'POST', 
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({ id: reportId, status: newStatus }) 
        }); 

        const result = await response.json(); 
        
        if (response.ok) { 
            alert('อัปเดตสถานะสำเร็จ!'); 
            fetchReports(); 
        } else { 
            alert('อัปเดตสถานะล้มเหลว: ' + (result.error || result.message || `HTTP Error ${response.status}`)); 
        } 
    } catch (error) { 
        console.error('Fetch Error:', error); 
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อเพื่ออัปเดตสถานะ'); 
    } 
}

function renderTable(reports) { 
    const tableBody = document.getElementById('reports_table_body'); 
    if (!tableBody) { 
        console.error("Element with ID 'reports_table_body' not found."); 
        return; 
    } 
    
    let htmlContent = '';

    if (reports.length === 0) { 
        htmlContent = '<tr><td colspan="8">ยังไม่มีรายงานเข้ามา</td></tr>'; 
    } else { 
        reports.forEach(report => { 
            const reportedDate = new Date(report.reported_at).toLocaleString('th-TH');
            htmlContent += `
                <tr>
                    <td>${report.id}</td>
                    <td>${report.topic}</td>
                    <td>${report.name_or_alias || '-'}</td>
                    <td>${report.address}</td>
                    <td>${report.details ? report.details.substring(0, 40) + (report.details.length > 40 ? '...' : '') : '-'}</td>
                    <td>
                        <img src="${report.image_url || 'no_image.png'}" alt="Report Image" style="width: 50px; height: 50px; object-fit: cover;">
                    </td>
                    <td>
                        <select data-report-id="${report.id}" onchange="updateStatus(this.dataset.reportId, this.value)">
                            <option value="Pending" ${report.status === 'Pending' ? 'selected' : ''}>รอดำเนินการ</option>
                            <option value="In Progress" ${report.status === 'In Progress' ? 'selected' : ''}>กำลังดำเนินการ</option>
                            <option value="Resolved" ${report.status === 'Resolved' ? 'selected' : ''}>แก้ไขแล้ว</option>
                            <option value="Rejected" ${report.status === 'Rejected' ? 'selected' : ''}>ปฏิเสธ</option>
                        </select>
                    </td>
                    <td>${reportedDate}</td>
                </tr>
            `;
        }); 
    } 
    
    tableBody.innerHTML = htmlContent;
}

async function fetchReports() { 
    const tableBody = document.getElementById('reports_table_body'); 
    
    if (!tableBody) { 
        console.error("Element with ID 'reports_table_body' not found. Cannot fetch reports."); 
        return; 
    } 
    
    tableBody.innerHTML = '<tr><td colspan="8">กำลังโหลดข้อมูล...</td></tr>'; 

    try { 

        const response = await fetch('Back-end/จัดการขยะ/manage_trash_api.php');
        
        if (!response.ok) { 
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}. Detail: ${errorText.substring(0, 50)}...`); 
        } 
        
        const reports = await response.json(); 
        renderTable(reports); 
        
    } catch (error) { 
        console.error('Error fetching reports:', error); 
        if (tableBody) { 
            tableBody.innerHTML = '<tr><td colspan="8" style="color:red; text-align:center;">ไม่สามารถโหลดข้อมูลได้: ' + error.message + '</td></tr>'; 
        } 
    } 
}

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.hamburger-toggle');
    const closeBtn = document.querySelector('.close-sidebar');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', toggleSidebar); 
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeSidebar);
    }
    
    navLinks.forEach(link => {
         link.addEventListener('click', closeSidebar);
    });

    fetchReports();
});