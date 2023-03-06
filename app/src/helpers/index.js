import _ from 'lodash';


const KB = 1024;
const MB = KB * KB;
const GB = KB * KB * KB;
export const betterNumber = (input, round = true) => {

    if(input > MB){
        return round ? `${_.round(input/MB)} Mb` : `${(input/MB)} Mb`;
    }
    if(input > KB){
        return round ? `${_.round(input/KB)} Kb` : `${(input/KB)} Kb`;
    }
}