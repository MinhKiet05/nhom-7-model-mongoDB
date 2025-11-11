import React from 'react';

const ComingSoon = ({ pageName }) => {
  return (
    <div style={{ 
      padding: '50px', 
      textAlign: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '10px',
      margin: '20px'
    }}>
      <h2>🚧 {pageName} - Đang phát triển</h2>
      <p style={{ fontSize: '1.2em', marginTop: '20px' }}>
        Trang này đang được cập nhật để kết nối với API MongoDB
      </p>
      <p style={{ color: '#ccc', marginTop: '10px' }}>
        API Backend đã sẵn sàng - Frontend đang được hoàn thiện
      </p>
    </div>
  );
};

export default ComingSoon;