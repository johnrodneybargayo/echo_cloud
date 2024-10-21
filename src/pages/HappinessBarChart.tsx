import React, { useEffect, useState, useMemo } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import './HappinessBarChart.css';


Chart.register(...registerables);

const HappinessBarChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });
  const navigate = useNavigate();

  const emojis = useMemo(
    () => ['😡', '😞', '😐', '🙂', '😃', '😄', '😆', '😁', '😎', '🥳'],
    []
  );

  useEffect(() => {
    const db = getDatabase();
    const happinessRef = ref(db, 'happinessLevels');

    const unsubscribe = onValue(happinessRef, (snapshot) => {
      const levels = snapshot.val() || {};
      const counts: { [key: number]: number } = {};

      // Initialize counts for levels 1 through 10
      for (let i = 1; i <= 10; i++) {
        counts[i] = 0;
      }

      // Count occurrences of each happiness level
      for (const key in levels) {
        const level = Number(levels[key].level);
        counts[level] = (counts[level] || 0) + 1;
      }

      // Sort data in ascending order (smallest to largest number of people)
      const sortedData = Object.entries(counts)
        .sort(([, a], [, b]) => a - b) // Sort ascending by count
        .map(([key, value]) => ({ level: key, count: value }));

      const data = {
        labels: sortedData.map((item) => `Level ${item.level}`),
        datasets: [
          {
            label: 'Number of Responses',
            data: sortedData.map((item) => item.count),
            backgroundColor: sortedData.map(
              () =>
                `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`
            ),
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
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

        const emojiFontSize = Math.min(barWidth * 0.75, 50);
        const countFontSize = Math.min(barWidth * 0.4, 25);

        const yEmoji = Math.max(bar.y - 80, emojiFontSize + 20);
        const yCount = bar.y - 30;

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
                  padding: 15,
                },
              },
              y: {
                beginAtZero: true,
                max: 300,
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
                bottom: 50,
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

      {/* Button to proceed to thank you page */}
      <div className="thank-you-button-container">
        <button onClick={handleThankYouClick} className="thank-you-btn">
          Proceed to Thank You
        </button>
      </div>
    </div>
  );
};

export default HappinessBarChart;
