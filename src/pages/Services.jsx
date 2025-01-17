import React from 'react';
import { Box, Grid, Typography, Card, CardContent } from '@mui/material';

const services = [
    { title: 'Fast Delivery', description: 'Quick and reliable logistics solutions.' },
    { title: 'Global Reach', description: 'We cover domestic and international services.' },
    { title: 'Customer Support', description: '24/7 support to help you with your logistics needs.' },
];

const ServicesSection = () => {
    return (
        <Box sx={{ py: 6, backgroundColor: '#f7f7f7' }}>
            <Typography variant="h4" align="center" sx={{ mb: 4 }}>
                Our Services
            </Typography>
            <Grid container spacing={4} justifyContent="center">
                {services.map((service, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" sx={{ mb: 2 }}>
                                    {service.title}
                                </Typography>
                                <Typography>{service.description}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default ServicesSection;
