import React, { useMemo } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Box, Paper, Typography, Button } from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useAppSelector } from '../../store/hooks';
import { selectPaginatedCharacters } from '../../store/selectors/charactersSelectors';
import * as XLSX from 'xlsx';

const PieChart: React.FC = React.memo(() => {
  const paginatedCharacters = useAppSelector(selectPaginatedCharacters);

  // Prepare chart data from current page only
  const chartData = useMemo(() =>
    paginatedCharacters
      .filter((char) => char.films && char.films.length > 0)
      .map((char) => ({
        name: char.name || 'Unknown',
        y: char.films?.length || 0,
        films: char.films || [],
      }))
      .sort((a, b) => b.y - a.y) // Sort by film count descending
  , [paginatedCharacters]);

  const chartOptions: Highcharts.Options = useMemo(
    () => ({
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
        height: 500,
      },
      title: {
        text: 'Films per Character (Current Page Results)',
        style: {
          fontSize: '18px',
          fontWeight: 'bold',
        },
      },
      tooltip: {
        formatter() {
          const point = this.point as Highcharts.Point & { films?: string[] };
          const pointValue = point.y ?? 0;
          const total = chartData.reduce((sum, d) => sum + d.y, 0);
          const percentage = total > 0 ? ((pointValue / total) * 100).toFixed(2) : '0';
          const filmsList = point.films && point.films.length > 0
            ? point.films.join(', ')
            : 'No films';
          return `
            <b>${point.name}</b><br/>
            Films: <b>${pointValue}</b><br/>
            Percentage: <b>${percentage}%</b><br/>
            Film List: ${filmsList}
          `;
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.y}',
            distance: -30,
            style: {
              fontWeight: 'bold',
            },
          },
          showInLegend: true,
        },
      },
      series: [
        {
          name: 'Films',
          colorByPoint: true,
          data: chartData.map((item) => ({
            name: item.name,
            y: item.y,
            films: item.films,
          })),
          type: 'pie',
        },
      ],
      credits: {
        enabled: false,
      },
    }),
    [chartData],
  );

  const handleExportToExcel = () => {
    const total = chartData.reduce((sum, d) => sum + d.y, 0);
    const exportData = chartData.map((item) => ({
      Character: item.name,
      'Number of Films': item.y,
      Films: item.films.join(', '),
      Percentage: total > 0 ? `${((item.y / total) * 100).toFixed(2)}%` : '0%',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Films per Character');

    // Auto-size columns
    const colWidths = [
      { wch: 25 }, // Character name
      { wch: 15 }, // Number of Films
      { wch: 50 }, // Films list
      { wch: 12 }, // Percentage
    ];
    ws['!cols'] = colWidths;

    XLSX.writeFile(wb, `disney-characters-films-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  if (chartData.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No film data available for the current page results
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" component="div">
            Films Distribution Chart
          </Typography>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleExportToExcel}
            color="primary"
          >
            Export to Excel
          </Button>
        </Box>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
      </Paper>
    </Box>
  );
});

PieChart.displayName = 'PieChart';

export default PieChart;

