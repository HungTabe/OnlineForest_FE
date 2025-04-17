import React, { useState, useEffect } from 'react';
import './PlantingScreen.css'; // File CSS để xử lý style và animation

const PlantingScreen = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 phút tính bằng giây
  const [isPlanting, setIsPlanting] = useState(false); // Trạng thái trồng cây
  const [trees, setTrees] = useState([]); // Danh sách cây đã trồng (lấy từ API)
  const [currentTreeStage, setCurrentTreeStage] = useState('small'); // Giai đoạn cây đang trồng: small, medium, large
  const [isFinished, setIsFinished] = useState(false); // Trạng thái hoàn thành 30 phút

  // Lấy danh sách cây từ API khi component được mount
  useEffect(() => {
    fetchTrees();
  }, []);

  // API lấy danh sách cây đã trồng
  const fetchTrees = async () => {
    try {
      const response = await fetch('your-api-endpoint/trees');
      const data = await response.json();
      setTrees(data.trees || []);
    } catch (error) {
      console.error('Error fetching trees:', error);
    }
  };

  // API khai báo bắt đầu trồng cây
  const startPlanting = async () => {
    try {
      await fetch('your-api-endpoint/start-planting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-id' }),
      });
    } catch (error) {
      console.error('Error starting planting:', error);
    }
  };

  // API xác nhận hoàn thành trồng cây
  const confirmPlanting = async () => {
    try {
      await fetch('your-api-endpoint/confirm-planting', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'user-id' }),
      });
      fetchTrees(); // Cập nhật lại danh sách cây sau khi trồng xong
    } catch (error) {
      console.error('Error confirming planting:', error);
    }
  };

  // Xử lý đếm ngược và cập nhật giai đoạn cây
  useEffect(() => {
    if (!isPlanting || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;

        // Cập nhật giai đoạn cây dựa trên thời gian còn lại
        if (newTime <= 20 * 60) setCurrentTreeStage('medium'); // Sau 5 phút
        if (newTime <= 15 * 60) setCurrentTreeStage('large'); // Sau 10 phút

        if (newTime <= 0) {
          setIsPlanting(false);
          setIsFinished(true);
          confirmPlanting(); // Gửi API xác nhận khi hoàn thành
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlanting, timeLeft]);

  // Bắt đầu đếm ngược
  const handleStart = () => {
    setIsPlanting(true);
    startPlanting(); // Gửi API khai báo bắt đầu trồng
  };

  // Reset để bắt đầu quy trình mới
  const handleReset = () => {
    setTimeLeft(25 * 60);
    setIsPlanting(false);
    setIsFinished(false);
    setCurrentTreeStage('small');
  };

  // Format thời gian MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="planting-screen">
      {/* Phần bên trái: Đồng hồ và cây đang trồng */}
      <div className="left-section">
        <div className="tree-container">
          <div className={`tree ${currentTreeStage}`}>
            {/* Hiển thị cây với kích thước theo giai đoạn */}
          </div>
        </div>
        <p>Start planting today!</p>
        <div className="timer">{formatTime(timeLeft)}</div>
        {!isPlanting && !isFinished && (
          <button onClick={handleStart}>Start</button>
        )}
      </div>

      {/* Phần bên phải: Rừng cây đã trồng */}
      <div className="right-section">
        <h2>Build Your Forest</h2>
        <div className="forest">
          {trees.map((tree, index) => (
            <div key={index} className="tree planted" />
          ))}
          {isPlanting && <div className={`tree ${currentTreeStage}`} />}
        </div>
        {isFinished && (
          <button onClick={handleReset}>Do it again</button>
        )}
      </div>
    </div>
  );
};

export default PlantingScreen;