import React from "react";
import * as metricsService from "../../services/metrics.service";
import ReactHighcharts from 'react-highcharts';

//upon invocation, this function will make an API call to retreive data and present it with react-highcharts

metricsCall = (param) => {
        metricsService.getProjectRequest(param)
            .then(response => {
                if (!this.state.initialRender) {
                    this.allDataEnd = response[response.length - 1]._id;
                }
                this.setState({
                    initialRender: true,
                    config: {
                        title: {
                            text: ''
                        },

                        chart: {
                            height: 480
                        },

                        subtitle: {
                            // text: 'Source: stats'
                        },

                        xAxis: {
                            categories: response.map(item => item._id)
                        },

                        yAxis: {
                            title: {
                                text: 'Amount of Requests'
                            }
                        },
                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },

                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                }
                            }
                        },

                        series: [{
                            name: 'Request Created',
                            data: response.map(item => {
                                return item.count
                            })
                        }],

                        responsive: {
                            rules: [{
                                condition: {
                                    maxWidth: 500
                                },
                                chartOptions: {
                                    legend: {
                                        layout: 'horizontal',
                                        align: 'center',
                                        verticalAlign: 'bottom'
                                    }
                                }
                            }]
                        }
                    }
                })
            })
    }
