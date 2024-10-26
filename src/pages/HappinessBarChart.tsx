import React, { useEffect, useState, useMemo } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './HappinessBarChart.css';
import logo from '../assets/lcc_logo.png';

Chart.register(...registerables);

const HappinessBarChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const navigate = useNavigate();

  const emojis = useMemo(
    () => ['😢', '😞', '😐', '🙂', '😃', '😄', '😆', '😁', '😎', '🥳'],
    []
  );

  useEffect(() => {
    const db = getDatabase();
    const happinessRef = ref(db, 'happinessLevels');

    const unsubscribe = onValue(happinessRef, (snapshot) => {
      const levels = snapshot.val() || {};
      const counts: { [key: number]: number } = {};

      for (let i = 1; i <= 10; i++) {
        counts[i] = 0;
      }

      for (const key in levels) {
        const level = Number(levels[key].level);
        counts[level] = (counts[level] || 0) + 1;
      }

      const data = {
        labels: Object.keys(counts).map((key) => `Level ${key}`),
        datasets: [
          {
            label: 'Number of Responses',
            data: Object.values(counts),
            backgroundColor: Object.keys(counts).map(
              () =>
                `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`
            ),
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            barPercentage: 0.8,
            categoryPercentage: 0.6,
          },
        ],
      };

      setChartData(data);
    });

    return () => unsubscribe();
  }, []);

  const customPlugin = {
    id: 'customPlugin',
    afterDatasetsDraw: (chart: any) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      const barWidth = chartArea.width / chart.data.labels.length;

      ctx.save();

      chart.getDatasetMeta(0).data.forEach((bar: any, index: number) => {
        const level = Number(chart.data.labels[index].split(' ')[1]);
        const emoji = emojis[level - 1];
        const x = bar.x;

        const emojiFontSize = Math.min(Math.max(barWidth * 0.6, 30), 50);
        const countFontSize = Math.min(Math.max(barWidth * 0.3, 10), 20);

        // Adjust positions to bring elements closer together
        const yEmoji = Math.max(bar.y - 45, emojiFontSize + 10);
        const yCount = bar.y - 5; // Closer to the emoji

        ctx.font = `${emojiFontSize}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(emoji, x, yEmoji);

        const peopleCount = chart.data.datasets[0].data[index];
        ctx.font = `${countFontSize}px Arial`;
        ctx.fillText(peopleCount, x, yCount);
      });

      ctx.restore();
    },
  };

  const handleThankYouClick = () => {
    navigate('/thank-you');
  };

  return (
    <div className="wrapper">
      <img src={logo} alt="Logo" className="logo" />

      <div className="chart-wrapper">
        <h1>Happiness Level Responses</h1>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: '#333',
                  font: {
                    size: 16,
                    weight: 'bold',
                  },
                  padding: 10,
                },
              },
              y: {
                beginAtZero: true,
                max: 250,
                grid: {
                  display: true,
                },
                ticks: {
                  color: '#333',
                  stepSize: 50,
                  maxTicksLimit: 6,
                },
              },
            },
            layout: {
              padding: {
                bottom: 20,
              },
            },
            animation: {
              duration: 1500,
              easing: 'easeInOutQuad',
            },
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: 'Real-Time Happiness Level Chart',
              },
              tooltip: {
                enabled: true,
              },
            },
          }}
          plugins={[customPlugin]}
        />
      </div>

      <div className="thank-you-button-container">
        <button onClick={handleThankYouClick} className="thank-you-btn">
          End Session
        </button>
      </div>
    </div>
  );
};

export default HappinessBarChart;
