import React, { useEffect, useState } from 'react';
import { Table, Container } from '@mantine/core';

interface CropData {
  Country: string;
  Year: string;
  'Crop Name': string;
  'Crop Production (UOM:t(Tonnes))': string | number;
  'Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))': string | number;
  'Area Under Cultivation (UOM:Ha(Hectares))': string | number;
}

interface AggregatedData {
  cropName: string;
  averageYield: number;
  averageArea: number;
}

const AggregatedTableByCrop: React.FC = () => {
  const [data, setData] = useState<AggregatedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data: CropData[]) => {
        const groupedData: { [key: string]: CropData[] } = {};

        data.forEach(item => {
          const cropName = item['Crop Name'];
          if (!groupedData[cropName]) {
            groupedData[cropName] = [];
          }
          groupedData[cropName].push(item);
        });

        const aggregatedData: AggregatedData[] = Object.keys(groupedData).map(cropName => {
          const crops = groupedData[cropName];

          const totalYield = crops.reduce((sum, crop) => {
            const yieldValue = Number(crop['Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))']) || 0;
            return sum + yieldValue;
          }, 0);

          const totalArea = crops.reduce((sum, crop) => {
            const areaValue = Number(crop['Area Under Cultivation (UOM:Ha(Hectares))']) || 0;
            return sum + areaValue;
          }, 0);

          // Assuming this is where you calculate the averages
          const averageYield = parseFloat((totalYield / crops.length).toFixed(3));
          const averageArea = parseFloat((totalArea / crops.length).toFixed(3));
          
          // Then you would set these values in your state or use them as needed

          return {
            cropName: cropName,
            averageYield: averageYield,
            averageArea: averageArea,
          };
        });

        setData(aggregatedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
      <Table style={{ textAlign: 'center', border: '2px solid black', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black', padding: '8px' }}>Crop</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Average Yield of the Crop between 1950-2020</th>
            <th style={{ border: '1px solid black', padding: '8px' }}>Average Cultivation Area of the Crop between 1950-2020</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.cropName}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.averageYield.toFixed(2)}</td>
              <td style={{ border: '1px solid black', padding: '8px' }}>{item.averageArea.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AggregatedTableByCrop;
