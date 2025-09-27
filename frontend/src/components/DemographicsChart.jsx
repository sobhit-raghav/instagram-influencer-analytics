import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const genderData = [
  { name: 'Female', value: 65 },
  { name: 'Male', value: 35 },
];

const ageData = [
  { name: '13-17', value: 15 },
  { name: '18-24', value: 45 },
  { name: '25-34', value: 30 },
  { name: '35-44', value: 8 },
  { name: '45+', value: 2 },
];

const GENDER_COLORS = ['#f50057', '#3f51b5'];
const AGE_COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#d0ed57'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <Box sx={{ background: 'rgba(0, 0, 0, 0.8)', p: 1, borderRadius: 1, border: '1px solid #555' }}>
        <Typography variant="body2">{`${label} : ${payload[0].value}%`}</Typography>
      </Box>
    );
  }
  return null;
};

const DemographicsChart = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          Audience Demographics (Mock Data)
        </Typography>
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} md={5}>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Gender Split
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={7}>
            <Typography variant="subtitle1" align="center" gutterBottom>
              Age Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis unit="%" />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}/>
                <Legend />
                <Bar dataKey="value" name="Percentage" fill="#3f51b5">
                    {ageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={AGE_COLORS[index % AGE_COLORS.length]} />
                    ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DemographicsChart;