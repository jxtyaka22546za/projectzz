import axios from 'axios';

const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/data');
    console.log(response.data); // ข้อมูลที่ได้จาก Back-end
  } catch (error) {
    console.error('เกิดข้อผิดพลาด:', error);
  }
};