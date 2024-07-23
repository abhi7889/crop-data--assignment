import React, { useEffect, useState } from 'react';
import { Table, Container } from '@mantine/core';

interface DataItem {
  Country: string;
  Year: string;
  'Crop Name': string;
  'Crop Production (UOM:t(Tonnes))': string | number;
  'Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))': string | number;
  'Area Under Cultivation (UOM:Ha(Hectares))': string | number;
}

interface AggregatedData {
  Year: string;
  maxCrop: string;
  minCrop: string;
}

const DataTable: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data , setData] = useState<DataItem[]>([]);
  const [aggregatedData, setAggregatedData] = useState<AggregatedData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
        aggregateData(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const aggregateData = (data: DataItem[]) => {
    const yearMap: { [key: string]: { maxCrop: string; minCrop: string; maxProduction: number; minProduction: number } } = {};

    data.forEach((item) => {
      const year = item.Year.split(', ')[1];
      const production = item['Crop Production (UOM:t(Tonnes))'];
      if (!production) return;
      const productionValue = typeof production === 'string' ? parseFloat(production) : production;

      if (!yearMap[year]) {
        yearMap[year] = {
          maxCrop: item['Crop Name'],
          minCrop: item['Crop Name'],
          maxProduction: productionValue,
          minProduction: productionValue,
        };
      } else {
        if (productionValue > yearMap[year].maxProduction) {
          yearMap[year].maxCrop = item['Crop Name'];
          yearMap[year].maxProduction = productionValue;
        }
        if (productionValue < yearMap[year].minProduction) {
          yearMap[year].minCrop = item['Crop Name'];
          yearMap[year].minProduction = productionValue;
        }
      }
    });

    const aggregated: AggregatedData[] = Object.keys(yearMap).map((year) => ({
      Year: year,
      maxCrop: yearMap[year].maxCrop,
      minCrop: yearMap[year].minCrop,
    }));

    setAggregatedData(aggregated);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <Container>
  <Table style={{textAlign:'center', border: "2px solid black", borderCollapse: "collapse"}}>
    <thead>
      <tr style={{border: "2px solid black",padding:"50px"}}>
        <th style={{ border: "2px solid black",padding:'5px',fontSize:'20px' }}>Year</th>
        <th style={{border: "2px solid black",padding:'5px' ,fontSize:'20px'}}>Crop with Maximum Production in that Year</th>
        <th style={{border: "2px solid black",padding:'5px',fontSize:'20px' }}>Crop with Minimum Production in that Year</th>
      </tr>
    </thead>
    <tbody>
      {aggregatedData.map((item, index) => (
        <tr key={index}>
          <td style={{ border: "2px solid black" ,padding:'5px',fontSize:'20px'}}>{item.Year}</td>
          <td style={{ border: "2px solid black",padding:'5px',fontSize:'20px' }}>{item.maxCrop}</td>
          <td style={{ border: "2px solid black",padding:'5px',fontSize:'20px' }}>{item.minCrop}</td>
        </tr>
      ))}
    </tbody>
  </Table>
</Container>
  );
};

export default DataTable;
