import { Box, CircularProgress, Typography } from "@material-ui/core";
import React, {Component} from "react";
import "./timer.scss";
class Timer extends Component {
    state = { countDown: 25 }
    render() { 
        return ( 
            <Box position="relative" display="inline-flex">
        <CircularProgress 
            size="6rem"
            thickness="1.6"
            value="100" 
            variant="determinate">
            </CircularProgress>
            <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
        >
        <Typography variant="caption" component="div" color="textSecondary">25:00</Typography>
        </Box>
        </Box> );
    }
}
 
export default Timer;