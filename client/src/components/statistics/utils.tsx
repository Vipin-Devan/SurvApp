import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { IQuestion, QuestionChoiceType } from '../../services/survey.service';
import jsPDF from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
);

const setChartOptions = (question: IQuestion) => {
  return {
    responsive: true,
    scales: {
      x: {
        ticks: {
          font: {
            size: 0,
          },
          color: '#36454F',
        },
        display: false,
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            size: 16,
          },
          color: '#36454F',
        },
      },
      title: {
        display: true,
        text: question.text,
        font: {
          size: 24,
        },
        color: '#36454F',
        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
  };
};

const setChartLabels = (question: IQuestion) => {
  if (!question.answerOptions) {
    return [];
  }
  return question.answerOptions.map((answerOption) => answerOption.text);
};

const setChartScores = (question: IQuestion) => {
  if (!question.answerOptions) {
    return [];
  }
  return question.answerOptions.map((answerOption) =>
    Number(answerOption.score),
  );
};

const backgroundColor = [
  'rgba(255, 99, 132, 0.5)',
  'rgba(54, 162, 235, 0.5)',
  'rgba(255, 206, 86, 0.5)',
  'rgba(75, 192, 192, 0.5)',
  'rgba(153, 102, 255, 0.5)',
  'rgba(255, 159, 64, 0.5)',
];

const setChartData = ({
  labels,
  scores,
}: {
  labels?: string[];
  scores?: number[];
}) => {
  return {
    labels,
    datasets: [
      {
        data: scores,
        backgroundColor: backgroundColor,
      },
    ],
  };
};

export const prepareChartForMultiChoice = (question: IQuestion) => {
  const options = setChartOptions(question);
  const labels = setChartLabels(question);
  const scores = setChartScores(question);

  const data = setChartData({ labels, scores });
  options.plugins.legend.display = false;
  options.scales.x.ticks.font.size = 16;
  options.scales.x.display = true;

  return <Bar key={question._id} options={options} data={data} />;
};

export const prepareChartForRange = (question: IQuestion) => {
  const options = setChartOptions(question);
  const labels = setChartLabels(question);
  const scores = setChartScores(question);

  const data = setChartData({ labels, scores });
  return <Pie key={question._id} options={options} data={data} />;
};

export const prepareChart = (question: IQuestion) => {
  return (
    <>
      <hr className="chartDivider" />
      {question.choiceType === QuestionChoiceType.multiChoice
        ? prepareChartForMultiChoice(question)
        : prepareChartForRange(question)}
    </>
  );
};

export const downloadAsPDF = async () => {
  const pdf = new jsPDF('p', 'pt', 'a4');
  const pageHeight = pdf.internal.pageSize.getHeight();
  const charts = document.querySelectorAll('.stats canvas');

  let index = 0;
  let currentHeight = 0;
  let chartCountInSinglePage = 0;
  while (index < charts.length) {
    const canvasWidth = charts[index].clientWidth;
    const canvasHeight = charts[index].clientHeight;
    if (
      pageHeight <
      25 * (chartCountInSinglePage + 1) + currentHeight + canvasHeight
    ) {
      pdf.addPage();
      currentHeight = 0;
      chartCountInSinglePage = 0;
    }

    const canvas = charts[index] as HTMLCanvasElement;
    const dataURL = canvas.toDataURL('image/png', 1.0);
    pdf.addImage(
      dataURL,
      'PNG',
      50,
      25 * (chartCountInSinglePage + 1) + currentHeight,
      canvasWidth,
      canvasHeight,
    );
    currentHeight += canvasHeight;
    chartCountInSinglePage++;
    index++;
  }

  pdf.save('statistics.pdf');
};