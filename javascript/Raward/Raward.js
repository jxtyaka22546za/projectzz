let currentUserPoints = 0;

async function loadMyPoints() {
    try {
        const response = await fetch('Backend/Reward/get_user_points.php'); 
        const data = await response.json();
        
        const display = document.querySelector('.points-display');
        
        if (data.points !== undefined) {
            currentUserPoints = parseInt(data.points);
            display.innerText = `แต้มของคุณ ${currentUserPoints}`;
        } else {
            display.innerText = 'กรุณาเข้าสู่ระบบ';
        }
    } catch (error) {
        console.error('ไม่สามารถโหลดแต้มได้:', error);
        document.querySelector('.points-display').innerText = 'ข้อผิดพลาดการเชื่อมต่อ';
    }
}

async function redeem(rewardId, cost) {
    if (currentUserPoints < cost) {
        alert(`❌ แต้มไม่พอ! คุณมี ${currentUserPoints} แต้ม แต่ต้องใช้ ${cost} แต้ม`);
        return; 
    }

    if (!confirm(`ยืนยันการใช้ ${cost} แต้ม เพื่อแลกรางวัลนี้?`)) return;

    try {
        const response = await fetch('Backend/Reward/redeem_reward.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                reward_id: rewardId, 
                reward_cost: cost 
            })
        });
        
        const result = await response.json();

        if (result.message) {
            alert('✅ ' + result.message);
            
            currentUserPoints = result.new_points; 
            document.querySelector('.points-display').innerText = `แต้มของคุณ ${currentUserPoints}`;
        } else {
            alert('❌ ' + result.error);
            loadMyPoints();
        }
    } catch (error) {
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์');
    }
}

document.addEventListener('DOMContentLoaded', loadMyPoints);