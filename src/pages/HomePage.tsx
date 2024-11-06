import React from 'react';
import './HomePage.css'; // Import your CSS

const HomePage: React.FC = () => {
  const qrCodeUrl =
    'https://cdn.qr-code-generator.com/qrcode-preview?background_color=%23ffffff&foreground_color=%235493EC&marker_left_inner_color=%23000000&marker_left_outer_color=%23000000&marker_right_inner_color=%23000000&marker_right_outer_color=%23000000&marker_bottom_inner_color=%23000000&marker_bottom_outer_color=%23000000&marker_left_template=version17&marker_right_template=version17&marker_bottom_template=version17&qr_code_pattern=rounded-1&qr_code_logo=account38239836%2Flogo%2F9ee20928a5e607398d6efe456161629a.png&qr_code_text=https%3A%2F%2Fqrco.de%2FbfUVeC&image_format=PNG&image_width=500&Expires=1729248924&Signature=G2ukm2M6w7FOgF7ejzpGuMtNK641rs9fSI7Ki5X52NL1Qyb~r2LKwP-OvHUzl7eTsft4yygOT7rpobG-~GSK-s9kPW3ePQwHszeOI5vuykQH0UT3TsJryZYeXcx0-BkS6HpP1DNy3FMA7VO8xlkhkWZrck3vWyjvFHf-UGeAARLfXov~pvLPakXxN2L0uJYfNJg8n6DqoIfcnnBzGxNh0deVsfwuDK80YiHuSfVDVNyb5RnBVZvOy1q6WaPhWYJ-L4aPvAGlTT-R9hqUsix0q~8DY6FHO-f5nsVTaN2oWcYkrLdxMI370xuCbmq~SHvzXlIiHKKJp5R6gcsOZ~8ryw__&Key-Pair-Id=KKMPOJU8AYATR';

  return (
    <div className="home-container">
      <h1>Welcome to VerbiVibe</h1>
      <div className="qr-code-container">
        <img src={qrCodeUrl} alt="QR Code" className="qr-code" />
      </div>
      <p>Scan the QR Code to enter the word cloud submission page</p>
    </div>
  );
};

export default HomePage;
