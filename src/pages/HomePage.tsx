import React from 'react';

const HomePage: React.FC = () => {
  const qrCodeUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=https://your-qr-code-url.com/enter&choe=UTF-8`;

  return (
    <div>
      <h1>Welcome to Echo Cloud</h1>
      <img src={qrCodeUrl} alt="QR Code" />
      <p>Scan the QR Code to enter the word cloud submission page</p>
    </div>
  );
};

export default HomePage;
